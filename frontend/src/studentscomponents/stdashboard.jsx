import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import "./stdashboard.css";

const baseUrl = import.meta.env.VITE_BASE_URL;

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        const res = await axios.get(`${baseUrl}/student/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStudent(res.data);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (!student) return <p>No profile data found</p>;

  return (
    <>
      <Navbar />

      <main className="student-dashboard">
        <header className="dashboard-header">
          <h3 style={{ marginTop: "40px" }}>
            Welcome to your profile <span className="name">{student.name}</span>!
          </h3>
          <p className="subtitle">Here are your details</p>
        </header>

        <h5>Personal Details</h5>
        <table>
          <thead>
            <tr>
              <td>Name</td>
              <td>Email</td>
              <td>Phone</td>
              <td>Address</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.phone || "-"}</td>
              <td>{student.address || "-"}</td>
            </tr>
          </tbody>
        </table>

        <h5>Academic Details</h5>
        <table>
          <thead>
            <tr>
              <td>School</td>
              <td>Class</td>
              <td>Board</td>
              <td>Zone</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{student.school || "-"}</td>
              <td>{student.className || student.class || "-"}</td>
              <td>{student.board || "-"}</td>
              <td>{student.zone || "-"}</td>
            </tr>
          </tbody>
        </table>
      </main>
    </>
  );
};

export default StudentDashboard;
