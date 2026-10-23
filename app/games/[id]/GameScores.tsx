'use client';

import { formatScoreDate, useLeaderboard } from '@/app/data/scores';

const TOP_N = 10;

export function ScoreStats({ gameId }: { gameId: string }) {
  const scores = useLeaderboard(gameId, TOP_N);
  const best = scores[0]?.score ?? 0;

  return (
    <>
      <div>
        <div className="l">Partidas</div>
        <div className="v">{scores.length > 0 ? scores.length : '-'}</div>
      </div>
      <div>
        <div className="l">Mejor global</div>
        <div
          className="v"
          style={{
            color: 'var(--magenta)',
            textShadow: '0 0 6px rgba(255,0,110,0.5)',
          }}
        >
          {best > 0 ? best.toLocaleString('es-ES') : '-'}
        </div>
      </div>
    </>
  );
}

export function Leaderboard({ gameId }: { gameId: string }) {
  const scores = useLeaderboard(gameId, TOP_N);

  return (
    <div className="leaderboard">
      <h3>MEJORES PUNTUACIONES</h3>
      {scores.length === 0 ? (
        <div
          style={{
            padding: '40px 0',
            textAlign: 'center',
            color: 'var(--ink-faint)',
          }}
        >
          <div
            className="pixel"
            style={{ fontSize: 12, color: 'var(--cyan)', marginBottom: 8 }}
          >
            SIN REGISTROS
          </div>
          <div style={{ fontSize: 13 }}>
            Sé el primero en entrar al salón de la fama
          </div>
        </div>
      ) : (
        scores.map((r, i) => (
          <div
            key={r.id}
            className={`lb-row${i === 0 ? ' top1' : i === 1 ? ' top2' : i === 2 ? ' top3' : ''}`}
          >
            <div className="rk">#{String(i + 1).padStart(2, '0')}</div>
            <div className="pl">
              {r.player_name}
              <div
                style={{
                  fontSize: 10,
                  color: 'var(--ink-faint)',
                  letterSpacing: '0.1em',
                }}
              >
                {formatScoreDate(r.created_at)}
              </div>
            </div>
            <div className="sc">{r.score.toLocaleString('es-ES')}</div>
          </div>
        ))
      )}
    </div>
  );
}
