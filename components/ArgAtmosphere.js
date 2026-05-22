"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { readArgState, subscribeArgState } from "@/lib/argState";

const routeProfiles = {
  "/": { low: 42, high: 96, noise: 0.018, pulse: 0.045 },
  "/login": { low: 35, high: 84, noise: 0.014, pulse: 0.035 },
  "/terminal": { low: 58, high: 132, noise: 0.026, pulse: 0.055 },
  "/arquivos": { low: 47, high: 105, noise: 0.02, pulse: 0.042 },
  "/arquivos/arq01": { low: 39, high: 91, noise: 0.024, pulse: 0.05 },
  "/workbech": { low: 52, high: 118, noise: 0.018, pulse: 0.04 }
};

export default function ArgAtmosphere() {
  const pathname = usePathname();
  const audioRef = useRef(null);
  const [armed, setArmed] = useState(false);
  const [argState, setArgState] = useState(null);
  const [mirrorActive, setMirrorActive] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setArgState(readArgState()));

    return subscribeArgState(setArgState);
  }, []);

  useEffect(() => {
    if (armed) return;

    const start = () => setArmed(true);

    window.addEventListener("pointerdown", start, { once: true });
    window.addEventListener("keydown", start, { once: true });

    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
    };
  }, [armed]);

  useEffect(() => {
    if (!armed) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    if (!audioRef.current) {
      const context = new AudioContext();
      const master = context.createGain();
      const low = context.createOscillator();
      const high = context.createOscillator();
      const lowGain = context.createGain();
      const highGain = context.createGain();
      const noiseGain = context.createGain();
      const filter = context.createBiquadFilter();
      const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < data.length; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = context.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      low.type = "sine";
      high.type = "triangle";
      filter.type = "lowpass";
      filter.frequency.value = 1150;
      master.gain.value = 0.22;

      low.connect(lowGain);
      high.connect(highGain);
      noise.connect(filter);
      filter.connect(noiseGain);
      lowGain.connect(master);
      highGain.connect(master);
      noiseGain.connect(master);
      master.connect(context.destination);

      low.start();
      high.start();
      noise.start();

      audioRef.current = { context, low, high, lowGain, highGain, noiseGain, master };
    }

    const profile = routeProfiles[pathname] || routeProfiles["/"];
    const audio = audioRef.current;

    const corruption = argState?.corruption || 0;
    const presence = argState?.presence || 0;
    const infection = Math.min(2.2, 1 + (corruption + presence) / 18);

    audio.low.frequency.setTargetAtTime(profile.low + presence * 1.5, audio.context.currentTime, 0.6);
    audio.high.frequency.setTargetAtTime(profile.high + corruption * 4, audio.context.currentTime, 0.6);
    audio.lowGain.gain.setTargetAtTime(profile.pulse * infection, audio.context.currentTime, 0.8);
    audio.highGain.gain.setTargetAtTime(profile.pulse * 0.32 * infection, audio.context.currentTime, 0.8);
    audio.noiseGain.gain.setTargetAtTime(profile.noise * infection, audio.context.currentTime, 0.8);

    const tremor = setInterval(() => {
      const now = audio.context.currentTime;
      audio.noiseGain.gain.setTargetAtTime(profile.noise * infection * (1.6 + Math.random()), now, 0.02);
      audio.noiseGain.gain.setTargetAtTime(profile.noise * infection, now + 0.12, 0.15);
    }, 5000 + Math.floor(Math.random() * 5000));

    return () => clearInterval(tremor);
  }, [armed, pathname, argState]);

  useEffect(() => {
    const updateMirror = () => {
      setMirrorActive((argState?.mirrorActiveUntil || 0) > Date.now());
    };

    updateMirror();
    const timer = setInterval(updateMirror, 1000);

    return () => clearInterval(timer);
  }, [argState?.mirrorActiveUntil]);

  const corruption = argState?.corruption || 0;

  return (
    <>
      <div className="arg-crt-overlay" style={{ opacity: 0.3 + Math.min(corruption, 10) * 0.025 }} aria-hidden="true" />
      <div className={`arg-ghosting ${mirrorActive ? "arg-mirror-breach" : ""}`} aria-hidden="true" />
      {corruption >= 6 && (
        <div className="pointer-events-none fixed inset-0 z-[1088] bg-red-950/10 mix-blend-screen animate-[crtBlink_900ms_steps(2,end)_infinite]" aria-hidden="true" />
      )}
      <div key={pathname} className="arg-route-flash arg-route-flash--active" aria-hidden="true" />
      {!armed && (
        <div className="pointer-events-none fixed bottom-4 right-4 z-[1200] border border-red-900/60 bg-black/70 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-red-300/60">
          audio feed dormant
        </div>
      )}
    </>
  );
}
