export interface EntityItem {
  // 原kuaishou
  adnetqq?: Record<string, any>;
  alipay?: Record<string, any>;
  create_time?: string;
  // 原youlianghui
  csj?: Record<string, any>;
  domain?: string;
  id: number | string;
  kwai?: Record<string, any>;
  name: string;
  // 平台配置
  taku?: Record<string, any>;
  update_time?: string;
  user?: Api.Auth.UserInfo;
  user_id?: number;
}

export interface EntityListResponse {
  list: EntityItem[];
  total: number;
}
