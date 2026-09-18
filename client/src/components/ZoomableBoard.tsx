import { useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';

const MIN_SCALE = 1;
const MAX_SCALE = 3;
const SCALE_STEP = 0.5;

interface Point {
  x: number;
  y: number;
}

interface PinchStart {
  distance: number;
  scale: number;
  translate: Point;
}

interface PanStart {
  pointer: Point;
  translate: Point;
}

function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Wraps the board in a clipped, pinch-to-zoom + pan container using Pointer
 *  Events, so touch gestures on the board don't trigger the browser's own
 *  page-wide pinch-zoom (via `touchAction: 'none'` below) — only the map
 *  zooms, never the whole screen. Click/tap targets inside `children` are
 *  untouched: the zoom is a CSS transform on a wrapper, so the browser
 *  resolves hit-testing against the transformed geometry automatically. */
export function ZoomableBoard({ aspectRatio, children }: { aspectRatio: number; children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointers = useRef<Map<number, Point>>(new Map());
  const pinchStart = useRef<PinchStart | null>(null);
  const panStart = useRef<PanStart | null>(null);

  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState<Point>({ x: 0, y: 0 });

  function clampTranslate(next: Point, nextScale: number): Point {
    const el = containerRef.current;
    if (!el) return next;
    const { width, height } = el.getBoundingClientRect();
    const maxX = (width * (nextScale - 1)) / 2;
    const maxY = (height * (nextScale - 1)) / 2;
    return {
      x: Math.min(maxX, Math.max(-maxX, next.x)),
      y: Math.min(maxY, Math.max(-maxY, next.y)),
    };
  }

  // Capturing the pointer retargets its later `click` event to the
  // capturing element instead of whatever's visually underneath — great for
  // not losing a drag mid-gesture, terrible for a plain tap: it would
  // silently swallow every vertex/edge/tile click on the board. So only
  // capture once we're sure this pointer is actually part of a pinch/pan
  // gesture, never for a lone tap at the default (unzoomed) scale.
  function captureGesturePointer(e: ReactPointerEvent<HTMLDivElement>) {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Best-effort — e.g. a pointer id the browser doesn't consider
      // "active". Not load-bearing for the gesture math below.
    }
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2) {
      captureGesturePointer(e);
      const [a, b] = [...pointers.current.values()];
      pinchStart.current = { distance: distance(a, b), scale, translate };
      panStart.current = null;
    } else if (pointers.current.size === 1 && scale > 1) {
      captureGesturePointer(e);
      panStart.current = { pointer: { x: e.clientX, y: e.clientY }, translate };
    }
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinchStart.current) {
      const [a, b] = [...pointers.current.values()];
      const ratio = distance(a, b) / pinchStart.current.distance;
      const nextScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, pinchStart.current.scale * ratio));
      setScale(nextScale);
      setTranslate(clampTranslate(pinchStart.current.translate, nextScale));
    } else if (pointers.current.size === 1 && panStart.current) {
      const [p] = [...pointers.current.values()];
      const dx = p.x - panStart.current.pointer.x;
      const dy = p.y - panStart.current.pointer.y;
      setTranslate(clampTranslate({ x: panStart.current.translate.x + dx, y: panStart.current.translate.y + dy }, scale));
    }
  }

  function handlePointerUp(e: ReactPointerEvent<HTMLDivElement>) {
    pointers.current.delete(e.pointerId);
    pinchStart.current = null;
    panStart.current = pointers.current.size === 1 ? { pointer: [...pointers.current.values()][0], translate } : null;
  }

  function reset() {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }

  function adjustScale(delta: number) {
    setScale((s) => {
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, s + delta));
      setTranslate((t) => clampTranslate(t, next));
      return next;
    });
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        touchAction: 'none',
        width: '100%',
        aspectRatio: String(aspectRatio),
        maxHeight: '70vh',
        borderRadius: 8,
        background: 'var(--water)',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onDoubleClick={reset}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        {children}
      </div>

      <div style={{ position: 'absolute', bottom: 8, right: 8, display: 'flex', gap: 4 }}>
        <button type="button" style={zoomBtnStyle} onClick={() => adjustScale(-SCALE_STEP)} aria-label="Zoom out">
          −
        </button>
        <button type="button" style={zoomBtnStyle} onClick={reset} aria-label="Reset zoom">
          ⟲
        </button>
        <button type="button" style={zoomBtnStyle} onClick={() => adjustScale(SCALE_STEP)} aria-label="Zoom in">
          +
        </button>
      </div>
    </div>
  );
}

const zoomBtnStyle: React.CSSProperties = {
  width: 30,
  height: 30,
  borderRadius: 6,
  border: '1px solid var(--border)',
  background: 'var(--panel)',
  cursor: 'pointer',
  fontSize: 16,
  lineHeight: 1,
  padding: 0,
};
