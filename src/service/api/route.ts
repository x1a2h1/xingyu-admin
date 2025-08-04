import { request } from '../request';

/** get constant routes */
export function fetchGetConstantRoutes() {
  return request<Api.Route.MenuRoute[]>({ url: '/route/getConstantRoutes' });
}

/** get user routes */
export function fetchGetUserRoutes() {
  return request<Api.Route.UserRoute>({ url: '/route/getReactUserRoutes' });
}

export function fetchGetUserRoutePaths() {
  return request<Api.Route.UserRoute>({ url: '/route/paths' });
}

/**
 * whether the route is exist
 *
 * @param routeName route name
 */
export function fetchIsRouteExist(routeName: string) {
  return request<boolean>({ params: { routeName }, url: '/route/isRouteExist' });
}
