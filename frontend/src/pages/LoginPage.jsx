import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/auth.css';

function getErrorMessage(error) {
  if (!error?.response) {
    return 'Cannot reach backend API. Make sure backend is running on http://localhost:8080 and CORS is enabled.';
  }

  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    'Something went wrong. Please try again.'
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [loginForm, setLoginForm] = useState({
    identifier: '',
    password: '',
  });

  const redirectPath = location.state?.from || '/dashboard';

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await registerUser(registerForm);
      setIsRegisterMode(false);
      setLoginForm((prev) => ({
        ...prev,
        identifier: registerForm.email,
      }));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginUser(loginForm);
      const data = response.data || {};
      const token = data.token || data.accessToken || data.jwt;

      if (!token) {
        throw new Error('No token returned by login API.');
      }

      const user = data.user || {
        username: loginForm.identifier,
      };

      login(token, user);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h2>{isRegisterMode ? 'Create Account' : 'Login'}</h2>
        <p className="auth-subtitle">
          {isRegisterMode
            ? 'Register to start quizzes and earn XP.'
            : 'Sign in to continue your coding quiz journey.'}
        </p>

        <div className="auth-toggle-row">
          <button
            type="button"
            className={!isRegisterMode ? 'toggle-btn active' : 'toggle-btn'}
            onClick={() => {
              setError('');
              setIsRegisterMode(false);
            }}
          >
            Login
          </button>
          <button
            type="button"
            className={isRegisterMode ? 'toggle-btn active' : 'toggle-btn'}
            onClick={() => {
              setError('');
              setIsRegisterMode(true);
            }}
          >
            Register
          </button>
        </div>

        <ErrorMessage message={error} />

        {loading ? (
          <LoadingSpinner label="Processing request..." />
        ) : isRegisterMode ? (
          <form className="auth-form" onSubmit={handleRegisterSubmit}>
            <label>
              Username
              <input
                type="text"
                value={registerForm.username}
                onChange={(e) =>
                  setRegisterForm((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
                required
              />
            </label>

            <label>
              Email
              <input
                type="email"
                value={registerForm.email}
                onChange={(e) =>
                  setRegisterForm((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={registerForm.password}
                onChange={(e) =>
                  setRegisterForm((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                required
              />
            </label>

            <button className="primary-btn" type="submit">
              Register
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <label>
              Email or Username
              <input
                type="text"
                value={loginForm.identifier}
                onChange={(e) =>
                  setLoginForm((prev) => ({
                    ...prev,
                    identifier: e.target.value,
                  }))
                }
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                required
              />
            </label>

            <button className="primary-btn" type="submit">
              Login
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

export default LoginPage;
