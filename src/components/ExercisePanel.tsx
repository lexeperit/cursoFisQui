import { useState } from 'react'
import { Exercise } from '../utils/types'

interface ExercisePanelProps {
  exercise: Exercise | null
  loading: boolean
  error: string | null
  hintsRevealed: number
  onSubmitAnswer: (answer: string) => void
  onRevealHint: () => void
  onNewExercise: () => void
  feedback: { correct: boolean; message: string } | null
}

export default function ExercisePanel({
  exercise,
  loading,
  error,
  hintsRevealed,
  onSubmitAnswer,
  onRevealHint,
  onNewExercise,
  feedback,
}: ExercisePanelProps) {
  const [answer, setAnswer] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (answer.trim()) {
      onSubmitAnswer(answer.trim())
      setAnswer('')
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700/50">
        <div className="flex items-center gap-2">
          <span className="text-base">&#129302;</span>
          <span className="text-xs text-gray-400 font-medium">Tutor IA</span>
        </div>
        <button
          onClick={onNewExercise}
          disabled={loading}
          className="text-xs text-violet-400 hover:text-violet-300 disabled:text-gray-600 transition-colors"
        >
          Nuevo ejercicio
        </button>
      </div>

      {/* Contenido scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Estado de carga */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-10 h-10 border-3 border-violet-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-400 text-sm">Generando ejercicio...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={onNewExercise}
              className="mt-2 text-xs text-red-300 hover:text-red-200 underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Ejercicio */}
        {exercise && !loading && (
          <>
            {/* Problema */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-2">
                Problema
              </h3>
              <p className="text-gray-200 text-sm leading-relaxed">
                {exercise.problema}
              </p>
            </div>

            {/* Pistas reveladas */}
            {hintsRevealed > 0 && (
              <div className="space-y-2">
                {exercise.pistas.slice(0, hintsRevealed).map((hint, i) => (
                  <div
                    key={i}
                    className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 animate-fade-in"
                  >
                    <span className="text-xs font-medium text-amber-400">
                      Pista {i + 1}:
                    </span>
                    <p className="text-sm text-amber-200/80 mt-1">{hint}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Feedback */}
            {feedback && (
              <div
                className={`rounded-lg p-4 text-center animate-fade-in ${
                  feedback.correct
                    ? 'bg-emerald-500/10 border border-emerald-500/30'
                    : 'bg-red-500/10 border border-red-500/30'
                }`}
              >
                <span className="text-2xl block mb-1">
                  {feedback.correct ? '\u2705' : '\u274C'}
                </span>
                <p className={`text-sm font-medium ${feedback.correct ? 'text-emerald-400' : 'text-red-400'}`}>
                  {feedback.message}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Input de respuesta (fijo abajo) */}
      {exercise && !loading && (
        <div className="border-t border-gray-700/50 p-4 space-y-3">
          {/* Botón de pista */}
          {hintsRevealed < (exercise?.pistas.length ?? 0) && !feedback?.correct && (
            <button
              onClick={onRevealHint}
              className="w-full py-2 text-xs text-amber-400 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/20 rounded-lg transition-colors"
            >
              &#128161; Pedir pista ({hintsRevealed}/{exercise.pistas.length})
            </button>
          )}

          {/* Form de respuesta */}
          {!feedback?.correct && (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Tu respuesta..."
                className="flex-1 px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!answer.trim()}
                className="px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-medium transition-colors"
              >
                Enviar
              </button>
            </form>
          )}

          {/* Botón siguiente si acertó */}
          {feedback?.correct && (
            <button
              onClick={onNewExercise}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold hover:from-emerald-500 hover:to-green-500 transition-all active:scale-[0.98]"
            >
              Siguiente ejercicio &#8594;
            </button>
          )}
        </div>
      )}
    </div>
  )
}
