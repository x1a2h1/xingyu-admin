import { request } from '../request';

export function fetchGetAppChanList(params?: { keyword?: string; page?: number; pageSize?: number }) {
  return request<Api.AppChan.List>({
    method: 'get',
    params,
    url: '/appchan/list'
  });
}
/* 新增app关联渠道 */
export function fetchPostAppChan(data: Record<string, any>) {
  return request({
    data,
    method: 'post',
    url: '/appchan'
  });
}

/* 删除app关联渠道 */
export function fetchDeleteAppChan(id: string) {
  return request({
    method: 'delete',
    url: `/appchan/${id}`
  });
}
