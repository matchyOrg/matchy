import type { RouteLocationNormalized } from "vue-router";

/**
 * TODO: This is badly named, it should be "routeQuery" or something.
 */
export function routeParam(route: RouteLocationNormalized, param: string) {
  const value = route.query[param];
  return Array.isArray(value) ? value[0] : value;
}
