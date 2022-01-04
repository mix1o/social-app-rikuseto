import 'styled-components';
import { StyledType } from './styles/common';
// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme extends StyledType {}
}
