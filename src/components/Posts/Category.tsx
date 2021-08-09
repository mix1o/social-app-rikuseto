import axios from 'axios';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import styled from 'styled-components';

interface CategoryArray {
  _id: string;
  name: string;
  totalPosts: number;
}

interface CategoryProps {
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  chooseCategory?: string;
}

interface MyProp {
  open: boolean;
}

const StyledInput = styled.input`
  border-bottom-width: ${(props: MyProp) => (props.open ? ' 1px' : '0')};
`;

const Category: FC<CategoryProps> = ({ handleChange, chooseCategory }) => {
  const [cookies] = useCookies();
  const { user } = cookies;

  const [categories, setCategories] = useState<CategoryArray[]>();
  const [filterHelper, setFilterHelper] = useState<CategoryArray[]>();
  const [open, setOpen] = useState(false);

  const getCategory = () => {
    axios
      .get(
        `${process.env.REACT_APP_API}/category/get-categories?id=${user._id}`
      )
      .then(res => {
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

  return (
    <div onClick={() => setOpen(true)} className="category">
      <div className="category__search">
        {/* #FIX You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly` */}
        <StyledInput
          type="text"
          placeholder={`Find it's place`}
          onChange={filterCategories}
          className="category__search-input"
          open={open}
        />
        <button className="category__search--open">
          <i className="fas fa-chevron-down"></i>
        </button>
      </div>
      {open && (
        <div className="category__description-wrapper">
          {filterHelper
            ?.sort((firstElem, secondELem) =>
              firstElem.name.localeCompare(secondELem.name)
            )
            .map(({ _id: id, name, totalPosts }) => (
              <div key={id} className="category__searched">
                <label
                  style={{ color: 'white' }}
                  htmlFor={`input-${id}`}
                  defaultValue={id}
                  className="category__description"
                >
                  <span className="category__description-item category__name">
                    {name}
                  </span>
                  <span className="category__description-item category__count">
                    {totalPosts} Unique posts
                  </span>
                </label>
                <input
                  className="category__placeholder-input"
                  onFocus={handleChange}
                  value={id}
                  id={`input-${id}`}
                  name="category"
                />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Category;
