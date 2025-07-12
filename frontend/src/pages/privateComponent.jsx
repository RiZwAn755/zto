import { Outlet, Navigate } from "react-router-dom";

const PrivateComponent = () => {
  const auth = localStorage.getItem("email");
  return auth ? <Outlet /> : <Navigate to="/landing" />;
};

export default PrivateComponent;
