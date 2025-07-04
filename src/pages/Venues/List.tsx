import { useEffect, useState } from 'react';
import Modal from '../../components/UI/Modal';
import '../../styles/tables.css';
import './Venues.css';
import { BiShowAlt } from 'react-icons/bi';
import { FaEdit } from 'react-icons/fa';
import { IoIosRemoveCircle } from 'react-icons/io';
import type { Venue } from '../../types/venue';
import { useNavigate } from 'react-router';
import { getVenues, deleteVenue } from '../../services/venueService';
import toast from 'react-hot-toast';

export default function Venues() {
  const [showDeleteVenueModal, setShowDeleteVenueModal] = useState(false);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenueId, setSelectedVenueId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    setLoading(true);
    try {
      const venues = await getVenues();
      /*
        const res = await api.get('/venues', {
          params: {
            page: 1,
            limit: 10,
          },
        });
        */
      setVenues(venues);
    } catch (err) {
      console.error('Error al obtener venues:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOnDeleteVenueIcon = (id: number) => {
    setShowDeleteVenueModal(true);
    setSelectedVenueId(id);
  };

  const handleOnDeleteVenue = async () => {
    try {
      await deleteVenue(selectedVenueId || 0);
      toast.success('¡Se ha logrado eliminar el lugar para asesorias!');
      fetchVenues();
    } catch (error) {
      if (error instanceof Error) {
        toast.error('No se logró eliminar el lugar para asesorias');
        console.error(error.message);
      }
    }
  };

  const handleOnShowVenue = (id: number) => {
    navigate(`/venues/${id}`);
  };

  const handleOnEditVenue = (id: number) => {
    navigate(`/venues/${id}/edit`);
  };

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
              // setShowModal(true);
              navigate('/venues/create');
            }}
          >
            + Nuevo lugar
          </button>
        </div>
      </div>
      {venues.length === 0 && loading === false && (
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
      {venues.length > 0 && loading === false && (
        <>
          <div className="table-container">
            <table className="table table--venues">
              <thead className="table__head">
                <tr className="table__row--head">
                  <th className="table__cell table__cell--head table__cell--name">Nombre</th>
                  <th className="table__cell table__cell--head table__cell--type">Tipo</th>
                  <th className="table__cell table__cell--head table__cell--link">Enlace</th>
                  <th className="table__cell table__cell--head table__cell--building">Edificio</th>
                  <th className="table__cell table__cell--head table__cell--floor">Piso</th>
                  <th className="table__cell table__cell--head table__cell--actions-header">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="table__body">
                {venues.map(venue => {
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
                    <tr className="table__row" key={venue.venue_id}>
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
                          <span
                            className="table__cell--action"
                            onClick={() => {
                              handleOnShowVenue(venue.venue_id);
                            }}
                          >
                            <BiShowAlt size={30} color="black" />
                          </span>
                          <span
                            className="table__cell--action"
                            onClick={() => {
                              handleOnEditVenue(venue.venue_id);
                            }}
                          >
                            <FaEdit size={30} />
                          </span>
                          <span
                            className="table__cell--action"
                            onClick={() => {
                              handleOnDeleteVenueIcon(venue.venue_id);
                            }}
                          >
                            <IoIosRemoveCircle size={30} color="#B22F10" />
                          </span>
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
              <button className="pagination__button ">Anterior</button>

              <button className="pagination__button pagination__button--active">1</button>
              <button className="pagination__button">2</button>
              <button className="pagination__button">3</button>

              <button className="pagination__button">Siguiente</button>
            </div>
          </div>
        </>
      )}
      <Modal
        title="¿Seguro que desea eliminar este lugar?"
        children={
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '32px',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '16px',
              }}
            >
              <button
                className="button"
                onClick={() => {
                  handleOnDeleteVenue();
                  setShowDeleteVenueModal(false);
                }}
              >
                Eliminar
              </button>
              <button
                className="button button--ghost"
                onClick={() => {
                  setShowDeleteVenueModal(false);
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        }
        isOpen={showDeleteVenueModal}
        onClose={() => {
          setShowDeleteVenueModal(false);
          setSelectedVenueId(null);
        }}
      />
    </div>
  );
}
