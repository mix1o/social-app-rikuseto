import { ChangeEvent, FormEvent, FC, useState } from 'react';
import Compressor from 'compressorjs';

// interface OptionsInterface {
//   value: string;
//   label: string;
// }

// interface Post {
//   headline?: string;
//   file?: string;
//   category?: string;
// }

// interface File {
//   name: string;
//   lastModified: number;
//   lastModifiedDate?: string;
//   size: number;
//   type: string;
//   webkitRelativePath?: string;
// }

const CreatePost: FC = () => {
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
        console.log(json);
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
  return (
    <div className="App">
      <input
        type="file"
        accept="image/*"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          compressImg(e.target.files);
        }}
      />
    </div>
  );
};

export default CreatePost;
