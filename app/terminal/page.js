"use client";

import { useState } from "react";

export default function Terminal() {

  const [authorized, setAuthorized] = useState(false);

  const [password, setPassword] = useState("");

  const correctPassword =
    "thereisnolastchoice";

  // TERMINAL STATES

  const [input, setInput] = useState("");

  const [logs, setLogs] = useState([
    "ACCESS GRANTED.",
    "TYPE HELP FOR COMMANDS."
  ]);

  // LOGIN

  function handleLogin() {

    if (
      password.toLowerCase() === correctPassword
    ) {

      setAuthorized(true);

    } else {

      alert("ACCESS DENIED");
    }
  }

  // TERMINAL COMMANDS

  function handleCommand(command) {

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
CLEAR`;

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

    else if (cmd === "clear") {

      setLogs([]);

      setInput("");

      return;
    }

    else {

      response = "UNKNOWN COMMAND";
    }

    setLogs((prev) => [
      ...prev,
      `> ${command}`,
      response
    ]);

    setInput("");
  }

  // LOGIN SCREEN

  if (!authorized) {

    return (

      <main className="min-h-screen bg-black text-green-400 p-10 font-mono flex items-center justify-center">

        <div className="border border-green-900 p-10 max-w-2xl w-full">

          <h1 className="text-4xl text-white mb-10 tracking-widest break-all">
            OBSERVER TERMINAL
          </h1>

          <p className="opacity-60 mb-8">
            AUTHORIZATION REQUIRED
          </p>

          <div className="border border-red-900 p-6 mb-10">

            <p className="text-red-700">
              WARNING:
            </p>

            <p className="opacity-60 mt-4">
              unauthorized access attempts
              are being monitored.
            </p>

          </div>

          <input
            type="password"
            placeholder="ENTER PASSWORD"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="bg-transparent border border-green-900 p-4 w-full outline-none mb-6"
          />

          <button
            onClick={handleLogin}
            className="border border-green-900 px-6 py-3 hover:bg-green-950/30 transition"
          >
            ACCESS TERMINAL
          </button>

        </div>

      </main>
    );
  }

  // TERMINAL SCREEN

  return (

    <main className="min-h-screen bg-black text-green-400 p-10 font-mono">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl text-white mb-10 tracking-widest break-all">
          OBSERVER TERMINAL
        </h1>

        <div className="border border-green-900 p-8 h-[70vh] overflow-y-auto">

          <div className="space-y-6 whitespace-pre-line">

            {logs.map((log, i) => (

              <div key={i}>
                {log}
              </div>

            ))}

          </div>

          <div className="flex mt-8">

            <span className="mr-3">
              {">"}
            </span>

            <input
              autoFocus
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) => {

                if (e.key === "Enter") {

                  handleCommand(input);
                }

              }}
              className="bg-transparent outline-none flex-1"
            />

          </div>

        </div>

      </div>

    </main>
  );
}