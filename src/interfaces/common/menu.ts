import { Dispatch, SetStateAction } from 'react';

export interface MenuProps {
  iconsClasses: string;
  href: string;
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
  value: string;
}
