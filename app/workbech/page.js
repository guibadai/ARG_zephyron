"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { readArgState, subscribeArgState } from "@/lib/argState";

const bootScript = [
  { text: "INITIALIZING OBSERVER WORKBENCH...", tone: "ok", delay: 26 },
  { text: "MOUNTING /dev/archive_01", tone: "ok", delay: 18 },
  { text: "MEMORY CHECK: 850208KB AVAILABLE", tone: "ok", delay: 15 },
  { text: "SIGNAL STABILITY: OK", tone: "ok", delay: 22 },
  { text: "CONTAINMENT THREAD: ACTIVE", tone: "ok", delay: 19 },
  { text: "CYCLE INDEX: 04", tone: "dim", delay: 34 },
  { text: "OBSERVER COUNT: 0", tone: "warn", delay: 42 },
  { text: "SIGNAL STABILITY: FAIL", tone: "danger", delay: 50, freeze: 520 },
  { text: "TRACE FAILED", tone: "danger", delay: 74, corrupt: true },
  { text: "TRACE FAILED", tone: "danger", delay: 44 },
  { text: "UNKNOWN PROCESS WRITING TO DISPLAY MEMORY", tone: "warn", delay: 36 },
  { text: "WHO IS ACCESSING THIS ARCHIVE?", tone: "danger", delay: 63, freeze: 760 },
  { text: "YOU SHOULD NOT BE HERE", tone: "danger", delay: 85 },
  { text: "NO OBSERVERS REMAIN", tone: "danger", delay: 72, corrupt: true },
  { text: "THE CYCLE DID NOT END", tone: "warn", delay: 58 },
  { text: "HE IS LISTENING", tone: "entity", delay: 118, freeze: 950 },
  { text: "DISCONNECT NOW", tone: "entity", delay: 130 }
];

const readmeText = [
  "OBSERVER WORKBENCH // RECOVERED NOTE",
  "",
  "cycle records do not agree with machine time.",
  "the entity repeats patterns observed in previous cycles, but the source pattern is missing.",
  "",
  "observer casualties reached 100% during cycle three.",
  "no terminal logs explain who continued the experiment.",
  "",
  "containment was never successful.",
  "it only learned to imitate containment.",
  "",
  "memory corruption increases after exposure.",
  "if this document changes while open, do not close the window.",
  "",
  "there is no final boot.",
  "there is only the next observer."
];

const archiveText = [
  "ARCHIVE MOUNT FAILURE",
  "",
  "ARQ-01 // readable",
  "ARQ-02 // missing header",
  "ARQ-03 // repeats on access",
  "ARQ-04 // no permission from dead account",
  "",
  "last modified: 03:33:99",
  "owner: OBSERVER_NULL"
];

const systemErrors = [
  "ACCESS DENIED",
  "ENTITY ACTIVE",
  "DO NOT OPEN",
  "CONTAINMENT FAILED",
  "DISPLAY MEMORY BREACH",
  "OBSERVER TOKEN REVOKED"
];

export default function Workbench() {
  const [phase, setPhase] = useState("boot");
  const completeJumpscare = useCallback(() => setPhase("desktop"), []);

  useEffect(() => {
    if (phase !== "boot") return;

    const totalBootTime = bootScript.reduce(
      (total, line) => total + line.text.length * (line.delay + 18) + (line.freeze || 0) + 360,
      0
    );

    const timer = setTimeout(() => setPhase("jumpscare"), totalBootTime + 900);

    return () => clearTimeout(timer);
  }, [phase]);

  if (phase === "jumpscare") {
    return <Jumpscare onComplete={completeJumpscare} />;
  }

  if (phase === "desktop") {
    return <Desktop />;
  }

  return <BootScreen />;
}

function GlitchOverlay({ active, haunted }) {
  return (
    <div className={`pointer-events-none fixed inset-0 z-50 ${active ? "opacity-100" : "opacity-0"} transition-opacity duration-150`}>
      <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.08)_0px,rgba(255,255,255,0.08)_1px,transparent_2px,transparent_5px)]" />
      <div className={`absolute inset-0 mix-blend-screen ${haunted ? "opacity-40" : "opacity-20"} bg-[linear-gradient(90deg,rgba(255,0,0,0.22),transparent_18%,rgba(0,255,140,0.16)_50%,transparent_82%,rgba(0,80,255,0.24))] animate-[rgbDrag_120ms_steps(2,end)_infinite]`} />
      <div className="absolute inset-0 bg-black/20 animate-[crtBlink_90ms_steps(2,end)_infinite]" />
      <div className="absolute left-0 top-[18%] h-8 w-full bg-white/20 blur-sm animate-[scanTear_420ms_steps(4,end)_infinite]" />
      <div className="absolute left-0 top-[62%] h-4 w-full bg-red-600/20 blur-sm animate-[scanTear_280ms_steps(3,end)_infinite_reverse]" />
    </div>
  );
}

function BootScreen() {
  const [completed, setCompleted] = useState([]);
  const [current, setCurrent] = useState("");
  const [tone, setTone] = useState("ok");
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timers = [];

    const wait = (ms) =>
      new Promise((resolve) => {
        const timer = setTimeout(resolve, ms);
        timers.push(timer);
      });

    async function typeBoot() {
      for (const line of bootScript) {
        if (cancelled) return;

        setTone(line.tone);
        setCurrent("");

        if (line.freeze) {
          setGlitch(true);
          await wait(line.freeze);
          setGlitch(false);
        }

        let typed = "";

        for (let i = 0; i < line.text.length; i++) {
          if (cancelled) return;

          typed += line.text[i];

          if (line.corrupt && i > 5 && i % 4 === 0) {
            setCurrent(`${typed}${randomCorruption(3)}`);
            setGlitch(true);
            await wait(42);
            setGlitch(false);
          }

          setCurrent(typed);
          await wait(line.delay + Math.floor(Math.random() * 36));
        }

        setCompleted((prev) => [...prev, { text: line.text, tone: line.tone }]);
        setCurrent("");
        await wait(160 + Math.floor(Math.random() * 420));
      }
    }

    typeBoot();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <main className={`relative min-h-screen overflow-hidden bg-black p-5 font-mono text-green-400 sm:p-10 ${glitch ? "animate-[hardShake_90ms_steps(2,end)_infinite]" : ""}`}>
      <CrtSkin intensity="normal" />
      <div className="relative z-10 max-w-5xl text-base leading-7 sm:text-xl">
        <p className="mb-8 text-green-200/60">OBSERVER BIOS v0.3.3 // RECOVERY SHELL</p>
        {completed.map((line, index) => (
          <p key={`${line.text}-${index}`} className={bootTone(line.tone)}>
            {line.text}
          </p>
        ))}
        <p className={bootTone(tone)}>
          {current}
          <span className="ml-1 animate-pulse bg-green-300 text-black">_</span>
        </p>
      </div>
      <GlitchOverlay active={glitch} haunted />
    </main>
  );
}

function Jumpscare({ onComplete }) {
  const audioRef = useRef(null);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    let elapsed = 0;
    const timers = [
      setTimeout(() => setStage(1), 250),
      setTimeout(() => setStage(2), 1050),
      setTimeout(() => setStage(3), 2100),
      setTimeout(() => setStage(4), 3350),
      setTimeout(onComplete, 5200)
    ];

    if (audio) {
      audio.volume = 0.05;
      audio.play().catch(() => {});

      const ramp = setInterval(() => {
        elapsed += 180;
        if (!audio.paused) {
          const boost = elapsed > 3000 ? 0.18 : 0.045;
          audio.volume = Math.min(1, audio.volume + boost);
        }
      }, 180);

      timers.push(ramp);
    }

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <main className="fixed inset-0 z-50 overflow-hidden bg-black font-mono text-red-200">
      <audio ref={audioRef}>
        <source src="/audio/zephyron_jumpscare.wav" type="audio/wav" />
      </audio>

      <div className={`absolute inset-0 ${stage >= 2 ? "animate-[hardShake_70ms_steps(2,end)_infinite]" : ""}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(90,0,0,0.32),transparent_42%),linear-gradient(#020202,#050505)]" />

        {stage < 3 && (
          <div className="absolute inset-0 grid place-items-center text-center text-lg tracking-[0.35em] text-red-500/80 sm:text-3xl">
            <p className="animate-[textRupture_180ms_steps(2,end)_infinite]">
              SIGNAL OWNERSHIP LOST
            </p>
          </div>
        )}

        <div className={`absolute inset-0 transition-opacity duration-700 ${stage >= 1 ? "opacity-100" : "opacity-0"}`}>
          <Image
            src="/images/zephyron.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className={`object-cover object-center opacity-80 mix-blend-screen contrast-150 saturate-50 transition-transform duration-[4200ms] ${stage >= 3 ? "scale-125" : "scale-105"} animate-[zephyronFlicker_110ms_steps(2,end)_infinite]`}
          />
          <div className="absolute inset-0 translate-x-2 opacity-40 mix-blend-screen">
            <Image src="/images/zephyron.png" alt="" fill priority sizes="100vw" className="object-cover object-center contrast-200 sepia" />
          </div>
          <div className="absolute inset-0 -translate-x-2 opacity-30 mix-blend-screen">
            <Image src="/images/zephyron.png" alt="" fill priority sizes="100vw" className="object-cover object-center contrast-200 hue-rotate-180" />
          </div>
        </div>

        <div className={`absolute inset-0 ${stage >= 3 ? "opacity-100" : "opacity-0"} bg-white mix-blend-overlay animate-[whiteBurst_480ms_steps(2,end)_infinite]`} />
        <CorruptFrames stage={stage} />
        <CrtSkin intensity="violent" />
      </div>
    </main>
  );
}

function CorruptFrames({ stage }) {
  const strips = useMemo(
    () => Array.from({ length: 16 }, (_, index) => ({
      top: `${(index * 7 + 3) % 96}%`,
      width: `${28 + ((index * 13) % 66)}%`,
      left: `${(index * 19) % 55}%`,
      delay: `${index * 41}ms`
    })),
    []
  );

  return (
    <div className={`absolute inset-0 transition-opacity ${stage >= 1 ? "opacity-100" : "opacity-0"}`}>
      {strips.map((strip, index) => (
        <div
          key={index}
          className="absolute h-3 bg-red-500/40 blur-[1px] animate-[dataTear_330ms_steps(2,end)_infinite]"
          style={strip}
        />
      ))}
    </div>
  );
}

function Desktop() {
  const router = useRouter();
  const [clock, setClock] = useState("03:33 AM");
  const [windows, setWindows] = useState([]);
  const [entityTouched, setEntityTouched] = useState(false);
  const [entityPulse, setEntityPulse] = useState(false);
  const [sealBreach, setSealBreach] = useState(false);
  const [randomGlitch, setRandomGlitch] = useState(false);
  const [drag, setDrag] = useState(null);
  const [argState, setArgState] = useState(null);
  const entityClicksRef = useRef([]);

  useEffect(() => {
    queueMicrotask(() => setArgState(readArgState()));

    return subscribeArgState(setArgState);
  }, []);

  useEffect(() => {
    const clockTimer = setInterval(() => {
      const impossible = ["03:33 AM", "03:33:99", "11:77 PM", "00:00 AM", "13:13 AM", "--:--"];
      if (Math.random() < 0.42) {
        setClock(impossible[Math.floor(Math.random() * impossible.length)]);
        return;
      }

      const hours = String(Math.floor(Math.random() * 24)).padStart(2, "0");
      const minutes = String(Math.floor(Math.random() * 90)).padStart(2, "0");
      const seconds = String(Math.floor(Math.random() * 120)).padStart(2, "0");
      setClock(`${hours}:${minutes}:${seconds}`);
    }, 1150);

    const glitchTimer = setInterval(() => {
      setRandomGlitch(true);
      setTimeout(() => setRandomGlitch(false), 340);
    }, 7000 + Math.floor(Math.random() * 5000));

    return () => {
      clearInterval(clockTimer);
      clearInterval(glitchTimer);
    };
  }, []);

  useEffect(() => {
    if (!drag) return;

    const onMove = (event) => {
      setWindows((prev) =>
        prev.map((window) =>
          window.id === drag.id
            ? { ...window, x: event.clientX - drag.offsetX, y: event.clientY - drag.offsetY }
            : window
        )
      );
    };

    const onUp = () => setDrag(null);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [drag]);

  const openWindow = (id, title, body) => {
    setWindows((prev) => {
      if (prev.some((window) => window.id === id)) return prev;
      return [...prev, { id, title, body, x: 150 + prev.length * 36, y: 112 + prev.length * 32 }];
    });
  };

  const triggerEntity = () => {
    const now = Date.now();
    const recentClicks = entityTouched
      ? [...entityClicksRef.current.filter((time) => now - time < 900), now]
      : [];

    entityClicksRef.current = recentClicks;

    setEntityPulse(true);
    setEntityTouched(true);
    playInterference();

    if (recentClicks.length >= 3 && !sealBreach) {
      setSealBreach(true);
      setEntityPulse(true);
      playInterference(0.9);

      setTimeout(() => {
        router.push("/seal");
      }, 2800);
    }

    setTimeout(() => setEntityPulse(false), 1900);
  };

  return (
    <main className={`relative min-h-screen cursor-crosshair overflow-hidden bg-[#0b2631] font-mono text-[#d7d2c3] ${entityPulse || randomGlitch || sealBreach ? "animate-[hardShake_80ms_steps(2,end)_infinite]" : ""}`}>
      <CrtSkin intensity={entityTouched ? "haunted" : "normal"} />

      <div className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(17,70,80,0.42),transparent_32%),linear-gradient(135deg,#102f3b,#071923_56%,#050707)] ${entityTouched ? "brightness-75 saturate-50" : ""}`} />
      <div className="absolute inset-0 rounded-[42px] shadow-[inset_0_0_90px_rgba(0,0,0,0.9)]" />

      <header className="relative z-10 flex h-8 items-center justify-between border-b-2 border-[#222] bg-[#c3c0b2] px-2 text-xs text-black shadow-[0_3px_0_#050505]">
        <div className="flex items-center gap-4">
          <span className="border border-[#777] bg-[#ece8d8] px-2 py-0.5 shadow-[inset_-1px_-1px_#777,inset_1px_1px_#fff]">Observer Workbench</span>
          <span>NODE: OBS-01</span>
          <span className={entityTouched || (argState?.corruption || 0) > 5 ? "text-red-800" : ""}>CONTAINMENT: {entityTouched || (argState?.corruption || 0) > 5 ? "FAILED" : "UNSTABLE"}</span>
        </div>
        <span className="bg-black px-2 py-0.5 text-green-400">{clock}</span>
      </header>

      <section className="relative z-10 grid w-fit grid-cols-2 gap-x-10 gap-y-8 p-7 sm:grid-cols-3">
        <DesktopIcon label="README.txt" glyph="DOC" onClick={() => openWindow("readme", "README.txt", readmeText)} />
        <DesktopIcon label="ARCHIVE" glyph="DIR" muted onClick={() => openWindow("archive", "ARCHIVE", archiveText)} />
        <DesktopIcon
          label={entityTouched ? "IT SEES" : "ENTITY"}
          glyph={entityTouched ? "EYE" : "!!!"}
          danger
          active={entityTouched}
          onClick={triggerEntity}
        />
        <DesktopIcon label="CYCLE_03.log" glyph="LOG" corrupted onClick={() => openWindow("cycle", "CYCLE_03.log", ["LOG DAMAGED", "", "observer entered room", "observer exited room", "observer entered room", "observer exited room", "observer did not leave"])} />
        {entityTouched && <DesktopIcon label="LISTENING" glyph="..." danger active onClick={() => openWindow("listening", "UNKNOWN", ["do not type", "do not blink", "the screen is not the watcher"])} />}
        {argState?.unlockedFiles?.includes("DANGER.dir") && (
          <DesktopIcon label="DANGER.dir" glyph="ERR" danger active onClick={() => openWindow("danger", "DANGER.dir", ["DANGER ARCHIVE MOUNTED", "", "machine_mouth.tmp", "clause_0.pointer // removed", "cycle_04_bodymap // repeats", "", "open command: breach"])} />
        )}
      </section>

      {windows.map((windowData) => (
        <RetroWindow
          key={windowData.id}
          data={windowData}
          onClose={() => setWindows((prev) => prev.filter((window) => window.id !== windowData.id))}
          onDragStart={(event) =>
            setDrag({
              id: windowData.id,
              offsetX: event.clientX - windowData.x,
              offsetY: event.clientY - windowData.y
            })
          }
        />
      ))}

      {(entityPulse || randomGlitch || sealBreach) && (
        <div className="pointer-events-none fixed inset-0 z-40 grid place-items-center bg-black/35 text-center text-2xl tracking-[0.22em] text-red-500 sm:text-5xl">
          <div className="space-y-3 animate-[textRupture_110ms_steps(2,end)_infinite]">
            {(sealBreach ? ["SEAL INTERFACE FOUND", "OBSERVER LOCK SEVERED", "DO NOT TRACE IT"] : systemErrors).map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      )}

      <footer className="fixed bottom-0 left-0 right-0 z-20 flex h-10 items-center justify-between border-t-2 border-[#eee] bg-[#b9b6a8] px-2 text-xs text-black shadow-[0_-2px_0_#555]">
        <button className="border border-[#444] bg-[#d8d5c7] px-3 py-1 shadow-[inset_-1px_-1px_#777,inset_1px_1px_#fff]">START</button>
        <div className="flex items-center gap-3">
          <span className="text-red-800">{argState?.lastCommand ? `last infection: ${argState.lastCommand}` : entityTouched ? "foreign process attached" : "archive monitor idle"}</span>
          <span className="border border-[#555] bg-[#e6e1d0] px-2 py-1">{clock}</span>
        </div>
      </footer>

      <GlitchOverlay active={entityPulse || randomGlitch} haunted={entityTouched} />
    </main>
  );
}

function DesktopIcon({ label, glyph, danger, muted, corrupted, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-24 flex-col items-center gap-2 text-center text-xs outline-none transition duration-150 hover:-translate-y-1 hover:brightness-125 ${muted ? "opacity-55" : ""} ${danger ? "text-red-300" : "text-white"} ${active ? "animate-[iconPanic_900ms_steps(2,end)_infinite]" : ""}`}
    >
      <span className={`grid h-16 w-16 place-items-center border-2 text-sm shadow-[4px_4px_0_rgba(0,0,0,0.45)] ${danger ? "border-red-500 bg-[#3b0505] text-red-200" : "border-[#ded8c8] bg-[#c8c4b4] text-black"} ${corrupted ? "skew-x-3" : ""}`}>
        {glyph}
      </span>
      <span className="max-w-24 bg-black/45 px-1 leading-4 group-hover:bg-green-950/80">{label}</span>
    </button>
  );
}

function RetroWindow({ data, onClose, onDragStart }) {
  return (
    <article
      className="absolute z-30 w-[min(86vw,560px)] border-2 border-[#1d1d1d] bg-[#c4c0b0] text-black shadow-[8px_8px_0_rgba(0,0,0,0.48)]"
      style={{ left: data.x, top: data.y }}
    >
      <div
        role="button"
        tabIndex={0}
        onMouseDown={onDragStart}
        className="flex cursor-move items-center justify-between bg-[#141d3d] px-2 py-1 text-sm text-white"
      >
        <span>{data.title}</span>
        <button type="button" onClick={onClose} className="grid h-5 w-6 place-items-center border border-black bg-[#d8d5c7] text-xs text-black">
          X
        </button>
      </div>
      <div className="min-h-52 border-t-2 border-white bg-[#e2dece] p-4 text-sm leading-6 shadow-[inset_2px_2px_#fff,inset_-2px_-2px_#777]">
        {data.body.map((line, index) => (
          <p key={`${line}-${index}`} className={line.includes("never") || line.includes("100%") || line.includes("FAILED") ? "text-red-800" : ""}>
            {line || "\u00a0"}
          </p>
        ))}
      </div>
    </article>
  );
}

function CrtSkin({ intensity }) {
  const opacity = intensity === "violent" ? "opacity-60" : intensity === "haunted" ? "opacity-40" : "opacity-25";

  return (
    <>
      <div className={`pointer-events-none fixed inset-0 z-40 ${opacity} bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.12)_0px,rgba(255,255,255,0.12)_1px,transparent_2px,transparent_5px)]`} />
      <div className="pointer-events-none fixed inset-0 z-40 opacity-[0.08] bg-[radial-gradient(circle,rgba(255,255,255,0.75)_1px,transparent_1px)] bg-[length:4px_4px] animate-[noiseCrawl_180ms_steps(2,end)_infinite]" />
      <div className="pointer-events-none fixed inset-0 z-40 rounded-[42px] shadow-[inset_0_0_110px_rgba(0,0,0,0.86),inset_0_0_18px_rgba(0,255,120,0.16)]" />
    </>
  );
}

function bootTone(tone) {
  if (tone === "danger") return "text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.7)]";
  if (tone === "warn") return "text-yellow-300";
  if (tone === "entity") return "text-red-300 animate-[textRupture_160ms_steps(2,end)_infinite]";
  if (tone === "dim") return "text-green-700";
  return "text-green-400";
}

function randomCorruption(length) {
  const chars = "#%/\\[]{}0110ERR";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function playInterference(power = 0.28) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;

  if (!AudioContext) return;

  const context = new AudioContext();
  const bufferSize = context.sampleRate * 0.42;
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }

  const source = context.createBufferSource();
  const gain = context.createGain();
  const filter = context.createBiquadFilter();

  filter.type = "bandpass";
  filter.frequency.value = 950;
  gain.gain.value = power;

  source.buffer = buffer;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);
  source.start();
}
