import axios from 'axios';

export const authorOfComment = async (user_id: string) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API}/author?userId=${user_id}`
  );

  return res.data;
};
