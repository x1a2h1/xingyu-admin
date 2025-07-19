import { localStg } from '@/utils/storage';

/** Get token */
export function getToken() {
  return localStg.get('token') || '';
}

/** Get user info */
export function getUserInfo() {
  const emptyInfo: Api.User.Info = {
    account: '',
    cellphone: '',
    create_time: '',
    email: '',
    id: 0,
    menu_list: [],
    nickname: '',
    remark: '',
    role_list: [],
    root: false,
    status: 0,
    update_time: ''
  };
  const userInfo = localStg.get('userInfo') || emptyInfo;

  // fix new property: buttons, this will be removed in the next version `1.1.0`
  if (!userInfo.menu_list) {
    userInfo.menu_list = [];
  }

  return userInfo;
}

/** Clear auth storage */
export function clearAuthStorage() {
  localStg.remove('token');
  localStg.remove('refreshToken');
  localStg.remove('userInfo');
}
