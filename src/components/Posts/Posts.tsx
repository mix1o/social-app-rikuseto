import { FC, useEffect, useState, useCallback, useRef } from 'react';
import CreatePost from '../CreatePost/CreatePost';
import Post from '../Post/Post';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { PostInterface } from '../../interfaces/posts/postInterfaces';
import { useCounter } from '../../store/sub';
import Header from '../Header/Header';
import { AnimatePresence as Presence } from 'framer-motion';
import BlurredContent from '../Animations/Popup';
import Select from 'react-select';
import { mainSelect } from '../../helpers/selectStyles.styled';
import {
  singleOptions,
  singleOptionsWithGroup,
} from '../../interfaces/posts/category';
import CreatePostCtx from '../../providers/CreatePostCtx';
import { useGetAllPosts, usePopularCategories } from '../../hooks/usePost';

const MODE_HOME = 'home';
const MODE_ALL = 'all';
type viewMode = 'home' | 'all';
type filterT = 'popular' | 'latest' | 'top' | 'default';

const Posts: FC = () => {
  const [cookies] = useCookies();
  const { user } = cookies;
  const [state, actions] = useCounter();

  const [topCategory, setTopCategory] = useState<string | undefined>('');
  const [filter, setFilter] = useState<filterT | undefined>('default');
  const [selectOptions, setSelectOptions] = useState<singleOptionsWithGroup[]>(
    []
  );
  const selectRef = useRef<any>();

  const [postTypes, setPostTypes] = useState<viewMode>(
    user ? MODE_HOME : MODE_ALL
  );
  const [filters, setFilters] = useState(user ? 0 : 1);

  const { data } = useGetAllPosts(
    postTypes === 'all' ? 'all-posts' : 'user-posts',
    postTypes === 'all'
      ? '/posts/get'
      : user
      ? `/posts/get-categories?id=${user._id}`
      : '/posts/get'
  );
  const { data: popularCategories, refetch } = usePopularCategories();

  useEffect(() => {
    if (!popularCategories) refetch();
  }, [postTypes]);

  useEffect(() => {
    setSelectOptions(formatPopularCategories());
  }, [popularCategories, filters]);

  const sortPosts = (a: PostInterface, b: PostInterface) => {
    switch (filter) {
      case 'popular':
        return b.likes.length - a.likes.length;
      case 'latest':
        return new Date(a.date) > new Date(b.date) ? -1 : 1;
      case 'top':
        return 0;
      case 'default':
        return 0;
      default:
        return 0;
    }
  };

  const filterByCategory = (element: PostInterface) => {
    if (topCategory !== '' && filters !== 0)
      return element.category === topCategory;
    return true;
  };

  const closeHandler = useCallback(() => {
    actions.openCreatePost(false);
  }, [actions]);

  const formatPopularCategories = () => {
    const mainOptions: singleOptionsWithGroup = {
      label: 'Popular categories',
      options: [{ label: 'Default', value: '' }],
    };

    const options: singleOptionsWithGroup[] = [
      {
        label: 'Filter by',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Popular', value: 'popular' },
          { label: 'Top', value: 'top' },
          { label: 'Latest', value: 'latest' },
        ],
      },
    ];

    if (filters === 1) {
      popularCategories?.forEach(singlePost => {
        const e: singleOptions = {
          label: singlePost.name,
          value: singlePost.name,
        };

        mainOptions.options.push(e);
      });

      options.push(mainOptions);
    }

    return options;
  };

  const handleSelectChange = (value: string | undefined) => {
    if (
      value === 'popular' ||
      value === 'latest' ||
      value === 'default' ||
      value === 'top'
    ) {
      setFilter(value);
    } else {
      setTopCategory(value);
    }
  };

  return (
    <>
      <Header />

      <main>
        {user && !state.isOpenCommentComponent && (
          <div className="post__wrapper">
            <label className="post__container-input">
              <img
                className="post__image-author"
                src={user.avatar}
                alt={user.firstName}
              />
              <input
                disabled={state.open ? true : false}
                className="post__input"
                onClick={() => actions.openCreatePost(true)}
                type="text"
                placeholder={`${user.firstName}, what's is on your mind`}
              />
            </label>
          </div>
        )}
        <Presence>
          {state.open && (
            <BlurredContent closeHandler={closeHandler}>
              <CreatePostCtx>
                <CreatePost />
              </CreatePostCtx>
            </BlurredContent>
          )}
        </Presence>

        {user && (
          <div className="post__displaying">
            <button
              className={`post__option-displaying ${
                filters === 0 ? 'post__filter-active' : ''
              }`}
              onClick={() => {
                setPostTypes(MODE_HOME);
                setFilters(0);
              }}
            >
              Home <i className="fas fa-home" />
            </button>
            <button
              className={`post__option-displaying ${
                filters === 1 ? 'post__filter-active' : ''
              }`}
              onClick={() => {
                setPostTypes(MODE_ALL);
                setFilters(1);
              }}
            >
              All posts <i className="fas fa-book" />
            </button>
          </div>
        )}

        <div className="post__manage-data post__manage-data--padding">
          <h4>Filter posts</h4>
          <Select
            ref={selectRef}
            options={selectOptions}
            styles={mainSelect}
            onChange={value => handleSelectChange(value?.value)}
            placeholder="Choose filter"
            defaultValue={selectOptions}
            maxMenuHeight={300}
          />
        </div>
        <div>
          {data
            ?.sort(sortPosts)
            ?.filter(filterByCategory)
            ?.map(post => {
              return <Post key={post._id} {...post} />;
            })}
        </div>
      </main>
    </>
  );
};

export default Posts;
