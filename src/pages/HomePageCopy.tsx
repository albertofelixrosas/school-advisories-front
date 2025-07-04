import calendarIcon from '../assets/icons/calendar-icon.png';

import toast from 'react-hot-toast';
import Modal from '../components/UI/Modal';
import { useState } from 'react';
import AddMeetModal from '../components/Modals/Meets/AddMeetModal';
import type { Period } from '../types/periods';

const FORM_PERIOD_INITIAL_DATA: Period = {
  name: '',
  code: '',
  state: 'Activo',
  begin: '',
  end: '',
};

export default function HomePageCopy() {
  const [showModal, setShowModal] = useState(false);
  const [newPeriod, setNewPeriod] = useState<Period>(FORM_PERIOD_INITIAL_DATA);

  return (
    <section className="page">
      <header className="page__header">
        <h2 className="page__title">Bienvenido</h2>
        <p className="page__subtitle">
          Panel de Administración del Sistema Academico | Marzo 11, 2025
        </p>
      </header>

      <hr className="page__separator" />
      <div className="page__direct-access-container">
        <div className="page__direct-access">Estadisticas</div>
        <div className="page__direct-access">Documentos Pendientes</div>
        <div className="page__direct-access">Calendario Academico</div>
        <div className="page__direct-access">Directorio</div>
      </div>
      <div className="page__header-section">
        <h3 className="page__title--gray">Proximas Reuniones...</h3>
        <div className="page__actions">
          <button className="page__action button button--ghost">Modo Calendario</button>
          <button
            className="page__action button"
            onClick={e => {
              setShowModal(true);
            }}
          >
            + Nueva Reunión
          </button>
        </div>
      </div>

      <div className="meet-card-grid">
        <div className="meet-card">
          <div className="meet-card__header">
            <h4 className="meet-card__header-title">Consejo Directivo</h4>
            <div className="meet-card__header-priority">Urgente</div>
          </div>
          <div className="meet-card__body">
            <div className="meet-card__body-datetime">
              <img
                className="meet-card__body-datetime-icon"
                src={calendarIcon}
                alt="Calendar icon"
              />
              Hoy, 15:30 - 17:00
            </div>
            <p>
              Revisión del presupuesto del segundo trimestre y aprobación de nuevos proyectos
              académicos. Análisis de indicadores de desempeño institucional.
            </p>
            <br />
            <p>
              <strong>Participantes:</strong> 8 directores de departamento, Vicerrector Académico,
              Secretario General
            </p>
            <div className="meet-card__body-buttons">
              <button className="meet-card__body-button">Confirmar Asistencia</button>
              <button className="meet-card__body-button meet-card__body-button--ghost">
                Ver agenda
              </button>
            </div>
          </div>
        </div>
        <div className="meet-card">
          <div className="meet-card__header">
            <h4 className="meet-card__header-title">Consejo Directivo</h4>
            <div className="meet-card__header-priority">Urgente</div>
          </div>
          <div className="meet-card__body">
            <div className="meet-card__body-datetime">
              <img
                className="meet-card__body-datetime-icon"
                src={calendarIcon}
                alt="Calendar icon"
              />
              Hoy, 15:30 - 17:00
            </div>
            <p>
              Revisión del presupuesto del segundo trimestre y aprobación de nuevos proyectos
              académicos. Análisis de indicadores de desempeño institucional.
            </p>
            <br />
            <p>
              <strong>Participantes:</strong> 8 directores de departamento, Vicerrector Académico,
              Secretario General
            </p>
            <div className="meet-card__body-buttons">
              <button className="meet-card__body-button">Confirmar Asistencia</button>
              <button className="meet-card__body-button meet-card__body-button--ghost">
                Ver agenda
              </button>
            </div>
          </div>
        </div>
        <div className="meet-card">
          <div className="meet-card__header">
            <h4 className="meet-card__header-title">Consejo Directivo</h4>
            <div className="meet-card__header-priority">Urgente</div>
          </div>
          <div className="meet-card__body">
            <div className="meet-card__body-datetime">
              <img
                className="meet-card__body-datetime-icon"
                src={calendarIcon}
                alt="Calendar icon"
              />
              Hoy, 15:30 - 17:00
            </div>
            <p>
              Revisión del presupuesto del segundo trimestre y aprobación de nuevos proyectos
              académicos. Análisis de indicadores de desempeño institucional.
            </p>
            <br />
            <p>
              <strong>Participantes:</strong> 8 directores de departamento, Vicerrector Académico,
              Secretario General
            </p>
            <div className="meet-card__body-buttons">
              <button className="meet-card__body-button">Confirmar Asistencia</button>
              <button className="meet-card__body-button meet-card__body-button--ghost">
                Ver agenda
              </button>
            </div>
          </div>
        </div>
        <div className="meet-card">
          <div className="meet-card__header">
            <h4 className="meet-card__header-title">Consejo Directivo</h4>
            <div className="meet-card__header-priority">Urgente</div>
          </div>
          <div className="meet-card__body">
            <div className="meet-card__body-datetime">
              <img
                className="meet-card__body-datetime-icon"
                src={calendarIcon}
                alt="Calendar icon"
              />
              Hoy, 15:30 - 17:00
            </div>
            <p>
              Revisión del presupuesto del segundo trimestre y aprobación de nuevos proyectos
              académicos. Análisis de indicadores de desempeño institucional.
            </p>
            <br />
            <p>
              <strong>Participantes:</strong> 8 directores de departamento, Vicerrector Académico,
              Secretario General
            </p>
            <div className="meet-card__body-buttons">
              <button className="meet-card__body-button">Confirmar Asistencia</button>
              <button className="meet-card__body-button meet-card__body-button--ghost">
                Ver agenda
              </button>
            </div>
          </div>
        </div>
        <div className="meet-card">
          <div className="meet-card__header">
            <h4 className="meet-card__header-title">Consejo Directivo</h4>
            <div className="meet-card__header-priority">Urgente</div>
          </div>
          <div className="meet-card__body">
            <div className="meet-card__body-datetime">
              <img
                className="meet-card__body-datetime-icon"
                src={calendarIcon}
                alt="Calendar icon"
              />
              Hoy, 15:30 - 17:00
            </div>
            <p>
              Revisión del presupuesto del segundo trimestre y aprobación de nuevos proyectos
              académicos. Análisis de indicadores de desempeño institucional.
            </p>
            <br />
            <p>
              <strong>Participantes:</strong> 8 directores de departamento, Vicerrector Académico,
              Secretario General
            </p>
            <div className="meet-card__body-buttons">
              <button className="meet-card__body-button">Confirmar Asistencia</button>
              <button className="meet-card__body-button meet-card__body-button--ghost">
                Ver agenda
              </button>
            </div>
          </div>
        </div>
        <div className="meet-card">
          <div className="meet-card__header">
            <h4 className="meet-card__header-title">Consejo Directivo</h4>
            <div className="meet-card__header-priority">Urgente</div>
          </div>
          <div className="meet-card__body">
            <div className="meet-card__body-datetime">
              <img
                className="meet-card__body-datetime-icon"
                src={calendarIcon}
                alt="Calendar icon"
              />
              Hoy, 15:30 - 17:00
            </div>
            <p>
              Revisión del presupuesto del segundo trimestre y aprobación de nuevos proyectos
              académicos. Análisis de indicadores de desempeño institucional.
            </p>
            <br />
            <p>
              <strong>Participantes:</strong> 8 directores de departamento, Vicerrector Académico,
              Secretario General
            </p>
            <div className="meet-card__body-buttons">
              <button className="meet-card__body-button">Confirmar Asistencia</button>
              <button className="meet-card__body-button meet-card__body-button--ghost">
                Ver agenda
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Nuevo Periodo"
        children={
          <AddMeetModal
            formData={newPeriod}
            changeFormData={setNewPeriod}
            onSubmitForm={e => {
              e.preventDefault();
              setShowModal(false);
              toast.success('Checa la consola para ver el resultado');
              console.log({ data: newPeriod });
            }}
          />
        }
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      />
    </section>
  );
}
