import './Dashboard.css';

import { IoSend } from "react-icons/io5";

export default function Dashboard() {
  return (
    // Quiero un contenedor con 3 elementos hijos, cada uno con un fondo de color diferente y un texto centrado
    <div className="dashboard">
      <div className="dashboard__item">
        {/* <img className="dashboard__image" src="/images/apartado.png" alt="Solicitar apartado" /> */}
        <IoSend size={100} />
        <p className="dashboard__title">Solicitar apartado</p>
      </div>
      <div className="dashboard__item">
        <IoSend size={100} />
        {/* <img className="dashboard__image" src="/images/apartado.png" alt="Mis apartados" /> */}
        <p className="dashboard__title">Mis apartados</p>
      </div>
      <div className="dashboard__item">
        <IoSend size={100} />
        {/* <img className="dashboard__image" src="/images/apartado.png" alt="Consulta de apartados" /> */}
        <p className="dashboard__title">Consulta de apartados</p>
      </div>
    </div>
  );
}
