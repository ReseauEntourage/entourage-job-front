import { AxiosError } from 'axios';
import { Api } from '.';

type ResolvedValue<T> = T extends PromiseLike<infer U> ? U | T : never;
type Api = typeof Api;
type ApiMethod = keyof Api;
type GetOutput<Method extends ApiMethod> = ResolvedValue<
  ReturnType<Api[Method]>
>;

export function mockApiSuccess<
  Method extends ApiMethod,
  Output extends GetOutput<Method>
>(methodKey: Method, response: Partial<Output>) {
  const method = jest.fn().mockResolvedValue(response);

  jest.spyOn(Api, methodKey).mockImplementation(method);

  return method;
}

export function mockApiError<Method extends ApiMethod>(
  methodKey: Method,
  error: Partial<AxiosError>
) {
  const method = jest.fn().mockRejectedValue(error);

  jest.spyOn(Api, methodKey).mockImplementation(method);

  return method;
}
