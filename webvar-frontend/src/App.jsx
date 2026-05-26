import { Routes, Route } from 'react-router-dom';
import video from './assets/11.mp4'; // Import the video
import Navbar from './components/Navbar'; // Import the Navbar component
import Home from './components/Home';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import Contact from './components/Pages/Contact';
import About from './components/Pages/About';
import UserProfile from './components/UserProfile';
import PriceComparison from './components/Pages/PriceComparison';
import VerifyEmail from './components/Auth/VerifyEmail';
import ChangePassword from './components/Auth/ChangePassword';
import SecureShopping from './components/Pages/SecureShopping';


function App() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Navigation Bar */}
      <Navbar />

      {/* Video Background and Routed Content */}
      <div className="flex-1 flex items-center justify-center relative">
        <video autoPlay muted loop playsInline className="video-background">
          <source src={video} type="video/mp4" />
          Your browser does not support the video tag or the file could not be loaded.
        </video>
        <div className="overlay"></div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/About" element={<About />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/price-comparison" element={<PriceComparison />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/secure-shopping" element={<SecureShopping />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;