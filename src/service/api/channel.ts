import { request } from '../request';

/* 获取渠道列表 */
export function fetchGetchGetChannelList(params?: { keyword?: string; page?: number; pageSize?: number }) {
  return request<Api.Channel.List>({
    method: 'get',
    params,
    url: '/channel/list'
  });
}

/* 更新渠道配置 */
export function fetchPutChannelConfig(id: string, data: Record<string, any>) {
  return request({
    data,
    method: 'put',
    url: `/channel/${id}/config`
  });
}

/* 新增渠道 */
export function fetchPostChannel(data: Record<string, any>) {
  return request({
    data,
    method: 'post',
    url: '/channel'
  });
}
/* 更新渠道 */
export function fetchPutChannel(id: string, data: Record<string, any>) {
  return request({
    data,
    method: 'put',
    url: `/channel/${id}`
  });
}
/* 删除渠道 */
export function fetchDeleteChannel(id: string) {
  return request({
    method: 'delete',
    url: `/channel/${id}`
  });
}
