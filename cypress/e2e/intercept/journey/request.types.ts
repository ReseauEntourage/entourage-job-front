export type RequestConfig = {
  path: string;
  data: {
    statusCode?: number;
    fixture?: string;
  };
  alias: string;
};
