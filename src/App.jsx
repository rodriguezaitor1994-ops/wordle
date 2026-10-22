import Casilla from './components/Casilla.jsx'

function App() {
  return (
    <div className="juego">
      <h1>Wordle</h1>
      <div className="fila">
        <Casilla letra="H" />
        <Casilla letra="O" estado="correcta" />
        <Casilla letra="L" estado="presente" />
        <Casilla letra="A" estado="ausente" />
        <Casilla letra="" />
      </div>
    </div>
  )
}

export default App