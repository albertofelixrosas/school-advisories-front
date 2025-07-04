import { useNavigate } from 'react-router';

import { useState } from 'react';
import '../../styles/forms.css';
import type { CreateVenueDto } from '../../types/venue';
import { createVenue } from '../../services/venueService';
import toast from 'react-hot-toast';

const CreateVenue = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [type, setType] = useState<'classroom' | 'office' | 'virtual'>('classroom');
  const [url, setUrl] = useState(''); // Para venues virtuales
  const [building, setBuilding] = useState(''); // Para venues físicas
  const [floor, setFloor] = useState(''); // Para venues físicas

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const venue = createVenueJSON();
      await createVenue(venue);
      clearAllFields();
      toast.success('¡Se ha creado un nuevo lugar para asesorias con exito!');
      // navigate('/venues');
    } catch (err) {
      toast.error('Hubo un error al intentar crear el lugar para asesorias');
      console.error('Error al crear venue', err);
    }
  };

  const createVenueJSON = (): CreateVenueDto => {
    return {
      name,
      type,
      building: type === 'virtual' ? null : building,
      floor: type === 'virtual' ? null : floor,
      url: type !== 'virtual' ? null : url,
    };
  };

  const clearAllFields = () => {
    setName('');
    setFloor('');
    setBuilding('');
    setUrl('');
  };

  return (
    <div className="page">
      <header className="page__header">
        <h2 className="page__title">Agregar lugar de asesorias (presenciales y virtuales)</h2>
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
        <form className="form form--small-width" onSubmit={handleSubmit} noValidate>
          <h3 className="form__title">Registrar lugar</h3>
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
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div className="form__group">
              <label className="form__label" htmlFor="type">
                Tipo de venue:
              </label>
              <select
                className="form__select"
                id="type"
                value={type}
                onChange={e => setType(e.target.value as 'classroom' | 'office' | 'virtual')}
              >
                <option value="classroom">Aula</option>
                <option value="office">Cubículo</option>
                <option value="virtual">Virtual</option>
              </select>
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
                  value={url}
                  onChange={e => setUrl(e.target.value)}
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
                    value={building}
                    onChange={e => setBuilding(e.target.value)}
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
                    value={floor}
                    onChange={e => setFloor(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
          <div className="form__buttons">
            <button type="submit" className="button">
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVenue;
