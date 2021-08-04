import { Dispatch, FC, SetStateAction, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion as m } from 'framer-motion';

interface MenuProps {
  iconsClasses: string;
  href: string;
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
  value: string;
}

const MenuItemVariant = {
  active: {
    color: '#753ee0',
  },
  disabled: {
    color: 'inherit',
  },
};

const MenuItem: FC<MenuProps> = ({
  href,
  iconsClasses,
  selected,
  setSelected,
  value,
}) => {
  return (
    <m.button
      variants={MenuItemVariant}
      initial="disabled"
      animate={selected === value ? 'active' : 'disabled'}
      whileTap={{ scale: 1.2 }}
      onClick={() => setSelected(value)}
      className="menu__item"
    >
      <Link to={href} className="menu__item--link">
        <i className={`${iconsClasses}`}></i>
      </Link>
    </m.button>
  );
};
const MENU_ROUTES = {
  MAIN: 'main',
  NOTIFICATION: 'notification',
  POST: 'post',
  MESSAGES: 'messages',
  AUTH: 'auth',
};

const Menu = () => {
  const [selected, setSelected] = useState(MENU_ROUTES.MAIN);

  return (
    <nav className="menu">
      <MenuItem
        href="/"
        selected={selected}
        iconsClasses="fas fa-home"
        setSelected={setSelected}
        value={MENU_ROUTES.MAIN}
      />
      <MenuItem
        href="/notification"
        selected={selected}
        iconsClasses="fas fa-bell "
        setSelected={setSelected}
        value={MENU_ROUTES.NOTIFICATION}
      />
      <MenuItem
        href="/new-post"
        selected={selected}
        iconsClasses="fas fa-plus"
        setSelected={setSelected}
        value={MENU_ROUTES.POST}
      />
      <MenuItem
        href="/messages"
        selected={selected}
        iconsClasses="fas fa-comment-dots"
        setSelected={setSelected}
        value={MENU_ROUTES.MESSAGES}
      />
      <MenuItem
        href="/auth"
        selected={selected}
        iconsClasses="fas fa-user"
        setSelected={setSelected}
        value={MENU_ROUTES.AUTH}
      />
    </nav>
  );
};

export default Menu;
