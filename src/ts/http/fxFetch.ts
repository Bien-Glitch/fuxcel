import type {FXRequestType, ResponseData} from '../types';
import {isFunction, TimeoutError} from '../utils';

/**
 * Perform a fetch request using the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
 *
 * Wraps `fetch` with timeout support (via `AbortController`), automatic
 * `FormData` coercion, and structured success / error callbacks.
 *
 * @param uri {FXRequestType.uri} Request URL.
 * @param method {FXRequestType.method} HTTP method (default: 'get').
 * @param data {FXRequestType.data} Request body data.
 * @param dataType {FXRequestType.dataType} Expected response type (default: 'json').
 * @param headers {FXRequestType.headers} Additional request headers.
 * @param beforeSend {FXRequestType.beforeSend} Callback fired before the request is sent.
 * @param timeout {FXRequestType.timeout} Timeout in seconds before the request is aborted (default: 10).
 * @param onComplete {FXRequestType.onComplete} Callback fired when the request completes (success or error).
 * @param onError {FXRequestType.onError} Callback fired on network/timeout errors.
 * @param onSuccess {FXRequestType.onSuccess} Callback fired on HTTP 2xx responses.
 */
export const fxFetch = function ({
	uri = '',
	method = 'get',
	data = null,
	dataType = 'json',
	headers = null,
	beforeSend = null,
	timeout = 10,
	onComplete = null,
	onError = null,
	onSuccess = null,
}: FXRequestType): void {
	
	let status: number;
	let statusText: string;
	let responseData: ResponseData;
	timeout = (timeout as number) * 1000;
	
	const controller = new AbortController();
	const timeoutID = setTimeout(() => controller.abort(), timeout as number);
	
	const allowedErrorStatuses = new Set([301, 308, 401, 402, 419, 422, 423, 426, 451, 500, 511]);
	
	const defaultHeaders: Record<string, string> = {'X-Requested-With': 'XMLHttpRequest'};
	
	isFunction(beforeSend) && (<Function>beforeSend)();
	
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
		method: <string>method,
		body: <BodyInit | null>data,
		headers: <Headers><unknown>defaultHeaders,
		signal: controller.signal,
	}).then(response => {
		responseData = response as ResponseData;
		status = responseData.status;
		statusText = responseData.statusText;
		
		try {
			// @ts-ignore
			const consumed = response[dataType]();
			return (consumed && (responseData.ok || (status > 199 && status < 300) || allowedErrorStatuses.has(status))) ? consumed : Promise.reject(response);
		} catch (e) {
			return Promise.reject(e);
		}
	}).then(parsedData => {
		responseData.responseJSON = dataType === 'json' && parsedData;
		responseData.responseText = dataType === 'json'
			? JSON.stringify(parsedData)
			: (dataType === 'text' && parsedData);
		
		onComplete && isFunction(onComplete) && onComplete(responseData, status, statusText);
		status > 199 && status < 300 && onSuccess && isFunction(onSuccess) && onSuccess(responseData, status, statusText);
	}).catch(error => {
		isFunction(onError) && (error.name === 'AbortError'
			? (<Function>onError)(
				new TimeoutError(`⏰ Request timed out\r\nSet Timeout:${(timeout as number) / 1000}s`),
				408, 'timeout'
			)
			: (<Function>onError)(error, status, statusText));
	}).finally(() => clearTimeout(timeoutID));
};
