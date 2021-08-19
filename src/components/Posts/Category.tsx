import axios from 'axios';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import styled from 'styled-components';
import { CreatePostI } from '../../interfaces/posts/postInterfaces';

interface CategoryArray {
  _id: string;
  name: string;
  totalPosts: number;
  user_id: string;
}

interface CategoryProps {
  // handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  chooseCategory?: string;
  setPost: React.Dispatch<React.SetStateAction<CreatePostI>>;
  post: CreatePostI;
}

interface MyProp {
  open: boolean;
}

const StyledInput = styled.input`
  border-bottom-width: ${(props: MyProp) => (props.open ? ' 1px' : '0')};
`;

const Category: FC<CategoryProps> = ({ chooseCategory, post, setPost }) => {
  const [cookies] = useCookies();
  const { user } = cookies;

  const [categories, setCategories] = useState<CategoryArray[]>();
  const [filterHelper, setFilterHelper] = useState<CategoryArray[]>();
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [usersCategories, setUsersCategories] = useState<CategoryArray[]>();

  const getCategory = () => {
    axios
      .get(
        `${process.env.REACT_APP_API}/category/get-categories?userId=${user._id}`
      )
      .then(res => {
        console.log(res.data);
        setCategories(res.data);
        setFilterHelper(res.data);
      });
  };

  const filterCategories = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = e.target.value;

    const valueCompared = categories?.filter(category =>
      category.name.toLocaleLowerCase().includes(value.toLocaleLowerCase())
    );

    setFilterHelper(valueCompared);
  };

  useEffect(() => {
    getCategory();
  }, []);

  const handleSetCategory = (value: string) => {
    setPost({ ...post, category: value });
    setSelectedCategory(value);
  };

  const handleSearchFetch = () => {
    const params = new URLSearchParams({
      userId: user._id,
      value: selectedCategory,
    });
    axios
      .get(`${process.env.REACT_APP_API}/category/get-all?${params.toString()}`)
      .then(res => setUsersCategories(res.data));
  };

  useEffect(() => {
    if (selectedCategory.length > 0) handleSearchFetch();
    if (selectedCategory === '') setUsersCategories([]);
  }, [selectedCategory]);

  return (
    <div className="category">
      <div className="category__search">
        <StyledInput
          type="text"
          placeholder={`Find category or create own`}
          className="category__search-input"
          open={open}
          onClick={() => setOpen(true)}
          value={selectedCategory}
          onChange={e => {
            handleSetCategory(e.target.value);
            filterCategories(e);
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
        <>
          <div className="category__description-wrapper">
            {categories!.length > 0 && (
              <p style={{ color: 'var(--font-dark-300)', textAlign: 'center' }}>
                Your categories
              </p>
            )}
            {filterHelper
              ?.sort((firstElem, secondELem) =>
                firstElem.name.localeCompare(secondELem.name)
              )
              .map(({ _id: id, name, totalPosts }) => (
                <div key={id} className="category__searched">
                  <label
                    style={{
                      color: 'white',
                      marginTop: '1rem',
                    }}
                    onClick={() => {
                      handleSetCategory(name);
                      setOpen(false);
                    }}
                    className="category__description"
                  >
                    <span
                      style={{ marginBottom: '0' }}
                      className="category__description-item category__name"
                    >
                      {name}
                    </span>
                    <span
                      style={{
                        color: 'var(--font-dark-300)',
                        fontSize: '11px',
                      }}
                      className="category__description-item category__count"
                    >
                      {totalPosts} Unique posts
                    </span>
                  </label>
                </div>
              ))}
            <p style={{ color: 'var(--font-dark-300)', textAlign: 'center' }}>
              Other also used
            </p>
            {selectedCategory.length === 0 && (
              <p style={{ color: 'var(--font-dark-300)', textAlign: 'center' }}>
                Result will appear here
              </p>
            )}
            <div>
              {usersCategories?.map(({ name, totalPosts }, idx) => {
                return (
                  <div key={idx} className="category__searched">
                    <label
                      style={{
                        color: 'white',
                        marginTop: '1rem',
                      }}
                      onClick={() => {
                        handleSetCategory(name);
                        setOpen(false);
                      }}
                      className="category__description"
                    >
                      <span
                        style={{ marginBottom: '0' }}
                        className="category__description-item category__name"
                      >
                        {name}
                      </span>
                      <span
                        style={{
                          color: 'var(--font-dark-300)',
                          fontSize: '11px',
                        }}
                        className="category__description-item category__count"
                      >
                        {totalPosts} Unique posts
                      </span>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
          {categories?.length === 0 && (
            <p style={{ color: 'var(--font-dark-300)', textAlign: 'center' }}>
              You don't have own categories
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default Category;
