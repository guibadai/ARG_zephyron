"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Arquivos() {

  const bootLines = [
    "BOOTING OBSERVER SYSTEM...",
    "RESTORING MEMORY...",
    "SEARCHING ARCHIVES...",
    "WARNING: DATA CORRUPTION DETECTED",
    "RECOVERING SURVIVING FILES..."
  ];

  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLine, setCurrentLine] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [bootFinished, setBootFinished] = useState(false);
  const [checkedStorage, setCheckedStorage] = useState(false);
useEffect(() => {

  const alreadyBooted =
    sessionStorage.getItem("observer_boot");

  if (alreadyBooted === "true") {

    setBootFinished(true);

  }

  setCheckedStorage(true);

}, []);
  useEffect(() => {

    if (lineIndex >= bootLines.length) {

      setTimeout(() => {
        setBootFinished(true);
        sessionStorage.setItem("observer_boot", "true");
      }, 800);

      return;
    }

    const current = bootLines[lineIndex];

    if (charIndex < current.length) {

      const timeout = setTimeout(() => {

        setCurrentLine((prev) => prev + current[charIndex]);

        setCharIndex((prev) => prev + 1);

      }, 30);

      return () => clearTimeout(timeout);

    } else {

      const timeout = setTimeout(() => {

        setDisplayedLines((prev) => [...prev, current]);

        setCurrentLine("");
        setCharIndex(0);
        setLineIndex((prev) => prev + 1);

      }, 400);

      return () => clearTimeout(timeout);
    }

  }, [charIndex, lineIndex]);

  return (

    <main className="min-h-screen bg-black text-green-400 p-10 font-mono">

      {checkedStorage && !bootFinished ? (

        <div className="space-y-3 text-lg">

          {displayedLines.map((line, i) => (

            <p
              key={i}
              className={
                line.includes("WARNING")
                  ? "text-red-600"
                  : ""
              }
            >
              {line}
            </p>

          ))}

          <p>

            {currentLine}

            <span className="animate-pulse">
              █
            </span>

          </p>

        </div>

      ) : (

        <div className="max-w-5xl mx-auto">

          <h1 className="text-5xl text-white mb-12 tracking-widest">
            OBSERVER ARCHIVE SYSTEM
          </h1>

          <div className="border border-green-800">

            {/* ARQ 01 */}

            <Link href="/arquivos/arq01">

              <div className="border-b border-green-900 p-6 hover:bg-green-950/20 transition cursor-pointer">

                <p className="text-xl text-white">
                  [ARQ-01]
                </p>

                <p className="opacity-60 mt-2">
                  Fragmento Recuperado
                </p>

              </div>

            </Link>

            {/* LOCKED */}

            <div className="border-b border-green-900 p-6 opacity-40">

              <p className="text-xl">
                [ARQ-02]
              </p>

              <p className="mt-2">
                LOCKED
              </p>

            </div>

            {/* CORRUPTED */}

            <div className="border-b border-green-900 p-6 text-red-700">

              <p className="text-xl">
                [ARQ-03]
              </p>

              <p className="mt-2 animate-pulse">
                █ CORRUPTED █
              </p>

            </div>

            {/* DENIED */}

            <div className="p-6 opacity-20">

              <p className="text-xl">
                [ARQ-04]
              </p>

              <p className="mt-2">
                ACCESS DENIED
              </p>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}