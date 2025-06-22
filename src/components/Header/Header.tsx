import './Header.css';

import { IoIosNotifications } from 'react-icons/io';
import { MdMenu } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onMenuClick: (active: boolean) => void;
  active: boolean;
}

export default function Header({ onMenuClick, active }: HeaderProps) {
  const { logout } = useAuth();

  return (
    <header className="main-header">
      <div
        className="main-header__menu-container header__button"
        onClick={() => {
          onMenuClick(!active);
        }}
      >
        <MdMenu color="#FFFFFF" size={20} />
        <div className="main-header__menu-text">MENU</div>
      </div>

      <div
        className="main-header__profile-container header__button"
        onClick={e => {
          logout();
        }}
      >
        <IoIosNotifications color="#FFFFFF" size={20} />
        <div className="main-header__profile-name">Manuel Alejandro Quintana</div>
        <div className="main-header__profile-name-circle">M</div>
      </div>
    </header>
  );
}
