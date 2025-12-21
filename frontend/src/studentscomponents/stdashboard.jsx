import { useState } from "react"
import Navbar from "../Components/Navbar";
import "./stdashboard.css";

const StudentDashboard = () => {

     const [name , setName] = useState("");
     const [email , setEmail] = useState("");
    return (
        <>
        <Navbar />
        <main className="student-dashboard">
          <header className="dashboard-header">
            <h3 style={{marginTop:"40px"}}>Welcome to your profile <span className="name">{name}</span>!</h3>
            <p className="subtitle">Here are your details</p>
          </header>
        <div>
            <h5>personal details</h5>
        <table>
            <thead>
                <tr>
                    <td>name</td>
                    <td>email</td>
                    <td>Phone number</td>
                    <td>Address</td>
                </tr>
            </thead>
            <tbody>
             {/* // fetch from backend and map here */}
                <tr>

                </tr>

            </tbody>
        </table>
        <h5>Academic details</h5>
        <table>
            <thead>
                <tr>
                    <td>School/Coaching</td>
                    <td>Class/Grade</td>
                    <td>Board</td>
                    <td>Zone</td>
                </tr>
            </thead>
            <tbody>

                {/* fetch from backend and map here  */}
                <tr>

                </tr>
            </tbody>
        </table>
        <h5>Enrolled Exams</h5>
        <table>
            <thead>
                <tr>
                    <td>Exam Name</td>
                    <td>Exam Date</td>
                    <td>Exam Time</td>
                    <td>Exam Duration</td>
                </tr>
            </thead>
            
            <tbody>
                {/* fetch from backend and map here  */}
                <tr>

                </tr>
            </tbody>
        </table>
        </div>
        </main>


        </>
    )
}

export default StudentDashboard;