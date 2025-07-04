import calendarIcon from '../assets/icons/calendar-icon.png';

import toast from 'react-hot-toast';
import Modal from '../components/UI/Modal';
import { useState } from 'react';
import AddMeetModal from '../components/Modals/Meets/AddMeetModal';
import type { Period } from '../types/periods';
import { formatDateToLongSpanish } from '../utils/dateUtils';
import { formatPhoneNumber } from '../utils/formatStringsUtils';
import { FaUser } from 'react-icons/fa';
import { MdOutlineEmail } from 'react-icons/md';
import { FaPhoneAlt } from 'react-icons/fa';
import { IoSchool } from 'react-icons/io5';

const FORM_PERIOD_INITIAL_DATA: Period = {
  name: '',
  code: '',
  state: 'Activo',
  begin: '',
  end: '',
};

const advisories = [
  {
    advisory_id: 3,
    date: '2025-06-24',
    begin_time: '09:30:00',
    end_time: '10:00:00',
    teacher: {
      teacher_id: 1,
      name: 'Juan',
      last_name: 'Pérez',
      email: 'juan.perez@escuela.edu',
      phone_number: '6621234567',
      school_id: 181331,
    },
    subject: {
      subject_id: 15,
      subject: 'Sistemas Operativos',
    },
    location: {
      location_id: 7,
      location: '3',
      location_type: 'Cubículo',
    },
    students: [
      {
        student_id: 9,
        name: 'Valeria',
        last_name: 'Gómez',
        email: 'valeria.gomez@escuela.edu',
        phone_number: '6628901234',
        school_id: 4099,
      },
      {
        student_id: 13,
        name: 'Camila',
        last_name: 'Silva',
        email: 'camila.silva@escuela.edu',
        phone_number: '6622233445',
        school_id: 4103,
      },
      {
        student_id: 9,
        name: 'Valeria',
        last_name: 'Gómez',
        email: 'valeria.gomez@escuela.edu',
        phone_number: '6628901234',
        school_id: 4099,
      },
      {
        student_id: 13,
        name: 'Camila',
        last_name: 'Silva',
        email: 'camila.silva@escuela.edu',
        phone_number: '6622233445',
        school_id: 4103,
      },
      {
        student_id: 9,
        name: 'Valeria',
        last_name: 'Gómez',
        email: 'valeria.gomez@escuela.edu',
        phone_number: '6628901234',
        school_id: 4099,
      },
      {
        student_id: 13,
        name: 'Camila',
        last_name: 'Silva',
        email: 'camila.silva@escuela.edu',
        phone_number: '6622233445',
        school_id: 4103,
      },
    ],
  },
  {
    advisory_id: 3,
    date: '2025-06-25',
    begin_time: '09:30:00',
    end_time: '10:00:00',
    teacher: {
      teacher_id: 1,
      name: 'Juan',
      last_name: 'Pérez',
      email: 'juan.perez@escuela.edu',
      phone_number: '6621234567',
      school_id: 181331,
    },
    subject: {
      subject_id: 15,
      subject: 'Sistemas Operativos',
    },
    location: {
      location_id: 7,
      location: '3',
      location_type: 'Cubículo',
    },
    students: [
      {
        student_id: 9,
        name: 'Valeria',
        last_name: 'Gómez',
        email: 'valeria.gomez@escuela.edu',
        phone_number: '6628901234',
        school_id: 4099,
      },
      {
        student_id: 13,
        name: 'Camila',
        last_name: 'Silva',
        email: 'camila.silva@escuela.edu',
        phone_number: '6622233445',
        school_id: 4103,
      },
    ],
  },
  {
    advisory_id: 3,
    date: '2025-06-26',
    begin_time: '09:30:00',
    end_time: '10:00:00',
    teacher: {
      teacher_id: 1,
      name: 'Juan',
      last_name: 'Pérez',
      email: 'juan.perez@escuela.edu',
      phone_number: '6621234567',
      school_id: 181331,
    },
    subject: {
      subject_id: 15,
      subject: 'Sistemas Operativos',
    },
    location: {
      location_id: 7,
      location: '3',
      location_type: 'Cubículo',
    },
    students: [
      {
        student_id: 9,
        name: 'Valeria',
        last_name: 'Gómez',
        email: 'valeria.gomez@escuela.edu',
        phone_number: '6628901234',
        school_id: 4099,
      },
      {
        student_id: 13,
        name: 'Camila',
        last_name: 'Silva',
        email: 'camila.silva@escuela.edu',
        phone_number: '6622233445',
        school_id: 4103,
      },
    ],
  },
  {
    advisory_id: 3,
    date: '2025-06-27',
    begin_time: '09:30:00',
    end_time: '10:00:00',
    teacher: {
      teacher_id: 1,
      name: 'Juan',
      last_name: 'Pérez',
      email: 'juan.perez@escuela.edu',
      phone_number: '6621234567',
      school_id: 181331,
    },
    subject: {
      subject_id: 15,
      subject: 'Sistemas Operativos',
    },
    location: {
      location_id: 7,
      location: '3',
      location_type: 'Cubículo',
    },
    students: [
      {
        student_id: 13,
        name: 'Camila',
        last_name: 'Silva',
        email: 'camila.silva@escuela.edu',
        phone_number: '6622233445',
        school_id: 4103,
      },
    ],
  },
];

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [newPeriod, setNewPeriod] = useState<Period>(FORM_PERIOD_INITIAL_DATA);

  return (
    <section className="page">
      <header className="page__header">
        <h2 className="page__title">Bienvenido</h2>
        <p className="page__subtitle">
          Panel de Administración del Sistema de Asesorias | {formatDateToLongSpanish(new Date())}
        </p>
      </header>

      <hr className="page__separator" />

      {/*
  <div className="page__direct-access-container">
        <div className="page__direct-access">Estadisticas</div>
        <div className="page__direct-access">Documentos Pendientes</div>
        <div className="page__direct-access">Calendario Academico</div>
        <div className="page__direct-access">Directorio</div>
      </div>
  */}

      <div className="page__header-section">
        <h3 className="page__title--gray">Proximas Reuniones...</h3>
        <div className="page__actions">
          <button className="page__action button button--ghost">Modo Calendario</button>
          <button
            className="page__action button"
            onClick={() => {
              setShowModal(true);
            }}
          >
            + Nueva Reunión
          </button>
        </div>
      </div>

      {advisories.length > 0 && (
        <div className="meet-card-grid">
          {advisories.map((advisoriy, index) => {
            const {
              advisory_id,
              teacher,
              subject,
              location,
              students,
              date,
              begin_time,
              end_time,
            } = advisoriy;

            const description = `Aquí va la descripción de la asesoría que toca agregar en la base de datos en el modelo.`;

            const now = new Date();
            const advisoryDate = new Date(`${date}T${begin_time}`);

            const status = advisoryDate.getTime() > now.getTime() ? 'Vigente' : 'Expirada';

            // https://chatgpt.com/share/685b45a6-a700-8013-ac35-e1d6190a2ee1

            return (
              <div className="meet-card" key={advisory_id + index}>
                <div className="meet-card__header">
                  <h4 className="meet-card__header-title">{subject.subject}</h4>
                  <div className="meet-card__header-priority">{status}</div>
                </div>
                <div className="meet-card__body">
                  <div className="meet-card__body-datetime">
                    <img
                      className="meet-card__body-datetime-icon"
                      src={calendarIcon}
                      alt="Calendar icon"
                    />
                    {formatDateToLongSpanish(new Date(date))}, {begin_time.slice(0, 5)} -{' '}
                    {end_time.slice(0, 5)}
                  </div>
                  <p className="meet-card__body-description">{description}</p>
                  <br />
                  <p className="meet-card__body-label">
                    Participantes: <span>{students.length}</span>
                  </p>
                  {students.length < 5 && (
                    <div className="meet-card__body-participants">
                      {students.map(student => {
                        const { student_id, name, last_name, email, phone_number, school_id } =
                          student;

                        const copyParticipantDataOnClick = async (
                          attributeName: string,
                          value: string,
                        ) => {
                          try {
                            await navigator.clipboard.writeText(value);
                            toast.success(`Se ha copiado ${attributeName} correctamente.`);
                          } catch (error) {
                            toast.error(`Hubo un error al intentar copiar ${attributeName}`);
                          }
                        };

                        return (
                          <div className="meet-card__body-participant" key={student_id}>
                            <span
                              className="meet-card__body-participant-data-item"
                              onClick={() =>
                                copyParticipantDataOnClick('el nombre', `${name} ${last_name}`)
                              }
                            >
                              {' '}
                              <FaUser size={20} /> {`${name} ${last_name}`}
                            </span>
                            <span
                              className="meet-card__body-participant-data-item"
                              onClick={() =>
                                copyParticipantDataOnClick('el correo eléctronico', email)
                              }
                            >
                              <MdOutlineEmail size={20} />
                              {email}
                            </span>
                            <span
                              className="meet-card__body-participant-data-item"
                              onClick={() =>
                                copyParticipantDataOnClick('el id escolar', `${school_id}`)
                              }
                            >
                              <IoSchool size={20} />
                              {school_id}
                            </span>
                            <span
                              className="meet-card__body-participant-data-item"
                              onClick={() =>
                                copyParticipantDataOnClick(
                                  'el numero de celular',
                                  formatPhoneNumber(phone_number),
                                )
                              }
                            >
                              <FaPhoneAlt size={20} />
                              {formatPhoneNumber(phone_number)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {students.length >= 5 && (
                    <div
                      style={{
                        height: '276px',
                        display: 'grid',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '16px',
                          backgroundColor: 'white',
                          padding: '16px',
                          borderRadius: '8px',
                          border: '1px solid gray',
                          marginTop: '8px',
                          alignItems: 'center',
                        }}
                      >
                        <p style={{ fontStyle: 'italic' }}>
                          El numero de participantes es muy grande.
                        </p>
                        <button className="meet-card__body-button">
                          Mostrar listado de participantes
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="meet-card__body-buttons">
                    <button className="meet-card__body-button">Confirmar Asistencia</button>
                    <button className="meet-card__body-button meet-card__body-button--ghost">
                      Ver agenda
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
