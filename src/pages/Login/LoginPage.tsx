import { useState } from 'react';

import '../../components/Login/Login.css';
import itsonImage from '../../assets/images/card-image.png';
import prototypeImage from '../../assets/images/prototype.png';
import { useLogin } from '../../hooks/useLogin';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const body = JSON.stringify({ username, password });

    console.log(JSON.parse(body));

    login({ username, password });
  };

  return (
    <div className="login">
      <div className="card">
        <div className="prototype">
          <img className="prototype__image" src={prototypeImage} alt="SACD logo" />
        </div>

        <h2 className="login-form__title">Sistema de Administración</h2>
        <span className="login-form__subtitle">Consejo Directivo</span>

        <form className="login-form" noValidate onSubmit={handleSubmit}>
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
              value={username}
              onChange={e => {
                setUsername(e.target.value);
              }}
              autoComplete="username"
              disabled={loading}
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
              value={password}
              onChange={e => {
                setPassword(e.target.value);
              }}
              autoComplete="current-password"
              disabled={loading}
              required
            />
          </div>
          <input
            className="login-form__submit-button"
            type="submit"
            value="Ingresar al sistema"
            disabled={loading}
          />
        </form>
      </div>
      <div className="image-container">
        <img className="rectoria-img" src={itsonImage} alt="ITSON Obregón" />
      </div>
    </div>
  );
};

export default LoginPage;
