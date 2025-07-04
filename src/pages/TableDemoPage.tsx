import '../styles/forms.css';
import '../styles/tables.css';

export default function ContacPage() {
  return (
    <section className="page">
      <header className="page__header">
        <h2 className="page__title">Periodos Académicos</h2>
        <p className="page__subtitle">Gestión de periodos académicos | Marzo 11, 2025</p>
      </header>

      <hr className="page__separator" />
      <div className="academic-period__form-header">
        <form className="academic-period__form">
          <input
            className="form__input-text"
            type="text"
            name=""
            placeholder="Buscar por nombre o código"
          />
          <input className="button" type="submit" value="Buscar" />
        </form>
        <button className="button">+ Nuevo Periodo</button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead className="table__head">
            <tr className="table__row table__row--head">
              <th className="table__cell table__cell--head">Nombre</th>
              <th className="table__cell table__cell--head">Código</th>
              <th className="table__cell table__cell--head">Fecha de inicio</th>
              <th className="table__cell table__cell--head">Fecha de fin</th>
              <th className="table__cell table__cell--head">Estado</th>
              <th className="table__cell table__cell--head">Acciones</th>
            </tr>
          </thead>
          <tbody className="table__body">
            <tr className="table__row">
              <td className="table__cell">Primer Semestre 2025</td>
              <td className="table__cell">2025-1</td>
              <td className="table__cell">Enero 15, 2025</td>
              <td className="table__cell">Mayo 30, 2025</td>
              <td className="table__cell">
                <div className="table__cell--state-container">
                  <span className="table__cell--state table__cell--green">Activo</span>
                </div>
              </td>
              <td className="table__cell">
                <div className="table__cell--actions">
                  <span className="table__cell--action">Editar</span>
                  <span className="table__cell--action">Eliminar</span>
                </div>
              </td>
            </tr>
            <tr className="table__row">
              <td className="table__cell">Segundo Semestre 2025</td>
              <td className="table__cell">2025-2</td>
              <td className="table__cell">Julio 15, 2025</td>
              <td className="table__cell">Noviembre 30, 2025</td>
              <td className="table__cell">
                <div className="table__cell--state-container">
                  <span className="table__cell--state table__cell--green">Activo</span>
                </div>
              </td>
              <td className="table__cell">
                <div className="table__cell--actions">
                  <span className="table__cell--action">Editar</span>
                  <span className="table__cell--action">Eliminar</span>
                </div>
              </td>
            </tr>
            <tr className="table__row">
              <td className="table__cell">Primer Semestre 2025</td>
              <td className="table__cell">2025-1</td>
              <td className="table__cell">Enero 15, 2025</td>
              <td className="table__cell">Mayo 30, 2025</td>
              <td className="table__cell">
                <div className="table__cell--state-container">
                  <span className="table__cell--state table__cell--yellow">Planificado</span>
                </div>
              </td>
              <td className="table__cell">
                <div className="table__cell--actions">
                  <span className="table__cell--action">Editar</span>
                  <span className="table__cell--action">Eliminar</span>
                </div>
              </td>
            </tr>
            <tr className="table__row">
              <td className="table__cell">Primer Semestre 2025</td>
              <td className="table__cell">2025-1</td>
              <td className="table__cell">Enero 15, 2025</td>
              <td className="table__cell">Mayo 30, 2025</td>
              <td className="table__cell">
                <div className="table__cell--state-container">
                  <span className="table__cell--state table__cell--red">Finalizado</span>
                </div>
              </td>
              <td className="table__cell">
                <div className="table__cell--actions">
                  <span className="table__cell--action">Editar</span>
                  <span className="table__cell--action">Eliminar</span>
                </div>
              </td>
            </tr>
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
    </section>
  );
}
