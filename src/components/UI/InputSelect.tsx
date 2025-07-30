/*
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
*/

interface Option {
  value: string;
  label: string;
}

interface InputSelectProps {
  className: string;
  options: Option[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled: boolean;
}

export const InputSelect = (props: InputSelectProps) => {
  const { className, options, onChange, disabled } = props;
  return (
    <select className={className} onChange={onChange}>
      {options.map((option, index) => {
        const { value, label } = option;
        return (
          <option value={value} key={`${value}-${index}`} disabled={disabled}>
            {label}
          </option>
        );
      })}
    </select>
  );
};
