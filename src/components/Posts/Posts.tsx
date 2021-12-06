import { FC, useEffect, useState, useCallback, useRef } from 'react';
import CreatePost from '../CreatePost/CreatePost';
import Post from '../Post/Post';
import { useCookies } from 'react-cookie';
import {
  fetchType,
  PostInterface,
} from '../../interfaces/posts/postInterfaces';
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
import { CookieUser } from '../../interfaces/auth/authInterface';

const MODE_HOME = 'user-posts';
const MODE_ALL = 'all-posts';

type filterT = 'popular' | 'latest' | 'top' | 'default';

const Posts: FC = () => {
  const [cookies] = useCookies();
  const user: CookieUser = cookies['user'] ? { ...cookies['user'] } : undefined;
  const [state, actions] = useCounter();

  const [topCategory, setTopCategory] = useState<string | undefined>('');
  const [filter, setFilter] = useState<filterT | undefined>('default');
  const [selectOptions, setSelectOptions] = useState<singleOptionsWithGroup[]>(
    []
  );

  const selectRef = useRef<any>();

  const [postTypes, setPostTypes] = useState<fetchType>(
    user ? MODE_HOME : MODE_ALL
  );
  const [filters, setFilters] = useState(user ? 0 : 1);

  const { data: userPosts, status: userStatus } = useGetAllPosts({
    type: 'user-posts',
    url: `/posts/get-categories?id=${user?._id}`,
  });

  const { data, status } = useGetAllPosts({
    type: 'all-posts',
    url: '/posts/get',
  });

  const reducedCategories = userPosts?.reduce((acc, val) => {
    const elem = acc.findIndex(filt => filt.category === val.category);

    return [
      ...acc.filter(
        (reduced, idx, old) =>
          idx === old.findIndex(item => item.category === reduced.category)
      ),
      {
        category: elem === -1 ? val.category : acc[elem].category,
        count: elem === -1 ? 1 : acc[elem].count++,
      },
    ];
  }, [] as { category: string; count: number }[]);

  const { data: popularCategories, refetch } = usePopularCategories();

  useEffect(() => {
    if (!popularCategories) refetch();
  }, []);

  useEffect(() => {
    setSelectOptions(formatPopularCategories());
  }, [filters]);

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

  const formatPopularCategories = useCallback(() => {
    const mainOptions: singleOptionsWithGroup = {
      label: 'Popular categories',
      options: [{ label: 'Default', value: '' }],
    };

    const defaultOptions = {
      label: 'Filter by',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Popular', value: 'popular' },
        { label: 'Top', value: 'top' },
        { label: 'Latest', value: 'latest' },
      ],
    };

    const options: singleOptionsWithGroup[] = [defaultOptions];

    if (filters === 1) {
      popularCategories?.forEach(singlePost => {
        const e: singleOptions = {
          label: singlePost.name,
          value: singlePost.name,
        };

        mainOptions.options.push(e);
      });

      options.push(mainOptions);
    } else {
      options.splice(0, options.length, defaultOptions);
    }

    return options;
  }, [popularCategories, filters]);

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

  const formatMap = () => (postTypes === 'all-posts' ? data : userPosts);

  if (status === 'loading') return <h1>Loading...</h1>; // TODO Make loader component

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
                setFilters(0);
                setPostTypes(MODE_HOME);
              }}
            >
              Home <i className="fas fa-home" />
            </button>
            <button
              className={`post__option-displaying ${
                filters === 1 ? 'post__filter-active' : ''
              }`}
              onClick={() => {
                setFilters(1);
                setPostTypes(MODE_ALL);
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
          {formatMap()
            ?.sort(sortPosts)
            ?.filter(filterByCategory)
            ?.map(post => (
              <Post key={post._id} {...post} />
            ))}
        </div>
      </main>
    </>
  );
};

export default Posts;
