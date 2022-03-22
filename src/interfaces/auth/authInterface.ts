export interface BaseUserData {
  email: string;
  password: string;
}

export interface User extends BaseUserData {
  lastName: string;
  firstName: string;
}

export interface CreateUser extends User {
  confirmPassword: string;
}

export interface RemoveUser extends BaseUserData {
  userId: string;
}
export interface ResetData {
  step: number;
  password?: string;
  confirmPassword?: string;
  email?: string;
  token?: string;
}
export interface CookieUser extends User {
  avatar: string;
  createdAt: string;
  categories?: string[];
  friends?: { friendId: string; roomId: string; _id: string }[];
  requests?: Request[];
  savedPosts: string[];
  pushNotification: boolean;
  sentRequests?: Omit<Request, 'userId'>[];
  serviceWorkers?: {
    endpoint: string;
    keys: { auth: string; p256dh: string };
  }[];
  _id: string;
}
