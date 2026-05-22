"use client";

export const ARG_STATE_KEY = "zephyron_arg_state";
export const ARG_STATE_EVENT = "zephyron-arg-state";

export const initialArgState = {
  corruption: 1,
  awareness: 1,
  presence: 1,
  cycle: 5,
  commands: {},
  fragments: [],
  unlockedFiles: [],
  deepGames: {},
  repeatIndex: 0,
  mirrorActiveUntil: 0,
  lastCommand: null
};

const commandEffects = {
  echo: { awareness: 1, presence: 1, fragment: "echo_return" },
  witness: { awareness: 2, corruption: 1, fragment: "dead_observers" },
  cycle: { awareness: 1, corruption: 1, fragment: "cycle_index" },
  signal: { presence: 2, corruption: 1, fragment: "below_archive" },
  breach: { corruption: 3, presence: 2, unlock: "DANGER.dir", fragment: "containment_open" },
  mirror: { awareness: 1, corruption: 2, mirror: true, fragment: "false_reflection" },
  burial: { presence: 2, fragment: "burial_failed" },
  repeat: { corruption: 1, repeat: true, fragment: "loop_return" }
};

export const commandFragments = {
  echo: [
    "echo returned before transmission completed.",
    "someone answered using the observer channel.",
    "the reply contains your previous command."
  ],
  witness: [
    "OBS-02: we stopped him in cycle three / no, this already happened.",
    "OBS-11: the clause was removed before initialization.",
    "OBS-00: we were never meant to remember."
  ],
  cycle: [
    "cycle_02 ended during eclipse event.",
    "cycle_03 observer extinction confirmed.",
    "cycle_04 repeated deviation pattern.",
    "cycle_05 currently unstable.",
    "medieval substrate mismatch: not origin cycle."
  ],
  signal: [
    "signal detected below archive layer.",
    "cycle continuity required.",
    "consent engine incomplete.",
    "entity progression maintained."
  ],
  breach: [
    "containment opened inward.",
    "danger archive mounted without observer consent.",
    "zephyron proximity increased.",
    "the machine remembers."
  ],
  mirror: [
    "you already lived this.",
    "this is not the first world.",
    "the fifth cycle diverges.",
    "reflection timestamp predates access."
  ],
  burial: [
    "burial unsuccessful.",
    "the lower archive continued transmitting.",
    "cycle 4 collapse repeated under soil layer.",
    "dead worlds do not stay closed."
  ],
  repeat: [
    "previous event restored.",
    "audio memory returned.",
    "loop residue visible.",
    "do not repeat the command."
  ]
};

export function readArgState() {
  if (typeof window === "undefined") return initialArgState;

  try {
    const stored = window.localStorage.getItem(ARG_STATE_KEY);
    if (!stored) return initialArgState;

    return normalizeState(JSON.parse(stored));
  } catch {
    return initialArgState;
  }
}

export function writeArgState(nextState) {
  if (typeof window === "undefined") return nextState;

  const normalized = normalizeState(nextState);
  window.localStorage.setItem(ARG_STATE_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new CustomEvent(ARG_STATE_EVENT, { detail: normalized }));

  return normalized;
}

export function applyCommandEvent(command) {
  const cmd = command.toLowerCase();
  const effect = commandEffects[cmd];
  const current = readArgState();

  if (!effect) return current;

  const count = (current.commands[cmd] || 0) + 1;
  const fragments = commandFragments[cmd] || [];
  const fragment = fragments[(count - 1) % fragments.length];

  return writeArgState({
    ...current,
    corruption: clamp(current.corruption + (effect.corruption || 0), 0, 13),
    awareness: clamp(current.awareness + (effect.awareness || 0), 0, 13),
    presence: clamp(current.presence + (effect.presence || 0), 0, 13),
    commands: {
      ...current.commands,
      [cmd]: count
    },
    fragments: unique([...current.fragments, effect.fragment, fragment].filter(Boolean)),
    unlockedFiles: effect.unlock ? unique([...current.unlockedFiles, effect.unlock]) : current.unlockedFiles,
    repeatIndex: effect.repeat ? current.repeatIndex + 1 : current.repeatIndex,
    mirrorActiveUntil: effect.mirror ? Date.now() + 18000 : current.mirrorActiveUntil,
    lastCommand: cmd
  });
}

export function markDeepGame(game, fragment) {
  const current = readArgState();

  return writeArgState({
    ...current,
    awareness: clamp(current.awareness + 1, 0, 13),
    corruption: clamp(current.corruption + 1, 0, 13),
    deepGames: {
      ...current.deepGames,
      [game]: true
    },
    fragments: unique([...current.fragments, fragment].filter(Boolean))
  });
}

export function subscribeArgState(callback) {
  if (typeof window === "undefined") return () => {};

  const handler = (event) => callback(event.detail || readArgState());
  const storageHandler = (event) => {
    if (event.key === ARG_STATE_KEY) callback(readArgState());
  };

  window.addEventListener(ARG_STATE_EVENT, handler);
  window.addEventListener("storage", storageHandler);

  return () => {
    window.removeEventListener(ARG_STATE_EVENT, handler);
    window.removeEventListener("storage", storageHandler);
  };
}

function normalizeState(state) {
  return {
    ...initialArgState,
    ...state,
    commands: { ...initialArgState.commands, ...(state?.commands || {}) },
    fragments: Array.isArray(state?.fragments) ? state.fragments : [],
    unlockedFiles: Array.isArray(state?.unlockedFiles) ? state.unlockedFiles : [],
    deepGames: { ...initialArgState.deepGames, ...(state?.deepGames || {}) }
  };
}

function unique(items) {
  return [...new Set(items)];
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
