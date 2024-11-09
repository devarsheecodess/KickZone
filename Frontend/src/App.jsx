import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './components/Landing'
import Login from './components/Login'
import Signup from './components/Signup'
import Header from './components/Header'
import Home from './components/Page/Home'
import Meet from './components/Page/Meet'
import Polls from './components/Page/Polls'
import Community from './components/Page/Community'
import Games from './components/Page/Games'
import LiveChat from './components/Livechat'

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
            <Meet/>
          </>
        }
      />
       <Route
        path="/community"
        element={
          <>
            <Header />
            <Community/>
          </>
        }
      />
       <Route
        path="/polls"
        element={
          <>
            <Header />
            <Polls/>
          </>
        }
      />
      <Route
        path="/games"
        element={
          <>
            <Header />
            <Games />
          </>
        }
      />
      <Route path="/livechat" element={<div><Home/>< LiveChat/></div>}/>

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
