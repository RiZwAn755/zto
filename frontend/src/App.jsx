import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './pages/Login';
import Register from './pages/Register';
import Resources from './pages/Resources';
import Contact from './pages/Contact';
import About from './pages/About';
import Home from './pages/Home';
import EnrollExams from './pages/EnrollExams';
import Rewards from './pages/Rewards';
import PastExams from './pages/PastExams';
import UpcomingExams from './pages/upcomingExams'
import Admin from './pages/Admin';
// import EnrollExams from './pages/EnrollExams';
import PrivateComponent from './pages/privateComponent';

import CheckResult from './pages/CheckResult'; // Corrected import

import CardLayout from './pages/Exams';
import PageNotFound from './Components/PageNotFound';
import AskAI from './Components/Doubt_Assistant';
import Landing from './pages/Landing';
import DoubtButton from './Components/DoubtButton';
import ForgotPassword from './Components/ForgotPassword';
import ResetPassword from './Components/resetpassword';

function App() {
  
  const handleDoubt = (e) => {
    e.preventDefault();
    navigate('/AskAI');
  };

  // Debug: Log the Google Client ID
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  console.log('Google Client ID:', googleClientId);
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="App">
      
        <Routes>

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route path="*" element={<PageNotFound />} />

            // private hai ye Components
           <Route  element = {<PrivateComponent/>}>
             <Route path="/UpcomingExams" element={<UpcomingExams />} />
            <Route path="/" element={<Home />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/exams" element={<CardLayout />} />
            <Route path="/pastexams" element={<PastExams />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/enroll-exams" element={<EnrollExams />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/checkresult" element={<CheckResult  />} />
            <Route path='/AskAI' element = {<AskAI/>} />
            </Route>


          </Routes>
          <DoubtButton />
        </div>
      </GoogleOAuthProvider>
     
  );
}

export default App;
