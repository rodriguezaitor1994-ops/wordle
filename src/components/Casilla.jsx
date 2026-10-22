function Casilla({ letra, estado = '', activa, onCambio }) {
  // Retroceso en una casilla vacía: el cursor va a la anterior
  function teclaPulsada(evento) {
    if (evento.key === 'Backspace' && letra === '') {
      evento.preventDefault()
      evento.target.previousElementSibling?.focus()
    }
  }

  return (
    <input
      className={`casilla ${estado}`}
      value={letra}
      maxLength={1}
      disabled={!activa}
      onChange={onCambio}
      onKeyDown={teclaPulsada}
      onFocus={(evento) => evento.target.select()}
    />
  )
}

export default Casilla