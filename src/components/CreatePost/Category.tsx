import axios from 'axios';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { CookieUser } from '../../interfaces/auth/authInterface';
import { CategoryArray, singleOptions } from '../../interfaces/posts/category';

import AsyncCreatableSelect from 'react-select/async-creatable';
import { mainSelect } from '../../helpers/selectStyles.styled';
import { useCreatePostCtx } from '../../hooks/useCreatePost';
import { ActionEnum } from '../../interfaces/posts/postInterfaces';

const Category = () => {
  const [cookies] = useCookies();
  const user: CookieUser = cookies['user'] ? { ...cookies['user'] } : undefined;
  const [userCategories, setUserCategories] = useState<singleOptions[]>();
  const postCtx = useCreatePostCtx();

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
            postCtx?.dispatch({
              type: ActionEnum.SET_CATEGORY,
              payload: inputValue.value,
            });
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
