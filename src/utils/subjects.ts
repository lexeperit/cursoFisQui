import { Subject } from './types'

export const subjects: Subject[] = [
  {
    id: 'fisica',
    name: 'Física',
    icon: '⚡',
    topics: [
      {
        id: 'cinematica',
        name: 'Cinemática',
        phetUrl: 'https://phet.colorado.edu/sims/html/projectile-motion/latest/projectile-motion_all.html',
      },
      {
        id: 'leyes-newton',
        name: 'Leyes de Newton',
        phetUrl: 'https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_all.html',
      },
      {
        id: 'energia',
        name: 'Energía y Trabajo',
        phetUrl: 'https://phet.colorado.edu/sims/html/energy-skate-park-basics/latest/energy-skate-park-basics_all.html',
      },
      {
        id: 'ondas',
        name: 'Ondas',
        phetUrl: 'https://phet.colorado.edu/sims/html/wave-on-a-string/latest/wave-on-a-string_all.html',
      },
    ],
  },
  {
    id: 'quimica',
    name: 'Química',
    icon: '🧪',
    topics: [
      {
        id: 'estequiometria',
        name: 'Estequiometría',
        phetUrl: 'https://phet.colorado.edu/sims/html/reactants-products-and-leftovers/latest/reactants-products-and-leftovers_all.html',
      },
      {
        id: 'gases-ideales',
        name: 'Gases Ideales',
        phetUrl: 'https://phet.colorado.edu/sims/html/gas-properties/latest/gas-properties_all.html',
      },
      {
        id: 'estructura-atomica',
        name: 'Estructura Atómica',
        phetUrl: 'https://phet.colorado.edu/sims/html/build-an-atom/latest/build-an-atom_all.html',
      },
      {
        id: 'soluciones',
        name: 'Soluciones',
        phetUrl: 'https://phet.colorado.edu/sims/html/molarity/latest/molarity_all.html',
      },
    ],
  },
]
