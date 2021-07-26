import { FC, useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MenuProps {
  className: string;
  href: string;
  position: number;
  currentPosition: number;
}

const MenuItem: FC<MenuProps> = ({
  className,
  href,
  position,
  currentPosition,
}) => {
  return (
    <Link to={href} className="menu__item">
      <i
        className={`${className} ${
          currentPosition === position ? 'menu__item--active' : null
        }`}
      ></i>
    </Link>
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

const Menu = () => {
  return (
    <nav className="menu">
      <Link to="/">
        <i className={`fas fa-home menu__item `}></i>
      </Link>
      <Link to="/notification">
        <i className={`fas fa-bell menu__item `}></i>
      </Link>
      <Link to="/new-post">
        <i className={`fas fa-plus menu__item `}></i>
      </Link>
      <Link to="/messages">
        <i className={`fas fa-comment-dots menu__item `}></i>
      </Link>
      <Link to="/auth">
        <i className={`fas fa-user menu__item `}></i>
      </Link>
    </nav>
  );
};

export default Menu;
