import { useState } from 'react'
import { subjects } from '../utils/subjects'
import { Subject, Topic } from '../utils/types'

interface LandingScreenProps {
  onStart: (subject: Subject, topic: Topic, apiKey: string) => void
}

export default function LandingScreen({ onStart }: LandingScreenProps) {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [apiKey, setApiKey] = useState('')

  const canStart = selectedSubject && selectedTopic && apiKey.trim().length > 0

  function handleStart() {
    if (selectedSubject && selectedTopic && apiKey.trim()) {
      onStart(selectedSubject, selectedTopic, apiKey.trim())
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo y título */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 mb-4 shadow-lg shadow-violet-500/25">
            <span className="text-3xl">&#127891;</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Platform Studio</h1>
          <p className="text-gray-400">Laboratorio interactivo de ciencias</p>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-6 shadow-xl">
          {/* Selector de materia */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Selecciona tu materia
            </label>
            <div className="grid grid-cols-2 gap-3">
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => {
                    setSelectedSubject(subject)
                    setSelectedTopic(null)
                  }}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    selectedSubject?.id === subject.id
                      ? 'border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-500/10'
                      : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800'
                  }`}
                >
                  <span className="text-2xl block mb-1">{subject.icon}</span>
                  <span className="font-semibold text-white">{subject.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Selector de tema */}
          {selectedSubject && (
            <div className="animate-fade-in">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Selecciona el tema
              </label>
              <div className="space-y-2">
                {selectedSubject.topics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic)}
                    className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${
                      selectedTopic?.id === topic.id
                        ? 'border-violet-500 bg-violet-500/10 text-white'
                        : 'border-gray-700 bg-gray-800/30 text-gray-300 hover:border-gray-600 hover:text-white'
                    }`}
                  >
                    {topic.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* API Key */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              API Key de Google AI Studio
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Pega tu API Key aqu\u00ed..."
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
            />
            <p className="mt-1.5 text-xs text-gray-500">
              Obt\u00e9n tu clave en{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 hover:underline"
              >
                aistudio.google.com
              </a>
              . Se usa solo en tu sesi\u00f3n, no se almacena.
            </p>
          </div>

          {/* Bot\u00f3n de inicio */}
          <button
            onClick={handleStart}
            disabled={!canStart}
            className={`w-full py-3.5 rounded-xl font-semibold text-lg transition-all duration-200 ${
              canStart
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 active:scale-[0.98]'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            Iniciar Laboratorio
          </button>
        </div>
      </div>
    </div>
  )
}
