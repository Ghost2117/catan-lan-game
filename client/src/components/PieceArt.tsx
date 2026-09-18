/** Small building icons for settlements/cities, in the same hand-drawn-SVG-
 *  primitive style as TileArt.tsx. Centered on (0,0); callers translate. */

export function SettlementIcon({ color }: { color: string }) {
  return (
    <g>
      <rect x={-9} y={-2} width={18} height={13} fill={color} stroke="#222" strokeWidth={1.5} />
      <polygon points="-11,-2 0,-15 11,-2" fill={color} stroke="#222" strokeWidth={1.5} strokeLinejoin="round" />
      <rect x={-3} y={4} width={6} height={7} fill="#222" opacity={0.4} />
    </g>
  );
}

export function CityIcon({ color }: { color: string }) {
  return (
    <g>
      {/* Shorter attached wing */}
      <rect x={-17} y={2} width={11} height={13} fill={color} stroke="#222" strokeWidth={1.5} />
      <polygon points="-18,2 -11.5,-6 -5,2" fill={color} stroke="#222" strokeWidth={1.5} strokeLinejoin="round" />
      {/* Taller main tower */}
      <rect x={-3} y={-9} width={16} height={24} fill={color} stroke="#222" strokeWidth={1.5} />
      <polygon points="-4,-9 5,-19 14,-9" fill={color} stroke="#222" strokeWidth={1.5} strokeLinejoin="round" />
      <rect x={1} y={-2} width={3} height={4} fill="#222" opacity={0.4} />
      <rect x={7} y={-2} width={3} height={4} fill="#222" opacity={0.4} />
      <rect x={2} y={7} width={6} height={8} fill="#222" opacity={0.4} />
    </g>
  );
}
