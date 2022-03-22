import client from '../helpers/axios';
import {
  BaseUserData,
  CookieUser,
  CreateUser,
  RemoveUser,
  ResetData,
} from '../interfaces/auth/authInterface';
import { ServerBaseMessage } from '../interfaces/common/common';

interface SignInResponse {
  message: string;
  user?: CookieUser;
}

export const createNewAccount = async (userData: CreateUser) => {
  try {
    const response = await client.post<ServerBaseMessage>(
      'auth/create-account',
      userData
    );

    return response;
  } catch (err) {}
};

export const loginUser = async (userData: BaseUserData) => {
  try {
    const response = await client.post<SignInResponse>('/auth/login', userData);

    return response;
  } catch (err) {}
};

export const resetPassword = async (resetData: ResetData) => {
  try {
    const response = await client.put('/auth/reset-password', resetData);

    return response;
  } catch (err) {}
};

export const deleteAccount = async (userData: RemoveUser) => {
  try {
    const response = await client.delete<ServerBaseMessage>(
      '/auth/remove-account',
      {
        params: { userData },
      }
    );

    return response;
  } catch (err) {}
};
