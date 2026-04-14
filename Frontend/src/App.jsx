import { useState } from 'react'
import './App.css'
import Navbar from './components/navBar'
import Footer from './components/footer'
import HomePage from './pages/homescreen/homeScreen'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar/>
      <HomePage/>
      <Footer/>
    </>
  )
}

export default App
