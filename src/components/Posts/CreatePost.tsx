import { ChangeEvent, FormEvent, FC, useState } from 'react';
import Compressor from 'compressorjs';

interface Post {
  headline?: string;
  file?: string;
  category?: string;
}

const CreatePost: FC = () => {
  const [link, setLink] = useState<string>('');

  const [post, setPost] = useState<Post>({
    headline: '',
    file: link,
    category: '',
  });

  const upload = (data: any) => {
    fetch('https://api.imgur.com/3/image/', {
      method: 'post',
      headers: {
        Authorization: 'Client-ID de39c19dac90e78',
      },
      body: data,
    })
      .then(res => res.json())
      .then(json => {
        setLink(json.data.link);
      });
  };
  const compressImg = (file: any) => {
    if (!file) console.log('oops');

    const firstImg = file[0];

    new Compressor(firstImg, {
      quality: 0.6,
      convertSize: 268000,
      success(result) {
        const formData = new FormData();

        formData.append('file', result);

        upload(result);
      },
      error(err) {
        console.log(err.message);
      },
    });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const name = e.target.name;
    const value = e.target.value;

    setPost({ ...post, [name]: value });
  };

  const createNewPost = () => {
    fetch('https://rikuseto-social.herokuapp.com/post/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    });
  };

  console.log(post);

  return (
    <div className="App">
      <input onChange={e => handleChange(e)} type="text" name="headline" />
      <select onChange={e => handleChange(e)} name="category">
        //TODO set default value
        <option value="memes">memes</option>
        <option value="sport">sport</option>
      </select>
      <input
        type="file"
        accept="image/*"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          compressImg(e.target.files);
        }}
      />
      <button onClick={createNewPost}>Create new post</button>
    </div>
  );
};

export default CreatePost;
