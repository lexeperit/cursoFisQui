import { Exercise } from '../utils/types'

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

function buildSystemPrompt(subject: string, topic: string): string {
  return `Eres un tutor experto de ${subject} para estudiantes de bachillerato.
Tu tarea es generar UN ejercicio sobre el tema "${topic}".

REGLAS ESTRICTAS:
1. El ejercicio debe ser de nivel bachillerato, claro y bien redactado en español.
2. Incluye datos numéricos concretos para que el alumno pueda resolver el problema.
3. La respuesta correcta debe ser un valor numérico con sus unidades.
4. Genera exactamente 3 pistas que vayan de general a específica.
5. La tolerancia indica el margen aceptable para la respuesta numérica (ej. "±0.5", "±2%").

DEBES responder ÚNICAMENTE con un JSON válido, sin texto adicional, sin bloques de código markdown, con esta estructura exacta:
{
  "problema": "Enunciado completo del problema",
  "pistas": ["Pista 1 (general)", "Pista 2 (más específica)", "Pista 3 (casi la solución)"],
  "respuesta_correcta": "Valor numérico con unidades",
  "tolerancia": "±margen"
}`
}

export async function fetchExercise(
  apiKey: string,
  subject: string,
  topic: string
): Promise<Exercise> {
  const systemPrompt = buildSystemPrompt(subject, topic)

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: systemPrompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    const message =
      errorData?.error?.message ?? `Error de la API: ${response.status}`
    throw new Error(message)
  }

  const data = await response.json()

  const text: string | undefined =
    data?.candidates?.[0]?.content?.parts?.[0]?.text

  if (!text) {
    throw new Error(
      'La respuesta de Gemini no contiene texto. Intenta de nuevo.'
    )
  }

  // Limpiar posibles bloques de código markdown (```json ... ```)
  const cleaned = text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim()

  let parsed: unknown
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    throw new Error(
      'Gemini no devolvió un JSON válido. Intenta generar otro ejercicio.'
    )
  }

  const exercise = parsed as Record<string, unknown>

  if (
    typeof exercise.problema !== 'string' ||
    !Array.isArray(exercise.pistas) ||
    typeof exercise.respuesta_correcta !== 'string' ||
    typeof exercise.tolerancia !== 'string'
  ) {
    throw new Error(
      'El formato del ejercicio es incorrecto. Intenta generar otro ejercicio.'
    )
  }

  return {
    problema: exercise.problema,
    pistas: exercise.pistas.map(String),
    respuesta_correcta: exercise.respuesta_correcta,
    tolerancia: exercise.tolerancia,
  }
}
