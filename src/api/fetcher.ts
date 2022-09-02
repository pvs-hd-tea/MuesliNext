type Obj<T = unknown> = Record<string, T>;

export type FetcherOptions = {
  url: string;
  /**
   * Either already JSON or a plain object
   */
  body?: Obj | string;
  /**
   * @default POST
   */
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  headers?: HeadersInit;
  schema?: Zod.Schema;
};

/**
 * fetch wrapper for use in SWR App
 * @param {FetcherOptions} args - FetcherOptions
 */
export const fetcher = (args: FetcherOptions) =>
  fetch("http://localhost:8080/" + args.url, {
    method: args.method || "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...args.headers,
    },
    // credentials: "include", <- uncomment if authentication done
    redirect: "manual",
    body: args.body
      ? typeof args.body === "string"
        ? args.body
        : JSON.stringify(args.body)
      : undefined,
  }).then((res) => {
    if (!args.schema) {
      return res.json();
    }
    const parsed = args.schema.parse(res.json());

    return parsed;
  });
