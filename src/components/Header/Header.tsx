import './Header.css';

import { IoIosNotifications } from 'react-icons/io';
import { MdMenu } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { capitalizeEachWord } from '../../utils/formatStringsUtils';

interface HeaderProps {
  onMenuClick: (active: boolean) => void;
  active: boolean;
}

export default function Header({ onMenuClick, active }: HeaderProps) {
  const { logout, name, lastName } = useAuth();

  const fullName = name && lastName ? `${name} ${lastName}` : '';
  const capitalizeName = capitalizeEachWord(fullName);

  let firstLetter = '';

  if (capitalizeName.length > 0) {
    firstLetter = capitalizeName[0].toUpperCase();
  }

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
        onClick={() => {
          logout();
        }}
      >
        <IoIosNotifications color="#FFFFFF" size={20} />
        <div className="main-header__profile-name">{capitalizeName}</div>
        <div className="main-header__profile-name-circle">{firstLetter}</div>
      </div>
    </header>
  );
}
