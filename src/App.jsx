import React from "react"
import "./App.css"
import { Routes, Route } from "react-router-dom"
import Settings from "./pages/Settings"
import BeforeNavigate from "./pages/BeforeNavigate"

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Settings />} />

      <Route path="settings" element={<Settings />} />
      <Route path="before-navigate" element={<BeforeNavigate />} />
    </Routes>
  )
}

export default App
