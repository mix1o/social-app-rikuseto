export interface CommentsData {
  date: string;
  likes: string[];
  post_id: string;
  user_id: string;
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
}

export interface SingleCommentProps {
  _id: string;
  user_id: string;
  text: string;
  likes: string[];
  refreshComments: () => void;
}
