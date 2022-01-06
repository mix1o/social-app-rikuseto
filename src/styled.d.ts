import 'styled-components';
import { StyledType } from './styles/themes';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme extends StyledType {}
}
