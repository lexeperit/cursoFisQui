import { useState, useCallback } from 'react'
import { Subject, Topic, Exercise } from './utils/types'
import { fetchExercise } from './services/geminiService'
import LandingScreen from './components/LandingScreen'
import Header from './components/Header'
import PhETViewer from './components/PhETViewer'
import ExercisePanel from './components/ExercisePanel'

type Feedback = { correct: boolean; message: string }

function parseNumericValue(text: string): number | null {
  const match = text.replace(',', '.').match(/-?\d+(\.\d+)?/)
  return match ? parseFloat(match[0]) : null
}

function checkAnswer(userAnswer: string, correctAnswer: string, tolerance: string): boolean {
  const userVal = parseNumericValue(userAnswer)
  const correctVal = parseNumericValue(correctAnswer)

  if (userVal === null || correctVal === null) {
    return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()
  }

  if (tolerance.includes('%')) {
    const pct = parseNumericValue(tolerance)
    if (pct !== null) {
      const margin = Math.abs(correctVal * (pct / 100))
      return Math.abs(userVal - correctVal) <= margin
    }
  }

  const absMargin = parseNumericValue(tolerance)
  if (absMargin !== null) {
    return Math.abs(userVal - correctVal) <= Math.abs(absMargin)
  }

  return Math.abs(userVal - correctVal) <= Math.abs(correctVal * 0.05)
}

export default function App() {
  // Navegación
  const [screen, setScreen] = useState<'landing' | 'lab'>('landing')
  const [subject, setSubject] = useState<Subject | null>(null)
  const [topic, setTopic] = useState<Topic | null>(null)
  const [apiKey, setApiKey] = useState('')

  // Gamificación
  const [points, setPoints] = useState(0)
  const [streak, setStreak] = useState(0)

  // Ejercicio actual
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hintsRevealed, setHintsRevealed] = useState(0)
  const [feedback, setFeedback] = useState<Feedback | null>(null)

  const loadExercise = useCallback(async () => {
    if (!subject || !topic || !apiKey) return
    setLoading(true)
    setError(null)
    setExercise(null)
    setHintsRevealed(0)
    setFeedback(null)
    try {
      const ex = await fetchExercise(apiKey, subject.name, topic.name)
      setExercise(ex)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [apiKey, subject, topic])

  function handleStart(sub: Subject, top: Topic, key: string) {
    setSubject(sub)
    setTopic(top)
    setApiKey(key)
    setScreen('lab')
    setPoints(0)
    setStreak(0)
    // Cargar primer ejercicio después de transición
    setTimeout(() => {
      setSubject((s) => {
        // Trigger load with current values
        setLoading(true)
        setError(null)
        setExercise(null)
        setHintsRevealed(0)
        setFeedback(null)
        fetchExercise(key, sub.name, top.name)
          .then((ex) => setExercise(ex))
          .catch((err) => setError(err instanceof Error ? err.message : 'Error desconocido'))
          .finally(() => setLoading(false))
        return s
      })
    }, 100)
  }

  function handleExit() {
    setScreen('landing')
    setExercise(null)
    setError(null)
    setFeedback(null)
  }

  function handleSubmitAnswer(answer: string) {
    if (!exercise) return

    const correct = checkAnswer(answer, exercise.respuesta_correcta, exercise.tolerancia)

    if (correct) {
      const hintPenalty = hintsRevealed * 5
      const streakBonus = streak >= 2 ? 5 : 0
      const gained = Math.max(5, 20 - hintPenalty + streakBonus)
      setPoints((p) => p + gained)
      setStreak((s) => s + 1)
      setFeedback({
        correct: true,
        message: `+${gained} puntos${streakBonus > 0 ? ' (bonus racha!)' : ''}`,
      })
    } else {
      setStreak(0)
      if (hintsRevealed < exercise.pistas.length) {
        setHintsRevealed((h) => h + 1)
        setFeedback({
          correct: false,
          message: 'Incorrecto. Revisa la pista y vuelve a intentarlo.',
        })
      } else {
        setFeedback({
          correct: false,
          message: `La respuesta era: ${exercise.respuesta_correcta}`,
        })
      }
    }
  }

  function handleRevealHint() {
    if (exercise && hintsRevealed < exercise.pistas.length) {
      setHintsRevealed((h) => h + 1)
    }
  }

  // ---------- LANDING ----------
  if (screen === 'landing') {
    return <LandingScreen onStart={handleStart} />
  }

  // ---------- LABORATORIO ----------
  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white overflow-hidden">
      <Header
        points={points}
        streak={streak}
        subjectName={subject?.name ?? ''}
        topicName={topic?.name ?? ''}
        onExit={handleExit}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Simulación PhET - Izquierda */}
        <div className="w-1/2 border-r border-gray-800">
          {topic && <PhETViewer url={topic.phetUrl} topicName={topic.name} />}
        </div>

        {/* Tutor IA - Derecha */}
        <div className="w-1/2">
          <ExercisePanel
            exercise={exercise}
            loading={loading}
            error={error}
            hintsRevealed={hintsRevealed}
            feedback={feedback}
            onSubmitAnswer={handleSubmitAnswer}
            onRevealHint={handleRevealHint}
            onNewExercise={loadExercise}
          />
        </div>
      </div>
    </div>
  )
}
