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

export type singleOptions = {
  label: string;
  value: string;
};

export interface popularInterface {
  _id: string;
  totalPosts: number;
  name: string;
}

export type singleOptionsWithGroup = {
  label: string;
  options: { label: string; value: string | number }[];
  value?: string;
};
