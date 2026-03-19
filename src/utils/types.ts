export interface Subject {
  id: string
  name: string
  icon: string
  topics: Topic[]
}

export interface Topic {
  id: string
  name: string
  phetUrl: string
}

export interface Exercise {
  problema: string
  pistas: string[]
  respuesta_correcta: string
  tolerancia: string
}

export interface GameState {
  points: number
  streak: number
  currentSubject: Subject | null
  currentTopic: Topic | null
  apiKey: string
  screen: 'landing' | 'lab'
}
