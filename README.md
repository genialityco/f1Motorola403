# Sopa de Palabras

Juego interactivo construido con **Next.js (App Router)**, **React** y **TypeScript**.

## Requisitos

- Node.js 20 o superior
- npm

## Instalación

```bash
npm install
```

## Desarrollo local

```bash
npm run dev
```

## Compilación de producción

```bash
npm run build
```

## Pruebas

```bash
npm test
```

## Estructura principal

- `src/app/` — layout global y página principal.
- `src/components/game/` — pantallas, tarjetas, cuadrícula y modal.
- `src/components/layout/` — header, fondo de video y componente multimedia reutilizable.
- `src/data/game-data.json` — configuración completa del juego.
- `src/types/game.ts` — tipos e interfaces.
- `src/utils/` — utilidades puras y comprobables.
- `public/assets/` — recursos visuales placeholder.

## Dónde cambiar el contenido

### Categorías

Edita `src/data/game-data.json` en la sección `categories`.

### Palabras

Edita `src/data/game-data.json` en la sección `words`.

### Imágenes de header, intro, categorías y resultados

Edita las rutas dentro de `src/data/game-data.json`.

### GIF o video del botón Comenzar

Edita la sección `startButton` en `src/data/game-data.json`.

### Video de fondo

Edita `layout.backgroundVideo` en `src/data/game-data.json`.

> El archivo `public/assets/videos/background.mp4` es un placeholder de texto para reservar la ruta esperada. Sustitúyelo por un MP4 o WebM real cuando tengas el recurso final.

### Duración del cronómetro

Edita `timer.durationMilliseconds` en `src/data/game-data.json`.

### Mensajes de victoria y derrota

Edita la sección `result` en `src/data/game-data.json`.

## Notas de implementación

- El juego usa `performance.now()` y `requestAnimationFrame()` para el cronómetro.
- La cuadrícula muestra palabras completas, no letras individuales.
- Las palabras se mezclan en cada partida.
- Las selecciones correctas no se cuentan dos veces.
- El modal final bloquea interacción y soporta teclado.

## Reemplazo de placeholders

Todos los recursos visuales están en `public/assets/`.

Cuando tengas arte final, puedes reemplazar los SVG placeholder por PNG, GIF, MP4 o WebM reales manteniendo las rutas definidas en `game-data.json`.
