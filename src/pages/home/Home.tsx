import { useNavigate } from 'react-router-dom'
import './Home.scss'
import SamsikCompany from '../../share/components/etc/SamsikCompany'
import Copyright from '../../share/components/etc/Copyright'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-container">
      <SamsikCompany />
      <img src="/images/main.png" alt="MBTI 시작화면" className="main-image" />

      <button
        className="start-button"
        onClick={() => navigate('/questions')}
      >
        시작하기
      </button>
      <Copyright />
    </div>
  )
}
