import './SideMenu.css';
import logo from '../../assets/images/itson-logo.png';
import { useNavigate } from 'react-router';

interface SideMenuProps {
  isActive: boolean;
}

export default function SideMenu({ isActive }: SideMenuProps) {
  const navigate = useNavigate();

  return (
    <aside className={`sidebar ${isActive ? 'sidebar--active' : ''}`}>
      <div className="sidebar__logo-container">
        <img className="sidebar__logo" src={logo} alt="ITSON logo" />
      </div>
      <div className="sidebar__title">Sistema de asesorias en linea</div>
      <ul className="sidebar__sections">
        <li
          className="sidebar__section"
          onClick={() => {
            navigate('/users');
          }}
        >
          Usuarios
        </li>
        <li
          className="sidebar__section"
          onClick={() => {
            navigate('/advisories');
          }}
        >
          Asesorias
        </li>
        <li
          className="sidebar__section"
          onClick={() => {
            navigate('/venues');
          }}
        >
          Lugares
        </li>
        <li
          className="sidebar__section"
          onClick={() => {
            navigate('/subjects');
          }}
        >
          Materias
        </li>
      </ul>
    </aside>
  );
}
