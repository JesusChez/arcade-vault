# SPEC 02 — Home, Acerca de y rutas en inglés

> **Estado:** Aprobado
> **Depende de:** SPEC 01
> **Fecha:** 2026-10-13
> **Objetivo:** Añadir la Home (landing) en `/` y la página Acerca de en `/about` según las plantillas de `references/templates/home-about/`, y migrar todas las rutas de la app a inglés.

## Por qué existe este spec

SPEC 01 dejó la Biblioteca en `/` y no tenía portada ni página "Acerca de".
Las nuevas plantillas añaden una landing de marketing que ocupa `/`, así que la Biblioteca se muda.
Ya que se mueven rutas, se migran todas a inglés de una vez para no tocar los mismos enlaces dos veces.
**Solo cambian las URLs.** Los textos de la UI siguen en español.

**Referencia visual obligatoria:**

| Pantalla | Plantilla |
| --- | --- |
| Home | `references/templates/home-about/home (1).jsx` |
| Acerca de + contacto | `references/templates/home-about/about (1).jsx` |
| Navegación (enlaces nuevos) | `references/templates/home-about/nav (1).jsx` |
| Estilos | `references/templates/home-about/styles (1).css` |
| Vista completa | `references/templates/home-about/arcade-vault-standalone (1).html` |

Cuando este spec dice "como la plantilla", manda el fichero de esa tabla. Cuando el spec y la plantilla difieren, manda el spec.

## Alcance

**Dentro:**

- Nuevo mapa de rutas (sustituye al de SPEC 01):

  | Ruta nueva | Pantalla | Ruta anterior |
  | --- | --- | --- |
  | `/` | Home (nueva) | — (antes era la Biblioteca) |
  | `/games` | Biblioteca | `/` |
  | `/games/[id]` | Detalle | `/juegos/[id]` |
  | `/games/[id]/play` | Reproductor | `/juegos/[id]/jugar` |
  | `/hall-of-fame` (con `?game=<id>` opcional) | Salón de la Fama | `/salon?juego=<id>` |
  | `/login` (con `?mode=signup` opcional) | Acceso | `/acceso` |
  | `/about` | Acerca de (nueva) | — |
  | cualquier otra, incluidas las rutas anteriores | 404 retro | — |

- Las rutas anteriores en español **no redirigen**: dan la 404 retro.
- Carpetas de `app/` renombradas: `app/juegos/` → `app/games/`, `app/juegos/[id]/jugar/` → `app/games/[id]/play/`, `app/salon/` → `app/hall-of-fame/`, `app/acceso/` → `app/login/`. La Biblioteca pasa de `app/page.tsx` a `app/games/page.tsx`, con su `metadata` actual.
- Destinos de enlaces existentes:

  | Elemento | Destino |
  | --- | --- |
  | Tarjeta y botón `JUGAR` de la Biblioteca | `/games/<id>` |
  | `▶ JUGAR AHORA` (Detalle) | `/games/<id>/play` |
  | `VOLVER AL VAULT` (Detalle) | `/games` |
  | `SALIR` (Reproductor) | `/games/<id>` |
  | `VOLVER AL VAULT` (modal de fin de juego) | `/games` |
  | `VOLVER A LA BIBLIOTECA` (Salón) | `/games` |
  | `SIN MARCA · JUEGA YA` (Salón) | `/games/<id>/play` |
  | Envío del formulario de Acceso (ambas pestañas) | `/games` |
  | `JUGAR COMO INVITADO` | `/games` |
  | Botón de la 404 | `/`, con el texto `VOLVER AL INICIO` |
  | Logo de la nav | `/` |

- Salón: el parámetro de pestaña pasa de `juego` a `game`. Cambiar de pestaña hace `router.replace("/hall-of-fame?game=<id>", { scroll: false })`. Sin parámetro o con id inválido, el primer juego de `GAMES` (como en SPEC 01).
- Acceso: `/login?mode=signup` abre la pestaña `CREAR CUENTA`. Sin `mode` o con cualquier otro valor, `INICIAR SESIÓN`. Cambiar de pestaña no modifica la URL. Si `mode` cambia en la URL estando en `/login` (p. ej. pulsando "Iniciar Sesión" en la nav desde `/login?mode=signup`), la pestaña se resincroniza con la URL.
- Navegación como `nav (1).jsx`, con `next/link`:
  - Enlaces de escritorio y del panel móvil, en este orden: `Inicio` (`/`), `Biblioteca` (`/games`), `Salón de la Fama` (`/hall-of-fame`), `Acerca de` (`/about`).
  - El panel móvil añade al final el enlace a `/login` ("Iniciar Sesión" o "Cuenta" con sesión), como en SPEC 01.
  - Estado activo: `Inicio` solo en `/`. `Biblioteca` en `/games` y `/games/*`. `Salón de la Fama` en `/hall-of-fame`. `Acerca de` en `/about`. Enlace de cuenta del panel móvil en `/login`.
  - El botón `Iniciar Sesión` (sin sesión) enlaza a `/login`. El menú de usuario no cambia.
- **Home** (`/`) como `home (1).jsx`, con estas secciones en orden:
  1. Hero: siluetas flotantes, `▸ INSERTA UNA MONEDA_`, título en tres líneas, subtítulo, botones `▶  EXPLORAR JUEGOS` (→ `/games`) y `✦  CREAR CUENTA` (→ `/login?mode=signup`), indicador `DESLIZA ▼`.
  2. `// 01 ¿POR QUÉ ARCADE VAULT?`: cuatro tarjetas de característica con icono pixel.
  3. `// 02 JUEGOS DISPONIBLES AHORA`: los 6 primeros juegos de `GAMES` como mini-tarjetas (portada, título, categoría) que enlazan a `/games/<id>`, y botón `VER TODOS LOS JUEGOS →` (→ `/games`).
  4. Franja de estadísticas (tres bloques).
  5. `// 03 ACTIVIDAD EN VIVO`: "ÚLTIMAS PUNTUACIONES" (7 filas) y "TOP JUGADORES · HOY" (5 filas) con el botón `VER SALÓN →` (→ `/hall-of-fame`).
  6. `// 04 PRECIOS`: tarjeta de plan con `EMPEZAR GRATIS →` (→ `/login?mode=signup`), sello `FREE PLAY` y tres preguntas frecuentes.
  7. CTA final: `¿LISTO PARA JUGAR?` y `INSERTAR MONEDA →` (→ `/games`).
- **Acerca de** (`/about`) como `about (1).jsx`: hero con misión y tres destacados con icono pixel, divisor animado de 24 píxeles, y bloque de contacto con intro, tres consejos y formulario simulado.
- Animación de aparición al hacer scroll (`.reveal` → `.reveal.in`) en las secciones que la tienen en la plantilla, en Home y Acerca de.
- Con `prefers-reduced-motion: reduce`, todo `.reveal` se ve desde el principio, sin transición.
- Portar a `app/globals.css` los estilos nuevos de `styles (1).css` que usan Home y Acerca de (ver plan, paso 1).
- `metadata` de `/` y `/about` (ver Modelo de datos).

**Elementos decorativos sin funcionalidad (se pintan como la plantilla y no hacen nada más):**

- "ÚLTIMAS PUNTUACIONES" y "TOP JUGADORES · HOY": datos fijos, literales de la plantilla. No leen rankings ni localStorage.
- Franja de estadísticas, tarjeta de precio y FAQ: texto fijo.

**Fuera de alcance (para futuros specs):**

- Envío real del formulario de contacto (email, backend, almacenamiento).
- Actividad y top de la Home con datos reales.
- Redirecciones de las URLs antiguas en español.
- Traducir al inglés los textos de la UI. Solo cambian las URLs.
- El mando (`.gp`, `.gp-*`, `.dp`, `.ab`, variantes de tema) de `styles (1).css` y la imagen `download (1) (1)`: son del Reproductor y no se usan aquí.
- Limpiar ficheros sobrantes de `references/templates/home-about/` (`download`, que es un `.DS_Store`).
- Sitemap, robots o datos estructurados.
- Tests automatizados.

## Modelo de datos

Este spec no introduce datos persistentes ni cambia `lib/games.ts`, `lib/scores.ts` ni `lib/storage.ts`. Reutiliza el modelo de SPEC 01.

Los contenidos fijos de Home y Acerca de son constantes locales del fichero que los pinta. Se copian literalmente de las plantillas, **salvo estos ajustes**:

| Dónde | Plantilla | Texto final |
| --- | --- | --- |
| Tarjeta `JUEGOS CLÁSICOS` (descripción) | `Arkanoid, Tetris, Snake y muchos más. …` | `Bloque Buster, Caída, Serpentina y muchos más. Los mejores arcades de todos los tiempos en un solo lugar.` |
| Primer bloque de estadísticas | `12+` / `JUEGOS` / `Y CONTANDO` | `8` / `JUEGOS` / `Y CONTANDO` |
| FAQ `¿NECESITO CREAR CUENTA?` | `No. Puedes jugar como invitado. Si quieres guardar tu puntuación y aparecer en el ranking, regístrate en 10 segundos.` | `No. Puedes jugar y guardar tu puntuación como invitado. Si creas una cuenta, tu nombre se rellena solo al guardar.` |
| Precio (`pc-amount-n`) | `$0` | `0 €` |

- La mini-tarjeta usa `game.category` (en la plantilla era `game.cat`) y `game.cover`.
- Las puntuaciones fijas se formatean con `toLocaleString("es-ES")`, como en la plantilla.

Reglas del formulario de contacto (`components/ContactForm.tsx`, cliente):

```ts
type ContactFields = { name: string; email: string; msg: string };
// state: fields, sent: string | null (sender name), shake: boolean
```

- Campos `NOMBRE` (placeholder `px_kai`), `CORREO ELECTRÓNICO` (`type="email"`, placeholder `jugador@vault.gg`) y `MENSAJE` (`textarea`, 5 filas, placeholder `Cuéntanos qué tienes en mente…`). Sin `required`.
- Al enviar: si algún campo, tras `trim()`, está vacío, el formulario recibe la clase `shake` durante 400 ms y no pasa nada más.
- Si los tres tienen contenido: se muestra la terminal de éxito como la plantilla, con la última línea `> MENSAJE RECIBIDO. TE RESPONDEREMOS PRONTO. GRACIAS, <NOMBRE EN MAYÚSCULAS>._`.
- `ENVIAR OTRO MENSAJE` vacía los tres campos y vuelve al formulario.
- No se envía ni se guarda nada. La validación de formato del correo es la nativa del navegador (`type="email"`).

Metadatos:

| Ruta | `title` | `description` |
| --- | --- | --- |
| `/` | `Arcade Vault · Clásicos arcade gratis en tu navegador` | `Juega gratis a los mejores clásicos arcade en tu navegador, sin descargas, y compite por la puntuación más alta.` |
| `/about` | `Acerca de · Arcade Vault` | `Conoce Arcade Vault, el proyecto que preserva los arcades clásicos, y escríbenos con tus sugerencias.` |
| `/games` | Sin cambios (`Biblioteca · Arcade Vault`) | Sin cambios |

Convenciones (las de SPEC 01): código, identificadores y comentarios en inglés. Textos de la UI en español.

## Plan de implementación

1. **Estilos.** Añadir a `app/globals.css`, en el mismo bloque/capa donde están los estilos portados de la plantilla, las líneas 930–1149 (`HOME PAGE`, `ABOUT PAGE`) y 1621–1724 (`ACTIVITY`, `PRICING`) de `references/templates/home-about/styles (1).css`. No duplicar reglas ni `@keyframes` que ya existan en `globals.css` (p. ej. `.divider`, `.fade-in`, `pulse`, `blink`). No portar las líneas 1150–1620 (mando). Añadir la regla de `prefers-reduced-motion: reduce` para `.reveal`. Comprobación: `npm run build` pasa y las pantallas de SPEC 01 se ven igual.
2. **Migración de rutas.** Mover las carpetas de `app/` según el Alcance. Crear `app/games/page.tsx` con el contenido actual de `app/page.tsx` (`app/page.tsx` sigue igual hasta el paso 6). Actualizar los tipos `PageProps<"/games/[id]">` y `PageProps<"/games/[id]/play">`, conservando `generateStaticParams`, `generateMetadata`, `notFound()` y `export const instant = false`. Actualizar todos los destinos de la tabla de enlaces, el parámetro `game` del Salón y el texto/destino de la 404. Comprobación: `/games`, `/games/caida`, `/games/caida/play`, `/hall-of-fame?game=caida` y `/login` funcionan.
3. **Navegación.** Actualizar `components/Nav.tsx` con los cuatro enlaces, el panel móvil y las reglas de estado activo del Alcance.
4. **Acceso con `?mode=signup`.** `components/AuthForm.tsx` lee `mode` con `useSearchParams` para la pestaña inicial y se resincroniza si cambia. `app/login/page.tsx` envuelve `AuthForm` en `<Suspense>` (requisito de `cacheComponents`).
5. **Piezas compartidas.** Crear `components/PixelArt.tsx` (sin `"use client"`) con `FloatingSilhouettes`, `FeatureIcon` y `HighlightIcon`, copiados de las plantillas (atributos SVG en camelCase de React). Crear `components/RevealObserver.tsx` (cliente): al montar, observa todos los `.reveal` del documento con `IntersectionObserver` (`threshold: 0.12`), les añade `in` al entrar y deja de observarlos. No renderiza nada.
6. **Home, parte 1.** Sustituir `app/page.tsx` por la Home (componente servidor, envoltorio `<div className="home fade-in">`, monta `<RevealObserver />`): hero, `// 01`, `// 02` y estadísticas. Botones y mini-tarjetas son `next/link`. Si `.mini-card` como `<a>` rompe el diseño, se ajusta la regla portada lo mínimo.
7. **Home, parte 2.** Añadir `// 03` (actividad), `// 04` (precios + FAQ) y el CTA final, con los ajustes de texto del Modelo de datos.
8. **Acerca de.** Crear `app/about/page.tsx` (servidor, envoltorio `<div className="about fade-in">`, monta `<RevealObserver />`) y `components/ContactForm.tsx` (cliente) con las reglas del formulario.
9. **Metadatos y limpieza.** `metadata` de `/` y `/about`. Comprobar que no quedan referencias a las rutas antiguas en `app/`, `components/`, `hooks/` ni `lib/`.

Notas técnicas para todo el plan:

- Next.js 16 con `cacheComponents: true` y `partialPrefetching: true`: leer `node_modules/next/dist/docs/` antes de usar `params`, `searchParams`, `useSearchParams` o `PageProps` (ver `AGENTS.md`).
- Las páginas son componentes servidor siempre que se pueda. Solo son cliente `Nav`, `AuthForm`, `ContactForm`, `RevealObserver` y los que ya lo eran.
- Los `style={{...}}` inline de las plantillas (p. ej. `transitionDelay`) pueden quedarse inline. Sin clases nuevas en `globals.css` salvo las portadas y la regla de reduced-motion.

## Criterios de aceptación

Automáticos:

- [ ] `npm run lint` termina sin errores.
- [ ] `npm run build` termina sin errores.
- [ ] El build genera estáticamente `/games/[id]` y `/games/[id]/play` para los 8 ids de `GAMES`.
- [ ] No existen `app/juegos/`, `app/salon/` ni `app/acceso/`.
- [ ] En `app/`, `components/`, `hooks/` y `lib/` no aparecen las cadenas `/juegos`, `/jugar`, `/salon`, `/acceso` ni `?juego=`.
- [ ] En el código no aparecen `Arkanoid`, `12+` ni `$0`.
- [ ] `app/globals.css` no contiene la clase `.gp`.

Rutas y navegación:

- [ ] `/`, `/games`, `/games/caida`, `/games/caida/play`, `/hall-of-fame`, `/login` y `/about` cargan sin errores en consola.
- [ ] `/juegos/caida`, `/salon`, `/acceso` y `/games/no-existe` muestran la 404 retro, y su botón `VOLVER AL INICIO` lleva a `/`.
- [ ] La nav muestra `Inicio`, `Biblioteca`, `Salón de la Fama` y `Acerca de`, en ese orden, en escritorio y en el panel móvil.
- [ ] En `/` solo está activo `Inicio`. En `/games` y `/games/caida` solo `Biblioteca`. En `/hall-of-fame` solo `Salón de la Fama`. En `/about` solo `Acerca de`.
- [ ] El logo lleva a `/`.
- [ ] `VOLVER AL VAULT` del Detalle y del modal de fin de juego, y `VOLVER A LA BIBLIOTECA` del Salón, llevan a `/games`.
- [ ] Iniciar sesión, crear cuenta y `JUGAR COMO INVITADO` navegan a `/games`.
- [ ] `/hall-of-fame?game=caida` muestra `CAÍDA` activo. Pulsar otro chip cambia la URL a `/hall-of-fame?game=<id>`.

Acceso:

- [ ] `/login?mode=signup` abre la pestaña `CREAR CUENTA` con el campo de correo visible. `/login` y `/login?mode=xyz` abren `INICIAR SESIÓN`.
- [ ] Desde `/login?mode=signup`, pulsar `Iniciar Sesión` en la nav muestra la pestaña `INICIAR SESIÓN`.

Home:

- [ ] Se ven las 7 secciones en el orden del Alcance.
- [ ] `// 02` muestra 6 mini-tarjetas, de `BLOQUE BUSTER` a `ROCAS`, y cada una lleva a `/games/<id>`.
- [ ] `EXPLORAR JUEGOS`, `VER TODOS LOS JUEGOS →` e `INSERTAR MONEDA →` llevan a `/games`.
- [ ] `✦  CREAR CUENTA` y `EMPEZAR GRATIS →` llevan a `/login?mode=signup` con la pestaña `CREAR CUENTA` abierta.
- [ ] `VER SALÓN →` lleva a `/hall-of-fame`.
- [ ] La franja de estadísticas muestra `8 JUEGOS`. La tarjeta de precio muestra `0 €`. La FAQ y la tarjeta `JUEGOS CLÁSICOS` usan los textos ajustados.
- [ ] El título de la pestaña en `/` es `Arcade Vault · Clásicos arcade gratis en tu navegador`.

Acerca de:

- [ ] Enviar el formulario con algún campo vacío (o solo espacios) no muestra la terminal.
- [ ] Enviar con nombre `px_kai`, un correo válido y un mensaje muestra la terminal con `GRACIAS, PX_KAI.`.
- [ ] `ENVIAR OTRO MENSAJE` vuelve al formulario con los tres campos vacíos.
- [ ] El título de la pestaña en `/about` es `Acerca de · Arcade Vault`.

Visual (revisión manual):

- [ ] Home y Acerca de coinciden visualmente con `arcade-vault-standalone (1).html`.
- [ ] Las secciones `.reveal` aparecen con animación al hacer scroll.
- [ ] Con `prefers-reduced-motion: reduce` emulado en DevTools, todas las secciones se ven sin hacer scroll.
- [ ] El formulario de contacto tiembla al enviarlo con campos vacíos.
- [ ] Las pantallas de SPEC 01 se ven igual que antes de este spec.
- [ ] Home y Acerca de se ven bien a menos de 840 px de ancho.

## Decisiones

- **Sí:** Home en `/` y Biblioteca en `/games`. La landing es la portada, como en la plantilla.
- **Sí:** todas las rutas en inglés (`/games`, `/games/[id]/play`, `/hall-of-fame`, `/login`, `/about`). Sustituye la decisión de slugs en español de SPEC 01.
- **No:** mezclar `/games` con `/juegos/[id]`. Rompía la jerarquía de URLs.
- **Sí:** un único spec para migración + Home + Acerca de. La Home y la nav necesitan las rutas nuevas desde el principio; partirlo obligaba a tocar los mismos enlaces dos veces.
- **Sí:** solo cambian las URLs. **No:** traducir textos de la UI.
- **No:** redirecciones desde las rutas antiguas. La app no está publicada y no hay enlaces externos que preservar.
- **Sí:** `/login?mode=signup` para abrir la pestaña `CREAR CUENTA` desde los CTAs. **No:** `/signup` como ruta aparte, ni enlazar a `/login` sin más (el usuario caería en la pestaña equivocada).
- **Sí:** tras login, registro o invitado, y en `VOLVER AL VAULT`, destino `/games`. El usuario viene a jugar.
- **Sí:** la 404 lleva a `/` con `VOLVER AL INICIO`.
- **Sí:** formulario de contacto simulado como la plantilla. **No:** envío real; necesita servicio de email y merece spec propio.
- **Sí:** actividad y top de la Home fijos. **No:** derivarlos de los rankings; lógica nueva sin valor en el MVP.
- **Sí:** ajustar solo los textos que afirmaban cosas falsas de la app (`12+`, juegos inexistentes, FAQ contraria a SPEC 01, `$0`). El resto, literal.
- **Sí:** `.reveal` como la plantilla, más excepción para `prefers-reduced-motion`.
- **Sí:** `RevealObserver` como componente cliente aislado, para que Home y Acerca de sigan siendo componentes servidor.
- **No:** portar los estilos del mando (`.gp`). Son del Reproductor y quedan para su propio spec.
- **Sí (durante la construcción):** el CSS de `PRICING` se portó hasta la línea 1725 (no 1724). La 1725 es `.faq-a`, que usa la FAQ de la Home; el rango del plan se quedaba una línea corto.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Sin JS, las secciones `.reveal` quedan invisibles | Aceptado: la app ya requiere JS. Con reduced-motion se ven siempre. |
| `RevealObserver` añade `in` fuera de React; un re-render del servidor podría quitarla | Las páginas no se refrescan solas. Si pasa, la sección vuelve a ocultarse hasta la siguiente navegación; se revisa en la verificación manual. |
| Enlaces olvidados a rutas antiguas | Criterio automático de búsqueda de cadenas en `app/`, `components/`, `hooks/` y `lib/`. |
| `useSearchParams` sin `<Suspense>` rompe el build con `cacheComponents` | `AuthForm` envuelto en `<Suspense>` en `app/login/page.tsx`. |
| Reglas duplicadas al portar el CSS cambian pantallas de SPEC 01 | No duplicar reglas existentes; criterio visual de regresión. |
| `.mini-card` pensada para `<div>` al pasar a `<a>` | Ajuste mínimo de la regla portada (paso 6). |

## Lo que **no** entra en este spec

- Envío real del formulario de contacto.
- Datos reales en la actividad y el top de la Home.
- Redirecciones de las URLs antiguas.
- Traducción de los textos de la UI.
- Estilos y componente del mando.
- Tests automatizados.

Cada uno, si llega, va en su propio spec.
