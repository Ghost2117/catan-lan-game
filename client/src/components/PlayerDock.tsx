import type { ClientGameState } from '../../../shared/protocol.js';
import { PlayerChip } from './PlayerChip.js';

export function PlayerDock({ state }: { state: ClientGameState }) {
  return (
    <div className="player-dock">
      {state.players.map((p, i) => {
        const isCurrent = i === state.currentPlayerIndex && state.phase !== 'gameOver';
        return <PlayerChip key={p.id} state={state} player={p} isCurrent={isCurrent} layout="row" />;
      })}
    </div>
  );
}
