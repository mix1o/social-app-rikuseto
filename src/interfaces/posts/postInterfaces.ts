export interface PostInterface {
  _id: string;
  user_id: string;
  headline: string;
  category: string;
  file: string;
  likes: string[];
  date: string;
}

export interface PostInterfaceExtended extends PostInterface {
  refreshPosts: () => void;
  saved?: boolean;
}

export interface CreatePostI {
  headline?: string;
  file?: string;
  category?: string;
  user_id?: string;
  notification: boolean;
}
