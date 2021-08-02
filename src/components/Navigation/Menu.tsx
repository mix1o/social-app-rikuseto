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
    color: '#222831',
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

// const Menu: FC = () => {
//   const location = useLocation();
//   const [position, setPosition] = useState(0);
//   useMemo(() => {
//     switch (location.pathname) {
//       case '/':
//         setPosition(0);
//         break;
//       case '/notification':
//         setPosition(1);
//         break;
//       case '/new-post':
//         setPosition(2);
//         break;
//       case '/messages':
//         setPosition(3);
//         break;
//       case '/auth':
//         setPosition(4);
//         break;

//       default:
//         console.log('null');
//     }
//   }, [location]);

//   return (
//     <nav className="menu">
//       <MenuItem
//         className="fas fa-home"
//         href="/"
//         position={0}
//         currentPosition={position}
//       />
//       <MenuItem
//         className="fas fa-bell"
//         href="/notification"
//         position={1}
//         currentPosition={position}
//       />
//       <MenuItem
//         className="fas fa-plus"
//         href="/new-post"
//         position={2}
//         currentPosition={position}
//       />
//       <MenuItem
//         className="fas fa-comment-dots"
//         href="/messages"
//         position={3}
//         currentPosition={position}
//       />
//       <MenuItem
//         className="fas fa-user"
//         href="/auth"
//         position={4}
//         currentPosition={position}
//       />
//     </nav>
//   );
// };

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
    // TODO set white color icons on dark mode
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
