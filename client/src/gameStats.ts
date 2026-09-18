import type { ClientGameState } from '../../shared/protocol.js';

export function publicVictoryPoints(state: ClientGameState, playerId: string): number {
  let vp = 0;
  for (const b of Object.values(state.buildings)) {
    if (b.playerId !== playerId) continue;
    vp += b.type === 'city' ? 2 : 1;
  }
  if (state.longestRoad?.playerId === playerId) vp += 2;
  if (state.largestArmy?.playerId === playerId) vp += 2;
  return vp;
}
