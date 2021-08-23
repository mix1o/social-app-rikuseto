import axios from 'axios';
import {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
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
  chooseCategory?: string;
  setPost: React.Dispatch<React.SetStateAction<CreatePostI>>;
  post: CreatePostI;
}

interface MyProp {
  open: boolean;
}

interface CategoryItemI {
  name: string;
  totalPosts?: number;
  handleSetCategory: (value: string) => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const StyledInput = styled.input`
  border-bottom-width: ${(props: MyProp) => (props.open ? ' 1px' : '0')};
`;

const CategoryItem: FC<CategoryItemI> = ({
  name,
  totalPosts,
  handleSetCategory,
  setOpen,
}) => {
  return (
    <div className="category__item">
      <label
        onClick={() => {
          handleSetCategory(name);
          setOpen(false);
        }}
        className="category__description"
      >
        <span className="category__description-item category__name">
          {name}
        </span>
        <span className="category__description-item category__count">
          {totalPosts} Unique posts
        </span>
      </label>
    </div>
  );
};

const Category: FC<CategoryProps> = ({ post, setPost }) => {
  const [cookies] = useCookies();
  const { user } = cookies;

  const [categories, setCategories] = useState<CategoryArray[]>([]);

  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [userCategories, setUserCategories] = useState<CategoryArray[]>([]);

  const getCategory = () => {
    axios
      .get(
        `${process.env.REACT_APP_API}/category/get-categories?userId=${user._id}`
      )
      .then(res => {
        console.log(res.data);
        setUserCategories(res.data);
      });
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
      value: selectedCategory,
    });
    axios
      .get(`${process.env.REACT_APP_API}/category/filter?${params.toString()}`)
      .then(res => setCategories(res.data));
  };

  useEffect(() => {
    if (selectedCategory.length > 0) handleSearchFetch();
    if (selectedCategory === '') setCategories([]);
  }, [selectedCategory]);

  return (
    <div className="category">
      <div className="category__search">
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
      )}
    </div>
  );
};

export default Category;
