import { RouteRecordRaw } from "vue-router";
import { RouteNames } from "./types";
import Home from "@/views/Home.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: Home,
    name: RouteNames.Home,
  },
  {
    path: "/room",
    component: () => import("@/views/Room.vue"),
    name: RouteNames.Room,
  },
];
