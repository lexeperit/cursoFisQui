interface HeaderProps {
  points: number
  streak: number
  subjectName: string
  topicName: string
  onExit: () => void
}

export default function Header({ points, streak, subjectName, topicName, onExit }: HeaderProps) {
  return (
    <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <button
          onClick={onExit}
          className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Salir
        </button>
        <div className="h-5 w-px bg-gray-700" />
        <span className="text-sm text-gray-300">
          <span className="font-semibold text-white">{subjectName}</span>
          {' / '}
          {topicName}
        </span>
      </div>

      <div className="flex items-center gap-5">
        {/* Puntos de Energía */}
        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5">
          <span className="text-lg">&#9889;</span>
          <span className="font-bold text-amber-400 tabular-nums">{points}</span>
          <span className="text-xs text-amber-400/70">pts</span>
        </div>

        {/* Racha */}
        <div className={`flex items-center gap-2 rounded-full px-4 py-1.5 transition-all duration-300 ${
          streak >= 3
            ? 'bg-orange-500/20 border border-orange-500/40 scale-105'
            : 'bg-gray-800 border border-gray-700'
        }`}>
          <span className={`text-lg transition-transform duration-300 ${streak >= 3 ? 'animate-bounce' : ''}`}>
            &#128293;
          </span>
          <span className={`font-bold tabular-nums ${streak >= 3 ? 'text-orange-400' : 'text-gray-300'}`}>
            {streak}
          </span>
          <span className={`text-xs ${streak >= 3 ? 'text-orange-400/70' : 'text-gray-500'}`}>racha</span>
        </div>
      </div>
    </header>
  )
}
