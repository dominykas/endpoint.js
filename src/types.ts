export interface endpoint {
  /**
   * Transforms a GitHub REST API endpoint into generic request options
   *
   * @param {string} route Request method + URL. Example: `'GET /orgs/:org'`
   * @param {object} [parameters] URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
   */
  (route: Route, parameters?: Parameters): RequestOptions;

  /**
   * Transforms a GitHub REST API endpoint into generic request options
   *
   * @param {object} endpoint Must set `method` and `url`. Plus URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
   */
  (options: Endpoint): RequestOptions;

  /**
   * Object with current default route and parameters
   */
  DEFAULTS: Defaults;

  /**
   * Returns a new `endpoint` with updated route and parameters
   */
  defaults: (newDefaults: Parameters) => endpoint;

  merge: {
    /**
     * Merges current endpoint defaults with passed route and parameters,
     * without transforming them into request options.
     *
     * @param {string} route Request method + URL. Example: `'GET /orgs/:org'`
     * @param {object} [parameters] URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
     *
     */
    (route: Route, parameters?: Parameters): Defaults;

    /**
     * Merges current endpoint defaults with passed route and parameters,
     * without transforming them into request options.
     *
     * @param {object} endpoint Must set `method` and `url`. Plus URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
     */
    (options: Parameters): Defaults;

    /**
     * Returns current default options.
     *
     * @deprecated use endpoint.DEFAULTS instead
     */
    (): Defaults;
  };

  /**
   * Stateless method to turn endpoint options into request options.
   * Calling `endpoint(options)` is the same as calling `endpoint.parse(endpoint.merge(options))`.
   *
   * @param {object} options `method`, `url`. Plus URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
   */
  parse: (options: Defaults) => RequestOptions;
}

/**
 * Request method + URL. Example: `'GET /orgs/:org'`
 */
export type Route = string;

/**
 * Request method
 */
export type Method = "DELETE" | "GET" | "HEAD" | "PATCH" | "POST" | "PUT";

/**
 * Endpoint parameters
 */
export type Parameters = {
  /**
   * Base URL to be used when a relative URL is passed, such as `/orgs/:org`.
   * If `baseUrl` is `https://enterprise.acme-inc.com/api/v3`, then the resulting
   * `RequestOptions.url` will be `https://enterprise.acme-inc.com/api/v3/orgs/:org`.
   */
  baseUrl?: string;

  /**
   * HTTP headers. Use lowercase keys.
   */
  headers?: {
    /**
     * Avoid setting `accept`, use `mediaFormat.{format|previews}` instead.
     */
    accept?: string;
    /**
     * Use `authorization` to send authenticated request, remember `token ` / `bearer ` prefixes. Example: `token 1234567890abcdef1234567890abcdef12345678`
     */
    authorization?: string;
    /**
     * `user-agent` is set do a default and can be overwritten as needed.
     */
    "user-agent"?: string;
    [header: string]: string | number | undefined;
  };

  /**
   * Media type options, see {@link https://developer.github.com/v3/media/|GitHub Developer Guide}
   */
  mediaType?: {
    /**
     * `json` by default. Can be `raw`, `text`, `html`, `full`, `diff`, `patch`, `sha`, `base64`. Depending on endpoint
     */
    format?: string;

    /**
     * Custom media type names of {@link https://developer.github.com/v3/media/|API Previews} without the `-preview` suffix.
     * Example for single preview: `['squirrel-girl']`.
     * Example for multiple previews: `['squirrel-girl', 'mister-fantastic']`.
     */
    previews?: string[];
  };

  /**
   * Pass custom meta information for the request. The `request` object will be returned as is.
   */
  request?: {
    [option: string]: any;
  };

  /**
   * Any additional parameter will be passed as follows
   * 1. URL parameter if `':parameter'` or `{parameter}` is part of `url`
   * 2. Query parameter if `method` is `'GET'` or `'HEAD'`
   * 3. Request body if `parameter` is `'data'`
   * 4. JSON in the request body in the form of `body[parameter]` unless `parameter` key is `'data'`
   */
  [parameter: string]: any;
};

export type Endpoint = Parameters & {
  method: Method;
};

export type Defaults = Parameters & {
  method: Method;
  baseUrl: string;
  headers: {
    accept: string;
    "user-agent": string;
  };
  mediaType: {
    format: string;
    previews: string[];
  };
};

export type RequestOptions = {
  method: Method;
  url: string;
  headers: {
    accept: string;
    "user-agent": string;
    [option: string]: any;
  };
  body?: any;
  request?: {
    [option: string]: any;
  };
};
