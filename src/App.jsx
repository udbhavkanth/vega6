// App.jsx
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AddCaptionPage from './pages/AddCaptionPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/add-caption" element={<AddCaptionPage />} />
    </Routes>
  )
}

export default App
