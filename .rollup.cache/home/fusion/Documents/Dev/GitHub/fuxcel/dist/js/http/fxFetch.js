import { isFunction, TimeoutError } from '../utils';
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
export const fxFetch = function ({ uri = '', method = 'get', data = null, dataType = 'json', headers = null, beforeSend = null, timeout = 10, onComplete = null, onError = null, onSuccess = null, }) {
    let status;
    let statusText;
    let responseData;
    timeout = timeout * 1000;
    const controller = new AbortController();
    const timeoutID = setTimeout(() => controller.abort(), timeout);
    const allowedErrorStatuses = new Set([301, 308, 401, 402, 419, 422, 423, 426, 451, 500, 511]);
    const defaultHeaders = { 'X-Requested-With': 'XMLHttpRequest' };
    isFunction(beforeSend) && beforeSend();
    // Coerce plain objects to FormData
    if (data?.constructor.name.toLowerCase() === 'object') {
        const formData = new FormData();
        // @ts-ignore
        Object.keys(data).forEach(key => formData.append(key, data[key]));
        data = formData;
    }
    // Merge custom headers
    if (headers?.constructor.name.toLowerCase() === 'object')
        // @ts-ignore
        Object.keys(headers).forEach(key => (defaultHeaders[key] = headers[key]));
    fetch(uri, {
        method: method,
        body: data,
        headers: defaultHeaders,
        signal: controller.signal,
    })
        .then(response => {
        responseData = response;
        status = responseData.status;
        statusText = responseData.statusText;
        try {
            // @ts-ignore
            const consumed = response[dataType]();
            return (consumed && (responseData.ok || (status > 199 && status < 300) || allowedErrorStatuses.has(status)))
                ? consumed
                : Promise.reject(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    })
        .then(parsedData => {
        responseData.responseJSON = dataType === 'json' && parsedData;
        responseData.responseText = dataType === 'json'
            ? JSON.stringify(parsedData)
            : (dataType === 'text' && parsedData);
        onComplete && isFunction(onComplete) && onComplete(responseData, status, statusText);
        status > 199 && status < 300 && onSuccess && isFunction(onSuccess) && onSuccess(responseData, status, statusText);
    })
        .catch(error => {
        isFunction(onError) && (error.name === 'AbortError'
            ? onError(new TimeoutError(`⏰ Request timed out\r\nSet Timeout:${timeout / 1000}s`), 408, 'timeout')
            : onError(error, status, statusText));
    })
        .finally(() => clearTimeout(timeoutID));
};
//# sourceMappingURL=fxFetch.js.map