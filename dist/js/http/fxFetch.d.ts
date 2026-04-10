import type { FXRequestType } from '../types';
/**
 * Perform a fetch request using the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
 *
 * Wraps `fetch` with timeout support (via `AbortController`), automatic
 * `FormData` coercion, and structured success / error callbacks.
 *
 * @param uri          Request URL.
 * @param method       HTTP method (default: 'get').
 * @param data         Request body data.
 * @param dataType     Expected response type (default: 'json').
 * @param headers      Additional request headers.
 * @param beforeSend   Callback fired before the request is sent.
 * @param timeout      Timeout in seconds before the request is aborted (default: 10).
 * @param onComplete   Callback fired when the request completes (success or error).
 * @param onError      Callback fired on network/timeout errors.
 * @param onSuccess    Callback fired on HTTP 2xx responses.
 */
export declare const fxFetch: ({ uri, method, data, dataType, headers, beforeSend, timeout, onComplete, onError, onSuccess, }: FXRequestType) => void;
