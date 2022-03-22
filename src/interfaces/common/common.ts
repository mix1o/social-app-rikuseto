export interface AuthorInterface {
  avatar: string;
  firstName: string;
  lastName: string;
  status: number;
}

export interface ServerBaseMessage {
  message: string;
  status?: number;
}
