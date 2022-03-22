import { FC } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import styled from 'styled-components';
import { darkTheme } from '../../styles/themes'; //theme hook

const StyledContent = styled.section`
  display: grid;
  grid-template-columns: 50px 1fr 1fr 1fr;
  grid-template-areas:
    'img author author .'
    'img group group .'
    '. . . .'
    'content-title content-title content-title content-title'
    'content-desc content-desc content-desc content-desc'
    '. . . .'
    'likes . comments share';
  gap: 1em;
  min-width: ${({ theme }) => theme.formWidth};

  & > span:nth-of-type(1) {
    grid-area: img;
    span {
      border-radius: 100%;
      height: ${({ theme }) => theme.fs600};
      width: ${({ theme }) => theme.fs600};
    }
  }
  & > span:nth-of-type(2) {
    grid-area: author;
    span {
      border-radius: 0.5em;
      height: ${({ theme }) => theme.fs100};
      width: 100%;
    }
  }
  & > span:nth-of-type(3) {
    grid-area: group;
    span {
      border-radius: 0.5em;
      height: ${({ theme }) => theme.fs100};
      width: 100%;
    }
  }
  & > span:nth-of-type(4) {
    grid-area: content-title;
    span {
      border-radius: 0.5em;
      height: ${({ theme }) => theme.fs300};
      width: 100%;
    }
  }
  & > span:nth-of-type(5) {
    grid-area: content-desc;
    span {
      border-radius: 0.5em;
      height: ${({ theme }) => theme.fs300};
      width: 100%;
    }
  }
  & > span:nth-of-type(6) {
    grid-area: likes;
    span {
      border-radius: 0.5em;
      height: ${({ theme }) => theme.fs300};
      width: 100%;
    }
  }
  & > span:nth-of-type(7) {
    grid-area: comments;
    span {
      border-radius: 0.5em;
      height: ${({ theme }) => theme.fs300};
      width: 100%;
    }
  }
  & > span:nth-of-type(8) {
    grid-area: share;
    span {
      border-radius: 0.5em;
      height: ${({ theme }) => theme.fs300};
      width: 100%;
    }
  }
`;

const ContentLoader: FC<{ totalItems: number }> = ({ totalItems = 3 }) => {
  const totalElements = [...Array(totalItems).keys()];
  return (
    <>
      {totalElements.map(index => (
        <SkeletonTheme
          color={darkTheme.background600}
          highlightColor={darkTheme.background400}
          key={index}
        >
          <StyledContent>
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </StyledContent>
        </SkeletonTheme>
      ))}
    </>
  );
};

export default ContentLoader;
