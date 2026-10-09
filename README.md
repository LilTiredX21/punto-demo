# PUNTO — Prototipo web (versión corregida y mejorada)

Versión limpia y modular del prototipo `PUNTO PAGE.html`, con los errores
corregidos y mejoras de calidad, accesibilidad y mantenibilidad.
El diseño y la identidad visual se conservan idénticos al original.

## Estructura

```
punto/
├── index.html   · Marcado semántico, sin contenido duplicado
├── styles.css   · CSS consolidado (tokens + todos los componentes)
└── app.js       · Lógica interactiva (datos, filtros, modal, formularios)
```

Abre `index.html` directamente en el navegador (no necesita servidor ni build).

## Errores corregidos respecto al original

1. **CSS duplicado.** El original tenía tres capas de CSS (base, identidad y
   "capa visual PRO") donde la tercera sobrescribía a las anteriores de forma
   confusa. Ahora hay **un único archivo** resuelto a los valores finales.
2. **Contenido renderizado dos veces.** Las categorías, el marketplace y los
   cursos estaban hardcodeados en el HTML *y* generados por JavaScript,
   produciendo tarjetas duplicadas. Ahora la **fuente de datos es única** (JS).
3. **Buscador del hero sin validar.** Enviar el campo vacío metía una cadena
   vacía al formulario. Ahora valida, enfoca y muestra feedback visual.
4. **Memory leak en el modal.** Se añadían nuevos listeners cada vez que se
   abría. Ahora se usa **delegación de eventos** con listeners únicos.
5. **Tokens inconsistentes.** `--blue`, `--blue-2`, `--green` eran el mismo
   color; igual con `--signal`/`--amber`. Se definen tokens semánticos
   (`--purple`, `--lime`, ...) manteniendo alias de compatibilidad.
6. **`initials()` rota** con nombres de una sola palabra (`"Madonna"` → `"MM"`).
7. **Animaciones SVG ignoraban `prefers-reduced-motion`.** Con movimiento
   reducido las líneas del grafo quedaban invisibles. Ahora el estado final es
   visible aunque la animación esté desactivada.
8. **Aviso sin `<noscript>` coherente.** Se mantiene el aviso, y el contenido
   clave ya no depende del JS para mostrarse (revelado con *progressive
   enhancement*).

## Mejoras añadidas

- **Accesibilidad:** enlace "saltar al contenido", foco visible, trampa de foco
  y cierre con `ESC` en el modal, restauración del foco, `aria-*` en menú,
  pestañas, chips y buscadores, etiquetas para lectores de pantalla (`sr-only`).
- **UX:** `scroll-margin-top` para que el header fijo no tape las anclas,
  bloqueo de scroll al abrir menú/modal, búsqueda con *debounce* (200 ms),
  validación nativa de formularios con `reportValidity()` y reinicio tras envío.
- **SEO/rendimiento:** `preconnect` a Google Fonts, `theme-color`, atributos
  `aria-label` y `role` coherentes.
- **Seguridad:** escapado de HTML en los datos que se inyectan dinámicamente.
- **Hero profesional:** el blob amorfo pasa a disco lima perfecto; marca de agua
  gigante eliminada; grafo con órbita reducida (etiquetas sin recorte),
  líneas moradas, nodos negros, micro-etiquetas en mayúsculas y «PUNTO» lima
  sobre negro (regla del manual).

## Revisión de calidad y accesibilidad

Pasada de corrección basada en el detector mecánico de Impeccable:

- **Contraste:** el gris de texto secundario (`--text-faint`) pasa de `#777777`
  (≈3.7–4.5:1) a `#5F5F5F` (≥6.4:1 sobre blanco). Se corrigió además el
  `COP/mes` del plan destacado (gris sobre morado → `#DDD7EF`, 8.6:1) y los
  subtítulos `<h4>` del panel morado "Para Empresas", que heredaban `--ink`
  (negro sobre morado, 1.6:1) → ahora `#FFFFFF`.
- **Tamaño mínimo de texto:** etiquetas de 8–9 px (meta del hero, píldoras,
  nota de categoría, formato de curso, etiquetas del grafo SVG) se elevan a
  **≥11 px**.
- **Jerarquía de encabezados:** se eliminan los saltos `h2→h4` y `h3→h5`.
  Las tarjetas/pasos/planes/principios usan `h3`, los sub-ítems de beneficios
  `h4`, los títulos de columna del footer `h2`. La ficha modal usa `h3` + `h4`.

> Se mantiene **Montserrat** en cuerpo pese a la advertencia de "fuente
> sobreusada", porque el manual de marca la exige (el brief manda).

## Identidad de marca (assets)

Logotipo **reconstruido en vectorial** desde la sección 6 del manual (trazos exactos,
sin depender de la fuente Harabara):

```
punto/assets/
├── logo-punto-color.svg    · bicolor morado + «un» lima (cabecera, fondo claro)
├── logo-punto-purple.svg   · morado (fondo claro)
├── logo-punto-white.svg    · blanco (fondo morado)
├── logo-punto-lime.svg     · lima (footer, fondo negro)
├── logo-punto-black.svg    · negro (fondo lima)
└── favicon.svg             · «P» blanca sobre morado
```

Regla de color del manual: morado sobre claro · blanco sobre morado · lima sobre
negro · negro sobre lima. El manual **no** incluye isotipo, por eso el favicon se
deriva de la «P».

## Optimización SEO y micro-interacciones

Pase aplicado sobre la identidad existente (la marca manda: se conservan paleta
lima/morado y Montserrat/Oswald).

**SEO**

- `<title>` y `meta description` reescritos con propuesta de valor + ciudad.
- `lang="es-CO"`, Open Graph y Twitter Card, `theme-color`.
- Datos estructurados JSON-LD: `Organization` (área servida: Medellín y Valle de
  Aburrá) y `WebSite`. En modo demo se usan `@id` relativos (`#organization`)
  sin URL absoluta.
- Jerarquía verificada: un solo `<h1>`, sin saltos `h1→h2→h3→h4`.

**Modo demo (enlace compartible, no oficial)**

Para que un enlace de prototipo no compita con el sitio real ni se confunda con
una página oficial:

- `robots` = `noindex, nofollow`.
- Sin `canonical` ni `og:url` apuntando a `unpunto.com`.
- JSON-LD sin URLs absolutas del dominio.
- En `index.html` hay un comentario con los **3 pasos para revertir** al publicar
  el sitio definitivo.

## Responsive (cualquier tamaño de pantalla)

Auditoría con la página cargada en *iframes* de ancho fijo (cada iframe tiene su
propio viewport y dispara sus media queries). Resultado: **0 desbordamiento
horizontal de 280 px a 1920 px**.

- **Formularios:** `.form-grid` no colapsaba en móvil; el ancho intrínseco de los
  `<input>` empujaba la página a ~537 px. Ahora los campos llevan
  `width:100%;min-width:0` y la rejilla pasa a **1 columna** en móvil.
- **Navegación:** el menú completo desbordaba entre 641–860 px. Ahora colapsa a
  **hamburguesa por debajo de 900 px** (`header .nav-links`/`.nav-actions` se
  ocultan; el botón aparece).
- **Rejillas que no colapsaban:** `ethics-grid` (2 columnas ≤900, 1 ≤640),
  `hero-meta` (2 columnas en móvil), además de `form-grid` y el resto.
- **Botones:** `.btn` con `white-space:nowrap` desbordaba a ≤320 px
  ("Solicitar diagnóstico personalizado" = 336 px). Ahora permite salto de línea
  por debajo de 420 px.
- **Separación de contenido:** `.hero-meta` pasa a rejilla de 3 columnas
  (divisores `border-left`) — se elimina la fila huérfana y el divisor colgando
  que dejaba el ítem "Diagnóstico"; el `strong` usa `clamp()` para no desbordar
  su celda. Los `.step` ganan `padding-left` (24 px) para no tocar las líneas
  divisorias; en ≤1024 los pasos usan 2 columnas con `border-left` en las pares
  (sin bordes derechos colgando en el borde del contenedor).
- **Paddings** reducidos en móvil (`.wrap`, `.academy-wrap`, `.press-box`,
  `.modal-card`, `.advisor-card`).
- **Arranque móvil (order del hero):** el panel oscuro de la red (568px
  colapsado) estaba con `order:-1` y **empujaba el titular bajo el fold** en
  390×844: `<h1>` en y=779, buscador en y=1052, CTAs en y=1192. Ahora en ≤820 el
  **texto va primero** y la red pasa después de las CTAs; `<h1>` sube a y=134.
  En tablet (821–1024) se mantiene el círculo arriba.
- **Padding superior** del hero en móvil de 125px → **96px** (el header fijo
  mide 61px; antes había 64px de espacio muerto).
- **Objetivos táctiles:** `.btn-sm` y `.nav-toggle` pasan a **≥44px** en móvil
  (antes 36px y 34×28, por debajo de la guía de iOS/Android).
- Verificado además: nav completo ≥901 px, **red circular ≥821 px** (8/8 nodos
  dentro del panel), **acordeón ≤820 px**, acordeón y menú móvil interactivos,
  tarjeta de nodo dentro del panel y «Saber más» abriendo el modal correcto.

**Movimiento (criterios Kowalski)**

- Subrayado de menú migrado de `right` (layout) a `transform:scaleX` (GPU).
- Eliminado `transition:all`; cada control transiciona solo propiedades concretas.
- Duraciones de hover ≤ 250 ms (180–220 ms) con easing natural
  `cubic-bezier(.16,.8,.24,1)`; feedback de pulsación `scale(.97)`.
- Estados `:hover` aislados tras `@media (hover:hover) and (pointer:fine)`
  (evita el hover pegado en táctil).
- La barra de acento de las tarjetas de categoría usa `scaleY` en vez de `height`.

## Red de servicios interactiva (hero)

El diagrama circular estático del hero se reemplazó por una **red de servicios
dinámica** (`app.js` → `serviceNetwork()`), generada desde una única fuente de
datos (8 servicios con icono SVG, resumen y detalle).

- **Panel oscuro** `#0d0d0f` con acento neón en el lima de marca `#D7F209`
  (regla del manual «lima sobre negro»), sobre el hero claro.
- **Núcleo PUNTO** con *glow* y pulsación suave (anillo animado en el compositor).
- **8 nodos orbitales** conectados por líneas finas con partículas que viajan
  hacia el centro (`<animateMotion>` + `mpath`; se omiten con *movimiento
  reducido*).
- **Interacción:** al pasar el cursor o enfocar con teclado, el nodo se enciende,
  su línea se ilumina y aparece una tarjeta de servicio *dentro* del panel
  (posición calculada y limitada a los bordes). Al hacer clic el nodo queda
  seleccionado (estado fijo); «Saber más» abre una ficha en el modal existente
  (reutiliza la trampa de foco) con CTA que precarga el formulario de proyecto.
- **Responsive mobile-first:** por debajo de 820 px el escenario circular se
  oculta y los mismos datos se disponen como **acordeón vertical conectado**.
- **Accesibilidad:** nodos como `<button>` con `aria-label` y `aria-expanded`,
  foco visible, cierre con `ESC` y clic fuera. Geometría verificada: 8/8 nodos y
  tarjetas dentro del panel; consola sin errores.

> El *glow* neón (`dark-glow` del detector) es intencional: lo pide el brief del
> componente; el resto de avisos del detector (kickers, etiquetas numeradas,
> tarjetas anidadas, franja lateral, "fuente sobreusada") son preexistentes y se
> dejaron fuera de alcance a propósito.

## Principios (mejora)

La sección «Nuestros Principios» era una rejilla de 6 bloques de texto con solo un
borde superior, sin jerarquía visual, y con dos ítems redundantes («Confianza y
transparencia» vs «Transparencia Comercial»).

- Cada principio es ahora una **tarjeta** sutil (`rgba(255,255,255,.05)` + borde,
  radio 14) sobre el morado, con **icono SVG lima** por principio y un **acento que
  se dibuja al pasar el cursor** (`transform:scaleX`), en el mismo lenguaje que el
  resto del sitio (hover aislado tras `@media (hover:hover) and (pointer:fine)`).
- Contenido deduplicado: «Confianza y transparencia» → **«Orientación y
  Acompañamiento»** (pilar real del producto), conservando 6 principios distintos.
- Contraste verificado sobre el morado: título 10.5:1, icono 6.5:1, cuerpo 4.9:1.
- Responsive: 3 columnas (escritorio) · 2 (≤900) · 1 (≤640). Sin desbordamiento.

## Notas

- Los textos y precios siguen siendo **demostrativos** (prototipo).
- Los formularios no envían datos a ningún servidor: simulan la confirmación.
- El manual de marca indica **Harabara** para títulos; el prototipo aún usa
  **Oswald** (desviación pendiente de corregir cuando haya archivo/licencia).
- El logotipo está aplicado, pero el **archivo fuente original** (AI/SVG) sigue
  pendiente de recibir por si difiere de la reconstrucción.
