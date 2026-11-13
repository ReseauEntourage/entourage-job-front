/**
 * UIkit is gone from the project: forbids importing it and writing its class names (`uk-flex`,
 * `data-uk-toggle`…), which would silently do nothing now that its style sheet is not loaded.
 */
const UIKIT_NAME = /(^|[^\w-])(uk-[a-z0-9]|data-uk-)/;

const MESSAGE_CLASS =
  'UIkit is no longer part of the project: the `uk-*` classes have no effect. Use a styled component (`*.styles.ts`) or a `ui` primitive.';
const MESSAGE_IMPORT =
  'UIkit is no longer part of the project: do not import `uikit`.';

const isUikitModule = (value) =>
  typeof value === 'string' && /^uikit(\/|$)/.test(value);

const rule = {
  meta: {
    type: 'problem',
    schema: [],
    docs: { description: 'Forbids UIkit imports and `uk-*` class names' },
  },
  create(context) {
    const checkImport = (node, source) => {
      if (source && isUikitModule(source.value)) {
        context.report({ node, message: MESSAGE_IMPORT });
      }
    };
    return {
      ImportDeclaration: (node) => checkImport(node, node.source),
      ImportExpression: (node) => checkImport(node, node.source),
      ExportNamedDeclaration: (node) => checkImport(node, node.source),
      ExportAllDeclaration: (node) => checkImport(node, node.source),
      CallExpression(node) {
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'require' &&
          node.arguments[0] &&
          isUikitModule(node.arguments[0].value)
        ) {
          context.report({ node, message: MESSAGE_IMPORT });
        }
      },
      Literal(node) {
        if (typeof node.value === 'string' && UIKIT_NAME.test(node.value)) {
          // The module name of an import is reported above.
          if (!isUikitModule(node.value)) {
            context.report({ node, message: MESSAGE_CLASS });
          }
        }
      },
      TemplateElement(node) {
        if (UIKIT_NAME.test(node.value.raw)) {
          context.report({ node, message: MESSAGE_CLASS });
        }
      },
      JSXAttribute(node) {
        const name = node.name.name;
        if (typeof name === 'string' && /^data-uk-/.test(name)) {
          context.report({ node, message: MESSAGE_CLASS });
        }
      },
    };
  },
};

export default rule;
