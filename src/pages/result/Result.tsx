import { useSearchParams, useNavigate } from 'react-router-dom'
import './Result.scss'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react';
import html2canvas from 'html2canvas'

interface CordovaPlugins {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface CordovaWindow extends Window {
  cordova: {
    plugins: CordovaPlugins;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    file: any;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolveLocalFileSystemURL: any;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cordova?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolveLocalFileSystemURL?: any;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cordova: any;
}

declare const window: CordovaWindow;

const mbtiDescriptions: Record<string, {
  title: string
  desc1: string
  desc2: string
  desc3: string
  emoji: string
  image?: string
  summary: string // 👈 요거 추가
}> = {
  INTJ: {
    title: '전략가',
    summary: '분석적이고 전략적인 사고를 가진 계획형 인간.',
    desc1: '넌 머리 잘 돌아가고 한 번 꽂히면 끝까지 파는 타입.',
    desc2: '근데 사람 감정 읽는 건 진짜 못 함.',
    desc3: '그래서 대화하다가 상대방이 삐졌다는 걸 나중에 알게 됨.',
    emoji: '🧠',
    image: '/images/mbti/intj.png'
  },
  ENFP: {
    title: '활동가',
    summary: '에너지 넘치고 즉흥적인 낙천주의자.',
    desc1: '사람 좋아하고 분위기 띄우는 데 진심임.',
    desc2: '근데 집중력 짧고 말하다가 본론 잊음.',
    desc3: '그래서 친구들이 대화하면서 자주 정리해줌.',
    emoji: '🔥',
    image: '/images/mbti/enfp.png'
  },
  ISFJ: {
    title: '수호자',
    summary: '성실하고 조용히 헌신하는 배려의 아이콘.',
    desc1: '성실하고 배려심 강해서 주변 평판 좋음.',
    desc2: '근데 너무 참다가 혼자 스트레스 쌓임.',
    desc3: '그래서 가끔 연락두절되고 주변이 걱정함.',
    emoji: '🛡️',
    image: '/images/mbti/isfj.png'
  },
  INTP: {
    title: '논리술사',
    summary: '지적 호기심이 넘치는 아이디어 장인.',
    desc1: '아이디어 뱅크. 창의력 미침.',
    desc2: '근데 현실 감각 없고 맨날 머릿속에만 살음.',
    desc3: '그래서 같이 있을 땐 멍 때리는 줄 알았는데 알고보면 딴 생각 중.',
    emoji: '🔍',
    image: '/images/mbti/intp.png'
  },
  INFP: {
    title: '중재자',
    summary: '이상주의적인 감성러. 자기 내면과 화해 중.',
    desc1: '감정 깊고 공감력 좋음.',
    desc2: '근데 자주 혼자 상처받고 감정과몰입함.',
    desc3: '그래서 혼자 글 쓰거나 노래 들으며 감정 정리함.',
    emoji: '🌈',
    image: '/images/mbti/infp.png'
  },
  ENTJ: {
    title: '지휘관',
    summary: '야망 있고 통솔력 강한 빡센 리더.',
    desc1: '판 짜는 거 존나 잘하고 추진력 있음.',
    desc2: '근데 말이 세서 가끔 윽박처럼 들림.',
    desc3: '그래서 상대방이 혼나는 느낌 받을 때 있음.',
    emoji: '🚀',
    image: '/images/mbti/entj.png'
  },
  ESTP: {
    title: '사업가',
    summary: '즉흥적이고 현실 감각 좋은 실행가.',
    desc1: '즉흥적이지만 센스 있어서 잘 먹힘.',
    desc2: '근데 디테일 다 무시함. 마무리 약함.',
    desc3: '그래서 시작은 멋진데 결과는 흐지부지될 때 있음.',
    emoji: '💼',
    image: '/images/mbti/estp.png'
  },
  ESFP: {
    title: '연예인',
    summary: '모두의 기분을 띄우는 무드메이커.',
    desc1: '분위기 메이커. 있으면 파티 됨.',
    desc2: '근데 텐션 강제로 올릴 때 있음.',
    desc3: '그래서 주변 사람들이 조금 피곤해할 때도 있음.',
    emoji: '🎤',
    image: '/images/mbti/esfp.png'
  },
  ISTJ: {
    title: '현실주의자',
    summary: '원칙 지키는 조용한 실무형 인간.',
    desc1: '규칙 잘 지키고 신뢰감 쩜.',
    desc2: '근데 유연성 부족. 계획 틀어지면 멘붕.',
    desc3: '그래서 갑작스런 약속 변경에 예민하게 반응함.',
    emoji: '📘',
    image: '/images/mbti/istj.png'
  },
  ESTJ: {
    title: '경영자',
    summary: '조직 관리 능력 탑, 실용적인 결정가.',
    desc1: '정리 잘하고 딱딱 맞추는 거 좋아함.',
    desc2: '근데 고집 세고 자기 방식 아니면 불안해함.',
    desc3: '그래서 갑자기 분위기 안 맞으면 혼자 짜증내기도 함.',
    emoji: '📊',
    image: '/images/mbti/estj.png'
  },
  ISFP: {
    title: '예술가',
    summary: '감성적이고 조용한 낭만주의자.',
    desc1: '감성 있고 취향 확실함.',
    desc2: '근데 표현 안 하고 혼자 끙끙 앓음.',
    desc3: '그래서 주변 사람들이 뭐가 문제인지 모름.',
    emoji: '🎨',
    image: '/images/mbti/isfp.png'
  },
  ISTP: {
    title: '장인',
    summary: '말수는 없지만 손재주 좋은 고요한 관찰자.',
    desc1: '손재주 좋고 실용적임.',
    desc2: '근데 말 없고 혼자 노는 거 좋아함.',
    desc3: '그래서 단체 모임에서 말수 적어서 오해받기도 함.',
    emoji: '🛠️',
    image: '/images/mbti/istp.png'
  },
  ENTP: {
    title: '변론가',
    summary: '호기심 많고 말 잘하는 토론광.',
    desc1: '말빨 좋고 재치 있음.',
    desc2: '근데 싸움만 하고 정작 실천은 귀찮아함.',
    desc3: '그래서 말은 잘하는데 결과가 없을 때 있음.',
    emoji: '🧩',
    image: '/images/mbti/entp.png'
  },
  ENFJ: {
    title: '선도자',
    summary: '사람 챙기고 이끄는 감정 코치.',
    desc1: '눈치 빠르고 배려심 있음.',
    desc2: '근데 혼자 애쓰고 지침.',
    desc3: '그래서 아무도 몰랐는데 나중에 탈진해 있음.',
    emoji: '🤝',
    image: '/images/mbti/enfj.png'
  },
  INFJ: {
    title: '옹호자',
    summary: '깊은 통찰과 사명감을 가진 철학자.',
    desc1: '직관력 좋고 본질 파악 빠름.',
    desc2: '근데 자기 얘긴 잘 안 함. 벽 있음.',
    desc3: '그래서 친해지기 전까진 무뚝뚝하단 말 자주 듣는다.',
    emoji: '🔮',
    image: '/images/mbti/infj.png'
  },
}

export default function Result() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const mbtiParam = params.get('mbti') || 'UNKNOWN'
  const subParam = params.get('sub')
  const prob = params.get('prob')

  const [showSub, setShowSub] = useState(false)

  const typeKey = showSub && subParam ? subParam : mbtiParam
  const info = mbtiDescriptions[typeKey as keyof typeof mbtiDescriptions] || {
    title: '알 수 없음',
    summary : '-',
    desc1: 'MBTI 결과가 유효하지 않습니다.',
    desc2: '올바른 결과가 아닙니다.',
    desc3: '-',
    emoji: '❓'
  }

  const handleSave = async () => {
    try {
      const target = document.querySelector('.result-card') as HTMLElement
      const canvas = await html2canvas(target, { useCORS: true })
      const dataUrl = canvas.toDataURL('image/png')
      const base64 = dataUrl.split(',')[1]

      if (window.cordova && cordova.plugins) {
        const fileName = `mbti_result_${Date.now()}.png`
        const folderPath = cordova.file.externalRootDirectory + 'Pictures/'

        window.resolveLocalFileSystemURL(folderPath, dir => {
          dir.getFile(fileName, { create: true }, file => {
            file.createWriter(writer => {
              writer.onwriteend = () => {
                alert('✅ 사진첩에 저장 완료!')
              }
              const blob = b64toBlob(base64, 'image/png')
              writer.write(blob)
            })
          })
        })
      } else {
        alert('❌ Cordova 환경이 아닙니다.')
      }
    } catch (e) {
      console.error(e)
      alert('저장 중 오류 발생')
    }
  }

  const b64toBlob = (b64Data: string, contentType: string = '', sliceSize = 512): Blob => {
    const byteCharacters = atob(b64Data)
    const byteArrays = []

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize)
      const byteNumbers = new Array(slice.length).fill(0).map((_, i) => slice.charCodeAt(i))
      byteArrays.push(new Uint8Array(byteNumbers))
    }

    return new Blob(byteArrays, { type: contentType })
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: '내 MBTI 결과',
          text: `${mbtiParam} (${mbtiDescriptions[mbtiParam]?.title}) 성향 결과야!`,
          url: window.location.href
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        alert('링크가 복사되었습니다!')
      }
    } catch {
      alert('공유 중 오류 발생')
    }
  }

  useEffect(() => {
    const handler = () => {
      setShowSub(false)
    }
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [])

  useEffect(() => {
    if (showSub) {
      window.history.pushState({ showSub: true }, '')
    }
  }, [showSub])

  return (
    <div className="result-container">
      <div className="result-fixed-buttons">
        <button className="result-icon-button" onClick={handleSave}>📸 사진 저장</button>
        <button className="result-icon-button" onClick={handleShare}>🔗 공유하기</button>
      </div>

      <motion.div
        className="result-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="result-type">당신의 MBTI는</h1>
        <h2 className="result-code">{typeKey}</h2>
        <h3 className="result-title"><span className="result-emoji">{info.emoji}</span>{info.title}</h3>
        <p className="result-desc"><strong>{info.summary}</strong></p>
        <p className="result-desc"><strong>장점:</strong> {info.desc1}</p>
        <p className="result-desc"><strong>단점:</strong> {info.desc2}</p>
        <p className="result-desc"><strong>나비효과:</strong> {info.desc3}</p>

        {subParam && prob && !showSub && (
          <div style={{ marginTop: '40px' }}>
            <p className='result-desc'><strong>당신의 또 다른 성향</strong></p>
            <button className="result-btn mt0" onClick={() => setShowSub(true)}>
              ({subParam} {prob}% 성향) 보기
            </button>
          </div>
        )}
        {showSub && subParam && (
          <button className="result-btn" onClick={() => setShowSub(false)}>
            원래 결과로 돌아가기
          </button>
        )}

        <button className="result-btn" onClick={() => navigate('/')}>다시 테스트하기</button>
      </motion.div>
    </div>
  )
}
