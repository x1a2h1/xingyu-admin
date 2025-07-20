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
}
