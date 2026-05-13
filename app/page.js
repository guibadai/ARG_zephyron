import Link from "next/link";
export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white p-10 relative overflow-hidden">

  {/* VHS NOISE */}
  <div className="fixed inset-0 pointer-events-none z-[999] opacity-20">
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] animate-pulse"></div>
  </div>

  {/* SCANLINES */}
  <div
    className="fixed inset-0 pointer-events-none z-[998]"
    style={{
      background: `repeating-linear-gradient(
        to bottom,
        rgba(255,255,255,0.03),
        rgba(255,255,255,0.03) 1px,
        transparent 1px,
        transparent 4px
      )`
    }}
  ></div>

  {/* VHS GLITCH */}
  <div className="fixed top-[30%] left-0 w-full h-[3px] bg-white opacity-20 animate-pulse z-[1000]"></div>

  <div className="fixed top-[60%] left-0 w-full h-[2px] bg-red-700 opacity-20 animate-pulse z-[1000]"></div>

  <div className="max-w-5xl mx-auto w-full"></div>

      <div className="max-w-5xl mx-auto w-full pt-32 relative z-10">

        <p className="text-red-700 mb-6 tracking-widest">
          ARQUIVO PARCIALMENTE RECUPERADO
        </p>

        <h1 className="text-4xl md:text-5xl text-white mb-12 tracking-[0.3em] break-all leading-relaxed max-w-full overflow-hidden">
          Pd_1qm2pizhBS4nVK30qqwrillYbkmsu9DvhGOI_xhE
        </h1>
        <div className="w-full h-px bg-red-900 opacity-40 mb-10"></div>
        <div className="space-y-3 text-sm opacity-70">
          <p>STATUS DO SISTEMA: CORROMPIDO</p>
          <p>PROTOCOLO ECLIPSE: INATIVO</p>
          <p>CLÁUSULA 0: REMOVIDA</p>
          <p>ATIVIDADE EXTRAPLANAR DETECTADA</p>
        </div>

        <div className="flex gap-4 mt-10">

          <Link href="/arquivos">
            <button className="border border-white px-4 py-2 hover:bg-red-950 transition">
              ARQUIVOS
            </button>
          </Link>

          <Link href="/login">
            <button className="border border-white px-4 py-2 hover:bg-red-950 transition">
              LOGIN
            </button>
          </Link>
          <Link href="/terminal">
  <button className="border border-white px-4 py-2 hover:bg-red-950 transition">
    TERMINAL
  </button>
</Link>
        </div>

        <div className="mt-24 opacity-30 text-xs">
          “Se você encontrou isto… ele já percebeu.”
        </div>

      </div>

    </main>
  );
}