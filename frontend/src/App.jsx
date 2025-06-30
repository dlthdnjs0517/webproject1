import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import React from 'react'
import './App.css'
import Home from './pages/home/home'

// 서버실행을 위해 npm run dev 입력하기

function App(){

  return(
  <Routes>
    <Route path='/' element={<Home/>} />
  </Routes>
  )
}


export default App;
