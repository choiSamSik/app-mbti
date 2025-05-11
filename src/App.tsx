import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home/Home'
import Questions from './pages/question/Question'
import Result from './pages/result/Result'
// import Questions from './pages/Questions'
// import Result from './pages/Result'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/result" element={<Result />} />
        {/* <Route path="/result" element={<Result />} /> */}
      </Routes>
    </BrowserRouter>
  )
}
