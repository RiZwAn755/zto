import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

const PrivateComponent = () => {
  const location = useLocation();
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuth(isTokenValid(token));
  }, [location]);

  return auth ? <Outlet /> : <Navigate to="/landing" />;
};

export default PrivateComponent;
