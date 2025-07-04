import { useNavigate, useParams } from 'react-router';

import '../../styles/forms.css';
import { useEffect, useState } from 'react';
import { getVenueById } from '../../services/venueService';
import toast from 'react-hot-toast';

const VenueDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [name, setName] = useState('');
  const [type, setType] = useState<'classroom' | 'office' | 'virtual'>('classroom');
  const [url, setUrl] = useState('');
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');

  const fetchVenue = async () => {
    try {
      const venue = await getVenueById(+(id || ''));
      const { name, type, building, floor, url } = venue;
      setName(name);
      setType(type);
      setBuilding(building || '');
      setFloor(floor || '');
      setUrl(url || '');
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    fetchVenue();
  }, []);

  let typeText = '';
  if (type === 'classroom') {
    typeText = 'Aula de clase';
  } else if (type === 'office') {
    typeText = 'Cubículo';
  } else if (type === 'virtual') {
    typeText = 'En linea';
  }

  return (
    <div className="page">
      <header className="page__header">
        <h2 className="page__title">Visualizar lugar de asesorias (presenciales y virtuales)</h2>
      </header>
      <div className="page__header-section">
        <div className="page__actions">
          <button
            className="page__action button"
            onClick={() => {
              // setShowModal(true);
              navigate('/venues');
            }}
          >
            Regresar
          </button>
        </div>
      </div>
      <div className="card">
        <div className="form form--small-width">
          <h3 className="form__title">Detalles del lugar</h3>
          <div className="form__inputs">
            <div className="form__group">
              <label className="form__label" htmlFor="name">
                Nombre del lugar:
              </label>
              <input
                type="text"
                id="name"
                className="form__input"
                placeholder="Aula, cubículo, enlace virtual"
                value={name}
                disabled
              />
            </div>
            <div className="form__group">
              <label className="form__label" htmlFor="type">
                Tipo de lugar:
              </label>
              <input className="form__input" type="text" id="type" value={typeText} disabled />
            </div>
            {type === 'virtual' && (
              <div className="form__group">
                <label className="form__label" htmlFor="url">
                  Enlace de videollamada:
                </label>
                <input
                  className="form__input"
                  type="url"
                  id="url"
                  placeholder="https://ejemplo.com/meeting"
                  value={url || ''}
                  disabled
                />
              </div>
            )}
            {type !== 'virtual' && (
              <>
                <div className="form__group">
                  <label className="form__label" htmlFor="building">
                    Edificio:
                  </label>
                  <input
                    className="form__input"
                    type="text"
                    id="building"
                    placeholder="Edificio del venue"
                    value={building || ''}
                    disabled
                  />
                </div>
                <div className="form__group">
                  <label className="form__label" htmlFor="floor">
                    Piso:
                  </label>
                  <input
                    className="form__input"
                    type="text"
                    id="floor"
                    placeholder="Piso del venue"
                    value={floor || ''}
                    disabled
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetail;
