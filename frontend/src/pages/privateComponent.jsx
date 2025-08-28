import { Outlet, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

const PrivateComponent = () => {
  const [checking, setChecking] = useState(true);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(`${baseUrl}/me`, { withCredentials: true });
        setChecking(false);
      } catch (err) {
        toast.warn("Please login or signup to visit these page", { toastId: "login-warning" });
        setTimeout(() => setRedirect(true), 1000);
      }
    };
    checkAuth();
  }, []);

  if (redirect) {
    return <Navigate to="/landing" />;
  }

  if (checking) {
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
