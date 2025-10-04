import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './pages/login';
import Register from './pages/register';
import Resources from './pages/resources';
import Contact from './pages/contact';
import About from './pages/about';
import Home from './pages/home';
import EnrollExams from './pages/enrollexams';
import Rewards from './pages/rewards';
import PastExams from './pages/pastexams';
import UpcomingExams from './pages/upcomingexams'
import Admin from './pages/admin';

import PrivateComponent from './pages/privatecomponent';

import CheckResult from './pages/checkresult'; 

import CardLayout from './pages/exams';
import PageNotFound from './components/pagenotfound';
import AskAI from './components/doubt_assistant';
import Landing from './pages/landing';
import ForgotPassword from './components/forgotpassword';
import ResetPassword from './components/resetpassword';
import Article from './pages/article';
import HomeArticles from './pages/homearticle';
import AddArticle from './admincomponents/addarticle';




function App() {
  


  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="App">
      
        <Routes>

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/resetPassword" element={<ResetPassword />} />
            <Route path="*" element={<PageNotFound />} />

                        // private hai ye Components
           <Route  element = {<PrivateComponent/>}>
            <Route path="/UpcomingExams" element={<UpcomingExams />} />
            <Route path="/" element={<Home />} />
             <Route path="/admin" element={<Admin />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/exams" element={<CardLayout />} />
            <Route path="/pastexams" element={<PastExams />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/enroll-exams" element={<EnrollExams />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/checkresult" element={<CheckResult />} />
            <Route path='/AskAI' element = {<AskAI />} />
            <Route path='/Article/:slug' element = {<Article/>} />
            <Route path = "/HomeArticle" element = {<HomeArticles/>} />
            <Route path = "/addArticle" element = {<AddArticle/>} />
            </Route>


          </Routes>
         
        </div>
      </GoogleOAuthProvider>
     
  );
}

export default App;
