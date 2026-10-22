import { useEffect, useState } from 'react'
import Casilla from './components/Casilla.jsx'

const FILAS = 6
const COLUMNAS = 5

// Palabras de cinco letras, en mayúsculas y sin tildes
const PALABRAS = [
  'PERRO', 'GATOS', 'PLATO', 'RELOJ', 'MONTE',
  'LIBRO', 'CAMPO', 'NUBES', 'FRESA', 'PIANO',
  'TIGRE', 'VERDE', 'PLAYA', 'CARTA', 'MUNDO',
]

// Crea un tablero vacío: 6 filas de 5 letras en blanco
function tableroVacio() {
  const tablero = []
  for (let f = 0; f < FILAS; f++) {
    tablero.push(Array(COLUMNAS).fill(''))
  }
  return tablero
}

// Elige una palabra al azar, distinta de la anterior
function palabraAlAzar(anterior = '') {
  let palabra
  do {
    const i = Math.floor(Math.random() * PALABRAS.length)
    palabra = PALABRAS[i]
  } while (palabra === anterior)
  return palabra
}

// Decide los colores de una fila completa, en dos pasadas
function estadosDeFila(fila, solucion) {
  const estados = Array(fila.length).fill('ausente')
  // Cuántas veces queda disponible cada letra de la solución
  const quedan = {}

  // 1ª pasada: las letras que están en su sitio
  fila.forEach((letra, c) => {
    if (letra === solucion[c]) {
      estados[c] = 'correcta'
    } else {
      quedan[solucion[c]] = (quedan[solucion[c]] ?? 0) + 1
    }
  })

  // 2ª pasada: las demás, mientras queden letras disponibles
  fila.forEach((letra, c) => {
    if (estados[c] !== 'correcta' && quedan[letra] > 0) {
      estados[c] = 'presente'
      quedan[letra]--
    }
  })

  return estados
}

function App() {
  const [intentos, setIntentos] = useState(tableroVacio())
  const [filaActual, setFilaActual] = useState(0)
  const [solucion, setSolucion] = useState(() => palabraAlAzar())
  const [aviso, setAviso] = useState('') // ⬅ M3

  // El último intento comprobado, como texto: 'PERRO'
  const ultimo = filaActual > 0 ? intentos[filaActual - 1].join('') : ''
  const ganada = ultimo === solucion
  const terminada = ganada || filaActual === FILAS

  useEffect(() => {
    // Lleva el cursor a la primera casilla en la que se puede escribir
    document.querySelector('.casilla:enabled')?.focus()
  }, [filaActual])

  function cambiarLetra(f, c, evento) {
    const letra = evento.target.value.toUpperCase()

    // Solo aceptamos una letra, o nada si se ha borrado
    if (!/^[A-ZÑ]?$/.test(letra)) return

    // Copiamos el tablero, cambiamos la copia y la guardamos
    const copia = intentos.map((fila) => [...fila])
    copia[f][c] = letra
    setIntentos(copia)
    setAviso('') 

    // Después de escribir una letra, pasamos a la casilla siguiente
    if (letra !== '') evento.target.nextElementSibling?.focus()
  }

  function comprobar(evento) {
    // Evita que el navegador recargue la página al enviar el formulario
    evento.preventDefault()

    if (terminada) return

    // No se puede comprobar una fila incompleta
    if (intentos[filaActual].includes('')) {
      setAviso('Faltan letras')
      return
    }

    setFilaActual(filaActual + 1)
  }

  function nuevaPartida() {
    setIntentos(tableroVacio())
    setFilaActual(0)
    setSolucion(palabraAlAzar(solucion))
    setAviso('') 
  }

  return (
    <form className="juego" onSubmit={comprobar}>
      <h1>Wordle</h1>
            <div className="tablero">
        {intentos.map((fila, f) => {
          const estados = f < filaActual ? estadosDeFila(fila, solucion) : []
          return (
            <div className="fila" key={f}>
              {fila.map((letra, c) => (
                <Casilla
                  key={c}
                  letra={letra}
                  estado={estados[c] ?? ''}
                  activa={f === filaActual && !terminada}
                  fila={f}
                  columna={c}
                  onCambio={(evento) => cambiarLetra(f, c, evento)}
                />
              ))}
            </div>
          )
        })}
      </div>
      {aviso && (
        <p className="aviso" role="alert">
          {aviso}
        </p>
      )}

      {terminada ? (
        <>
          <p className="mensaje" role="status">
            {ganada
              ? '¡Enhorabuena, has acertado!'
              : `La palabra era ${solucion}`}
          </p>
          <button className="boton" type="button" onClick={nuevaPartida}>
            Nueva partida
          </button>
        </>
      ) : (
        <button className="boton" type="submit">
          Comprobar
        </button>
      )}
    </form>
  )
}

export default App