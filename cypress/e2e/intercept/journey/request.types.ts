export type RequestConfig = {
  path: string;
  data:
    | {
        statusCode?: number;
        fixture?: string;
        body?: object;
      }
    | ((req: { url: string; reply: (response: object) => void }) => void);
  alias: string;
};
