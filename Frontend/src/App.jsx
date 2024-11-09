import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './components/Landing'
import Login from './components/Login'
import Signup from './components/Signup'

// Ecommerce Components
import EcomHeader from './ecommerce/Header'
import MainPage from './ecommerce/MainPage'
import AddStock from './ecommerce/AddStock'
import Cart from './ecommerce/Cart'
import Profile from './ecommerce/Profile'

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Ecommerce Routes */}
      <Route path="/store" element={<div><EcomHeader/><MainPage/></div>} />
      <Route path="/addStock" element={<div><AddStock/></div>} />
      <Route path="/cart" element={<div><EcomHeader/><Cart/></div>} />
      <Route path="/profile" element={<div><EcomHeader/><Profile/></div>} />
    </Routes>
  </Router>
)

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AppRouter />
    </>
  )
}

export default App
