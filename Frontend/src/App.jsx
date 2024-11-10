// App.jsx
import { useState } from 'react';
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
      <Route path="/form" element={<Form />} />

      {/* Routes with Header */}
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

  return (
    <>
      <AppRouter />
    </>
  );
}

export default App;