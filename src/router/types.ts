import { NavigationFailure, Router } from "vue-router";

export enum RouteNames {
  Home = "Home",
  Room = "Room",
}

export type TypedRouter = Omit<Router, "push"> & {
  push: (to: {
    name: RouteNames;
  }) => Promise<void | NavigationFailure | undefined>;
};
