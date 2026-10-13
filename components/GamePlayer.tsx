"use client";

import Link from "next/link";
import { useEffect, useReducer, useState } from "react";
import { useUser } from "@/hooks/useUser";
import type { Game } from "@/lib/games";
import { formatScore } from "@/lib/scores";
import { addScore } from "@/lib/storage";

const NAME_MAX_LENGTH = 10;

type PlayState = {
  score: number;
  lives: number;
  level: number;
  paused: boolean;
  over: boolean;
  saved: boolean;
};

type PlayAction =
  | { type: "tick"; points: number }
  | { type: "togglePause" }
  | { type: "end" }
  | { type: "saved" }
  | { type: "restart" };

const INITIAL_STATE: PlayState = { score: 0, lives: 3, level: 1, paused: false, over: false, saved: false };

function playReducer(state: PlayState, action: PlayAction): PlayState {
  switch (action.type) {
    case "tick": {
      const score = state.score + action.points;
      // Same level-up rule as the template: whenever the score lands just past a multiple of 2500.
      const level = score > 0 && score % 2500 < 100 ? state.level + 1 : state.level;
      return { ...state, score, level };
    }
    case "togglePause":
      return { ...state, paused: !state.paused };
    case "end":
      return { ...state, over: true };
    case "saved":
      return { ...state, saved: true };
    case "restart":
      return INITIAL_STATE;
  }
}

export default function GamePlayer({ game }: { game: Game }) {
  const user = useUser();
  const [state, dispatch] = useReducer(playReducer, INITIAL_STATE);
  // null until the player edits the field: falls back to the session name or INVITADO.
  const [editedName, setEditedName] = useState<string | null>(null);
  const { score, lives, level, paused, over, saved } = state;
  const name = editedName ?? (user ? user.name : "INVITADO");
  const canSave = name.trim() !== "";

  useEffect(() => {
    if (over || paused) return;
    const t = setInterval(() => dispatch({ type: "tick", points: Math.floor(10 + Math.random() * 90) }), 220);
    return () => clearInterval(t);
  }, [over, paused]);

  const save = () => {
    if (!canSave || saved) return;
    addScore({ game: game.id, name: name.trim(), score, at: Date.now() });
    dispatch({ type: "saved" });
  };

  return (
    <div className="av-player fade-in">
      <div className="player-hud">
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          <div className="hud-stat">
            <div className="l">Jugador</div>
            <div className="v" style={{ color: "var(--ink)" }}>
              {name}
            </div>
          </div>
          <div className="hud-stat">
            <div className="l">Puntuación</div>
            <div className="v">{formatScore(score)}</div>
          </div>
          <div className="hud-stat lives">
            <div className="l">Vidas</div>
            <div className="v">{"♥ ".repeat(lives).trim() || "—"}</div>
          </div>
          <div className="hud-stat level">
            <div className="l">Nivel</div>
            <div className="v">{String(level).padStart(2, "0")}</div>
          </div>
        </div>
        <div className="hud-actions">
          <button type="button" className="btn yellow" onClick={() => dispatch({ type: "togglePause" })}>
            {paused ? "REANUDAR" : "PAUSA"}
          </button>
          <button type="button" className="btn magenta" onClick={() => dispatch({ type: "end" })}>
            FIN
          </button>
          <Link href={`/games/${game.id}`} className="btn ghost">
            SALIR
          </Link>
        </div>
      </div>

      <div className="crt">
        <div className="crt-screen">
          <div className="game-arena">
            <div className="grid-floor"></div>
            <div className="enemy e1"></div>
            <div className="enemy e2"></div>
            <div className="enemy e3"></div>
            <div className="player-ship"></div>
          </div>
          {paused && (
            <div className="crt-content" style={{ background: "rgba(0,0,0,0.6)", zIndex: 5 }}>
              <div>
                <div className="pixel neon-yellow" style={{ fontSize: 22 }}>
                  EN PAUSA
                </div>
                <div
                  className="mono"
                  style={{ fontSize: 11, color: "var(--ink-dim)", marginTop: 10, letterSpacing: "0.16em" }}
                >
                  PULSA REANUDAR PARA CONTINUAR
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="crt-bottom">
          <span className="led">SEÑAL OK</span>
          <span>{game.title} · CRT-83 · 60 HZ</span>
          <span>CARGA · 1MB</span>
        </div>
      </div>

      {over && (
        <div className="modal-bd">
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="game-over-title">
            <h2 id="game-over-title">FIN DEL JUEGO</h2>
            <div className="final-label">PUNTUACIÓN FINAL</div>
            <div className="final">{formatScore(score)}</div>
            {!saved ? (
              <div className="input-row">
                <input
                  value={name}
                  onChange={(e) => setEditedName(e.target.value.toUpperCase().slice(0, NAME_MAX_LENGTH))}
                  placeholder="TUS INICIALES"
                />
                <button
                  type="button"
                  className="btn yellow"
                  onClick={save}
                  disabled={!canSave}
                  style={canSave ? undefined : { opacity: 0.4, cursor: "not-allowed" }}
                >
                  GUARDAR PUNTUACIÓN
                </button>
              </div>
            ) : (
              <div className="toast-saved">▸ PUNTUACIÓN GUARDADA_</div>
            )}
            <div className="actions">
              <button type="button" className="btn" onClick={() => dispatch({ type: "restart" })}>
                JUGAR DE NUEVO
              </button>
              <Link href="/games" className="btn magenta">
                VOLVER AL VAULT
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
