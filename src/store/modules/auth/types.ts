export enum AvatarURLS {
  DEFAULT = "/src/assets/images/avatar/clown.JPEG",
  AI = "/src/assets/images/avatar/child_female.JPEG",
  A2 = "/src/assets/images/avatar/woman.JPEG",
  A3 = "/src/assets/images/avatar/man.JPEG",
  A4 = "/src/assets/images/avatar/child_male.JPEG",
}

export enum LocalStorageKeys {
  USERNAME = "username",
  AVATAR = "avatar",
}

export interface AuthState {
  username?: string | null;
  avatar?: AvatarURLS | null;
}

export enum AuthMutationTypes {
  SET_AVATAR = "SET_AVATAR",
  SET_USERNAME = "SET_USERNAME",
}
