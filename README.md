# Fyrstikken

Fyrstikken er F21 VGS sin nettside for den årlige prisutdelingen, hvor elevprosjekter blir utstilt og publikum kan stemme på sine favoritter.

**Produksjon:** [fyrstikken.f21.no](https://fyrstikken.f21.no)

## Teknologi

- **[Astro v5](https://astro.build/)** - Statisk nettstedsgenerator
- **[Sanity CMS](https://www.sanity.io/)** - Headless CMS for innhold
- **[TypeScript](https://www.typescriptlang.org/)** - Typesikkerhet
- **[Cloudflare Pages](https://pages.cloudflare.com/)** - Hosting og deployment

## Kom i gang

### Forutsetninger

- [Node.js](https://nodejs.org/) v18+
- [pnpm](https://pnpm.io/) v8+

### Installasjon

```bash
# Klon repoet
git clone https://github.com/f21-fyrstikken/Fyrstikken.git
cd Fyrstikken

# Installer avhengigheter
pnpm install

# Kopier miljøvariabler
cp .env.example .env
```

Fyll inn Sanity-konfigurasjon i `.env`:

```env
PUBLIC_SANITY_PROJECT_ID=ditt-prosjekt-id
PUBLIC_SANITY_DATASET=production
```

### Utvikling

```bash
pnpm dev          # Start utviklingsserver (localhost:4321)
pnpm dev:studio   # Start Sanity Studio (localhost:3333)
```

### Bygging og testing

```bash
pnpm build        # Bygg nettsiden
pnpm preview      # Forhåndsvis bygget
pnpm test         # Kjør tester
pnpm test:watch   # Kjør tester i watch-modus
pnpm check        # Kjør typecheck + lint
```

## Prosjektstruktur

```
src/
├── components/
│   ├── common/          # Gjenbrukbare UI-komponenter
│   │   ├── BackLink.astro
│   │   ├── Breadcrumb.astro
│   │   ├── Button.astro
│   │   ├── Link.astro
│   │   ├── ProjectCard.astro
│   │   └── VideoEmbed.astro
│   ├── features/        # Funksjonskomponenter
│   │   ├── CategoryContent.astro
│   │   ├── ProjectContent.astro
│   │   ├── VoteButton.astro
│   │   ├── YearContent.astro
│   │   └── YearsList.astro
│   ├── layout/          # Layout-komponenter
│   │   ├── HeaderImg.astro
│   │   └── NightDay.astro
│   └── portable-text/   # Sanity PortableText-komponenter
│       ├── Audio.astro
│       ├── Embed.astro
│       ├── File.astro
│       ├── Image.astro
│       ├── LinkButton.astro
│       ├── Vimeo.astro
│       └── YouTube.astro
├── config/              # Sentralisert konfigurasjon
│   ├── index.ts         # SANITY_CONFIG, SITE_CONFIG, THEME_COLORS
│   └── queries.ts       # Alle GROQ-spørringer
├── layouts/
│   └── BaseLayout.astro
├── lib/
│   └── sanity-client.ts # Sanity-klient
├── pages/               # Ruter
│   ├── index.astro
│   ├── 404.astro
│   └── years/
│       └── [year]/
│           ├── index.astro
│           ├── [category].astro
│           └── [category]/
│               └── [project].astro
├── styles/
│   ├── tokens.css       # CSS design tokens
│   ├── global.css       # Globale stiler
│   └── typografi.css    # Typografi
├── types/
│   ├── index.ts         # Komponent-typer
│   └── sanity.ts        # Sanity-dokumenttyper
└── utils/
    ├── paths.ts         # URL-bygger
    ├── sanity.ts        # Bilde/fil-hjelpefunksjoner
    └── video.ts         # Video ID-ekstraksjon
```

## Arkitektur

### Dataflyt

```
Sanity CMS → GROQ-spørringer → Astro-sider → Statisk HTML
```

1. **Sanity CMS** lagrer alt innhold (år, kategorier, prosjekter)
2. **GROQ-spørringer** (`src/config/queries.ts`) henter data
3. **Astro-sider** renderer til statisk HTML ved bygging
4. **Cloudflare Pages** serverer det statiske innholdet

### Nøkkelkonsepter

- **Statisk generering**: Alle sider bygges på forhånd
- **Komponentbasert**: Gjenbrukbare Astro-komponenter
- **Typesikker**: Full TypeScript-dekning
- **CSS Tokens**: Sentraliserte designvariabler i `tokens.css`

## Konfigurasjon

All konfigurasjon er sentralisert i `src/config/index.ts`:

```typescript
// Sanity-tilkobling
SANITY_CONFIG.projectId;
SANITY_CONFIG.dataset;

// Nettstedsinnstillinger
SITE_CONFIG.title;
SITE_CONFIG.fallbackUrl;

// Tema
THEME_COLORS.primary;
THEME_COLORS.secondary;
```

## Testing

Prosjektet bruker [Vitest](https://vitest.dev/) for testing:

```bash
pnpm test              # Kjør alle tester
pnpm test:watch        # Watch-modus
pnpm test:coverage     # Med dekningsrapport
```

Testfiler ligger ved siden av kildekoden med `.test.ts`-suffiks.

## Deployment

Nettsiden deployes automatisk til Cloudflare Pages via GitHub Actions:

- **Push til `main`** → Produksjon
- **Pull requests** → Preview-deployment

Se `.github/workflows/deploy.yml` for konfigurasjon.

## Bidra

Se [CONTRIBUTING.md](./CONTRIBUTING.md) for retningslinjer.

## Lisens

Dette prosjektet er utviklet av og for F21 VGS.
