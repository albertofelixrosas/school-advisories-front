import '../Modals.css';
import type { Period, PeriodState } from '../../../types/periods';

interface AddMeetModalProps {
  formData: Period;
  changeFormData: (formData: Period) => void;
  onSubmitForm: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function AddMeetModal({
  formData,
  changeFormData,
  onSubmitForm,
}: AddMeetModalProps) {
  const { name, code, state, begin, end } = formData;

  return (
    <div className="modal-content">
      <form className="modal-content--new-period" noValidate onSubmit={onSubmitForm}>
        <label htmlFor="new-period-name">Nombre</label>
        <input
          className="modal-content__input-text"
          placeholder="Nombre del Periodo"
          type="text"
          name="name"
          value={name}
          id="new-period-name"
          onChange={e => {
            changeFormData({
              ...formData,
              name: e.target.value,
            });
          }}
        />
        <label htmlFor="new-period-code">Código (Opcional)</label>
        <input
          className="modal-content__input-text"
          placeholder="Código del Periodo"
          type="text"
          name="code"
          value={code}
          id="new-period-code"
          onChange={e => {
            changeFormData({
              ...formData,
              code: e.target.value,
            });
          }}
        />
        <label htmlFor="new-period-state">Estado</label>
        <select
          className="modal-content__select"
          name="state"
          value={state}
          id="new-period-state"
          onChange={e => {
            changeFormData({
              ...formData,
              state: e.target.value as PeriodState,
            });
          }}
        >
          <option value="Activo">Activo</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Finalizado">Finalizado</option>
        </select>
        <label htmlFor="new-period-begin">Inicio</label>
        <input
          className="modal-content__date"
          type="date"
          name="begin"
          id="new-period-begin"
          value={begin}
          onChange={e => {
            changeFormData({
              ...formData,
              begin: e.target.value,
            });
          }}
        />
        <label htmlFor="new-period-end">Fin</label>
        <input
          className="modal-content__date"
          type="date"
          name="end"
          id="new-period-end"
          value={end}
          onChange={e => {
            changeFormData({
              ...formData,
              end: e.target.value,
            });
          }}
        />
        <input className="button" type="submit" value="Agregar" />
      </form>
    </div>
  );
}
