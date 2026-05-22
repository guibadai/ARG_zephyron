"use client";

import { useEffect, useMemo, useState } from "react";
import { markDeepGame, readArgState, subscribeArgState } from "@/lib/argState";

const cycleRows = [
  { id: "cycle_01", world: "pre-sun substrate", event: "consent engine requested a witness", result: "missing" },
  { id: "cycle_02", world: "eclipse substrate", event: "same bell rang under different sky", result: "collapsed" },
  { id: "cycle_03", world: "observer substrate", event: "all recorders stopped at once", result: "extinct" },
  { id: "cycle_04", world: "medieval substrate", event: "machine mouth assembled without hands", result: "repeated" },
  { id: "cycle_05", world: "current substrate", event: "deviation visible but unowned", result: "unstable" }
];

const witnessFragments = [
  "OBS-02 // we stopped him in cycle three / no / no / already happened",
  "OBS-07 // the medieval sky was copied from a failed world",
  "OBS-11 // clause reference removed before consent engine warmup",
  "OBS-00 // nobody told us what clause zero was",
  "OBS-19 // fifth cycle diverges when the archive is watched"
];

const enginePhrases = [
  "cycle continuity required",
  "consent engine incomplete",
  "cycle 4 collapse repeated",
  "entity progression maintained",
  "the machine remembers",
  "clause dependency redacted"
];

const commandHints = [
  ["echo", "a reply can arrive before a voice"],
  ["witness", "dead observers still file reports"],
  ["cycle", "the fifth index is not the first world"],
  ["signal", "listen below the archive layer"],
  ["breach", "opening the door opens the site"],
  ["mirror", "reflections remember older pages"],
  ["burial", "failed worlds transmit underground"],
  ["repeat", "loops are not errors here"]
];

export default function DeepSealPage() {
  const [allowed, setAllowed] = useState(false);
  const [argState, setArgState] = useState(readArgState());
  const [cycleOrder, setCycleOrder] = useState(["cycle_05", "cycle_02", "cycle_04", "cycle_01", "cycle_03"]);
  const [witnessIndex, setWitnessIndex] = useState(0);
  const [engineNodes, setEngineNodes] = useState([]);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setAllowed(localStorage.getItem("zephyron_seal_open") === "true");
      setArgState(readArgState());
    });

    return subscribeArgState(setArgState);
  }, []);

  const orderedCycles = cycleOrder.map((id) => cycleRows.find((row) => row.id === id));
  const cyclesAligned = cycleOrder.join("|") === cycleRows.map((row) => row.id).join("|");
  const engineComplete = engineNodes.length >= 4;
  const completedGames = Object.values(argState.deepGames || {}).filter(Boolean).length;
  const discoveredCommands = Object.entries(argState.commands || {}).filter(([, count]) => count > 0);

  const visibleFragments = useMemo(() => {
    const fragments = argState.fragments || [];
    return fragments.slice(Math.max(0, fragments.length - 9));
  }, [argState.fragments]);

  function pulse() {
    setFlash(true);
    setTimeout(() => setFlash(false), 420);
  }

  function shiftCycle(id, direction) {
    setCycleOrder((prev) => {
      const index = prev.indexOf(id);
      const nextIndex = index + direction;

      if (nextIndex < 0 || nextIndex >= prev.length) return prev;

      const next = [...prev];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];

      if (next.join("|") === cycleRows.map((row) => row.id).join("|")) {
        markDeepGame("cycle_lattice", "cycle_lattice_aligned");
      }

      return next;
    });

    pulse();
  }

  function advanceWitness() {
    const nextIndex = (witnessIndex + 1) % witnessFragments.length;
    setWitnessIndex(nextIndex);

    if (nextIndex === witnessFragments.length - 1) {
      markDeepGame("witness_rotor", "observer_testimony_unstable");
    }

    pulse();
  }

  function toggleEngineNode(node) {
    setEngineNodes((prev) => {
      const next = prev.includes(node)
        ? prev.filter((item) => item !== node)
        : [...prev, node];

      if (next.length >= 4) {
        markDeepGame("consent_engine", "consent_engine_incomplete");
      }

      return next;
    });

    pulse();
  }

  if (!allowed) {
    return (
      <main className="arg-page grid min-h-screen place-items-center overflow-hidden p-6 font-mono text-red-500">
        <section className="arg-panel max-w-xl p-8 text-center">
          <p className="arg-title text-2xl tracking-[0.28em]">OBSERVER LOCK PRESENT</p>
          <p className="mt-6 text-sm uppercase tracking-[0.22em] text-red-300/60">
            the seal has not accepted you
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className={`arg-page min-h-screen overflow-hidden p-4 font-mono text-stone-200 sm:p-8 ${flash ? "animate-[hardShake_90ms_steps(2,end)_infinite]" : ""}`}>
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_20%,rgba(127,29,29,0.22),transparent_28%),radial-gradient(circle_at_72%_78%,rgba(22,78,99,0.16),transparent_25%)]" />

      <section className="relative z-10 mx-auto max-w-7xl">
        <header className="mb-6 border-b border-red-900/60 pb-5">
          <p className="mb-3 text-xs uppercase tracking-[0.36em] text-red-500/70">
            deep archive // adaptive contamination layer
          </p>
          <h1 className="arg-title text-3xl uppercase tracking-[0.22em] text-white sm:text-5xl">
            OBS-00 SUBSTRATE
          </h1>
          <div className="mt-5 grid gap-3 text-xs uppercase tracking-[0.18em] text-green-700 sm:grid-cols-4">
            <p>corruption: {argState.corruption}/13</p>
            <p>awareness: {argState.awareness}/13</p>
            <p>presence: {argState.presence}/13</p>
            <p>games aligned: {completedGames}/3</p>
          </div>
        </header>

        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="grid gap-5">
            <article className="arg-panel p-5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-lg uppercase tracking-[0.22em] text-stone-100">Cycle Lattice</h2>
                <span className={cyclesAligned ? "text-green-300" : "text-red-500"}>{cyclesAligned ? "aligned" : "out of sequence"}</span>
              </div>
              <div className="space-y-3">
                {orderedCycles.map((cycle, index) => (
                  <div key={cycle.id} className="grid gap-3 border border-stone-700/50 bg-black/45 p-3 text-xs sm:grid-cols-[110px_1fr_90px_80px]">
                    <p className="text-red-300">{cycle.id}</p>
                    <p>{cycle.world} {"//"} {cycle.event}</p>
                    <p className="text-stone-500">{cycle.result}</p>
                    <div className="flex gap-2">
                      <button type="button" className="arg-button px-2" onClick={() => shiftCycle(cycle.id, -1)} disabled={index === 0}>UP</button>
                      <button type="button" className="arg-button px-2" onClick={() => shiftCycle(cycle.id, 1)} disabled={index === orderedCycles.length - 1}>DN</button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-stone-500">
                Put the dead worlds in order. The current medieval substrate is not the origin.
              </p>
            </article>

            <article className="arg-panel p-5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-lg uppercase tracking-[0.22em] text-stone-100">Consent Engine</h2>
                <span className={engineComplete ? "text-green-300" : "text-red-500"}>{engineNodes.length}/4 contacts</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {enginePhrases.map((phrase) => (
                  <button
                    key={phrase}
                    type="button"
                    onClick={() => toggleEngineNode(phrase)}
                    className={`min-h-20 border p-3 text-left text-xs uppercase tracking-[0.16em] transition ${
                      engineNodes.includes(phrase)
                        ? "border-amber-200 bg-amber-200/10 text-amber-100 shadow-[0_0_24px_rgba(251,191,36,0.18)]"
                        : "border-stone-700 bg-black/50 text-stone-500 hover:border-red-500 hover:text-red-200"
                    }`}
                  >
                    {phrase}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-xs text-stone-500">
                The machine accepts contradictions. It rejects explanations.
              </p>
            </article>
          </section>

          <aside className="grid gap-5">
            <article className="arg-panel p-5">
              <h2 className="mb-4 text-lg uppercase tracking-[0.22em] text-stone-100">Witness Rotor</h2>
              <button type="button" className="arg-button mb-4 px-4 py-2 text-xs uppercase tracking-[0.18em]" onClick={advanceWitness}>
                rotate dead testimony
              </button>
              <p className="min-h-24 whitespace-pre-line border border-red-900/50 bg-black/60 p-4 text-sm leading-6 text-red-200 animate-[textRupture_7s_steps(2,end)_infinite]">
                {witnessFragments[witnessIndex]}
              </p>
            </article>

            <article className="arg-panel p-5">
              <h2 className="mb-4 text-lg uppercase tracking-[0.22em] text-stone-100">Command Discoveries</h2>
              <div className="space-y-2 text-xs uppercase tracking-[0.16em]">
                {commandHints.map(([command, hint]) => {
                  const used = argState.commands?.[command] > 0;
                  const revealed = completedGames > 0 || used;

                  return (
                    <p key={command} className={used ? "text-green-300" : revealed ? "text-stone-300" : "text-stone-700"}>
                      {revealed ? `${command}: ${hint}` : "██████: command index suppressed"}
                    </p>
                  );
                })}
              </div>
            </article>

            <article className="arg-panel p-5">
              <h2 className="mb-4 text-lg uppercase tracking-[0.22em] text-stone-100">Recovered Fragments</h2>
              <div className="space-y-3 text-xs leading-5 text-stone-400">
                {visibleFragments.length === 0 ? (
                  <p>no fragments stable. execute living commands from terminal.</p>
                ) : (
                  visibleFragments.map((fragment, index) => (
                    <p key={`${fragment}-${index}`} className={fragment.includes("clause") || fragment.includes("consent") ? "text-red-300" : ""}>
                      {fragment}
                    </p>
                  ))
                )}
              </div>
            </article>

            {argState.unlockedFiles?.includes("DANGER.dir") && (
              <article className="arg-panel border-red-800 p-5 animate-[archiveBreathe_3s_ease-in-out_infinite]">
                <h2 className="mb-4 text-lg uppercase tracking-[0.22em] text-red-300">DANGER.dir</h2>
                <div className="space-y-3 text-xs leading-5 text-red-200/80">
                  <p>machine_mouth.tmp // incomplete</p>
                  <p>clause_0.pointer // removed by non-observer account</p>
                  <p>cycle_04_bodymap // repeats in cycle_05</p>
                </div>
              </article>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
