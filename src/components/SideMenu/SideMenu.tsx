import './SideMenu.css';
import logo from '../../assets/images/prototype.png';
import { IoIosArrowDown } from 'react-icons/io';

interface SideMenuProps {
  isActive: boolean;
}

export default function SideMenu({ isActive }: SideMenuProps) {
  return (
    <aside className={`sidebar ${isActive ? 'sidebar--active' : ''}`}>
      <div className="sidebar__logo-container">
        <img className="sidebar__logo" src={logo} alt="LOGO SACD" />
      </div>
      <div className="sidebar__title">PORTAL DE GESTIÓN ACADÉMICA</div>
      <ul className="sidebar__sections">
        <li className="sidebar__section button">
          Gestión Academica
          <IoIosArrowDown />
        </li>
        <li className="sidebar__section button">
          Administración <IoIosArrowDown />
        </li>
        <li className="sidebar__section button">
          Investigación <IoIosArrowDown />
        </li>
        <li className="sidebar__section button">
          Extensión Universitaria <IoIosArrowDown />
        </li>
        <li className="sidebar__section button">
          Consejo Directivo <IoIosArrowDown />
        </li>
        {/* */}
      </ul>
    </aside>
  );
}
