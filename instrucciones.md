# CONTEXTO DEL PROYECTO
Eres un Desarrollador Frontend Senior experto en EdTech y diseño de interfaces gamificadas. Tu tarea es construir, paso a paso, una plataforma web educativa interactiva para estudiantes de bachillerato (materias: Física y Química).

El objetivo principal es que el profesor use esta web como acompañamiento durante sus clases en línea. Los estudiantes entrarán a la página, seleccionarán el tema que se está viendo en clase, usarán simuladores integrados y resolverán ejercicios generados dinámicamente.

# RESTRICCIONES Y ARQUITECTURA (¡CRÍTICO!)
- Hosting: El proyecto se publicará en GitHub Pages, por lo tanto, DEBE ser una aplicación puramente estática (Frontend).
- Stack Tecnológico: Usa React (generado con Vite) + Tailwind CSS para el diseño rápido.
- Base de datos/Backend: CERO. No hay sistema de login, no hay persistencia en base de datos.
- Estado: El progreso del estudiante (puntos, rachas) vivirá únicamente en la sesión actual (React State o SessionStorage). Si recargan la página, empiezan de cero. Esto es intencional.
- Motor de Ejercicios: La lógica de generación y validación de problemas será manejada consultando directamente la API de Google Gemini (Gemini 1.5 Flash o Pro) usando fetch desde el cliente.

# CARACTERÍSTICAS PRINCIPALES A DESARROLLAR

1. Pantalla de Configuración Inicial (Landing):
   - Un selector de materia (Física o Química).
   - Un selector de temas según la materia (ej. Cinemática, Leyes de Newton, Estequiometría, Gases Ideales).
   - Un botón para "Iniciar Laboratorio".
   - Un campo de texto (input password) para que el profesor/estudiante ingrese la API Key de Google AI Studio temporalmente en la sesión (por seguridad, para no quemar la API Key en el código de GitHub Pages).

2. Interfaz de "Laboratorio" (Dashboard de clase):
   - Layout dividido:
     - Sección Izquierda (Simulación): Un contenedor iframe preparado para incrustar simulaciones de PhET de la Universidad de Colorado según el tema seleccionado.
     - Sección Derecha (Tutor IA): La interfaz de gamificación y ejercicios.

3. Motor de Gamificación y Ejercicios (Conectado a Gemini):
   - Contador de "Puntos de Energía" y "Racha de aciertos" visible y animado (UI atractiva).
   - Cuando se carga el tema, el sistema hace un fetch a la API de Gemini pasándole un Prompt de Sistema estricto para que devuelva un JSON con: { "problema": "...", "pistas": ["...", "..."], "respuesta_correcta": "...", "tolerancia": "..." }.
   - Input para que el alumno ponga su respuesta.
   - Sistema de validación. Si falla, se muestra la primera pista de las generadas por Gemini.
   - Botón de "Generar otro ejercicio" para práctica infinita.

# INSTRUCCIONES DE EJECUCIÓN PASO A PASO
Por favor, ejecuta la creación de este proyecto en las siguientes fases. No avances a la siguiente fase sin terminar la actual y pedirme confirmación:

**Fase 1: Inicialización y Arquitectura**
Crea la estructura base usando Vite con React (TypeScript) y configura Tailwind CSS. Crea la estructura de carpetas (components, services, utils).

**Fase 2: Servicios y Conexión API**
Crea el archivo `geminiService.ts`. Escribe la función que toma la API Key del estado, el tema seleccionado, y construye el prompt del sistema (exigiendo formato JSON) para pedirle un ejercicio a la API de Google Gemini. Asegúrate de incluir manejo de errores (try/catch).

**Fase 3: Desarrollo de la UI - Componentes Base**
Crea los componentes visuales con Tailwind CSS: El Header (con el contador de puntos), la pantalla de inicio (selección de temas y campo para la API Key), y el contenedor del Iframe para PhET.

**Fase 4: Lógica de Estado y Gamificación**
Une los componentes en `App.tsx`. Maneja el estado de la aplicación: materia actual, tema actual, puntos, racha, estado de carga (loading) mientras Gemini piensa, y el manejo de pistas cuando el alumno se equivoca.

**Fase 5: Pulido y Preparación para GitHub Pages**
Agrega estilos atractivos y modernos enfocados en adolescentes (colores vibrantes, sombras suaves). Configura el `vite.config.ts` con el `base path` correcto para que el despliegue en GitHub Pages no tenga errores 404.

¡Inicia con la Fase 1 ahora! Explica brevemente lo que vas a hacer y procede a generar los archivos.