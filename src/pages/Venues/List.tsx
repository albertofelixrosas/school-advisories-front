import { useState } from 'react';
import Modal from '../../components/UI/Modal';
import '../../styles/tables.css';
import './Venues.css';

const VENUES_EXAMPLE = [
  {
    id: 1,
    name: 'Aula 101',
    type: 'classroom',
    url: null,
    building: 'Edificio A',
    floor: 'Planta baja',
  },
  {
    id: 2,
    name: 'Cubículo 202',
    type: 'office',
    url: null,
    building: 'Edificio B',
    floor: 'Segundo piso',
  },
  {
    id: 3,
    name: 'Sala de reuniones virtual',
    type: 'virtual',
    url: 'https://meet.example.com/room123',
    building: null,
    floor: null,
  },
  {
    id: 4,
    name: 'Aula 103',
    type: 'classroom',
    url: null,
    building: 'Edificio A',
    floor: 'Primer piso',
  },
  {
    id: 5,
    name: 'Cubículo 205',
    type: 'office',
    url: null,
    building: 'Edificio B',
    floor: 'Tercer piso',
  },
];

export default function Venues() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="page">
      <header className="page__header">
        <h2 className="page__title">Lugares de asesorias (presenciales y virtuales)</h2>
        <p className="page__subtitle">
          Administre aulas de clase, cubiculos y enlaces para videollamadas en este apartado.
        </p>
      </header>
      <hr className="page__separator" />
      <div className="page__header-section">
        <h3 className="page__title--gray">Lugares disponibles</h3>
        <div className="page__actions">
          <button
            className="page__action button"
            onClick={() => {
              setShowModal(true);
            }}
          >
            + Nuevo lugar
          </button>
        </div>
      </div>
      {VENUES_EXAMPLE.length === 0 && (
        <div className="not-found not-found--padding-top">
          <div className="not-found__card">
            <p className="not-found__title">No hay lugares registrados</p>
            <p className="not-found__description">
              Registre nuevos lugares para que los estudiantes puedan reservarlos para sus
              asesorías.
            </p>
          </div>
        </div>
      )}
      {VENUES_EXAMPLE.length > 0 && (
        <>
          <div className="table-container">
            <table className="table table--venues">
              <thead className="table__head">
                <tr className="table__row--head">
                  <th className="table__cell table__cell--head table__cell--id">ID</th>
                  <th className="table__cell table__cell--head table__cell--name">Nombre</th>
                  <th className="table__cell table__cell--head table__cell--type">Tipo</th>
                  <th className="table__cell table__cell--head table__cell--link">Enlace</th>
                  <th className="table__cell table__cell--head table__cell--building">Edificio</th>
                  <th className="table__cell table__cell--head table__cell--floor">Piso</th>
                  <th className="table__cell table__cell--head table__cell--actions-header">Acciones</th>
                </tr>
              </thead>
              <tbody className="table__body">
                {VENUES_EXAMPLE.map(venue => {
                  let typeCSSStyle = '';
                  const { type } = venue;
                  if (type === 'classroom') {
                    typeCSSStyle = 'table__cell--red';
                  } else if (type === 'office') {
                    typeCSSStyle = 'table__cell--yellow';
                  } else if (type === 'virtual') {
                    typeCSSStyle = 'table__cell--green';
                  }

                  let typeText = '';
                  if (type === 'classroom') {
                    typeText = 'Aula de clase';
                  } else if (type === 'office') {
                    typeText = 'Cubículo';
                  } else if (type === 'virtual') {
                    typeText = 'En linea';
                  }

                  return (
                    <tr className="table__row" key={venue.id}>
                      <td className="table__cell">{venue.id}</td>
                      <td className="table__cell">{venue.name}</td>
                      <td className="table__cell">
                        <div className="table__cell--state-container">
                          <span className={`table__cell--state ${typeCSSStyle}`}>{typeText}</span>
                        </div>
                      </td>
                      <td className="table__cell">
                        {venue.url ? (
                          <a href={venue.url} target="_blank" rel="noopener noreferrer">
                            Enlace
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="table__cell">{venue.building || 'N/A'}</td>
                      <td className="table__cell">{venue.floor || 'N/A'}</td>
                      <td className="table__cell">
                        <div className="table__cell--actions">
                          <span className="table__cell--action">Editar</span>
                          <span className="table__cell--action">Eliminar</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <div className="pagination__buttons">
              <button className="pagination__button" disabled>
                Anterior
              </button>

              <button className="pagination__button pagination__button--active">1</button>
              <button className="pagination__button">2</button>
              <button className="pagination__button">3</button>

              <button className="pagination__button">Siguiente</button>
            </div>
          </div>
        </>
      )}
      <Modal
        title="Nuevo Periodo"
        children={
          <div>
            <p>Lorem, ipsum.</p>
          </div>
        }
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      />
    </div>
  );
}
