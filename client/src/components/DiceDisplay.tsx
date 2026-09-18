import { useEffect, useRef, useState } from 'react';
import type { Action } from '../../../shared/actions.js';
import type { ClientGameState } from '../../../shared/protocol.js';
import { DiceFace } from './DiceIcon.js';

interface Props {
  state: ClientGameState;
  selfId: string;
  dispatch: (action: Action) => void;
}

function randomDie(): number {
  return 1 + Math.floor(Math.random() * 6);
}

/** Prominent, always-visible (once the game leaves setup) dice display —
 *  doubles as the roll button when it's your turn. Everyone sees the same
 *  brief "shuffle" before it settles on the real result, since the roll
 *  itself is shared game state, not a private action. */
export function DiceDisplay({ state, selfId, dispatch }: Props) {
  const [shownDice, setShownDice] = useState<[number, number] | null>(state.dice);
  const lastSeenDice = useRef<[number, number] | null>(state.dice);
  const [shuffling, setShuffling] = useState(false);

  useEffect(() => {
    const prev = lastSeenDice.current;
    const next = state.dice;
    const isNewRoll = next && (!prev || prev[0] !== next[0] || prev[1] !== next[1]);
    lastSeenDice.current = next;

    if (!isNewRoll) {
      setShownDice(next);
      return;
    }

    setShuffling(true);
    let ticks = 0;
    const id = setInterval(() => {
      ticks += 1;
      if (ticks >= 6) {
        clearInterval(id);
        setShownDice(next);
        setShuffling(false);
      } else {
        setShownDice([randomDie(), randomDie()]);
      }
    }, 60);
    return () => clearInterval(id);
  }, [state.dice]);

  if (state.phase === 'setup' || state.phase === 'lobby') return null;

  const isMyTurn = state.players[state.currentPlayerIndex]?.id === selfId;
  const canRoll = isMyTurn && state.phase === 'roll';
  const total = shownDice ? shownDice[0] + shownDice[1] : null;

  return (
    <div style={containerStyle}>
      <button
        type="button"
        onClick={() => canRoll && dispatch({ type: 'ROLL_DICE' })}
        disabled={!canRoll}
        style={{
          ...buttonStyle,
          cursor: canRoll ? 'pointer' : 'default',
          border: canRoll ? '2px solid var(--accent)' : '2px solid transparent',
          boxShadow: canRoll ? '0 0 0 3px var(--accent-light)' : undefined,
        }}
        title={canRoll ? 'Click to roll the dice' : undefined}
      >
        <div style={{ display: 'flex', gap: 8, transform: shuffling ? 'rotate(-3deg)' : undefined, transition: 'transform 60ms' }}>
          <DiceFace value={shownDice ? shownDice[0] : null} />
          <DiceFace value={shownDice ? shownDice[1] : null} />
        </div>
        <div style={labelStyle}>
          {total !== null ? (
            <span style={totalStyle}>= {total}</span>
          ) : canRoll ? (
            <span>👉 Click to roll</span>
          ) : (
            <span>Waiting to roll…</span>
          )}
        </div>
      </button>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  padding: '4px 0',
};

const buttonStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 6,
  padding: '10px 20px',
  borderRadius: 12,
  background: 'var(--panel)',
  fontFamily: 'inherit',
};

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  color: 'var(--text-muted)',
  fontWeight: 600,
};

const totalStyle: React.CSSProperties = {
  fontSize: 16,
  color: 'var(--text)',
  fontWeight: 800,
};
