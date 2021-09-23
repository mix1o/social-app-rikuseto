import axios, { AxiosResponse } from 'axios';
import { FC, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import styled from 'styled-components';
import { CookieUser } from '../../../interfaces/auth/authInterface';
import {
  CategoryArray,
  CategoryProps,
} from '../../../interfaces/posts/category';
import CategoryItem from './CategoryItem';
import AsyncSelect from 'react-select/async';
import { mainSelect } from '../../../helpers/selectStyles.styled';

const StyledInput = styled.input`
  border-bottom-width: ${(props: { open: boolean }) =>
    props.open ? ' 1px' : '0'};
`;

type singleOptions = {
  label: string;
  value: string;
}[];

const Category: FC<CategoryProps> = ({ post, setPost }) => {
  const [cookies] = useCookies();
  const user: CookieUser = cookies['user'] ? { ...cookies['user'] } : undefined;
  const [categories, setCategories] = useState<CategoryArray[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [userCategories, setUserCategories] = useState<singleOptions>();
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

  const handleSetCategory = (value: string) => {
    setPost({ ...post, category: value });
    setSelectedCategory(value);
  };

  const getCategories = (inputValue: string) => {
    const params = new URLSearchParams({
      value: inputValue,
    });
    axios
      .get(`${process.env.REACT_APP_API}/category/filter?${params.toString()}`)
      .then(res => setCategories(res.data));
  };

  const handleSearchFetch = async (inputValue: string) => {
    const params = new URLSearchParams({
      value: inputValue,
    });

    const response = await fetch(
      `${process.env.REACT_APP_API}/category/filter?${params.toString()}` // AXIOS IS ALREADY DEAD[*]
    );
    const result = await response.json();

    return formatCategories(result, 'Other searched');
  };

  const formatCategories = (arr: CategoryArray[], type: string) => {
    const options: { label: string; value: string }[] = [];
    arr?.forEach(({ name, totalPosts }) => {
      const obj = {
        label: `${name} ${totalPosts} unique posts`,
        value: name,
      };
      options.push(obj);
    });

    return options;
  };

  return (
    <div className="category">
      <AsyncSelect
        cacheOptions
        defaultOptions={userCategories}
        styles={mainSelect}
        placeholder="Choose category"
        loadOptions={inputValue => handleSearchFetch(inputValue)}
        onChange={inputValue =>
          setPost({ ...post, category: inputValue?.value })
        }
      />

      {/* <div className="category__search">
        <StyledInput
          type="text"
          placeholder={`Find category`}
          className="category__search-input"
          open={open}
          onClick={() => setOpen(true)}
          value={selectedCategory}
          onChange={e => {
            handleSetCategory(e.target.value);
          }}
        />
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="category__search--open"
          >
            <i className="fas fa-chevron-down" />
          </button>
        )}
        {open && (
          <button
            onClick={() => setOpen(false)}
            className="category__search--open"
          >
            <i className="fas fa-chevron-up" />
          </button>
        )}
      </div>
      {open && (
        <div>
          {userCategories!.length === 0 && (
            <p className="category__user--desc category__custom-margin">
              You do not have any favorite
            </p>
          )}
          {userCategories!.length > 0 && (
            <div className="category__user">
              <p
                style={{ marginLeft: '0' }}
                className="category__user--desc category__custom-margin"
              >
                Favorites
              </p>
              {userCategories?.map(({ name, totalPosts }, idx) => {
                return (
                  <CategoryItem
                    key={idx}
                    name={name}
                    setOpen={setOpen}
                    totalPosts={totalPosts}
                    handleSetCategory={handleSetCategory}
                  />
                );
              })}
            </div>
          )}
          {categories!.length >= 1 && (
            <div className="category__user">
              <>
                <p className="category__user--desc">Others also used</p>
                {categories
                  ?.sort((firstElem, secondElem) =>
                    firstElem.name.localeCompare(secondElem.name)
                  )
                  .map(({ _id: id, name, totalPosts }) => (
                    <CategoryItem
                      key={id}
                      name={name}
                      totalPosts={totalPosts}
                      setOpen={setOpen}
                      handleSetCategory={handleSetCategory}
                    />
                  ))}
              </>
            </div>
          )}
        </div>
      )} */}
    </div>
  );
};

export default Category;
