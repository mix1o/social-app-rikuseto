export interface CommentsData {
  date: string;
  likes: string[];
  postId: string;
  userId: string;
  _id: string;
  text: string;
}

export interface TopComment {
  topComment?: CommentsData;
  allComments: number;
}

export interface CommentProps {
  postId: string;
  setOpenComments: React.Dispatch<React.SetStateAction<boolean>>;
  fetchTopComment: () => void;
  authorId: string;
  view?: boolean;
}

export interface SingleCommentProps {
  _id: string;
  userId: string;
  text: string;
  likes: string[];
  date: string;
  scroll?: boolean;
  refreshComments: () => void;
  fetchTopComment: () => void;
}
