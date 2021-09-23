import { Dispatch, SetStateAction } from 'react';
import { CreatePostI } from './postInterfaces';

export interface CategoryArray {
  _id: string;
  name: string;
  totalPosts: number;
  user_id: string;
  view?: boolean;
}

export interface CategoryProps {
  chooseCategory?: string;
  setPost: React.Dispatch<React.SetStateAction<CreatePostI>>;
  post: CreatePostI;
}

export interface CategoryItemI {
  name: string;
  totalPosts?: number;
  handleSetCategory: (value: string) => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
