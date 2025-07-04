import './Login.css';
import itsonImage from './assets/images/card-image.png';
import prototypeImage from './assets/images/itson-logo.png';

function Login() {
  return (
    <div className="login">
      <div className="card">
        <div className="prototype">
          <img className="prototype__image" src={prototypeImage} alt="SACD logo" />
        </div>

        <h2 className='login-form__title'>Sistema de Administración</h2>
        <span className='login-form__subtitle'>Consejo Directivo</span>

        <form className="login-form" noValidate>
          <div className="login-form__inputs">
            <label className="login-form__label" htmlFor="username">
              Usuario
            </label>
            <input
              className="login-form__input-text"
              placeholder="Ingrese su usuario"
              type="text"
              name="username"
              id="username"
              required
            />
            <label className="login-form__label" htmlFor="password">
              Contraseña
            </label>
            <input
              className="login-form__input-text"
              placeholder="Ingrese su contraseña"
              type="password"
              name="password"
              id="password"
              required
            />
          </div>
          <input className="login-form__submit-button" type="submit" value="Ingresar al sistema" />
        </form>
      </div>
      <div className="image-container">
        <img className="rectoria-img" src={itsonImage} alt="ITSON Obregón" />
      </div>
    </div>
  );
}

export default Login;
