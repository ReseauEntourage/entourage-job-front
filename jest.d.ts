declare namespace jest {
  interface Matchers<R> {
    toHaveBeenCalledTimesWith<E>(times: number, ...payload: E | E[]): R;
    toHaveDispatchedAction(
      actionOrActionType: string | { type: string },
      times?: number
    ): R;
    toHaveDispatchedActionTimes(
      times?: number,
      actionOrActionType: string | { type: string }
    ): R;
  }
}
