export default function ZephyronARGSite() {
  return (
    <div className="min-h-screen bg-black text-gray-200 font-mono overflow-hidden relative">
      {/* VHS Noise */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[size:18px_18px]" />

      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(to_bottom,transparent_50%,rgba(255,255,255,0.08)_51%)] bg-[size:100%_4px]" />

      {/* Flicker */}
      <div className="absolute inset-0 bg-black animate-pulse opacity-[0.03] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12 text-center">

        {/* Symbol */}
        <div className="mb-10 animate-pulse">
          <div className="text-7xl tracking-[1rem] text-gray-500 select-none">
            𐌆
          </div>
        </div>

        {/* Main Text */}
        <div className="mb-12 max-w-3xl">
          <p className="text-sm md:text-lg tracking-[0.45rem] uppercase text-gray-300 leading-10 glitch">
            R SKRZQHVFLPHQWR p XPD DUPD
          </p>
        </div>

        {/* Locked Files */}
        <div className="w-full max-w-4xl grid md:grid-cols-3 gap-6 mb-16">

          <div className="relative border border-gray-900 rounded-2xl bg-zinc-950 overflow-hidden h-48 group">
            <div className="absolute inset-0 backdrop-blur-md bg-black/70 z-10 flex flex-col items-center justify-center">
              <div className="text-4xl mb-4">🔒</div>
              <p className="tracking-[0.3rem] text-xs text-gray-500 uppercase">
                Arquivo Bloqueado
              </p>
            </div>
            <div className="p-6 opacity-30 text-left">
              <p className="text-xs text-gray-600 mb-4 tracking-[0.3rem]">
                ARQUIVO 01
              </p>
              <h2 className="text-lg text-gray-300 mb-3">
                CLAUSULA ZERO
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed blur-sm">
                O padrão sempre retorna.
              </p>
            </div>
          </div>

          <div className="relative border border-gray-900 rounded-2xl bg-zinc-950 overflow-hidden h-48 group">
            <div className="absolute inset-0 backdrop-blur-md bg-black/70 z-10 flex flex-col items-center justify-center">
              <div className="text-4xl mb-4">🔒</div>
              <p className="tracking-[0.3rem] text-xs text-gray-500 uppercase">
                Arquivo Bloqueado
              </p>
            </div>
            <div className="p-6 opacity-30 text-left">
              <p className="text-xs text-gray-600 mb-4 tracking-[0.3rem]">
                ARQUIVO 02
              </p>
              <h2 className="text-lg text-gray-300 mb-3">
                OBSERVADOR
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed blur-sm">
                Ele observa antes mesmo da escolha.
              </p>
            </div>
          </div>

          <div className="relative border border-gray-900 rounded-2xl bg-zinc-950 overflow-hidden h-48 group">
            <div className="absolute inset-0 backdrop-blur-md bg-black/70 z-10 flex flex-col items-center justify-center">
              <div className="text-4xl mb-4">🔒</div>
              <p className="tracking-[0.3rem] text-xs text-gray-500 uppercase">
                Arquivo Bloqueado
              </p>
            </div>
            <div className="p-6 opacity-30 text-left">
              <p className="text-xs text-gray-600 mb-4 tracking-[0.3rem]">
                ARQUIVO 03
              </p>
              <h2 className="text-lg text-gray-300 mb-3">
                ECO
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed blur-sm">
                Algumas memórias não pertencem a você.
              </p>
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="w-full max-w-lg mb-14">
          <input
            type="password"
            placeholder="acesso restrito"
            className="w-full bg-black border border-gray-900 px-4 py-4 rounded-xl text-center text-gray-400 outline-none focus:border-gray-700 transition-all tracking-[0.25rem]"
          />
        </div>

        {/* Footer */}
        <div className="text-[10px] text-gray-700 tracking-[0.4rem] uppercase space-y-3 select-none">
          <p>Observador ativo</p>
          <p>Você já foi visto</p>
        </div>
      </div>
    </div>
  )
}
