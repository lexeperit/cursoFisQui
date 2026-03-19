import { Exercise } from '../utils/types'

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

function buildSystemPrompt(subject: string, topic: string): string {
  return `Eres un tutor de ${subject} para bachillerato. Genera UN ejercicio sobre "${topic}".

REGLAS:
1. Problema: enunciado claro en español con datos numéricos
2. Respuesta: valor numérico con unidades
3. Pistas: exactamente 3, de general a específica
4. Tolerancia: margen aceptable (ej. "±0.5" o "±10%")

RESPONDE SOLO CON ESTE JSON (sin markdown, sin explicaciones):
{
  "problema": "Enunciado del problema",
  "pistas": ["Pista 1", "Pista 2", "Pista 3"],
  "respuesta_correcta": "Valor con unidades",
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
        temperature: 0.5,
        maxOutputTokens: 512,
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
