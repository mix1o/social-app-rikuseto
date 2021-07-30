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
