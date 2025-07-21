export async function onRequest({ env, request }) {
  const url = new URL(request.url);
  const proxyRequest = new Request(`${env.base_url}${url.pathname}${url.search}`, {
    body: request.body,
    headers: request.headers,
    method: request.method
  });
  proxyRequest.headers.set('Host', env.base_url.replace(/^http?:\/\//, ''));
  const response = await fetch(proxyRequest);
  response.headers.append('Access-Control-Allow-Origin', '*');
  response.headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.append('Access-Control-Allow-Headers', '*');
  response.headers.append('Access-Control-Max-Age', '86400');

  /** 删除响应头 * */
  response.headers.delete('X-Cache');
  return response;
}
