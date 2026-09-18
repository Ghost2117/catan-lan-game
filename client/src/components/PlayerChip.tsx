import type { ClientGameState, ClientPlayerView } from '../../../shared/protocol.js';
import { PLAYER_COLOR_SWATCH } from '../boardColors.js';
import { publicVictoryPoints } from '../gameStats.js';

interface Props {
  state: ClientGameState;
  player: ClientPlayerView;
  isCurrent: boolean;
  layout: 'row' | 'column';
}

export function PlayerChip({ state, player, isCurrent, layout }: Props) {
  const swatch = PLAYER_COLOR_SWATCH[player.color] ?? player.color;
  const isColumn = layout === 'column';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: isColumn ? 'flex-start' : 'center',
        flexDirection: isColumn ? 'column' : 'row',
        gap: isColumn ? 4 : 7,
        padding: isColumn ? '10px 12px' : '7px 12px',
        borderRadius: 10,
        border: isCurrent ? `2px solid ${swatch}` : '1px solid var(--border)',
        background: isCurrent ? 'var(--accent-light)' : 'var(--panel)',
        boxShadow: isCurrent ? '0 1px 4px rgba(0,0,0,0.08)' : undefined,
        opacity: player.connected ? 1 : 0.5,
        transition: 'background 0.2s, border 0.2s',
        width: isColumn ? '100%' : undefined,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        {isCurrent && <span aria-hidden>▶</span>}
        <span
          style={{
            width: 13,
            height: 13,
            borderRadius: '50%',
            background: swatch,
            display: 'inline-block',
            border: '1px solid #333',
            flexShrink: 0,
          }}
        />
        <strong style={{ fontSize: 13 }}>
          {player.name}
          {player.isSelf ? ' (you)' : ''}
        </strong>
        {!player.connected && <span style={{ fontSize: 11, color: '#a00' }}>offline</span>}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: isColumn ? 8 : 7, alignItems: 'center' }}>
        <span style={statStyle} title="Victory points">
          🏆 {publicVictoryPoints(state, player.id)}
        </span>
        <span style={statStyle} title="Resource cards in hand">
          🎴 {player.resourceCount}
        </span>
        <span style={statStyle} title="Development cards">
          🃏 {player.devCardCount}
        </span>
        {state.longestRoad?.playerId === player.id && <span title="Longest Road">🛣️</span>}
        {state.largestArmy?.playerId === player.id && <span title="Largest Army">⚔️</span>}
      </div>
    </div>
  );
}

const statStyle: React.CSSProperties = { fontSize: 12, color: 'var(--text-muted)' };
