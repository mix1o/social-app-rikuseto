import axios from 'axios';
import { FC, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { CookieUser } from '../../../Interfaces/auth/authInterface';
import {
  CategoryArray,
  CategoryProps,
  singleOptions,
} from '../../../Interfaces/posts/category';
import AsyncCreatableSelect from 'react-select/async-creatable';
import { mainSelect } from '../../../Helpers/selectStyles.styled';

const Category: FC<CategoryProps> = ({ post, setPost }) => {
  const [cookies] = useCookies();
  const user: CookieUser = cookies['user'] ? { ...cookies['user'] } : undefined;
  const [userCategories, setUserCategories] = useState<singleOptions[]>();
  const getCategory = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/category/get-categories?userId=${user._id}`
      );
      return setUserCategories(formatCategories(response.data, 'Favorites'));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  const handleSearchFetch = async (inputValue: string) => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/category/filter`,
      { params: { value: inputValue } }
    );

    return formatCategories(response.data, 'Other searched');
  };

  const formatCategories = (arr: CategoryArray[], type: string) => {
    const options: { label: string; value: string }[] = [];
    arr?.forEach(({ name, totalPosts }) => {
      const obj = {
        label: `${name}, ${totalPosts} unique post${
          totalPosts <= 1 ? '' : 's'
        } `,
        value: name,
      };
      options.push(obj);
    });

    return options;
  };

  return (
    <div className="category">
      <AsyncCreatableSelect
        cacheOptions
        defaultOptions={userCategories}
        styles={mainSelect}
        placeholder="Choose category"
        loadOptions={inputValue => handleSearchFetch(inputValue)}
        onChange={inputValue => {
          if (inputValue?.value !== undefined) {
            setPost({ ...post, category: inputValue?.value });
          }
        }}
        loadingMessage={value => 'Searching ...'}
        isClearable={true}
        maxMenuHeight={300}
        noOptionsMessage={() => 'No one posted in this category yet.'}
      />
    </div>
  );
};

export default Category;
