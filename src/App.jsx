import { useState } from 'react'
import {Routes,Route } from 'react-router-dom'
import CalendarApp from './component/CalendarApp'

function App() {
   

  return (
    <>
    <Routes>  
        <Route path='/' element={<CalendarApp/>}></Route>
      </Routes>
    </>
  )
}

export default App
