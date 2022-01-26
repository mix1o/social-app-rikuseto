import { commonTheme } from './common';

const darkTheme = {
  background500: '#29292b', //header background
  background600: '#212122', // single post/comments/ background (when using we can adjust more use-cases)
  background700: '#1a1a1c', //body/hamburger background
  borderColor: '#3d3d3f',

  fontColor200: '#fff', //if you need white

  fontColor300: '#cfcfc9', // not highlight of content but still important e.g path to file
  fontColor400: '#d0d0d0', // headers, list titles, secondary content ?
  fontColor500: '#f8f8f8', //base font color

  fontColor800: '#14171c', //if need dark
  ...commonTheme,
};

const lightTheme = {
  background500: 'ececec', //header background
  background600: '#f3f3f3', // single post/comments/ background (when using we can adjust more use-cases)
  background700: '#fff', //body/hamburger background
  borderColor: '#ddd',

  fontColor200: '#fff', //if you need white

  fontColor300: '#737286', // not highlight of content but still important e.g path to file
  fontColor400: '#686676', // headers, list titles, secondary content ?
  fontColor500: '#36344b', //base font color

  fontColor800: '#14171c', //if need dark
  ...commonTheme,
};

export { lightTheme, darkTheme };

export type StyledType = typeof darkTheme;
