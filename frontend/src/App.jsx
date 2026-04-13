import { Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Resources from "./pages/Resources";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Home from "./pages/Home";
import EnrollExams from "./pages/EnrollExams";
import Rewards from "./pages/Rewards";
import PastExams from "./pages/PastExams";
import UpcomingExams from "./pages/upcomingExams";
import Admin from "./pages/Admin";
import PrivateComponent from "./pages/privateComponent";
import CheckResult from "./pages/CheckResult";
import CardLayout from "./pages/Exams";
import PageNotFound from "./Components/PageNotFound";
import AskAI from "./Components/Doubt_Assistant";
import Landing from "./pages/Landing";
import ForgotPassword from "./Components/ForgotPassword";
import ResetPassword from "./Components/resetpassword";
import Article from "./pages/article";
import HomeArticles from "./pages/homeArticle";
import StudentDashboard from "./studentscomponents/stdashboard.jsx";

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const [student, setStudent] = useState(null);

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="App">
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route
            path="/login"
            element={<Login onSuccess={(user) => setStudent(user)} />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/enroll-exams" element={<EnrollExams />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="*" element={<PageNotFound />} />

          {/* 🔐 PRIVATE ROUTES */}
          <Route element={<PrivateComponent />}>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route
              path="/studentDashboard"
              element={<StudentDashboard student={student} />}
            />
            <Route path="/UpcomingExams" element={<UpcomingExams />} />
            <Route path="/exams" element={<CardLayout />} />
            <Route path="/pastexams" element={<PastExams />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/checkresult" element={<CheckResult />} />
            <Route path="/AskAI" element={<AskAI />} />
            <Route path="/Article/:slug" element={<Article />} />
            <Route path="/HomeArticle" element={<HomeArticles />} />
          </Route>
        </Routes>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
