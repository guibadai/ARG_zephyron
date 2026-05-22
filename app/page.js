import Link from "next/link";

export default function Home() {
  return (
    <main className="arg-page min-h-screen overflow-hidden p-6 font-mono text-white sm:p-10">
      <div className="pointer-events-none fixed left-0 top-[28%] z-20 h-[3px] w-full animate-pulse bg-white/20" />
      <div className="pointer-events-none fixed left-0 top-[61%] z-20 h-[2px] w-full animate-[scanTear_620ms_steps(3,end)_infinite] bg-red-700/20" />

      <section className="relative z-10 mx-auto w-full max-w-5xl pt-24 sm:pt-32">
        <div className="mb-8 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.28em] text-red-500/80">
          <span>arquivo parcialmente recuperado</span>
          <span className="text-green-800">relay: unstable</span>
        </div>

        <div className="arg-panel p-5 sm:p-8">
          <p className="mb-6 text-xs uppercase tracking-[0.35em] text-green-700">
            recovered object // no registered origin
          </p>

          <h1 className="arg-title mb-10 max-w-full break-all text-3xl leading-relaxed tracking-[0.18em] text-white sm:text-5xl sm:tracking-[0.3em]">
            Pd_1qm2pizhBS4nVK30qqwrillYbkmsu9DvhGOI_xhE
          </h1>

          <div className="mb-10 h-px w-full bg-red-900/60" />

          <div className="grid gap-4 text-sm text-green-200/65 sm:grid-cols-2">
            <p>STATUS DO SISTEMA: CORROMPIDO</p>
            <p>PROTOCOLO ECLIPSE: INATIVO</p>
            <p>CLÃUSULA 0: REMOVIDA</p>
            <p>ATIVIDADE EXTRAPLANAR DETECTADA</p>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/arquivos" className="arg-button px-4 py-2 text-sm uppercase tracking-[0.2em]">
              ARQUIVOS
            </Link>

            <Link href="/login" className="arg-button px-4 py-2 text-sm uppercase tracking-[0.2em]">
              LOGIN
            </Link>

            <Link href="/terminal" className="arg-button px-4 py-2 text-sm uppercase tracking-[0.2em]">
              TERMINAL
            </Link>
          </div>
        </div>

        <div className="mt-16 max-w-xl border-l border-red-900/50 pl-5 text-xs leading-7 text-green-900">
          <p className="animate-[slowThreat_9s_steps(2,end)_infinite] text-red-700">
            â€œSe vocÃª encontrou istoâ€¦ ele jÃ¡ percebeu.â€
          </p>
          <p>the file opens differently when no one is watching</p>
          <p>last observer handshake: 03:33</p>
        </div>
      </section>
    </main>
  );
}

