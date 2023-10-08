export enum AvatarURLS {
  DEFAULT = "/avatar/clown.JPEG",
  AI = "/avatar/child_female.JPEG",
  A2 = "/avatar/woman.JPEG",
  A3 = "/avatar/man.JPEG",
  A4 = "/avatar/child_male.JPEG",
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
