import { request } from '../request';

export function fetchGetRoles(params?: {
  current?: number;
  keyword?: string;
  name?: string;
  size?: number;
  sort_num?: number;
}) {
  return request<Api.Role.List>({
    method: 'get',
    params,
    url: '/role/list'
  });
}

/** 新增角色 */
export function fetchAddRole(data: Omit<Api.Role.Info, 'create_time' | 'id' | 'update_time'>) {
  return request<Api.Role.Info>({
    data,
    method: 'post',
    url: '/role'
  });
}
/** 更新角色 */
export function fetchUpdateRole(id: number, data: Partial<Omit<Api.Role.Info, 'create_time' | 'id' | 'update_time'>>) {
  return request<Api.Role.Info>({
    data,
    method: 'put',
    url: `/role/${id}`
  });
}

/** 删除角色 */
export function fetchDeleteRole(id: number, data?: any) {
  return request<null>({
    data,
    method: 'delete',
    url: `/role/${id}`
  });
}

/** 更新角色菜单权限 */
export function fetchUpdateRoleMenu(id: number, data: { ids: React.Key[] }) {
  return request<null>({
    data,
    method: 'put',
    url: `/role/${id}/menus`
  });
}
