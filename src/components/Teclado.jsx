const FILAS_TECLADO = ['QWERTYUIOP', 'ASDFGHJKLÑ', 'ZXCVBNM']

// El teclado no guarda nada: recibe los colores y las funciones de App
function Teclado({ estados, onLetra, onBorrar }) {
  return (
    <div className="teclado">
      {FILAS_TECLADO.map((fila) => (
        <div className="fila-teclado" key={fila}>
          {[...fila].map((letra) => (
            <button
              key={letra}
              type="button"
              className={`tecla ${estados[letra] ?? ''}`}
              onClick={() => onLetra(letra)}
            >
              {letra}
            </button>
          ))}
          {fila === 'ZXCVBNM' && (
            <button
              type="button"
              className="tecla ancha"
              aria-label="Borrar"
              onClick={onBorrar}
            >
              ⌫
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

export default Teclado