export enum AvatarURLS {
  DEFAULT = "https://wallpapercave.com/wp/wc1709187.jpg",
  A1 = "https://c4.wallpaperflare.com/wallpaper/501/399/582/anime-naruto-madara-uchiha-wallpaper-preview.jpg",
  A2 = "https://wallpapercave.com/wp/wp8241464.jpg",
  A3 = "https://wallpapercave.com/wp/wp5823743.jpg",
}

export enum LocalStorageKeys {
  USERNAME = "username",
  AVATAR = "avatar",
}

export interface RootState {
  username?: string | null;
  avatar?: AvatarURLS | null;
}

export enum MutationTypes {
  SET_AVATAR = "SET_AVATAR",
  SET_USERNAME = "SET_USERNAME",
}
