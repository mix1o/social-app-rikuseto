const main = {
  mainBg100: '#f2edfc',
  mainBg200: '#d3c2f5',
  mainBg300: '#b496ee',
  mainBg400: '#946ae7',
  mainBg500: '#753ee0', // Rikuseto Brand color
  mainBg600: '#5a21ca',
  mainBg700: '#471a9e',
  mainBg800: '#331272',
  mainBg900: '#1f0b46',
};

const actionColors = {
  fontActive500: '#753ee0', // Rikuseto Brand color for typography
  warning300: '#ffa1a1',
  warning400: '#f78989',
  warning500: '#e53e3e', // warning basic
  warning600: '#e92525',
  warning700: 'rgba(229, 62, 62, 0.3)',
  pass500: '#53c245', // passing color
};

const sizes = {
  fs100: '0.9rem',
  fs200: '1.2rem',
  fs250: '1.4rem',
  fs300: '1.6rem',
  fs400: '2.1rem',
  fs500: '2.8rem',
  fs600: '3.7rem',
  fs700: '5rem',
  fs800: '6.7rem',
  fs900: '8.9rem',
  fs1000: '11.9rem',

  lh: '21px', // line height for text-area

  //font weights
  fw300: 100,
  fw400: 300,
  fw500: 400,
  fw600: 500,
  fw700: 700,

  formWidth: '350px', //base max-width for forms (modal)
  paddingAroundPost: '0 1rem',
  alpha: 0.8, //opacity for rgba
};

export const commonTheme = {
  ...main,
  ...actionColors,
  ...sizes,
};

export type StyledType = typeof commonTheme;
