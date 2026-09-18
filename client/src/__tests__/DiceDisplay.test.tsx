// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DiceDisplay } from '../components/DiceDisplay.js';
import { finishSetup, makeServerGame, toClientGameState } from './fixtures.js';

afterEach(cleanup);

describe('DiceDisplay', () => {
  it('lets the current player roll, and dispatches ROLL_DICE when clicked', () => {
    const server = finishSetup(makeServerGame(4, 1));
    const selfId = server.players[server.currentPlayerIndex].id;
    const state = toClientGameState(server, selfId);
    const dispatch = vi.fn();
    render(<DiceDisplay state={state} selfId={selfId} dispatch={dispatch} />);

    const btn = screen.getByRole('button');
    expect(btn).not.toBeDisabled();
    fireEvent.click(btn);
    expect(dispatch).toHaveBeenCalledWith({ type: 'ROLL_DICE' });
  });

  it('disables rolling, and never dispatches, for a player whose turn it is not', () => {
    const server = finishSetup(makeServerGame(4, 2));
    const notCurrent = server.players.find((_, i) => i !== server.currentPlayerIndex)!;
    const state = toClientGameState(server, notCurrent.id);
    const dispatch = vi.fn();
    render(<DiceDisplay state={state} selfId={notCurrent.id} dispatch={dispatch} />);

    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('shows the rolled total once the dice have a value', () => {
    const server = finishSetup(makeServerGame(4, 3));
    const selfId = server.players[server.currentPlayerIndex].id;
    const rolled = { ...server, phase: 'main' as const, dice: [3, 5] as [number, number] };
    const state = toClientGameState(rolled, selfId);
    render(<DiceDisplay state={state} selfId={selfId} dispatch={vi.fn()} />);

    expect(screen.getByText('= 8')).toBeInTheDocument();
  });

  it('renders nothing during the setup phase', () => {
    const server = makeServerGame(4, 4); // never advanced past 'setup'
    const selfId = server.players[0].id;
    const state = toClientGameState(server, selfId);
    const { container } = render(<DiceDisplay state={state} selfId={selfId} dispatch={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });
});
