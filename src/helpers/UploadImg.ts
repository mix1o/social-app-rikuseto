import axios from 'axios';

export const upload = async (data: Blob) => {
  // const res =await axios
  //   .post('https://api.imgur.com/3/image/', data, {
  //     headers: {
  //       Authorization: `Client-ID ${process.env.REACT_APP_IMGUR_KEY}`,
  //     },
  //   })
  //   .catch(err => console.log(err));
  try {
    const response = await fetch('https://api.imgur.com/3/image/', {
      method: 'POST',
      headers: {
        Authorization: `Client-ID ${process.env.REACT_APP_IMGUR_KEY}`,
      },
      body: data,
    });

    const result = await response.json();
    return result;
  } catch (err) {
    console.log(err);
  }
};

// TODO Convert to fetch async or fix axios respone
// TODO use it in compressor to uplaod image
