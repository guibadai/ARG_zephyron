"use client";

import { useEffect, useState } from "react";

export default function Login() {

  const targetDate = new Date("2026-05-22T00:00:00");

  const [timeLeft, setTimeLeft] = useState("");

  const messages = [

    "the signal grows stronger",
    "memory corruption detected",
    "it remembers your choices",
    "do not trust repetition",
    "the observers are gone",
    "something survived the archive",
    "it watches through the static",
    "there is no final choice"

  ];

  const [message, setMessage] = useState(messages[0]);

  useEffect(() => {

    const interval = setInterval(() => {

      const now = new Date();

      const difference = targetDate - now;

      if (difference <= 0) {

        setTimeLeft("ACCESS AVAILABLE");

        return;
      }

      const days =
        Math.floor(difference / (1000 * 60 * 60 * 24));

      const hours =
        Math.floor(
          (difference / (1000 * 60 * 60)) % 24
        );

      const minutes =
        Math.floor(
          (difference / (1000 * 60)) % 60
        );

      const seconds =
        Math.floor(
          (difference / 1000) % 60
        );

      setTimeLeft(
        `${days}D ${hours}H ${minutes}M ${seconds}S`
      );

    }, 1000);

    return () => clearInterval(interval);

  }, []);

  // RANDOM MESSAGES

  useEffect(() => {

    const interval = setInterval(() => {

      const random =
        messages[
          Math.floor(Math.random() * messages.length)
        ];

      setMessage(random);

    }, 4000);

    return () => clearInterval(interval);

  }, []);

  return (

    <main className="min-h-screen bg-black text-green-400 font-mono overflow-hidden relative flex items-center justify-center p-10">

      {/* SCANLINES */}

      <div
        className="fixed inset-0 pointer-events-none opacity-10"
        style={{
          background: `repeating-linear-gradient(
            to bottom,
            rgba(255,255,255,0.05),
            rgba(255,255,255,0.05) 1px,
            transparent 1px,
            transparent 4px
          )`
        }}
      ></div>

      {/* NOISE */}

      <div className="fixed inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <div className="relative z-10 max-w-3xl w-full border border-green-900 p-10">

        <h1 className="text-5xl text-white mb-12 tracking-widest">
          OBSERVER LOGIN
        </h1>

        <p className="opacity-60 mb-6">
          ACCESS TEMPORARILY RESTRICTED
        </p>

        <div className="border border-red-900 p-8 mb-10">

          <p className="text-red-700 mb-4">
            NEXT SIGNAL:
          </p>

          <p className="text-5xl tracking-widest text-white">
            {timeLeft}
          </p>

        </div>

        <div className="opacity-50 text-lg min-h-[40px] animate-pulse">

          {message}

        </div>

        <div className="mt-16 opacity-20 text-sm leading-8">

          <p>
            observer protocol unstable
          </p>

          <p>
            archive synchronization incomplete
          </p>

          <p>
            ████ survived the purge
          </p>

        </div>

      </div>

    </main>
  );
}
