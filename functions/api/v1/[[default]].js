export async function onRequest({ env, request }) {
  const url = new URL(request.url);
  const proxyRequest = new Request(`${env.base_url}${url.pathname}${url.search}`, {
    body: request.body,
    copyHeaders: true,
    headers: request.headers,
    method: request.method
  });
  proxyRequest.headers.set('Host', env.base_url.replace(/^http?:\/\//, ''));

  const response = await fetch(proxyRequest);

  response.headers.append('Access-Control-Allow-Origin', '*');
  // 指定哪些 HTTP 方法（如 GET, POST 等）允许访问资源
  response.headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  // 指定了哪些 HTTP 头可以在正式请求头中出现
  response.headers.append('Access-Control-Allow-Headers', 'Authorization');
  // 预检请求的结果可以被缓存多久
  response.headers.append('Access-Control-Max-Age', '86400');

  /** 删除响应头 * */
  response.headers.delete('X-Cache');
  return response;
}
