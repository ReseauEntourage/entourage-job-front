export {};

describe('toHaveBeenCalledTimesWith', () => {
  it(`
    Given spy function is call 2 times with the same argument
    When expected argument matches
      And call count specified is 2
    Then test should pass
  `, () => {
    const spyFn = jest.fn();

    spyFn('lulu');
    spyFn('lulu');

    expect(spyFn).toHaveBeenCalledTimesWith(2, 'lulu');
  });

  it(`
    Given spy function is call 3 times with object type argument
    When expected argument matches
      And call count specified is 3
    Then test should pass
  `, () => {
    const spyFn = jest.fn();

    spyFn({ coucou: 'lulu' });
    spyFn({ coucou: 'lulu' });
    spyFn({ coucou: 'lulu' });

    expect(spyFn).toHaveBeenCalledTimesWith(3, { coucou: 'lulu' });
  });

  it(`
    Given spy function is call 1 times with array type argument
    When expected argument matches
      And call count specified is 1
    Then test should pass
  `, () => {
    const spyFn = jest.fn();

    spyFn(['coucou', 'lulu']);

    expect(spyFn).toHaveBeenCalledTimesWith(
      1,
      expect.arrayContaining(['coucou', 'lulu'])
    );
  });

  it(`
    Given spy function is call 2 times with object type and array type as first and second argument
    When expected arguments matches
      And call count specified is 2
    Then test should pass
  `, () => {
    const spyFn = jest.fn();

    spyFn({ coucou: 'lulu' }, ['coucou', 'lulu']);
    spyFn({ coucou: 'lulu' }, ['coucou', 'lulu']);

    expect(spyFn).toHaveBeenCalledTimesWith(
      2,
      { coucou: 'lulu' },
      expect.arrayContaining(['coucou', 'lulu'])
    );
  });

  it(`
    Given spy function is call once with A and B
    Then test should not be called once with A and C
  `, () => {
    const spyFn = jest.fn();

    spyFn('A', 'B');

    expect(spyFn).not.toHaveBeenCalledTimesWith(1, 'A', 'C');
  });

  it(`
    Given spy function is call once with A, B and C
    Then test should not be called once with A and B
  `, () => {
    const spyFn = jest.fn();

    spyFn('A', 'B', 'C');

    expect(spyFn).not.toHaveBeenCalledTimesWith(1, 'A', 'B');
  });

  it(`
    Given spy function is call 3 times with different arguments
    When argument is not expected to matches
      And call count specified is 3
    Then test should pass
  `, () => {
    const spyFn = jest.fn();

    spyFn('lulu');
    spyFn('lolo');
    spyFn('lulu');

    expect(spyFn).not.toHaveBeenCalledTimesWith(3, 'lulu');
  });
});
