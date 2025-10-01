import { Outlet, Navigate } from "react-router-dom";

const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isValid = payload.exp * 1000 > Date.now();
    if (!isValid) {
      localStorage.removeItem("token");
    }
    return isValid;
  } catch {
    localStorage.removeItem("token");
    return false;
  }
};

const PrivateComponent = () => {
  const token = localStorage.getItem("token");
  const auth = isTokenValid(token);

  return auth ? <Outlet /> : <Navigate to="/landing" />;
};

export default PrivateComponent;
