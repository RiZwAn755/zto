import { Outlet, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";

const PrivateComponent = () => {
  const auth = localStorage.getItem("token");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!auth ) {
      toast.warn("Please login or signup to visit these page", { toastId: "login-warning" });
      const timer = setTimeout(() => setRedirect(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [auth]);

  if (!auth) {
    if (redirect) {
      return <Navigate to="/landing" />;
    }
    return <ToastContainer />;
  }
  return (
    <>
      <ToastContainer />
      <Outlet />
    </>
  );
};

export default PrivateComponent;
