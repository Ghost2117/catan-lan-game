import type { ClientGameState } from '../../../shared/protocol.js';
import { PlayerChip } from './PlayerChip.js';

/** Wide-layout-only sidebar (hidden below the 1100px breakpoint in
 *  styles.css, where PlayerDock covers the same ground horizontally). */
export function OpponentsPanel({ state }: { state: ClientGameState }) {
  const others = state.players.filter((p) => !p.isSelf);
  if (others.length === 0) return null;

  return (
    <div className="opponents-panel">
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
        Other Players
      </div>
      {state.players.map((p, i) => {
        if (p.isSelf) return null;
        const isCurrent = i === state.currentPlayerIndex && state.phase !== 'gameOver';
        return <PlayerChip key={p.id} state={state} player={p} isCurrent={isCurrent} layout="column" />;
      })}
    </div>
  );
}
