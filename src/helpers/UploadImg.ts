import axios from 'axios';

export const upload = async (data: Blob) => {
  const res = axios
    .post('https://api.imgur.com/3/image/', data, {
      headers: {
        Authorization: `Client-ID ${process.env.REACT_APP_IMGUR_KEY}`,
      },
    })
    .catch(err => console.log(err));

  return res;
};
