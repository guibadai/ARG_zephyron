"use client";

import { useState } from "react";

export default function Terminal() {

  const [authorized, setAuthorized] = useState(false);

  const [password, setPassword] = useState("");

  const correctPassword = "thereisnolastchoice";

  function handleLogin() {

    if (
      password.toLowerCase() === correctPassword
    ) {

      setAuthorized(true);

    } else {

      alert("ACCESS DENIED");
    }
  }

  // LOGIN

  if (!authorized) {

    return (

      <main className="min-h-screen bg-black text-green-400 p-10 font-mono flex items-center justify-center">

        <div className="border border-green-900 p-10 max-w-2xl w-full">

          <h1 className="text-4xl text-white mb-10 tracking-widest">
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

  // TERMINAL LIBERADO

  return (

    <main className="min-h-screen bg-black text-green-400 p-10 font-mono">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl text-white mb-10 tracking-widest">
          TERMINAL ACCESS GRANTED
        </h1>

        <div className="border border-green-900 p-8">

          <p>
            WELCOME, OBSERVER.
          </p>

          <p className="mt-6 opacity-60">
            SYSTEM INTEGRITY:
            18%
          </p>

          <p className="mt-2 opacity-60">
            ENTITY INFLUENCE:
            UNKNOWN
          </p>

          <p className="mt-12 text-red-700 animate-pulse">
            “the cycle continues.”
          </p>

        </div>

      </div>

    </main>
  );
}