import {
  createRouter,
  createWebHistory,
  useRouter as baseUseRouter,
} from "vue-router";

import { routes } from "./routes";
import { TypedRouter } from "./types";

export default createRouter({
  history: createWebHistory(),
  routes,
});

export function useRouter() {
  return baseUseRouter() as TypedRouter;
}
