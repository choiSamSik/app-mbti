import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import questions from '../question/data/question.json'
import '../question/Question.scss'
import Copyright from '../../share/components/etc/Copyright'

export default function Questions() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value]
    setAnswers(newAnswers)

    if (step + 1 < questions.length) {
      setStep(step + 1)
    } else {
      const { primary, secondary, secondaryScore } = calculateMBTI(newAnswers)
      navigate(`/result?mbti=${primary}&sub=${secondary}&prob=${secondaryScore}`)
    }
  }

  const calculateMBTI = (values: string[]) => {
    const count: Record<string, number> = {
      E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0
    }
    values.forEach(v => count[v]++)

    const ei = count.E + count.I ? count.E / (count.E + count.I) : 0.5
    const sn = count.S + count.N ? count.S / (count.S + count.N) : 0.5
    const tf = count.T + count.F ? count.T / (count.T + count.F) : 0.5
    const jp = count.J + count.P ? count.J / (count.J + count.P) : 0.5

    const combinations: { mbti: string; score: number }[] = []

    for (const e of ['E', 'I']) {
      for (const s of ['S', 'N']) {
        for (const t of ['T', 'F']) {
          for (const j of ['J', 'P']) {
            const mbti = `${e}${s}${t}${j}`
            const score =
              (e === 'E' ? ei : 1 - ei) +
              (s === 'S' ? sn : 1 - sn) +
              (t === 'T' ? tf : 1 - tf) +
              (j === 'J' ? jp : 1 - jp)
            combinations.push({ mbti, score })
          }
        }
      }
    }

    combinations.sort((a, b) => b.score - a.score)

    return {
      primary: combinations[0].mbti,
      secondary: combinations[1].mbti,
      secondaryScore: Math.round((combinations[1].score / 4) * 100)
    }
  }

  const q = questions[step];

  useEffect(() => {
    if (step > 0) {
      window.history.pushState({ step }, '')
    }
  }, [step])

  useEffect(() => {
    const handlePopState = () => {
      if (step > 0) {
        setStep(prev => prev - 1)
        setAnswers(prev => prev.slice(0, -1))
      } else {
        navigate('/', { replace: true })
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [step])

  const handleDebugAllE = () => {
    const dummyAnswers = questions.map(() => 'E')
    const { primary, secondary, secondaryScore } = calculateMBTI(dummyAnswers)
    navigate(`/result?mbti=${primary}&sub=${secondary}&prob=${secondaryScore}`)
  }

  return (
    <div className="question-container">
      {step > 0 && (
        <button
          onClick={() => {
            setStep(step - 1)
            setAnswers(prev => prev.slice(0, -1))
          }}
          className="question-back"
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            backgroundColor: '#eee',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          ← 이전 질문
        </button>
      )}
      <button
        onClick={handleDebugAllE}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          backgroundColor: '#ffcccc',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          cursor: 'pointer',
          zIndex: 10
        }}
      >
        🧪 테스트 바로가기
      </button>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
          className="question-card"
        >
          <div className="question-inner">
            <h2 className="question-number">질문 {q.id}.</h2>
            <img src={q.image} alt="질문 이미지" className="question-image" />
            <p className="question-text">{q.question}</p>
            {q.answers.map((a, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(a.value)}
                className="question-button"
              >
                {a.text}
              </button>
            ))}
          </div>
          <Copyright />
        </motion.div>
      </AnimatePresence>
      
    </div>
  )
}
