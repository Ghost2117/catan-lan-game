/** A single die face, drawn with real pips (not a generic 🎲 emoji) so it
 *  can actually show the rolled value. `value` of null renders a blank
 *  "not rolled yet" face. Fixed internal viewBox — `size` only scales the
 *  rendered box, not the pip math. */

const PIP_LAYOUTS: Record<number, Array<[number, number]>> = {
  1: [[0, 0]],
  2: [[-24, -24], [24, 24]],
  3: [[-24, -24], [0, 0], [24, 24]],
  4: [
    [-24, -24],
    [24, -24],
    [-24, 24],
    [24, 24],
  ],
  5: [
    [-24, -24],
    [24, -24],
    [0, 0],
    [-24, 24],
    [24, 24],
  ],
  6: [
    [-24, -24],
    [24, -24],
    [-24, 0],
    [24, 0],
    [-24, 24],
    [24, 24],
  ],
};

export function DiceFace({ value, size = 48 }: { value: number | null; size?: number }) {
  const pips = value !== null && value >= 1 && value <= 6 ? PIP_LAYOUTS[value] : [];
  return (
    <svg width={size} height={size} viewBox="-50 -50 100 100" style={{ display: 'block', flexShrink: 0 }}>
      <rect x={-46} y={-46} width={92} height={92} rx={16} fill="#fdfaf3" stroke="#2a2a2a" strokeWidth={4} />
      {pips.length > 0 ? (
        pips.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={8.5} fill="#2a2a2a" />)
      ) : (
        <text x={0} y={13} textAnchor="middle" fontSize={40} fontWeight={700} fill="#d8d1ba">
          ?
        </text>
      )}
    </svg>
  );
}
