import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/homePage.jsx"
import LoginPage from "./pages/authentication/LoginPage.jsx"
import RegistrationPage from "./pages/authentication/RegistrationPage.jsx"
function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
      </Routes>
    </>
  )
}

export default App
