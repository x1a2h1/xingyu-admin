import { request } from '../request';

export function fetchGetECPMList(params?: { keyword?: string; page?: number; pageSize?: number }) {
  return request<Api.ECPM.List>({
    method: 'get',
    params,
    url: '/ecpm/list'
  });
}

export function fetchSaveECPM(id: number, data: { ecpm_entries: Api.ECPM.ECPMEntry[] }) {
  return request<null>({
    data,
    method: 'put',
    url: `/ecpm/${id}`
  });
}

export function fetchCreateECPM() {
  return request<null>({
    method: 'post',
    url: '/ecpm'
  });
}
export function fetchDeleteECPM(id: number) {
  return request<null>({
    method: 'delete',
    url: `/ecpm/${id}`
  });
}
