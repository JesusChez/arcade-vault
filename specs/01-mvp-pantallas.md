# SPEC 01 — MVP: pantallas de Arcade Vault

> **Estado:** Aprobado
> **Depende de:** —
> **Fecha:** 2026-10-12
> **Objetivo:** Implementar en Next.js App Router las cinco pantallas del prototipo de `references/templates/` (Biblioteca, Detalle, Reproductor, Acceso y Salón de la Fama) con datos mock, sesión simulada y puntuaciones guardadas en localStorage.

## Por qué existe este spec

El prototipo de `references/templates/` es una SPA React + Babel con router por hash y todo en `window`.
Este spec lo convierte en la base real de la app: rutas de App Router, componentes TypeScript y una capa de datos mínima.
Los juegos jugables, la auth real y el backend quedan para specs posteriores.

**Referencia visual obligatoria:** cada pantalla debe reproducir el marcado y las clases de su plantilla:

| Pantalla | Plantilla |
| --- | --- |
| Navegación + footer | `references/templates/nav.jsx`, `references/templates/app.jsx` |
| Biblioteca | `references/templates/biblioteca.jsx` |
| Detalle | `references/templates/detalle.jsx` |
| Reproductor | `references/templates/reproductor.jsx` |
| Acceso | `references/templates/auth.jsx` |
| Salón de la Fama | `references/templates/salon.jsx` |
| Datos mock | `references/templates/data.jsx` |

Cuando este spec dice "como la plantilla", manda el fichero de esa tabla. Cuando el spec y la plantilla difieren, manda el spec.

## Alcance

**Dentro:**

- Rutas App Router:

  | Ruta | Pantalla |
  | --- | --- |
  | `/` | Biblioteca |
  | `/juegos/[id]` | Detalle del juego |
  | `/juegos/[id]/jugar` | Reproductor |
  | `/salon` (con `?juego=<id>` opcional) | Salón de la Fama |
  | `/acceso` | Iniciar sesión / Crear cuenta |
  | cualquier otra, o `[id]` inexistente | 404 retro (`app/not-found.tsx`) |

- Navegación superior y panel móvil como `nav.jsx`, con enlaces reales (`next/link`) y estado activo según `usePathname()`:
  - "Biblioteca" activo en `/` y en `/juegos/*`.
  - "Salón de la Fama" activo en `/salon`.
  - En el panel móvil, el enlace a `/acceso` ("Iniciar Sesión" o "Cuenta" si hay sesión) activo en `/acceso`.
  - Pulsar el logo lleva a `/`. El panel móvil se cierra al navegar o al pulsar el fondo.
- Menú de usuario: con sesión, el botón `NOMBRE ▾` abre un desplegable con una única opción `CERRAR SESIÓN`. Se cierra al pulsar fuera, al pulsar Esc o al elegir la opción. Cerrar sesión borra el usuario y deja al usuario en la página actual. Sin sesión, el botón `Iniciar Sesión` enlaza a `/acceso`.
- Footer como `app.jsx`: `© 2026 ARCADE VAULT · HECHO CON PIXELES Y NEÓN · v2.6.0`.
- **Biblioteca** como `biblioteca.jsx`: hero, buscador por título (sin distinguir mayúsculas), chips de categoría (`TODOS` + las de `CATEGORIES`), rejilla de tarjetas con efecto tilt al mover el ratón, estado vacío "NO HAY RESULTADOS". Pulsar la tarjeta o `JUGAR` lleva a `/juegos/[id]`.
- **Detalle** como `detalle.jsx`: portada, etiquetas, título, descripción larga, tira de stats, botones `▶ JUGAR AHORA` (→ `/juegos/[id]/jugar`) y `VOLVER AL VAULT` (→ `/`), y ranking lateral con las 10 primeras filas del ranking combinado del juego.
- **Reproductor** como `reproductor.jsx`: HUD (jugador, puntuación, vidas, nivel), puntuación simulada por temporizador, `PAUSA`/`REANUDAR` con capa "EN PAUSA", `FIN` abre el modal de fin de juego, `SALIR` → `/juegos/[id]`. Escena animada (`game-arena`, enemigos, nave) y barra CRT inferior como la plantilla.
- Modal de fin de juego: puntuación final, campo de iniciales y `GUARDAR PUNTUACIÓN`, mensaje `▸ PUNTUACIÓN GUARDADA_` tras guardar, `JUGAR DE NUEVO` (reinicia el estado) y `VOLVER AL VAULT` (→ `/`).
- **Acceso** como `auth.jsx`: pestañas `INICIAR SESIÓN` / `CREAR CUENTA` (esta añade el campo de correo), envío del formulario, `JUGAR COMO INVITADO`, divisor y botones sociales, texto legal.
- **Salón de la Fama** como `salon.jsx`: chips de un juego por pestaña, podio (2º, 1º, 3º), tabla con las 12 primeras filas del ranking combinado, bloque "TU MEJOR MARCA" con sesión, y botón `VOLVER A LA BIBLIOTECA` (→ `/`).
- Persistencia en localStorage de la sesión simulada y de las puntuaciones guardadas.
- Rankings combinados: puntuaciones semilla + puntuaciones guardadas, una fila por jugador con su mejor marca.
- Página 404 retro (`app/not-found.tsx`) con el estilo arcade y un botón de vuelta a la Biblioteca.
- `metadata` por página (título y descripción en español). En `/juegos/[id]` y `/juegos/[id]/jugar`, título con el nombre del juego vía `generateMetadata`.
- Sustituir el contenido del scaffold de `app/page.tsx` por la Biblioteca.

**Elementos decorativos sin funcionalidad (se pintan como la plantilla y no hacen nada más):**

- Contador `CRÉDITOS · 03` (nav y panel móvil): valor fijo.
- Botones `◆ GOOGLE` y `▣ GITHUB` de Acceso: sin acción (`type="button"`).
- Stats del Detalle: dificultad `★ ★ ★ ☆ ☆` y etiquetas `1 JUGADOR`, `TECLADO / TÁCTIL`, `RETRO 1985` iguales para todos los juegos. "Partidas" muestra el campo fijo `plays` del juego.

**Fuera de alcance (para futuros specs):**

- Juegos jugables reales (canvas, controles, colisiones). El Reproductor solo simula.
- Autenticación real: proveedor, contraseñas, validación de correo, login social.
- Backend, base de datos o API. Las puntuaciones solo viven en el navegador.
- Pantalla de perfil o "Mis puntuaciones".
- Lógica de créditos.
- Tests automatizados y test runner (Vitest, Playwright).
- Reescribir los estilos en utilidades de Tailwind.
- Limpiar los assets del scaffold en `public/`.

## Modelo de datos

```ts
// lib/games.ts
export type Category = "ARCADE" | "PUZZLE" | "SHOOTER" | "VERSUS";
export type GameColor = "cyan" | "magenta" | "yellow" | "green";

export type Game = {
  id: string;        // slug, e.g. "bloque-buster"
  title: string;
  short: string;
  long: string;
  category: Category;
  cover: string;     // CSS class, e.g. "cover-bricks"
  color: GameColor;  // picks the JUGAR button variant
  plays: string;     // fixed display value, e.g. "12.4K"
};

export const GAMES: Game[];                              // the 8 games from data.jsx, same ids/texts/covers/colors/plays
export const CATEGORIES: ("TODOS" | Category)[];         // ["TODOS", "ARCADE", "PUZZLE", "SHOOTER", "VERSUS"]
export function getGame(id: string): Game | undefined;
```

- El campo `best` de `data.jsx` **desaparece**. La mejor puntuación se calcula del ranking combinado.
- Los textos de los 8 juegos se copian literalmente de `data.jsx`.

```ts
// lib/scores.ts
export type SavedScore = {
  game: string;   // Game.id
  name: string;   // 1–10 chars, uppercase
  score: number;
  at: number;     // Date.now() when saved
};

export type LeaderboardRow = {
  rank: number;   // 1-based, after sorting
  name: string;
  score: number;
  date: string;   // "dd/mm/yyyy"
};

export function seededScores(gameId: string): LeaderboardRow[];                          // always 12 rows per game
export function buildLeaderboard(gameId: string, saved: SavedScore[]): LeaderboardRow[]; // full combined list
export function formatScore(n: number): string;                                          // n.toLocaleString("es-ES")
```

Reglas de los rankings:

- `seededScores` reutiliza el algoritmo y la lista `PLAYERS` de `data.jsx`. Diferencia: la semilla se deriva de un hash de **todo** el `id` (no de su longitud), para que dos juegos con ids de igual longitud (`caida` y `rocas`) no compartan ranking.
- Hay **un único ranking semilla por juego**: Detalle y Salón usan el mismo (la plantilla usaba dos semillas distintas).
- `buildLeaderboard` combina las 12 filas semilla con las `SavedScore` de ese juego. Deja una fila por `name` (su puntuación máxima; si empata, la fecha más antigua). Ordena por `score` descendente y recalcula `rank`.
- La fecha de una `SavedScore` es `at` formateada como `dd/mm/yyyy`.
- Detalle muestra las 10 primeras filas. El Salón muestra las 12 primeras (podio = filas 1–3).
- "MEJOR PUNTUACIÓN" (tarjeta) y "Mejor global" (Detalle) = `score` de la fila 1 del ranking combinado.

```ts
// lib/storage.ts — localStorage, client only
export const USER_KEY = "av:user:v1";     // JSON: { name: string } | absent
export const SCORES_KEY = "av:scores:v1"; // JSON: SavedScore[] | absent

export type User = { name: string };
```

- Funciones de lectura/escritura: leer usuario, guardar usuario, borrar usuario, leer puntuaciones, añadir puntuación.
- Si el JSON es inválido o tiene otra forma, se trata como ausente (sin usuario, lista vacía). Nunca lanza.
- Si localStorage no está disponible (lanza), las lecturas devuelven ausente y las escrituras se ignoran sin romper la UI.
- Los componentes se suscriben a estos datos con `useSyncExternalStore` (hooks `useUser()` y `useSavedScores()`), para que nav, rankings y menú se actualicen en el acto tras login, logout o guardado. El snapshot del servidor es "sin usuario" y "lista vacía".

Reglas de la sesión simulada (Acceso):

- Enviar el formulario (cualquier pestaña) guarda `{ name: (usuario || "PLAYER1").toUpperCase().slice(0, 10) }` y navega a `/`.
- Correo y contraseña no se validan ni se guardan.
- `JUGAR COMO INVITADO` borra el usuario y navega a `/`.
- Con sesión, `/acceso` muestra el mismo formulario (como la plantilla).

Reglas del guardado (modal de fin de juego):

- El campo de iniciales parte del nombre del usuario con sesión, o de `INVITADO` sin sesión.
- Al escribir se pasa a mayúsculas y se corta a 10 caracteres.
- `GUARDAR PUNTUACIÓN` está deshabilitado si el nombre, tras `trim()`, está vacío.
- Guardar añade `{ game, name: name.trim(), score, at: Date.now() }` a `av:scores:v1`. Solo se puede guardar una vez por partida. `JUGAR DE NUEVO` permite guardar la siguiente.

Reglas de "TU MEJOR MARCA" (Salón, solo con sesión):

- Se busca la fila del ranking combinado completo (no solo el top 12) cuyo `name` coincide con `user.name`.
- Si existe: fila `.tr.you` con su rango real, nombre, puntuación y fecha.
- Si no existe: fila `.tr.you` con el texto `SIN MARCA · JUEGA YA`, que enlaza a `/juegos/[id]/jugar` del juego activo.

Convenciones:

- Código, identificadores y comentarios en inglés. Textos de la UI en español, literales de las plantillas.
- Números con `toLocaleString("es-ES")`.

## Plan de implementación

1. **Datos.** Crear `lib/games.ts` y `lib/scores.ts` según el modelo de datos. Sin UI todavía. Comprobación: `npm run lint` y `npx tsc --noEmit` pasan.
2. **Persistencia.** Crear `lib/storage.ts` con las claves, lecturas/escrituras tolerantes a errores y los hooks `useUser()` / `useSavedScores()` (en `lib/` o `hooks/`, ficheros cliente con `"use client"`).
3. **Layout y navegación.** Crear `components/Nav.tsx` (cliente: nav, panel móvil, menú de usuario) y `components/Footer.tsx`. Montarlos en `app/layout.tsx` alrededor de `<main className="av-main">{children}</main>`, dentro del `.av-root` existente. Añadir a `app/globals.css` los estilos del desplegable de usuario (no existen), con los tokens y la estética de `.btn.ghost`. Comprobación: `npm run dev`, la nav se ve en `/`.
4. **Biblioteca.** Sustituir `app/page.tsx` por la Biblioteca: página servidor con el hero y un componente cliente `components/Library.tsx` (búsqueda + chips + rejilla) que usa `components/GameCard.tsx` (cliente: tilt y mejor puntuación combinada).
5. **Detalle.** Crear `app/juegos/[id]/page.tsx` con `generateStaticParams` (los 8 ids), `generateMetadata` y `notFound()` si el id no existe. El ranking lateral y "Mejor global" van en un componente cliente (`components/GameLeaderboard.tsx` o similar) porque dependen de localStorage.
6. **404.** Crear `app/not-found.tsx` con estilo arcade (clases existentes: `pixel`, `neon-magenta`, `btn`) y un enlace a `/`.
7. **Reproductor.** Crear `app/juegos/[id]/jugar/page.tsx` (con `generateStaticParams`, `generateMetadata` y `notFound()`) y `components/GamePlayer.tsx` (cliente): HUD, simulación, pausa, fin y escena, como `reproductor.jsx`.
8. **Modal de fin de juego.** Añadir a `GamePlayer` el modal con las reglas de guardado. Comprobación: guardar una puntuación alta y verla en el ranking del Detalle.
9. **Acceso.** Crear `app/acceso/page.tsx` y `components/AuthForm.tsx` (cliente) con las reglas de la sesión simulada.
10. **Salón de la Fama.** Crear `app/salon/page.tsx` y `components/HallOfFame.tsx` (cliente). La pestaña activa sale de `?juego=<id>` (`useSearchParams`); sin parámetro o con id inválido, el primer juego de `GAMES`. Cambiar de pestaña hace `router.replace("/salon?juego=<id>", { scroll: false })`. El componente que usa `useSearchParams` va envuelto en `<Suspense>` (requisito de `cacheComponents`).
11. **Metadatos y limpieza.** `metadata` en `/`, `/salon` y `/acceso`. Comprobar que no quedan referencias al scaffold en `app/` (`next/image` con `next.svg`, clases `bg-zinc-*`).

Notas técnicas para todo el plan:

- Next.js 16 con `cacheComponents: true`: leer `node_modules/next/dist/docs/` antes de usar `params`, `searchParams`, `generateStaticParams` o `useSearchParams` (ver `AGENTS.md`). `generateStaticParams` debe devolver al menos un elemento.
- Las páginas son componentes servidor siempre que se pueda. Solo son cliente los componentes que usan estado, eventos, localStorage o hooks de navegación.
- Los `style={{...}}` inline de las plantillas pueden quedarse inline o pasar a utilidades Tailwind con los tokens de `@theme` (`text-ink-faint`, `font-pixel`…). Sin crear clases nuevas en `globals.css`, salvo las del desplegable de usuario.

## Criterios de aceptación

Automáticos:

- [ ] `npm run lint` termina sin errores.
- [ ] `npm run build` termina sin errores.
- [ ] El build genera estáticamente `/juegos/[id]` y `/juegos/[id]/jugar` para los 8 ids de `GAMES`.
- [ ] `app/page.tsx` no contiene restos del scaffold (`next.svg`, `bg-zinc-`).
- [ ] No hay ninguna referencia a `av_user` ni `av_scores` (claves de la plantilla) en el código.

Navegación:

- [ ] `/`, `/juegos/caida`, `/juegos/caida/jugar`, `/salon` y `/acceso` cargan sin errores en consola.
- [ ] `/juegos/no-existe` y `/juegos/no-existe/jugar` muestran la 404 retro con un enlace que lleva a `/`.
- [ ] En `/juegos/caida` el enlace "Biblioteca" de la nav está marcado como activo. En `/salon` lo está "Salón de la Fama".
- [ ] A menos de 840 px de ancho, el botón `≡` abre el panel móvil, y pulsar un enlace navega y lo cierra.
- [ ] El título de la pestaña del navegador en `/juegos/caida` contiene `CAÍDA`.

Biblioteca:

- [ ] Se ven 8 tarjetas. Escribir `ro` muestra solo `ROCAS`. Escribir `zzz` muestra "NO HAY RESULTADOS".
- [ ] El chip `PUZZLE` muestra solo `CAÍDA`. El chip `TODOS` vuelve a mostrar 8.
- [ ] Pulsar una tarjeta o su botón `JUGAR` lleva a `/juegos/<id>`.

Rankings y puntuaciones:

- [ ] Para un mismo juego, las 10 filas del Detalle coinciden con las 10 primeras de la tabla del Salón.
- [ ] `/juegos/caida` y `/juegos/rocas` muestran rankings distintos.
- [ ] Sin puntuaciones guardadas, "MEJOR PUNTUACIÓN" de la tarjeta, "Mejor global" del Detalle y el campeón del podio del Salón muestran el mismo número para cada juego.
- [ ] Jugar, pulsar `FIN` y guardar con un nombre nuevo una puntuación mayor que el #1 hace que ese nombre aparezca como #1 en el Detalle, como campeón en el Salón y que su puntuación sea la "MEJOR PUNTUACIÓN" de la tarjeta.
- [ ] Guardar dos veces con el mismo nombre en el mismo juego deja una sola fila con la puntuación mayor.
- [ ] Tras guardar y recargar la página, la puntuación sigue en los rankings.
- [ ] Con `av:scores:v1` = `"basura"` en localStorage, todas las pantallas cargan y muestran solo el ranking semilla.

Reproductor:

- [ ] La puntuación sube sola. `PAUSA` la congela y muestra "EN PAUSA". `REANUDAR` la reanuda.
- [ ] `FIN` abre el modal con la puntuación final. Sin sesión, el campo de iniciales vale `INVITADO`.
- [ ] Escribir en el campo lo pasa a mayúsculas y no admite más de 10 caracteres.
- [ ] Con el campo vacío (o solo espacios), `GUARDAR PUNTUACIÓN` está deshabilitado.
- [ ] Tras guardar se ve `▸ PUNTUACIÓN GUARDADA_` y el botón de guardar desaparece.
- [ ] `JUGAR DE NUEVO` pone puntuación 0, 3 vidas y nivel 01, y cierra el modal.
- [ ] `SALIR` lleva a `/juegos/<id>`.

Sesión:

- [ ] Iniciar sesión con usuario `neonfox` deja `{"name":"NEONFOX"}` en `av:user:v1`, navega a `/` y la nav muestra `NEONFOX ▾`.
- [ ] Enviar el formulario con el usuario vacío inicia sesión como `PLAYER1`.
- [ ] La pestaña `CREAR CUENTA` muestra el campo de correo. `INICIAR SESIÓN` lo oculta.
- [ ] Pulsar `NEONFOX ▾` abre el desplegable. Pulsar fuera o Esc lo cierra. `CERRAR SESIÓN` borra `av:user:v1` y la nav vuelve a mostrar `Iniciar Sesión`.
- [ ] `JUGAR COMO INVITADO` borra la sesión y navega a `/`.
- [ ] Con sesión, el campo de iniciales del modal de fin de juego vale el nombre del usuario.

Salón de la Fama:

- [ ] `/salon` sin parámetro muestra `BLOQUE BUSTER` activo. `/salon?juego=caida` muestra `CAÍDA` activo. `/salon?juego=xyz` muestra `BLOQUE BUSTER` activo.
- [ ] Pulsar el chip de otro juego cambia la URL a `/salon?juego=<id>` y recargar conserva esa pestaña.
- [ ] Sin sesión no aparece el bloque "TU MEJOR MARCA".
- [ ] Con sesión y sin marca en el juego activo, aparece `SIN MARCA · JUEGA YA`, que lleva a `/juegos/<id>/jugar`.
- [ ] Con sesión y con marca, la fila muestra el rango real del usuario en el ranking combinado, aunque esté fuera del top 12.

Visual (revisión manual):

- [ ] Cada pantalla coincide visualmente con su plantilla abierta desde `references/templates/Arcade Vault.html`.
- [ ] Las tarjetas hacen el efecto tilt al mover el ratón.

## Decisiones

- **Sí:** rutas reales de App Router (`/`, `/juegos/[id]`, `/juegos/[id]/jugar`, `/salon`, `/acceso`). URLs enlazables, SSR y metadatos por página.
- **No:** SPA con router por hash como la plantilla. Desaprovecha Next.js.
- **Sí:** slugs de ruta en español (`juegos`, `jugar`, `salon`, `acceso`), coherentes con la UI.
- **Sí:** el Reproductor solo simula la puntuación, como la plantilla. Cada juego real irá en su propio spec.
- **Sí:** sesión simulada en localStorage. La auth real implica proveedor y base de datos, y merece spec propio.
- **Sí:** las puntuaciones guardadas se combinan con las semilla en los rankings. Así el MVP ya permite "competir".
- **Sí:** una fila por jugador (su mejor marca) en los rankings.
- **No:** todas las partidas como filas. Un jugador podría copar el top.
- **Sí:** "MEJOR PUNTUACIÓN" y "Mejor global" = #1 del ranking combinado, y se elimina `best` de los datos. En la plantilla `best` no cuadraba con el ranking (p. ej. DUELO PIXEL = 24).
- **Sí:** un único ranking semilla por juego, con semilla derivada del hash del id. La plantilla usaba semillas distintas en Detalle y Salón (rankings incoherentes) y basadas en la longitud del id (juegos con rankings idénticos).
- **Sí:** los invitados pueden guardar con iniciales editables. **No:** exigir sesión para guardar.
- **Sí:** `GUARDAR PUNTUACIÓN` deshabilitado con el nombre vacío. **No:** rellenar `INVITADO` automáticamente.
- **Sí:** claves versionadas `av:user:v1` y `av:scores:v1`. Permiten migrar el esquema sin romper datos antiguos. **No:** las claves de la plantilla.
- **Sí:** `useSyncExternalStore` para leer localStorage. Evita desajustes de hidratación y sincroniza nav, menú y rankings al instante.
- **Sí:** menú de usuario con desplegable y una sola opción `CERRAR SESIÓN`. **No:** que el botón cierre sesión directamente, ni una pantalla de perfil.
- **Sí:** pestaña del Salón en la URL (`?juego=<id>`) con `router.replace`, para no llenar el historial al cambiar de pestaña.
- **Sí:** 404 retro propia. La plantilla pintaba una pantalla vacía.
- **Sí:** reutilizar las clases ya portadas a `app/globals.css`. **No:** reescribir los estilos en Tailwind, por esfuerzo y riesgo de desviarse del diseño.
- **Sí:** créditos, botones sociales y stats del Detalle como decorativos fijos.
- **Sí:** verificación con `npm run lint`, `npm run build` y revisión manual. **No:** test runner en este spec.
- **Sí (durante la construcción):** las clases de portada siguen los nombres de `app/globals.css` (`cover-glutton`, `cover-rocks`, `cover-frog`, `cover-duel`), no los de `data.jsx`. El port del CSS las había renombrado, y con los nombres de la plantilla esas cuatro portadas salían vacías.
- **Sí (durante la construcción):** `export const instant = false` en `/juegos/[id]` y `/juegos/[id]/jugar`. Con `partialPrefetching`, leer `params` fuera de `<Suspense>` daba error en consola en dev, y moverlo dentro rompía `notFound()` en producción. Los 8 ids siguen prerenderizados.
- **Sí (durante la construcción):** `eslint.config.mjs` ignora `references/**`. Las plantillas usan globales del navegador y hacían fallar `npm run lint` antes de empezar.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Desajuste de hidratación al leer localStorage en componentes renderizados en servidor | `useSyncExternalStore` con snapshot de servidor vacío. El servidor pinta el ranking semilla y el cliente lo completa tras montar. |
| La mejor puntuación de la tarjeta cambia tras la hidratación si hay puntuaciones guardadas | Aceptado en el MVP: el valor del servidor es el semilla y el cliente lo actualiza. |
| localStorage bloqueado (modo privado, cookies desactivadas) | Lecturas y escrituras en `try/catch`. La app funciona sin persistir. |
| JSON corrupto o de otra versión en las claves | Validar la forma al leer y tratarlo como ausente. |
| APIs de Next.js 16 distintas a las conocidas (`params` asíncronos, `cacheComponents`) | Leer `node_modules/next/dist/docs/` antes de cada API, como exige `AGENTS.md`. |
| `useSearchParams` sin `<Suspense>` rompe el build con `cacheComponents` | Envolver `HallOfFame` en `<Suspense>` en `app/salon/page.tsx`. |

## Lo que **no** entra en este spec

- Juegos jugables reales.
- Autenticación real, login social y validación de formularios.
- Backend, base de datos o API de puntuaciones.
- Pantalla de perfil o "Mis puntuaciones".
- Lógica de créditos.
- Tests automatizados.
- Migrar los estilos a Tailwind.

Cada uno, si llega, va en su propio spec.
