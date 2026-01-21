# Bidragsguide

Velkommen som bidragsyter til Fyrstikken! Denne guiden hjelper deg med å komme i gang.

## Utviklingsmiljø

### Oppsett

```bash
pnpm install
cp .env.example .env
# Fyll inn Sanity-konfigurasjon i .env
```

### Nyttige kommandoer

| Kommando          | Beskrivelse            |
| ----------------- | ---------------------- |
| `pnpm dev`        | Start utviklingsserver |
| `pnpm dev:studio` | Start Sanity Studio    |
| `pnpm build`      | Bygg nettsiden         |
| `pnpm test`       | Kjør tester            |
| `pnpm test:watch` | Tester i watch-modus   |
| `pnpm check`      | Typecheck + lint       |
| `pnpm format`     | Formater kode          |

## Kodestil

### Generelt

- **TypeScript**: All kode skal være typesikker
- **Prettier**: Koden formateres automatisk
- **ESLint**: Følg lint-reglene

Kjør `pnpm check` før du committer for å sikre at koden er OK.

### Navngivning

```typescript
// Interfaces - prefix med I
interface IProject { ... }
interface IButtonProps { ... }

// Types - ingen prefix
type VideoProvider = 'youtube' | 'vimeo'

// Komponenter - PascalCase
VideoEmbed.astro
ProjectCard.astro

// Utilities - camelCase
buildImageUrl()
extractVideoId()
```

### Filstruktur

```
src/
├── components/
│   ├── common/       # Gjenbrukbare UI-komponenter
│   ├── features/     # Funksjons-spesifikke komponenter
│   ├── layout/       # Layout-komponenter
│   └── portable-text/# Sanity PortableText-komponenter
├── config/           # All konfigurasjon
├── types/            # TypeScript-definisjoner
└── utils/            # Hjelpefunksjoner
```

## Komponentmønstre

### Props-grensesnitt

Definer alltid et interface for props:

```astro
---
// src/components/common/Button.astro
export interface IButtonProps {
  href: string;
  variant?: "primary" | "secondary";
  class?: string;
}

const { href, variant = "primary", class: className } = Astro.props as IButtonProps;
---

<a href={href} class:list={["button", `button--${variant}`, className]}>
  <slot />
</a>
```

### Eksporter typer fra index

Samle typer i `src/types/index.ts`:

```typescript
// src/types/index.ts
export interface IButtonProps { ... }
export interface IVideoEmbedProps { ... }
```

### Bruk sentralisert konfigurasjon

Ikke hardkod verdier - bruk `src/config/index.ts`:

```typescript
// Bra
import { SITE_CONFIG } from "@/config";
const title = SITE_CONFIG.title;

// Unngå
const title = "Fyrstikken";
```

### Bruk path-aliases

Prosjektet har konfigurert path-aliases:

```typescript
// Bra
import { SANITY_CONFIG } from "@/config";
import type { IProject } from "@/types";

// Unngå
import { SANITY_CONFIG } from "../../../config";
```

## CSS-retningslinjer

### Design tokens

Bruk CSS-variabler fra `src/styles/tokens.css`:

```css
/* Bra */
.button {
  background: var(--color-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}

/* Unngå */
.button {
  background: #ff6b35;
  padding: 16px;
  border-radius: 8px;
}
```

### BEM-navngivning

Bruk BEM for CSS-klasser:

```css
.card {
}
.card__title {
}
.card__content {
}
.card--featured {
}
```

### Scoped styles

Astro-komponenter har scoped styles som standard:

```astro
<style>
  /* Disse stilene gjelder kun for denne komponenten */
  .button {
    background: var(--color-primary);
  }
</style>
```

## Testing

### Testfiler

Plasser tester ved siden av kildekoden:

```
src/utils/
├── video.ts
├── video.test.ts    # Tester for video.ts
├── sanity.ts
└── sanity.test.ts   # Tester for sanity.ts
```

### Skriv tester for

- Utility-funksjoner
- Kompleks forretningslogikk
- Edge cases

### Teststruktur

```typescript
import { describe, it, expect } from "vitest";
import { myFunction } from "./myFile";

describe("myFunction", () => {
  it("should handle normal input", () => {
    expect(myFunction("input")).toBe("expected");
  });

  it("should handle edge cases", () => {
    expect(myFunction("")).toBe(null);
  });
});
```

### Kjør tester

```bash
pnpm test              # Kjør alle tester
pnpm test:watch        # Watch-modus for utvikling
pnpm test:coverage     # Generer dekningsrapport
```

## Sanity CMS

### GROQ-spørringer

Alle spørringer er samlet i `src/config/queries.ts`:

```typescript
// Definer spørringer med JSDoc
/**
 * Henter alle år med kategorier
 */
export const QUERIES = {
  allYears: groq`*[_type == "year"] | order(year desc)`,
  // ...
};
```

### Legge til nye felt

1. Oppdater Sanity-skjemaet i `sanity/schemas/`
2. Legg til typen i `src/types/sanity.ts`
3. Oppdater relevante GROQ-spørringer
4. Deploy skjemaendringer: `pnpm sanity:deploy`

## Git-arbeidsflyt

### Brancher

- `main` - Produksjon (deployes automatisk)
- `feature/*` - Nye funksjoner
- `fix/*` - Bugfikser

### Commit-meldinger

Bruk beskrivende meldinger:

```bash
# Bra
git commit -m "Add video embed component for YouTube and Vimeo"
git commit -m "Fix N+1 query in category page"

# Unngå
git commit -m "fix"
git commit -m "update"
```

### Pull requests

1. Opprett en branch fra `main`
2. Gjør endringene dine
3. Kjør `pnpm check` og `pnpm test`
4. Opprett en PR med beskrivelse av endringene
5. Vent på review

## Vanlige oppgaver

### Legge til en ny komponent

1. Opprett filen i riktig mappe (`common/`, `features/`, etc.)
2. Definer props-interface
3. Eksporter typen fra `src/types/index.ts` hvis relevant
4. Legg til tester hvis komponenten har logikk

### Oppdatere stiler

1. Sjekk om det finnes en relevant token i `tokens.css`
2. Bruk tokens fremfor hardkodede verdier
3. Legg til nye tokens hvis nødvendig

### Feilsøking

```bash
# Typesjekk
pnpm typecheck

# Lint
pnpm lint

# Se bygge-output
pnpm build

# Sjekk Sanity-data
pnpm dev:studio
```

## Spørsmål?

Kontakt prosjektansvarlig eller åpne en issue på GitHub.
