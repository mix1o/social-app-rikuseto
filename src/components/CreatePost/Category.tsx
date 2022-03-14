import axios from 'axios';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { CookieUser } from '../../interfaces/auth/authInterface';
import { CategoryArray, singleOptions } from '../../interfaces/posts/category';

import AsyncCreatableSelect from 'react-select/async-creatable';
// import { mainSelect } from '../../helpers/selectStyles.styled';
import { useCreatePostCtx } from '../../hooks/useCreatePost';
import { ActionEnum } from '../../interfaces/posts/postInterfaces';
import { useCategory, useCategoryAll } from '../../hooks/useCategory';
import useDebounce from '../../hooks/useDebounce';

const Category = () => {
  const [cookies] = useCookies();
  const user: CookieUser = cookies['user'] ? { ...cookies['user'] } : undefined;
  const [userCategories, setUserCategories] = useState<singleOptions[]>();
  const [searchTerm, setSearchTerm] = useState('');
  const postCtx = useCreatePostCtx();
  const { data } = useCategory(user._id);

  const debouncedValue = useDebounce(searchTerm, 300);
  const { data: allCategory } = useCategoryAll(debouncedValue);

  useEffect(() => {
    setUserCategories(formatCategories(data));
  }, [debouncedValue]);

  const handleSearchFetch = async (inputValue: string) => {
    setSearchTerm(inputValue);

    return formatCategories(allCategory?.data);
  };

  const formatCategories = (arr: CategoryArray[]) => {
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
      {/* <AsyncCreatableSelect
        cacheOptions
        defaultOptions={userCategories}
        styles={mainSelect}
        placeholder="Choose category"
        loadOptions={inputValue => handleSearchFetch(inputValue)}
        onChange={inputValue => {
          postCtx?.dispatch({
            type: ActionEnum.SET_CATEGORY,
            payload: inputValue?.value ? inputValue?.value : '',
          });
        }}
        loadingMessage={value => 'Searching ...'}
        isClearable={true}
        maxMenuHeight={300}
        noOptionsMessage={() => 'No one posted in this category yet.'}
      /> */}
    </div>
  );
};

export default Category;
