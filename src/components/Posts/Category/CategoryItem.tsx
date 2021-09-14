import { FC } from 'react';
import { CategoryItemI } from '../../../interfaces/posts/category';

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

export default CategoryItem;
