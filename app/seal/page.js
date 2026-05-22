"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const points = [
  { id: 1, x: 12, y: 18, rune: "N" },
  { id: 2, x: 28, y: 15, rune: "V" },
  { id: 3, x: 44, y: 13, rune: "A" },
  { id: 4, x: 60, y: 15, rune: "W" },
  { id: 5, x: 76, y: 18, rune: "O" },
  { id: 6, x: 15, y: 35, rune: "R" },
  { id: 7, x: 32, y: 33, rune: "I" },
  { id: 8, x: 50, y: 32, rune: "E" },
  { id: 9, x: 68, y: 33, rune: "L" },
  { id: 10, x: 84, y: 36, rune: "S" },
  { id: 11, x: 18, y: 54, rune: "C" },
  { id: 12, x: 36, y: 52, rune: "Y" },
  { id: 13, x: 52, y: 51, rune: "0" },
  { id: 14, x: 70, y: 52, rune: "X" },
  { id: 15, x: 86, y: 55, rune: "T" },
  { id: 16, x: 22, y: 72, rune: "B" },
  { id: 17, x: 39, y: 70, rune: "M" },
  { id: 18, x: 55, y: 70, rune: "K" },
  { id: 19, x: 72, y: 71, rune: "P" },
  { id: 20, x: 34, y: 88, rune: "U" },
  { id: 21, x: 52, y: 88, rune: "H" },
  { id: 22, x: 70, y: 88, rune: "Z" }
];

const sealSegments = [
  [6, 7, 8, 9, 10],
  [10, 14, 13, 12, 11],
  [11, 16, 20],
  [13, 18, 21]
];

const hintPoints = new Set(sealSegments.flat());

const failureMessages = [
  "INCORRECT SEAL",
  "THE ENTITY REJECTED THE PATTERN",
  "MEMORY CORRUPTION DETECTED",
  "OBSERVER HAND UNRECOGNIZED"
];

export default function SealPage() {
  const router = useRouter();
  const boardRef = useRef(null);
  const audioRef = useRef(null);
  const selectedRef = useRef([]);
  const [selected, setSelected] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [message, setMessage] = useState("TRACE THE UNRECORDED SEAL");
  const [status, setStatus] = useState("idle");
  const [glitch, setGlitch] = useState(false);
  const [hintStage, setHintStage] = useState(0);

  const particles = useMemo(
    () => Array.from({ length: 34 }, (_, index) => ({
      left: `${(index * 29) % 100}%`,
      top: `${(index * 47) % 100}%`,
      delay: `${(index * 137) % 900}ms`
    })),
    []
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 180);
    }, 4200);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setHintStage((prev) => (prev + 1) % sealSegments.length);
    }, 1650);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    startSealAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.master.gain.setTargetAtTime(0, audioRef.current.context.currentTime, 0.04);
      }
    };
  }, []);

  const selectedPoints = selected
    .map((id) => points.find((point) => point.id === id))
    .filter(Boolean);

  const pathData = selectedPoints
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const livePath = cursor && selectedPoints.length > 0
    ? `${pathData} L ${cursor.x} ${cursor.y}`
    : pathData;

  const completedSegments = sealSegments.filter((segment) =>
    containsSequence(selected, segment) || containsSequence(selected, [...segment].reverse())
  ).length;

  function startSealAudio() {
    if (audioRef.current) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const context = new AudioContext();
    const master = context.createGain();
    const drone = context.createOscillator();
    const pulse = context.createOscillator();
    const noise = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const droneGain = context.createGain();
    const pulseGain = context.createGain();
    const noiseGain = context.createGain();
    const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    drone.type = "sine";
    drone.frequency.value = 43;
    pulse.type = "triangle";
    pulse.frequency.value = 86;
    filter.type = "lowpass";
    filter.frequency.value = 680;
    droneGain.gain.value = 0.055;
    pulseGain.gain.value = 0.018;
    noiseGain.gain.value = 0.012;
    master.gain.value = 0.32;

    noise.buffer = buffer;
    noise.loop = true;

    drone.connect(droneGain);
    pulse.connect(pulseGain);
    noise.connect(filter);
    filter.connect(noiseGain);
    droneGain.connect(master);
    pulseGain.connect(master);
    noiseGain.connect(master);
    master.connect(context.destination);

    drone.start();
    pulse.start();
    noise.start();

    audioRef.current = { context, master, drone, pulse, noiseGain };
  }

  function playSealHit(kind) {
    startSealAudio();

    const audio = audioRef.current;
    if (!audio) return;

    const oscillator = audio.context.createOscillator();
    const gain = audio.context.createGain();

    oscillator.type = kind === "accept" ? "sawtooth" : "square";
    oscillator.frequency.value = kind === "accept" ? 111 : kind === "reject" ? 73 : 420 + selected.length * 18;
    gain.gain.value = kind === "trace" ? 0.025 : 0.08;

    oscillator.connect(gain);
    gain.connect(audio.context.destination);
    oscillator.start();
    oscillator.stop(audio.context.currentTime + (kind === "trace" ? 0.045 : 0.42));
  }

  function boardPosition(event) {
    const rect = boardRef.current.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100
    };
  }

  function nearestPoint(position) {
    return points.find((point) => {
      const distance = Math.hypot(point.x - position.x, point.y - position.y);
      return distance < 6.5;
    });
  }

  function addPoint(point) {
    if (!point) return;

    setSelected((prev) => {
      if (prev[prev.length - 1] === point.id) return prev;
      if (prev.includes(point.id) && point.id !== 12 && point.id !== 13 && point.id !== 18) return prev;

      playSealHit("trace");
      setGlitch(Math.random() > 0.65);
      setTimeout(() => setGlitch(false), 110);

      const next = [...prev, point.id];
      selectedRef.current = next;

      return next;
    });
  }

  function beginDraw(event) {
    startSealAudio();
    const position = boardPosition(event);
    const point = nearestPoint(position);

    setDrawing(true);
    setCursor(position);
    addPoint(point);
  }

  function moveDraw(event) {
    if (!drawing) return;

    const position = boardPosition(event);
    setCursor(position);
    addPoint(nearestPoint(position));
  }

  function endDraw() {
    if (!drawing) return;

    setDrawing(false);
    setCursor(null);
    checkPattern();
  }

  function checkPattern() {
    const drawnPattern = selectedRef.current;
    const accepted = sealSegments.every((segment) =>
      containsSequence(drawnPattern, segment) || containsSequence(drawnPattern, [...segment].reverse())
    );

    if (accepted) {
      setStatus("accepted");
      setMessage("SEAL ACCEPTED // ACCESSING DEEP ARCHIVE");
      setGlitch(true);
      playSealHit("accept");
      localStorage.setItem("zephyron_seal_open", "true");

      setTimeout(() => {
        router.push("/seal/deep");
      }, 2800);

      return;
    }

    setStatus("rejected");
    setMessage(failureMessages[Math.floor(Math.random() * failureMessages.length)]);
    setGlitch(true);
    playSealHit("reject");

    setTimeout(() => {
      setSelected([]);
      selectedRef.current = [];
      setStatus("idle");
      setMessage("TRACE THE UNRECORDED SEAL");
      setGlitch(false);
    }, 1350);
  }

  return (
    <main className={`arg-page relative min-h-screen overflow-hidden p-4 font-mono text-[#d8d0ba] sm:p-8 ${glitch || status !== "idle" ? "animate-[hardShake_90ms_steps(2,end)_infinite]" : ""}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(97,18,18,0.28),transparent_30%),radial-gradient(circle_at_48%_45%,rgba(184,134,53,0.12),transparent_18%)]" />
      <div className="absolute inset-0 opacity-30 blur-3xl bg-[radial-gradient(circle_at_30%_20%,rgba(180,180,150,0.12),transparent_20%),radial-gradient(circle_at_70%_72%,rgba(120,0,0,0.24),transparent_24%)]" />

      {particles.map((particle, index) => (
        <span
          key={index}
          className="pointer-events-none absolute z-0 h-1 w-1 rounded-full bg-amber-200/20 animate-[sealDust_4s_ease-in-out_infinite]"
          style={particle}
        />
      ))}

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col items-center justify-center gap-6">
        <div className="text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.42em] text-red-400/70">observer lock // unindexed ritual interface</p>
          <h1 className="arg-title text-3xl uppercase tracking-[0.3em] text-stone-100 sm:text-5xl">
            SEAL OF ZEPHYRON
          </h1>
          <p className={`mt-5 min-h-6 text-xs uppercase tracking-[0.22em] ${status === "accepted" ? "text-green-300" : status === "rejected" ? "text-red-400" : "text-amber-100/55"}`}>
            {message}
          </p>
          <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-stone-500">
            aligned fragments: {completedSegments}/4
          </p>
        </div>

        <div
          ref={boardRef}
          onPointerDown={beginDraw}
          onPointerMove={moveDraw}
          onPointerUp={endDraw}
          onPointerCancel={endDraw}
          className="relative aspect-[4/5] w-[min(92vw,520px)] touch-none overflow-hidden border border-red-900/50 bg-black/70 shadow-[0_0_0_1px_rgba(212,175,55,0.1),0_0_70px_rgba(0,0,0,0.95),inset_0_0_80px_rgba(0,0,0,0.9)]"
        >
          <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.05)_0px,rgba(255,255,255,0.05)_1px,transparent_2px,transparent_6px)] opacity-40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_38%,rgba(0,0,0,0.82)_78%)]" />

          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
            <path d="M15 35 L32 33 L50 32 L68 33 L84 36" fill="none" stroke={hintStage === 0 ? "rgba(236,208,135,0.38)" : "rgba(205,171,90,0.16)"} strokeWidth="1.45" strokeLinecap="round" strokeDasharray="7 10" className="animate-[sealGhost_5s_steps(2,end)_infinite]" />
            <path d="M84 36 L70 52 L52 51 L36 52 L18 54" fill="none" stroke={hintStage === 1 ? "rgba(236,208,135,0.36)" : "rgba(205,171,90,0.13)"} strokeWidth="1.2" strokeLinecap="round" strokeDasharray="6 13" />
            <path d="M18 54 L22 72 L34 88" fill="none" stroke={hintStage === 2 ? "rgba(236,208,135,0.36)" : "rgba(205,171,90,0.12)"} strokeWidth="1.2" strokeLinecap="round" strokeDasharray="5 12" />
            <path d="M52 51 L55 70 L52 88" fill="none" stroke={hintStage === 3 ? "rgba(236,208,135,0.36)" : "rgba(205,171,90,0.12)"} strokeWidth="1.2" strokeLinecap="round" strokeDasharray="5 12" />

            {livePath && (
              <>
                <path d={livePath} fill="none" stroke="rgba(255,0,0,0.34)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" transform="translate(0.7 0)" />
                <path d={livePath} fill="none" stroke="rgba(0,255,180,0.25)" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" transform="translate(-0.8 0.4)" />
                <path d={livePath} fill="none" stroke="rgba(230,210,147,0.92)" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
              </>
            )}
          </svg>

          {points.map((point) => {
            const active = selected.includes(point.id);
            const hinted = sealSegments[hintStage].includes(point.id);
            const important = hintPoints.has(point.id);

            return (
              <button
                key={point.id}
                type="button"
                aria-label={`seal point ${point.id}`}
                className={`absolute grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border text-[10px] transition duration-150 ${
                  active
                    ? "border-amber-200 bg-amber-200/20 text-amber-100 shadow-[0_0_24px_rgba(251,191,36,0.55)]"
                    : hinted
                      ? "border-amber-300/80 bg-amber-200/10 text-amber-100 shadow-[0_0_18px_rgba(251,191,36,0.32)]"
                      : important
                        ? "border-stone-500/80 bg-stone-900/80 text-stone-300/80 hover:border-red-400 hover:text-red-200"
                        : "border-stone-700/45 bg-stone-950/70 text-stone-600/55 hover:border-red-400 hover:text-red-200"
                } ${point.id === 6 ? "ring-1 ring-red-500/50" : ""}`}
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
                onPointerDown={(event) => {
                  event.preventDefault();
                  beginDraw(event);
                }}
              >
                {point.rune}
              </button>
            );
          })}

          <div className="pointer-events-none absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-200/25 bg-black/70 shadow-[0_0_34px_rgba(251,191,36,0.2)]" />
          <div className="pointer-events-none absolute bottom-4 left-0 right-0 text-center text-[10px] uppercase tracking-[0.28em] text-stone-500">
            begin at the left rim. complete the four broken traces.
          </div>
        </div>

        <div className="grid max-w-3xl gap-3 text-center text-xs uppercase tracking-[0.22em] text-stone-500 sm:grid-cols-3">
          <p>the upper lid opens first</p>
          <p>the lower lid returns left</p>
          <p className="text-red-700 animate-[slowThreat_7s_steps(2,end)_infinite]">it recognizes hands</p>
        </div>
      </section>
    </main>
  );
}

function containsSequence(pattern, sequence) {
  let cursor = 0;

  for (const point of pattern) {
    if (point === sequence[cursor]) {
      cursor++;
    }

    if (cursor === sequence.length) {
      return true;
    }
  }

  return false;
}
