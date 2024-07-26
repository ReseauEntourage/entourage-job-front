/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */

export {};

const PRINT_LIMIT = 5;

function printCommon(that: jest.MatcherContext, val: any) {
  return that.utils.DIM_COLOR(that.utils.stringify(val));
}

function printReceivedArgs(
  that: jest.MatcherContext,
  receivedArg: any,
  expectedArg = []
) {
  const NO_ARGUMENTS = 'called with 0 arguments';

  return receivedArg.length === 0
    ? NO_ARGUMENTS
    : receivedArg
        .map((arg: any, i: any) =>
          Array.isArray(expectedArg) &&
          i < expectedArg.length &&
          that.equals(expectedArg[i], arg)
            ? printCommon(that, arg)
            : that.utils.printReceived(arg)
        )
        .join(', ');
}

function printToHaveBeenCalledTimesWithDiff(
  that: jest.MatcherContext,
  expected: { times: number; args: unknown[] },
  received: { times: number; calls: unknown[][] }
) {
  const payload = {
    isNot: that.isNot,
    promise: that.promise,
  };

  const callsArguments = received.calls.reduce(
    (lines, args, i) =>
      lines.length < PRINT_LIMIT
        ? [...lines, `${i + 1}. ${printReceivedArgs(that, args)}`]
        : lines,
    []
  ).join(`
      `);

  return `${that.utils.matcherHint(
    'toHaveBeenCalledTimesWith',
    undefined,
    undefined,
    payload
  )}


  Expected:
    - number of calls: ${that.utils.printExpected(expected.times)}
    - with args: ${that.utils.printExpected(expected.args)}
    Received:
    - number of calls: ${that.utils.printReceived(received.times)}
    - with args:
      ${callsArguments}


`;
}

expect.extend({
  toHaveBeenCalledTimesWith(received, expectedCallCount, ...expectedArgs) {
    const { calls } = received.mock;
    const callsCount = calls.length;

    const countCallPass = expectedCallCount === callsCount;
    const argsPass = calls.every((call: any) => {
      const isArgsCountEqual = call.length === expectedArgs.length;
      const isArgsEqual = expectedArgs.every((arg, i) =>
        this.equals(arg, call[i])
      );

      return isArgsCountEqual && isArgsEqual;
    });

    const message = () =>
      printToHaveBeenCalledTimesWithDiff(
        this,
        { args: expectedArgs, times: expectedCallCount },
        { times: callsCount, calls }
      );

    return { message, pass: countCallPass && argsPass };
  },
});
