import './SideMenu.css';
import logo from '../../assets/images/itson-logo.png';

interface SideMenuProps {
  isActive: boolean;
}

export default function SideMenu({ isActive }: SideMenuProps) {
  return (
    <aside className={`sidebar ${isActive ? 'sidebar--active' : ''}`}>
      <div className="sidebar__logo-container">
        <img className="sidebar__logo" src={logo} alt="ITSON logo" />
      </div>
      <div className="sidebar__title">Sistema de asesorias en linea</div>
      <ul className="sidebar__sections">
        <li className="sidebar__section">Usuarios</li>
        <li className="sidebar__section">Asesorias</li>
        <li className="sidebar__section">Lugares</li>
        <li className="sidebar__section">Materias</li>
      </ul>
    </aside>
  );
}
