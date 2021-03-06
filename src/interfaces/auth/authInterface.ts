export interface BaseUserData {
  email: string;
  password: string;
}

export interface User extends BaseUserData {
  lastName: string;
  firstName: string;
}

export interface IMessage {
  message: string;
  status?: number;
}

export interface CreateUser extends User {
  confirmPassword: string;
}

type RequestStatus = 'pending' | 'accepted' | 'declined';
interface Request {
  userId: string;
  requestedUser: string;
  date: string;
  status: RequestStatus;
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
