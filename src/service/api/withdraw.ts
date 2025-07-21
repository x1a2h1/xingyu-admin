import { request } from '../request';

export function fetchGetWithdrawList(params?: Api.Withdraw.SearchParams) {
  return request<Api.Withdraw.List>({
    params,
    url: '/withdraw/list'
  });
}

export function fetchPostWithdrawApprove(id: number | string, params: Api.Withdraw.ApprovalParams) {
  return request<null>({
    data: params,
    method: 'POST',
    url: `/withdraw/${id}/approve`
  });
}
