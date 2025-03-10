import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import authService from "../../services/auth.service";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();
  const { storeToken, authenticateUser } = useContext(AuthContext);

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const requestBody = { email, password };

    authService
      .login(requestBody)
      .then((response) => {
        storeToken(response.data.authToken);
        authenticateUser();

        setTimeout(() => {
          console.log("Redirigiendo a /dashboard/info...");
          navigate("/dashboard/info");
        }, 100);
      })
      .catch((error) => {
        const errorDescription = error.response?.data?.message || "Error desconocido";
        setErrorMessage(errorDescription);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-96 p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800">Iniciar sesión</h1>

        <form onSubmit={handleLoginSubmit} className="mt-6">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium text-left">Email:</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleEmail}
              placeholder="nombre@ejemplo.com"
              className="w-full p-2 mt-1 border border-gray-400 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium text-left">Contraseña:</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handlePassword}
              placeholder="Contraseña"
              className="w-full p-2 mt-1 border border-gray-400 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 text-white bg-indigo-500 rounded-md shadow-md hover:bg-indigo-600 transition-all duration-300"
          >
            Entrar
          </button>
        </form>

        {errorMessage && <p className="text-red-500 text-sm mt-2 text-center">{errorMessage}</p>}

        <p className="mt-4 text-gray-600 text-sm text-center">
          ¿No tienes una cuenta todavía?{" "}
          <Link to="/signup" className="text-indigo-500 hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
