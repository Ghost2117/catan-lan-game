// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { PlayerChip } from '../components/PlayerChip.js';
import { finishSetup, makeServerGame, toClientGameState } from './fixtures.js';

afterEach(cleanup);

describe('PlayerChip: longest road / largest army awards', () => {
  it('shows a Longest Road badge with its length when this player holds it', () => {
    const server = finishSetup(makeServerGame(4, 1));
    const holder = server.players[0];
    const awarded = { ...server, longestRoad: { playerId: holder.id, length: 6 } };
    const state = toClientGameState(awarded, holder.id);
    const player = state.players.find((p) => p.id === holder.id)!;

    render(<PlayerChip state={state} player={player} isCurrent={false} layout="row" />);
    expect(screen.getByTitle(/Longest Road — 6 roads/)).toHaveTextContent('🛣️ 6');
  });

  it('shows a Largest Army badge with its count when this player holds it', () => {
    const server = finishSetup(makeServerGame(4, 2));
    const holder = server.players[0];
    const awarded = { ...server, largestArmy: { playerId: holder.id, count: 4 } };
    const state = toClientGameState(awarded, holder.id);
    const player = state.players.find((p) => p.id === holder.id)!;

    render(<PlayerChip state={state} player={player} isCurrent={false} layout="row" />);
    expect(screen.getByTitle(/Largest Army — 4 knights/)).toHaveTextContent('⚔️ 4');
  });

  it('shows neither badge for a player who holds neither award', () => {
    const server = finishSetup(makeServerGame(4, 3));
    const [holder, other] = server.players;
    const awarded = {
      ...server,
      longestRoad: { playerId: holder.id, length: 5 },
      largestArmy: { playerId: holder.id, count: 3 },
    };
    const state = toClientGameState(awarded, other.id);
    const player = state.players.find((p) => p.id === other.id)!;

    render(<PlayerChip state={state} player={player} isCurrent={false} layout="row" />);
    expect(screen.queryByTitle(/Longest Road/)).toBeNull();
    expect(screen.queryByTitle(/Largest Army/)).toBeNull();
  });
});
