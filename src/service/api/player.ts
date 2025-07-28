import { request } from '../request';

/**
 * 获取玩家列表
 *
 * @param params 查询参数
 */
export function fetchGetPlayerList(params?: {
  is_banned?: number;
  is_marked?: number;
  keyword?: string;
  login_type?: string;
  page?: number;
  page_size?: number;
}) {
  return request<Api.Player.List>({
    method: 'GET',
    params,
    url: '/player/list'
  });
}

/**
 * 封禁玩家
 *
 * @param uid 玩家ID
 * @param reason 封禁原因
 */
export function fetchBanPlayer(uid: string, reason: string) {
  return request({
    data: { reason },
    method: 'POST',
    url: `/player/${uid}/ban`
  });
}

/**
 * 解封玩家
 *
 * @param uid 玩家ID
 */
export function fetchUnbanPlayer(uid: string) {
  return request({
    method: 'POST',
    url: `/player/${uid}/unban`
  });
}

export function fetchGetPlayerDetail(uid: string) {
  return request<Api.Player.Detail>({
    method: 'GET',
    url: `/player/${uid}/detail`
  });
}
export function fetchGetPlayerAdRecords(uid: string) {
  return request<Api.Player.AdRecords>({
    method: 'GET',
    url: `/player/${uid}/adrecords`
  });
}
