export const upload = async (data: Blob) => {
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
