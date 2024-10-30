import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Menu from './core/Menu'
import MainRouter from './MainRouter'
import { BrowserRouter } from 'react-router-dom';
//const base_url = import.meta.env.VITE_API_BASE_URL;


function App() {
    return (
        <>
            <MainRouter/>
        </>
    )
}

export default App
