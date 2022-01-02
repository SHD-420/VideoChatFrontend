import { RouteRecordRaw } from "vue-router";
import { RouteNames } from "./types";
import Home from "@/views/Home.vue";
import Room from "@/views/Room.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: Home,
    name: RouteNames.Home,
  },
  {
    path: "/room",
    component: Room,
    name: RouteNames.Room,
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import("@/views/404.vue"),
  },
];
