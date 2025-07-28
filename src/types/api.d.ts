/**
 * Namespace Api
 *
 * All backend api type
 */
declare namespace Api {
  namespace Common {
    /** common params of paginating */
    interface PaginatingCommonParams {
      /** current page number */
      current: number;
      /** page size */
      size: number;
      /** total count */
      total: number;
    }

    /** common params of paginating query list data */
    interface PaginatingQueryRecord<T = any> extends PaginatingCommonParams {
      records: T[];
    }

    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'current' | 'size'>;

    /**
     * enable status
     *
     * - "1": enabled
     * - "2": disabled
     */
    type EnableStatus = '1' | '2';

    /** common record */
    type CommonRecord<T = any> = {
      /** record creator */
      createBy: string;
      /** record create time */
      createTime: string;
      /** record id */
      id: number;
      /** record status */
      status: EnableStatus | null;
      /** record updater */
      updateBy: string;
      /** record update time */
      updateTime: string;
    } & T;
  }

  /**
   * namespace Auth
   *
   * backend api module: "auth"
   */
  namespace Auth {
    interface LoginToken {
      refreshToken: string;
      token: string;
    }

    interface UserInfo {
      buttons: string[];
      roles: string[];
      userId: string;
      userName: string;
    }

    type Info = {
      token: LoginToken['token'];
      userInfo: UserInfo;
    };
  }

  /**
   * namespace Route
   *
   * backend api module: "route"
   */
  namespace Route {
    type ElegantConstRoute = import('@soybean-react/vite-plugin-react-router').ElegantConstRoute;

    interface MenuRoute extends ElegantConstRoute {
      id: string;
    }

    interface UserRoute {
      home: import('@soybean-react/vite-plugin-react-router').LastLevelRouteKey;
      routes: string[];
    }
  }

  /**
   * namespace SystemManage
   *
   * backend api module: "systemManage"
   */
  namespace SystemManage {
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'current' | 'size'>;

    /** role */
    type Role = Common.CommonRecord<{
      /** role code */
      roleCode: string;
      /** role description */
      roleDesc: string;
      /** role name */
      roleName: string;
    }>;

    /** role search params */
    type RoleSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.Role, 'roleCode' | 'roleName' | 'status'> & CommonSearchParams
    >;

    /** role list */
    type RoleList = Common.PaginatingQueryRecord<Role>;

    /** all role */
    type AllRole = Pick<Role, 'id' | 'roleCode' | 'roleName'>;

    /**
     * user gender
     *
     * - "1": "male"
     * - "2": "female"
     */
    type UserGender = '1' | '2';

    /** user */
    type User = Common.CommonRecord<{
      /** user nick name */
      nickName: string;
      /** user email */
      userEmail: string;
      /** user gender */
      userGender: UserGender | null;
      /** user name */
      userName: string;
      /** user phone */
      userPhone: string;
      /** user role code collection */
      userRoles: string[];
    }>;

    /** user search params */
    type UserSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.User, 'nickName' | 'status' | 'userEmail' | 'userGender' | 'userName' | 'userPhone'> &
        CommonSearchParams
    >;

    /** user list */
    type UserList = Common.PaginatingQueryRecord<User>;

    /**
     * menu type
     *
     * - "1": directory
     * - "2": menu
     */
    type MenuType = '1' | '2';

    type MenuButton = {
      /**
       * button code
       *
       * it can be used to control the button permission
       */
      code: string;
      /** button description */
      desc: string;
    };

    /**
     * icon type
     *
     * - "1": iconify icon
     * - "2": local icon
     */
    type IconType = '1' | '2';

    type MenuPropsOfRoute = Pick<
      import('@soybean-react/vite-plugin-react-router').RouteMeta,
      | 'activeMenu'
      | 'constant'
      | 'fixedIndexInTab'
      | 'hideInMenu'
      | 'href'
      | 'i18nKey'
      | 'keepAlive'
      | 'multiTab'
      | 'order'
      | 'query'
    >;

    type Menu = Common.CommonRecord<{
      /** buttons */
      buttons?: MenuButton[] | null;
      /** children menu */
      children?: Menu[] | null;
      /** component */
      component?: string;
      /** iconify icon name or local icon name */
      icon: string;
      /** icon type */
      iconType: IconType;
      /** menu name */
      menuName: string;
      /** menu type */
      menuType: MenuType;
      /** parent menu id */
      parentId: number;
      /** route name */
      routeName: string;
      /** route path */
      routePath: string;
    }> &
      MenuPropsOfRoute;

    /** menu list */
    type MenuList = Common.PaginatingQueryRecord<Menu>;

    type MenuTree = {
      children?: MenuTree[];
      id: number;
      label: string;
      pId: number;
    };
  }
  /** 上述为模版，下面为业务需要新增的类型 */
  type base = {
    create_time: string;
    id: number;
    update_time: string;
  };
  type PageableData<T = any> = {
    list: T[];
    total: number;
  };
  namespace User {
    type Info = base & {
      account: string;
      cellphone: string;
      email: string;
      menu_list: Menu.Info[] | null;
      nickname: string;
      remark: string;
      role_list: Role.Info[] | null;
      root: boolean;
      status: number;
    };
    type List = PageableData<Info>;
  }
  namespace Menu {
    type Info = base & {
      display: number;
      external: number;
      external_way: number;
      icon: string;
      name: string;
      page: string;
      parent_id: number;
      path: string;
      sort_num: number;
      symbol: string;
      url: string;
    };
    type Tree = {
      children?: Tree[];
      display: number;
      external: number;
      external_way: number;
      icon: string;
      id: string;
      name: string;
      parent_id: number;
      sort_num: number;
      symbol: string;
      url: string;
    };
    type List = PageableData<Info>;
  }
  namespace Role {
    type Info = base & {
      menu_list: Menu.Info[] | null;
      name: string;
      sort_num: number;
    };
    type List = PageableData<Info>;
  }
  namespace Application {
    type Info = base & {
      adnetqq_app_id: number;
      app_name: string;
      csj_app_id: number;
      entity: Entity.Entity;
      entity_id: number;
      gromore_app_id: number;
      kwai_app_id: number;
      package_name: string;
      privacy_agreement_short_code: string;
      remarks: string;
      status: Common.EnableStatus;
      taku_app_id: number;
      user_agreement_short_code: string;
      user_id: number;
    };
    type List = PageableData<Info>;
  }
  namespace Entity {
    type Entity = base & {
      adnetqq: AdnetQQConfig;
      alipay: AlipayConfig;
      csj: CsjConfig;
      domain: string;
      kwai: KwaiConfig;
      name: string;
      taku: TakuConfig;
      user: Auth.UserInfo;
      user_id: number;
    };
    type AlipayConfig = {
      app_id: string;
      app_public_cert: string;
      entity_id: number;
      private_key: string;
      public_cert: string;
      root_cert: string;
    };
    type AdnetQQConfig = {
      member_id: string;
      secret: string;
    };
    type CsjConfig = {
      role_id: string;
      security_key: string;
      user_id: string;
    };
    type KwaiConfig = {
      access_key: string;
      security_key: string;
    };
    type TakuConfig = {
      publisher_id: string;
    };
    type List = PageableData<Entity>;
  }
  namespace Ads {
    type Slot = base & {
      ad_slot_id: number;
      app_name: string;
      bid_type: number;
      callback_url: string;
      ecpm: string;
      entity_name: string;
      key: string;
      name: string;
      platform: string;
      type: string;
    };
    type List = PageableData<Slot>;
  }
  // 提现相关类型
  namespace Withdraw {
    type Info = base & {
      amount: number;
      app_chan_name: string; // 冗余字段信息
      app_name: string;
      channel_name: string;
      entity_name: string;
      identity: string;
      operator_name: string;
      operator_remarks: string;
      out_biz_no: string;
      pay_fund_order_id?: string;
      // 保留的支付订单字段（后端协商中）
      payment_order_id?: string;

      // 单位为"元"
      platform: string;
      processed_at?: number;
      real_name: string;
      remarks: string;

      status: 'approved' | 'failed' | 'paid' | 'pending' | 'rejected';
      uid: string;
    };
    type List = PageableData<Info>;
    type SearchParams = {
      app_chan_id?: number;
      app_id?: number;
      approver_name?: string;
      entity_id?: number;
      keyword?: string;
      page?: number;
      page_size?: number;
      platform?: string;
      status?: string;
    };
    type ApprovalParams = {
      remarks?: string;
      status: 'approved' | 'rejected';
    };
  }
  // 渠道相关类型
  namespace Channel {
    type Options = {
      greeter_login?: boolean;
      qq_login?: boolean;
      wechat_login?: boolean;
    };

    type Info = base & {
      creator: Auth.UserInfo;
      creator_id: number;
      name: string;
      options?: Options | null;
      remarks: string;
      status: Common.EnableStatus;
    };
    type List = PageableData<Info>;
  }
  // 应用渠道关联相关类型
  namespace AppChan {
    type Info = base & {
      app: Application.Info;
      app_id: number;
      channel: Channel.Info;
      channel_id: number;
      creator: User.Info;
      creator_id: number;
      name: string;
      remarks: string;
    };
    type List = PageableData<Info>;
  }
  namespace ECPM {
    type Info = base & {
      ecpm_entries: ECPMEntry[] | null;
    };
    type ECPMEntry = {
      ad_type: number;
      bid_type: number;
      ecpm: number;
    };
    type List = PageableData<Info>;
  }

  namespace Player {
    type Info = {
      /** 用户余额 */
      balance: string;
      /** 余额更新时间秒时间戳 */
      balance_update_time: string;
      /** 封禁原因 */
      ban_reason: string;
      /** 封禁更新时间秒时间戳 */
      ban_update_time: string;
      /** 渠道id */
      channel_id: string;
      /** 创建时间秒时间戳 */
      create_time: string;
      /** 主键ID */
      id: number;
      /** 是否封禁 0-否 1-是 */
      is_banned: boolean;
      /** 是否被标记 0-否 1-是 */
      is_marked: boolean;
      /** 最近登录时间秒时间戳 */
      last_login_time: string;
      /** 等级更新时间秒时间戳 */
      level_update_time: string;
      /** 登录状态 */
      login_status: number;
      /** 1:微信 2:游客 */
      login_type: string;
      /** 标记更新时间秒时间戳 */
      mark_update_time: string;
      /** 手机号 */
      phone_number: string;
      /** 真实姓名 */
      real_name: string;
      /** 用户历史金币总和 */
      total_coins: string;
      /** 用户标识 */
      uid: string;
      /** 用户等级 0-4 */
      user_level: number;
      /** 用户名 */
      user_name: string;
      /** 用户提现总和 */
      withdrawal_total: string;
    };
    /** 玩家详情 */
    type Detail = {
      /** 应用渠道名称 */
      app_chan_name: string;
      /** 应用名称 */
      app_name: string;
      /** 主体公司名称 */
      entity_name: string;
      /** 玩家UID */
      uid: string;
    };
    type AdRecords = PageableData<Report.Ad_Record>;
    type List = PageableData<Info>;
  }
  namespace Report {
    /** 广告记录 */
    type Ad_Record = {
      /** 广告ID */
      ad_id: string;
      /** 广告平台 */
      ad_platform: string;
      /** 广告类型 */
      ad_type: string;
      /** 应用ID */
      app_id: string;
      /** 折扣eCPM */
      discount_ecpm: number;
      /** eCPM */
      ecpm: number;
      /** 游戏名称 */
      game_name: string;
      /** 主键ID */
      id: number;
      /** 用户UID */
      uid: string;
      /** 广告展示时间 */
      vad_time: string;
    };
    type List = PageableData<Ad_Record>;
  }
}
