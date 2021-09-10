import { FC, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion as m } from 'framer-motion';
import { useCounter } from '../../store/sub';
import { MenuProps } from '../../interfaces/common/menu';
import { useTheme } from '../../helpers/useTheme';

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
  const [, actions] = useCounter();

  return (
    <Link to={href} className="menu__item--link">
      <m.button
        variants={MenuItemVariant}
        initial="disabled"
        animate={selected === value ? 'active' : 'disabled'}
        whileTap={{ scale: 1.2 }}
        onClick={() => {
          setSelected(value);
          actions.isOpenComment(false);
        }}
        className="menu__item"
      >
        <i className={`${iconsClasses}`}></i>
      </m.button>
    </Link>
  );
};
const MENU_ROUTES = {
  MAIN: 'main',
  CONVERSATIONS: 'conversations',
  POST: 'new-post',
  NOTIFICATION: 'notification',
  AUTH: 'account',
};

const Menu = () => {
  const [selected, setSelected] = useState(MENU_ROUTES.MAIN);
  const [visible, setVisible] = useState(true);

  const location = useLocation();

  const checkPath = () => {
    const split = location.pathname.split('/').slice(1, 2);

    if (split[0].length <= 1) return setSelected(MENU_ROUTES.MAIN);

    setSelected(split[0]);
    return;
  };

  useEffect(() => {
    checkPath();
    if (location.pathname.includes('/single-conversation')) {
      setVisible(false);
      return;
    }
    setVisible(true);
  }, [location]);

  return (
    <>
      {visible && (
        <nav className="menu">
          <MenuItem
            href="/"
            selected={selected}
            iconsClasses="fas fa-home"
            setSelected={setSelected}
            value={MENU_ROUTES.MAIN}
          />
          <MenuItem
            href="/conversations"
            selected={selected}
            iconsClasses="fas fa-comment-dots"
            setSelected={setSelected}
            value={MENU_ROUTES.CONVERSATIONS}
          />
          <MenuItem
            href="/new-post"
            selected={selected}
            iconsClasses="fas fa-plus"
            setSelected={setSelected}
            value={MENU_ROUTES.POST}
          />
          <MenuItem
            href="/notification"
            selected={selected}
            iconsClasses="fas fa-bell "
            setSelected={setSelected}
            value={MENU_ROUTES.NOTIFICATION}
          />

          <MenuItem
            href="/account"
            selected={selected}
            iconsClasses="fas fa-user"
            setSelected={setSelected}
            value={MENU_ROUTES.AUTH}
          />
        </nav>
      )}
    </>
  );
};

export default Menu;
