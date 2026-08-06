"use client";

import { useEffect, useMemo, useRef, useState } from 'react';

import type { GameWord } from '../../types/game';
import { shuffleArray } from '../../utils/shuffleArray';

import { WordCard } from './WordCard';

const EDGE_PADDING = 12; // margen contra los bordes del tablero
const COLLISION_GAP = 4; // separación mínima visible entre tarjetas
const MIN_SPEED = 63; // px/s
const MAX_SPEED = 108; // px/s — velocidad media, legible
const MAX_DELTA = 0.032; // segundos: evita saltos grandes si la pestaña se congela

type WordGridProps = {
  words: GameWord[];
  selectedWordIds: string[];
  wrongWordId: string | null;
  categoryColor: string;
  categoryImage: string;
  gameKey: number;
  onSelectWord: (word: GameWord) => void;
};

// Cada tarjeta es un rectángulo con posición (esquina sup. izq.) y velocidad.
type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
};

// La casilla mantiene la proporción del banner (~4.11:1). El alto lo deriva el CSS
// (aspect-ratio) a partir de este ancho; aquí solo damos ancho suficiente para que el
// texto quepa en el ~60% izquierdo (el resto lo ocupa la imagen decorativa de la derecha).
function estimateWidth(name: string) {
  return Math.round(clamp((name.length * 8 + 26) / 0.62, 150, 250));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function rectsOverlap(a: Particle, x: number, y: number, width: number, height: number, gap: number) {
  return a.x < x + width + gap && a.x + a.width + gap > x && a.y < y + height + gap && a.y + a.height + gap > y;
}

function findFreePosition(
  placed: Particle[],
  width: number,
  height: number,
  boardWidth: number,
  boardHeight: number,
  index: number,
  total: number
) {
  const maxX = Math.max(EDGE_PADDING, boardWidth - width - EDGE_PADDING);
  const maxY = Math.max(EDGE_PADDING, boardHeight - height - EDGE_PADDING);

  for (let attempt = 0; attempt < 250; attempt += 1) {
    const x = EDGE_PADDING + Math.random() * (maxX - EDGE_PADDING);
    const y = EDGE_PADDING + Math.random() * (maxY - EDGE_PADDING);

    if (!placed.some((p) => rectsOverlap(p, x, y, width, height, COLLISION_GAP))) {
      return { x, y };
    }
  }

  // Fallback: rejilla, por si no cabe un hueco aleatorio libre.
  const columns = Math.ceil(Math.sqrt(total));
  const rows = Math.ceil(total / columns);
  const column = index % columns;
  const row = Math.floor(index / columns);
  const cellWidth = boardWidth / columns;
  const cellHeight = boardHeight / Math.max(1, rows);

  return {
    x: clamp(column * cellWidth + (cellWidth - width) / 2, EDGE_PADDING, maxX),
    y: clamp(row * cellHeight + (cellHeight - height) / 2, EDGE_PADDING, maxY)
  };
}

export function WordGrid({
  words,
  selectedWordIds,
  wrongWordId,
  categoryColor,
  categoryImage,
  gameKey,
  onSelectWord
}: WordGridProps) {
  const shuffledWords = useMemo(() => shuffleArray(words), [words, gameKey]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const particlesRef = useRef<Particle[]>([]);
  const boardRef = useRef({ width: 0, height: 0 });
  const [ready, setReady] = useState(false);

  nodeRefs.current.length = shuffledWords.length;

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const measureBoard = () => {
      const rect = container.getBoundingClientRect();
      boardRef.current = { width: Math.round(rect.width), height: Math.round(rect.height) };
    };

    measureBoard();

    // Inicializa las partículas usando el tamaño real de cada tarjeta (así la
    // colisión coincide exactamente con lo que se ve y nunca se superponen).
    const particles: Particle[] = [];

    nodeRefs.current.forEach((node) => {
      if (!node) {
        return;
      }

      const width = node.offsetWidth;
      const height = node.offsetHeight;
      const { x, y } = findFreePosition(
        particles,
        width,
        height,
        boardRef.current.width,
        boardRef.current.height,
        particles.length,
        shuffledWords.length
      );

      const angle = Math.random() * Math.PI * 2;
      const speed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);

      particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, width, height });
    });

    particlesRef.current = particles;

    const writePositions = () => {
      const current = particlesRef.current;

      for (let i = 0; i < current.length; i += 1) {
        const node = nodeRefs.current[i];

        if (node) {
          node.style.transform = `translate3d(${current[i].x.toFixed(2)}px, ${current[i].y.toFixed(2)}px, 0)`;
        }
      }
    };

    writePositions();
    setReady(true);

    const handleResize = () => {
      measureBoard();
      const { width, height } = boardRef.current;

      particlesRef.current.forEach((p) => {
        p.x = clamp(p.x, EDGE_PADDING, Math.max(EDGE_PADDING, width - p.width - EDGE_PADDING));
        p.y = clamp(p.y, EDGE_PADDING, Math.max(EDGE_PADDING, height - p.height - EDGE_PADDING));
      });
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(container);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const simulate = (dt: number) => {
      const { width, height } = boardRef.current;
      const ps = particlesRef.current;

      // 1. Mover y rebotar contra los bordes.
      for (const p of ps) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        const maxX = Math.max(EDGE_PADDING, width - p.width - EDGE_PADDING);
        const maxY = Math.max(EDGE_PADDING, height - p.height - EDGE_PADDING);

        if (p.x < EDGE_PADDING) {
          p.x = EDGE_PADDING;
          p.vx = Math.abs(p.vx);
        } else if (p.x > maxX) {
          p.x = maxX;
          p.vx = -Math.abs(p.vx);
        }

        if (p.y < EDGE_PADDING) {
          p.y = EDGE_PADDING;
          p.vy = Math.abs(p.vy);
        } else if (p.y > maxY) {
          p.y = maxY;
          p.vy = -Math.abs(p.vy);
        }
      }

      // 2. Resolver choques entre tarjetas (2 iteraciones para estabilidad).
      for (let iteration = 0; iteration < 2; iteration += 1) {
        for (let i = 0; i < ps.length; i += 1) {
          for (let j = i + 1; j < ps.length; j += 1) {
            const a = ps[i];
            const b = ps[j];

            const overlapX = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
            const overlapY = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);

            if (overlapX <= 0 || overlapY <= 0) {
              continue;
            }

            // Separar por el eje de menor penetración e intercambiar la velocidad
            // en ese eje (choque elástico de masas iguales).
            if (overlapX < overlapY) {
              const push = overlapX / 2 + 0.5;

              if (a.x + a.width / 2 < b.x + b.width / 2) {
                a.x -= push;
                b.x += push;
              } else {
                a.x += push;
                b.x -= push;
              }

              const swap = a.vx;
              a.vx = b.vx;
              b.vx = swap;
            } else {
              const push = overlapY / 2 + 0.5;

              if (a.y + a.height / 2 < b.y + b.height / 2) {
                a.y -= push;
                b.y += push;
              } else {
                a.y += push;
                b.y -= push;
              }

              const swap = a.vy;
              a.vy = b.vy;
              b.vy = swap;
            }
          }
        }
      }

      // 3. Volver a encajar dentro del tablero tras las separaciones.
      for (const p of ps) {
        p.x = clamp(p.x, EDGE_PADDING, Math.max(EDGE_PADDING, width - p.width - EDGE_PADDING));
        p.y = clamp(p.y, EDGE_PADDING, Math.max(EDGE_PADDING, height - p.height - EDGE_PADDING));
      }
    };

    let frameId = 0;
    let lastTime = 0;

    const step = (time: number) => {
      const dt = lastTime ? Math.min(MAX_DELTA, (time - lastTime) / 1000) : 0;
      lastTime = time;

      if (!prefersReducedMotion && dt > 0) {
        simulate(dt);
      }

      writePositions();
      frameId = window.requestAnimationFrame(step);
    };

    frameId = window.requestAnimationFrame(step);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frameId);
    };
  }, [shuffledWords]);

  return (
    <section className="word-grid-panel panel" aria-label="Sopa de palabras">
      <div
        ref={containerRef}
        className={`word-grid word-grid--floating transition-opacity duration-300 ${ready ? 'opacity-100' : 'opacity-0'}`}
      >
        {shuffledWords.map((word, index) => (
          <WordCard
            key={word.id}
            word={word}
            found={selectedWordIds.includes(word.id)}
            wrong={wrongWordId === word.id}
            categoryColor={categoryColor}
            foundImage={categoryImage}
            width={estimateWidth(word.name)}
            cardRef={(element) => {
              nodeRefs.current[index] = element;
            }}
            onSelect={onSelectWord}
          />
        ))}
      </div>
    </section>
  );
}
