// App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

// Main Components
import Landing from './components/Landing';
import Login from './components/Login';
import Signup from './components/Signup';
import Header from './components/Header';
import Home from './components/Page/Home';
import Meet from './components/Page/Meet';
import Polls from './components/Page/Polls';
import Community from './components/Page/Community';
import Quiz from './components/Page/Quiz';
import LiveChat from './components/Livechat';

// Football API Components
import Standings from './components/Page/Standings';
import Players from './components/Page/Players';
import Fixtures from './components/Page/Fixtures';

// Ecommerce Components
import EcomHeader from './ecommerce/Header'
import MainPage from './ecommerce/MainPage'
import AddStock from './ecommerce/AddStock'
import Cart from './ecommerce/Cart'
// Removed Profile since it has been deleted
import Form from './components/Form'
import GooglePayButton from './ecommerce/GooglePayButton';
import Recommendations from './components/Page/Recommendations';

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Routes with Header */}
      <Route path="/standings" element={<><Header /><Standings /></>} />
      <Route path="/players" element={<><Header /><Players /></>} />
      <Route path="/fixtures" element={<><Header /><Fixtures /></>} />
      <Route
        path="/home"
        element={
          <>
            <Header />
            <Home />
          </>
        }
      />
      <Route
        path="/meet"
        element={
          <>
            <Header />
            <Meet />
          </>
        }
      />
      <Route
        path="/community"
        element={
          <>
            <Header />
            <Community />
          </>
        }
      />
      <Route
        path="/recommendations"
        element={
          <>
            <Header />
            <Recommendations />
          </>
        }
      />
      <Route
        path="/polls"
        element={
          <>
            <Header />
            <Polls />
          </>
        }
      />
      <Route
        path="/quiz"
        element={
          <>
            <Header />
            <Quiz />
          </>
        }
      />
      <Route path="/livechat" element={<div><Home /><LiveChat /></div>} />

      {/* Ecommerce Routes */}
      <Route path="/store" element={<div><EcomHeader /><MainPage /></div>} />
      <Route path="/addStock" element={<AddStock />} />
      <Route path="/cart" element={<div><EcomHeader /><Cart /></div>} />
      <Route
        path="/google-pay"
        element={
          <div>
            <EcomHeader />
            <h1>Google Pay Integration</h1>
            <GooglePayButton totalPrice={100} />
          </div>
        }
      />
    </Routes>
  </Router>
);

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Check for query parameters from Google login redirect
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const username = urlParams.get('username');
    const googleLogin = urlParams.get('googleLogin');
    
    // If redirected from Google login, save the user data to localStorage
    if (id && username && googleLogin === 'true') {
      localStorage.setItem('id', id);
      localStorage.setItem('user', username);
      // Remove query parameters from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    const storedId = localStorage.getItem('id');
    const currentPath = window.location.pathname;
  
    // Paths that do not require login
    const publicPaths = ['/login', '/signup', '/'];
  
    if (!storedId && !publicPaths.includes(currentPath)) {
      alert('Please login to continue');
      window.location.href = '/login';
    }
  }, []);
  

  return (
    <>
      <AppRouter />
    </>
  );
}

export default App;