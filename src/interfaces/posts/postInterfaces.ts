export interface PostInterface {
  _id: string;
  userId: string;
  headline: string;
  category: string;
  file: string;
  likes: string[];
  date: string;
  totalLikes?: number;
}
export type fetchType = 'all-posts' | 'user-posts';
export interface PostInterfaceExtended extends PostInterface {
  saved?: boolean;
}

export interface CreatePostI {
  headline: string;
  file: string;
  category: string;
  userId: string;
  notification: boolean;
}

export enum ActionEnum {
  SET_HEADLINE = 'headline',
  SET_FILE = 'file',
  SET_CATEGORY = 'category',
  SET_NOTIFICATION = 'notification',
  CLEAR = 'clear',
}

interface ActionHeadline {
  type: ActionEnum.SET_HEADLINE;
  payload: string;
}
interface ActionFile {
  type: ActionEnum.SET_FILE;
  payload: string;
}
interface ActionCategory {
  type: ActionEnum.SET_CATEGORY;
  payload: string;
}
interface ActionNotification {
  type: ActionEnum.SET_NOTIFICATION;
}
interface ActionClear {
  type: ActionEnum.CLEAR;
}

export type Action =
  | ActionHeadline
  | ActionFile
  | ActionCategory
  | ActionNotification
  | ActionClear;
