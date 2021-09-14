export interface PostInterface {
  _id: string;
  userId: string;
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
  userId?: string;
  notification: boolean;
}
