import type { RouteLocationNormalized } from "vue-router";

export function routeParam(route: RouteLocationNormalized, param: string) {
  const value = route.query[param];
  return Array.isArray(value) ? value[0] : value;
}
