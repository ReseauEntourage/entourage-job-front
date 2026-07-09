export type RequestConfig = {
  path: string;
  data: {
    statusCode?: number;
    fixture?: string;
    body?: object;
  };
  alias: string;
};
