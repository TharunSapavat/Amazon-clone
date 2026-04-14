import { useState } from 'react'
import './App.css'
import Navbar from './components/navBar'
import Footer from './components/footer'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar/>

      <Footer/>
      
    </>
  )
}

export default App
