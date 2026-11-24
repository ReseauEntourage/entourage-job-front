import { ESLintUtils } from '@typescript-eslint/utils';
import isPropValid from '@emotion/is-prop-valid';
import ts from 'typescript';

// These are meaningful to styled-components itself (polymorphism / theming)
// and are never forwarded verbatim to the DOM the way a typo'd custom prop
// would be, so they're not real "unknown prop" footguns.
const STYLED_SPECIFIC_SAFE_PROPS = new Set(['as', 'theme', 'forwardedAs']);

const MAX_DEPTH = 6;

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/entourage/entourage-job-front/blob/main/eslint-rules/${name}.mjs`
);

/**
 * Given the initializer expression of a `const Foo = ...` declaration,
 * figure out what DOM tag (if any) the styled-component ultimately renders.
 * Handles: styled.div`...`, styled('div')`...`, styled(Other)`...`,
 * styled(Other).attrs(...)`...`, recursing through `styled(Other)` chains.
 */
function unwrapStyledTarget(checker, expr, depth) {
  if (!expr || depth > MAX_DEPTH) return null;

  if (ts.isTaggedTemplateExpression(expr)) {
    return unwrapStyledTarget(checker, expr.tag, depth);
  }

  if (ts.isPropertyAccessExpression(expr)) {
    // styled.div / styled.button / ...
    if (ts.isIdentifier(expr.expression) && expr.expression.text === 'styled') {
      return expr.name.text;
    }
    return null;
  }

  if (ts.isCallExpression(expr)) {
    const callee = expr.expression;

    // styled(Other).attrs(...) -> unwrap the `styled(Other)` part
    if (ts.isPropertyAccessExpression(callee) && callee.name.text === 'attrs') {
      return unwrapStyledTarget(checker, callee.expression, depth);
    }

    // styled(Other)  or  styled('div')
    if (ts.isIdentifier(callee) && callee.text === 'styled') {
      const arg = expr.arguments[0];
      if (!arg) return null;
      if (ts.isStringLiteral(arg)) {
        return arg.text;
      }
      if (ts.isIdentifier(arg)) {
        return resolveIdentifierStyledTarget(checker, arg, depth + 1);
      }
    }
  }

  return null;
}

function resolveIdentifierStyledTarget(checker, identifier, depth) {
  if (depth > MAX_DEPTH) return null;
  const symbol = checker.getSymbolAtLocation(identifier);
  const decl = symbol && (symbol.valueDeclaration ?? symbol.declarations?.[0]);
  if (!decl || !ts.isVariableDeclaration(decl) || !decl.initializer) return null;
  return unwrapStyledTarget(checker, decl.initializer, depth);
}

// Lowercase HTML tag names never collide with component names (which must
// be capitalized in JSX), so a lowercase string target means this
// styled-component ultimately renders a native DOM element.
function isDomTag(target) {
  return typeof target === 'string' && /^[a-z][a-z0-9]*$/.test(target);
}

export default createRule({
  name: 'no-untransient-styled-props',
  meta: {
    type: 'problem',
    docs: {
      description:
        "Require custom (non-HTML) props passed to a styled-components DOM element to use the transient '$' prefix, so they don't leak to the DOM and trigger React/styled-components console warnings.",
    },
    schema: [],
    messages: {
      untransientProp:
        'Prop "{{prop}}" is not a valid HTML attribute and will be forwarded to the underlying <{{tag}}> DOM element, which styled-components will warn about at runtime. Rename it to "${{prop}}" (transient prop) so it stays style-only.',
    },
  },
  defaultOptions: [],
  create(context) {
    const services = ESLintUtils.getParserServices(context, true);
    if (!services?.program) {
      return {};
    }
    const checker = services.program.getTypeChecker();

    return {
      JSXOpeningElement(node) {
        if (node.name.type !== 'JSXIdentifier') return;
        if (!/^[A-Z]/.test(node.name.name)) return; // only component references

        const tsNode = services.esTreeNodeToTSNodeMap.get(node.name);
        if (!tsNode) return;

        const target = resolveIdentifierStyledTarget(checker, tsNode, 0);
        if (!isDomTag(target)) return;

        node.attributes.forEach((attr) => {
          if (attr.type !== 'JSXAttribute') return; // skip {...spread}
          const propName =
            typeof attr.name.name === 'string' ? attr.name.name : null;
          if (!propName) return;
          if (propName.startsWith('$')) return;
          if (propName.startsWith('data-') || propName.startsWith('aria-')) {
            return;
          }
          if (STYLED_SPECIFIC_SAFE_PROPS.has(propName)) return;
          if (isPropValid(propName)) return;

          context.report({
            node: attr.name,
            messageId: 'untransientProp',
            data: { prop: propName, tag: target },
          });
        });
      },
    };
  },
});
