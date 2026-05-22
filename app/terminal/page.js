"use client";

import { useEffect, useRef, useState } from "react";
import { applyCommandEvent, commandFragments, readArgState, subscribeArgState } from "@/lib/argState";

const correctPassword =
  "thereisnolastchoice";

const initialLogs = [
  "ACCESS GRANTED.",
  "TYPE HELP FOR COMMANDS."
];

const livingCommands = ["echo", "witness", "cycle", "signal", "breach", "mirror", "burial", "repeat"];

const rareMessages = [
  "HE IS WATCHING",
  "DO NOT REPEAT THE COMMAND",
  "THE ENTITY LEARNED YOUR PATTERNS",
  "INPUT DELAY IS NOT LOCAL",
  "OBSERVER PRESENCE CONFIRMED",
  "YOUR LAST COMMAND WAS RECORDED BEFORE YOU TYPED IT"
];

export default function Terminal() {

  const [authorized, setAuthorized] = useState(false);

  const [password, setPassword] = useState("");

  const [input, setInput] = useState("");

  const [logs, setLogs] = useState(initialLogs);

  const [thinking, setThinking] = useState(false);

  const [corrupt, setCorrupt] = useState(false);

  const [argState, setArgState] = useState(null);

  const audioRef = useRef(null);

  const terminalRef = useRef(null);

  useEffect(() => {
    queueMicrotask(() => setArgState(readArgState()));

    return subscribeArgState(setArgState);
  }, []);

  useEffect(() => {
    terminalRef.current?.scrollTo({
      top: terminalRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [logs, thinking]);

  useEffect(() => {
    if (!authorized) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.38) return;

      setCorrupt(true);

      setLogs((prev) => [
        ...prev,
        {
          text: rareMessages[Math.floor(Math.random() * rareMessages.length)],
          ghost: true
        }
      ]);

      setTimeout(() => setCorrupt(false), 420);
    }, 9000);

    return () => clearInterval(interval);
  }, [authorized]);

  function handleLogin() {

    if (
      password.toLowerCase() === correctPassword
    ) {

      setAuthorized(true);

      setTimeout(() => playTone("grant"), 120);

    } else {

      playTone("denied");

      alert("ACCESS DENIED");
    }
  }

  function resolveCommand(command) {
    const cmd = command.toLowerCase();

    let response = "";

    if (cmd === "help") {

      response =
`AVAILABLE COMMANDS:

HELP
STATUS
ARCHIVE
OBSERVER
CLAUSULA0
CLEAR

UNINDEXED COMMANDS DETECTED`;

    }

    else if (cmd === "status") {

      response =
`SYSTEM STATUS:

INTEGRITY: 18%
MEMORY LOSS: CRITICAL
ENTITY INFLUENCE: DETECTED
ARCHIVE STABILITY: FAILING`;

    }

    else if (cmd === "archive") {

      response =
`ARCHIVE SYSTEM:

ARQ-01 : RECOVERED
ARQ-02 : LOCKED
ARQ-03 : CORRUPTED
ARQ-04 : MISSING`;

    }

    else if (cmd === "observer") {

      response =
`"the observers stopped recording
after the third signal."`;

    }

    else if (cmd === "clausula0") {

      response =
`ACCESSING...

ERROR

ERROR

ERROR

"there was never a final choice."`;

    }

    else if (livingCommands.includes(cmd)) {

      const current = readArgState();
      const count = (current.commands[cmd] || 0) + 1;
      const fragments = commandFragments[cmd] || [];
      const fragment = fragments[(count - 1) % fragments.length] || "fragment unavailable.";

      response =
`${cmd.toUpperCase()} EVENT:

${fragment}

site_state:
corruption pending
observer awareness shifting
entity presence not local`;

    }

    else {

      response = "UNKNOWN COMMAND";
    }

    return { cmd, response };
  }

  function handleCommand(command) {

    if (!command.trim()) return;

    const { cmd, response } = resolveCommand(command.trim());

    playTone("key");

    if (cmd === "clear") {

      setLogs([]);

      setInput("");

      return;
    }

    setLogs((prev) => [
      ...prev,
      `> ${command}`
    ]);

    setInput("");
    setThinking(true);

    const delay = 260 + Math.floor(Math.random() * 820) + (cmd === "clausula0" ? 900 : 0);

    setTimeout(() => {
      const nextState = livingCommands.includes(cmd) ? applyCommandEvent(cmd) : readArgState();

      playTone(response === "UNKNOWN COMMAND" ? "denied" : "reply");
      setCorrupt(livingCommands.includes(cmd) || Math.random() > 0.55);
      setLogs((prev) => [
        ...prev,
        livingCommands.includes(cmd)
          ? `${response}

ARG STATE MODIFIED:
corruption=${nextState.corruption}
awareness=${nextState.awareness}
presence=${nextState.presence}

deep archive updated.`
          : response
      ]);
      setThinking(false);
      setTimeout(() => setCorrupt(false), livingCommands.includes(cmd) ? 900 : 360);
    }, delay);
  }

  function onInputChange(value) {
    setInput(value);
    playTone("key");
  }

  if (!authorized) {

    return (

      <main className="arg-page flex min-h-screen items-center justify-center overflow-hidden p-6 font-mono text-green-400 sm:p-10">

        <section className={`arg-panel relative z-10 w-full max-w-2xl p-7 sm:p-10 ${corrupt ? "animate-[hardShake_90ms_steps(2,end)_infinite]" : ""}`}>

          <p className="mb-4 text-xs uppercase tracking-[0.32em] text-red-500/70">
            restricted relay // observer shell
          </p>

          <h1 className="arg-title mb-10 break-all text-4xl tracking-widest text-white sm:text-5xl">
            OBSERVER TERMINAL
          </h1>

          <div className="mb-10 border border-red-900/70 bg-red-950/10 p-5">

            <p className="text-red-500">
              WARNING:
            </p>

            <p className="mt-4 text-green-100/50">
              unauthorized access attempts are being monitored by a process that has no registered owner.
            </p>

          </div>

          <input
            type="password"
            placeholder="ENTER PASSWORD"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
            className="mb-6 w-full border border-green-900 bg-black/70 p-4 text-green-300 outline-none shadow-[inset_0_0_22px_rgba(0,0,0,0.85)] placeholder:text-green-800"
          />

          <button
            onClick={handleLogin}
            className="arg-button px-6 py-3 uppercase tracking-[0.22em]"
          >
            ACCESS TERMINAL
          </button>

          <div className="mt-12 text-xs leading-6 text-green-900">
            <p>handshake: unstable</p>
            <p>remote echo: present</p>
            <p className="animate-[slowThreat_8s_steps(2,end)_infinite] text-red-700">it typed first</p>
          </div>

        </section>

      </main>
    );
  }

  return (

    <main className={`arg-page min-h-screen overflow-hidden p-4 font-mono text-green-400 sm:p-10 ${corrupt ? "animate-[hardShake_90ms_steps(2,end)_infinite]" : ""}`}>

      <div className="relative z-10 mx-auto max-w-6xl">

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-green-900/50 pb-3 text-xs text-green-700">
          <span>OBSERVER TERMINAL // LIVE SHELL</span>
          <span className="text-red-700">ENTITY PRESENCE: {argState?.presence ?? "?"}/13</span>
        </div>

        <h1 className="arg-title mb-8 break-all text-4xl tracking-widest text-white sm:text-5xl">
          OBSERVER TERMINAL
        </h1>

        <section
          ref={terminalRef}
          className="arg-panel h-[72vh] overflow-y-auto p-5 shadow-[inset_0_0_80px_rgba(0,0,0,0.9)] sm:p-8"
        >

          <div className="space-y-6 whitespace-pre-line text-sm leading-6 sm:text-base">

            {logs.map((log, i) => {
              const text = typeof log === "string" ? log : log.text;
              const ghost = typeof log === "object" && log.ghost;

              return (
                <div
                  key={`${text}-${i}`}
                  className={`${ghost ? "text-red-500/80 animate-[textRupture_140ms_steps(2,end)_infinite]" : ""} ${text.includes("ERROR") || text.includes("UNKNOWN") ? "text-red-500" : ""}`}
                >
                  {text}
                </div>
              );
            })}

            {thinking && (
              <div className="text-green-700">
                remote process writing<span className="animate-pulse">...</span>
              </div>
            )}

          </div>

          <div className="mt-8 flex border-t border-green-900/40 pt-5">

            <span className="mr-3 text-red-500">
              {">"}
            </span>

            <input
              autoFocus
              value={input}
              onChange={(e) =>
                onInputChange(e.target.value)
              }
              onKeyDown={(e) => {

                if (e.key === "Enter") {

                  handleCommand(input);
                }

              }}
              className="flex-1 bg-transparent text-green-200 outline-none"
            />

            <span className="ml-1 inline-block w-3 bg-green-300 text-black animate-[terminalCursor_900ms_steps(2,end)_infinite]">
              &nbsp;
            </span>

          </div>

        </section>

        <div className="mt-4 grid gap-3 text-xs uppercase tracking-[0.18em] text-green-800 sm:grid-cols-4">
          <p>corruption: {argState?.corruption ?? "?"}</p>
          <p>awareness: {argState?.awareness ?? "?"}</p>
          <p>cycle: {argState?.cycle ?? "?"}</p>
          <p>last: {argState?.lastCommand || "none"}</p>
        </div>

      </div>

    </main>
  );
}

function playTone(kind) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;

  if (!AudioContext) return;

  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const filter = context.createBiquadFilter();

  const frequency = {
    key: 720,
    reply: 160,
    denied: 92,
    grant: 420
  }[kind];

  oscillator.type = kind === "key" ? "square" : "sawtooth";
  oscillator.frequency.value = frequency;
  filter.type = "bandpass";
  filter.frequency.value = kind === "key" ? 1100 : 280;
  gain.gain.value = kind === "key" ? 0.018 : 0.045;

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);

  oscillator.start();
  oscillator.stop(context.currentTime + (kind === "key" ? 0.025 : 0.18));
}
