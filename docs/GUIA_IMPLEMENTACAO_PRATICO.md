# GUIA DE IMPLEMENTAÇÃO PRÁTICO
## HTML5 Primoroso para Site Roncolato Dental

**Data:** 30 de Março, 2026  
**Nível:** Profissional / Production-Ready  
**Stack Recomendado:** Next.js 15 + React 18 + TypeScript + Tailwind CSS

---

## 📋 ÍNDICE RÁPIDO

1. Arquitetura de Pasta
2. HTML5 Estructura Semântica
3. CSS3 Estratégia
4. JavaScript Moderno
5. Performance Checklist
6. Accessibility Implementation
7. Deployment & Monitoring

---

## 1. ARQUITETURA DE PASTA (Next.js)

```
roncolato-dental/
├── public/
│   ├── images/
│   │   ├── hero/
│   │   ├── gallery/
│   │   ├── team/
│   │   └── testimonials/
│   ├── videos/
│   ├── favicons/
│   └── sitemap.xml
│
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── globals.css         # Global styles
│   │   ├── (home)/
│   │   │   └── page.tsx
│   │   ├── (services)/
│   │   │   ├── page.tsx
│   │   │   ├── implants/page.tsx
│   │   │   ├── invisalign/page.tsx
│   │   │   └── whitening/page.tsx
│   │   ├── (team)/
│   │   │   └── page.tsx
│   │   ├── (about)/
│   │   │   └── page.tsx
│   │   ├── (contact)/
│   │   │   └── page.tsx
│   │   └── api/
│   │       ├── appointment/route.ts
│   │       ├── contact/route.ts
│   │       └── newsletter/route.ts
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── hero/
│   │   │   ├── HeroSection.tsx
│   │   │   └── HeroSection.css
│   │   ├── services/
│   │   │   ├── ServiceCard.tsx
│   │   │   ├── ServiceGrid.tsx
│   │   │   └── ServiceCard.css
│   │   ├── gallery/
│   │   │   ├── BeforeAfter.tsx
│   │   │   ├── Lightbox.tsx
│   │   │   └── Gallery.css
│   │   ├── forms/
│   │   │   ├── AppointmentForm.tsx
│   │   │   ├── ContactForm.tsx
│   │   │   └── forms.css
│   │   ├── testimonials/
│   │   │   ├── TestimonialCard.tsx
│   │   │   ├── TestimonialSlider.tsx
│   │   │   └── testimonials.css
│   │   └── shared/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Badge.tsx
│   │       └── shared.css
│   │
│   ├── styles/
│   │   ├── variables.css       # Design tokens
│   │   ├── animations.css      # Keyframes
│   │   ├── typography.css      # Font setup
│   │   ├── utilities.css       # Utility classes
│   │   └── themes.css          # Dark/light mode
│   │
│   ├── hooks/
│   │   ├── useIntersection.ts
│   │   ├── useMediaQuery.ts
│   │   ├── useScrollPosition.ts
│   │   └── useWindowSize.ts
│   │
│   ├── utils/
│   │   ├── cn.ts              # classname utility
│   │   ├── validators.ts      # Form validation
│   │   ├── constants.ts       # App constants
│   │   └── helpers.ts         # Helper functions
│   │
│   ├── lib/
│   │   ├── api.ts             # API client
│   │   ├── db.ts              # Database connection
│   │   └── auth.ts            # Authentication
│   │
│   └── types/
│       ├── index.ts
│       ├── api.ts
│       ├── components.ts
│       └── models.ts
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .github/
│   └── workflows/
│       ├── deploy.yml
│       └── tests.yml
│
├── tailwind.config.js
├── tsconfig.json
├── next.config.js
├── package.json
└── README.md
```

---

## 2. HTML5 ESTRUCTURA SEMÂNTICA

### 2.1 Root Layout Template

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Roncolato Dental | Clínica Odontológica Premium',
  description: 'Clínica dental de referência com tecnologia avançada e atendimento humanizado',
  metadataBase: new URL('https://roncolatodental.com.br'),
  openGraph: {
    title: 'Roncolato Dental',
    description: 'Clínica odontológica com excelência em atendimento',
    url: 'https://roncolatodental.com.br',
    siteName: 'Roncolato Dental',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Roncolato Dental',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Roncolato Dental',
    description: 'Clínica odontológica de excelência',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="theme-color" content="#007bff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <div id="root" className="flex flex-col min-h-screen">
          <Header />
          <main id="main-content" className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
```

### 2.2 Home Page Semântica

```typescript
// src/app/page.tsx
import HeroSection from '@/components/hero/HeroSection'
import ServicesSection from '@/components/services/ServicesSection'
import GallerySection from '@/components/gallery/GallerySection'
import TestimonialsSection from '@/components/testimonials/TestimonialsSection'
import CTASection from '@/components/cta/CTASection'
import FAQSection from '@/components/faq/FAQSection'

export default function Home() {
  return (
    <>
      {/* Hero Principal */}
      <article className="hero-article">
        <HeroSection />
      </article>

      {/* Seção de Serviços */}
      <section className="services-section" aria-labelledby="services-heading">
        <h2 id="services-heading" className="sr-only">Nossos Serviços</h2>
        <ServicesSection />
      </section>

      {/* Galeria de Casos */}
      <section className="gallery-section" aria-labelledby="gallery-heading">
        <h2 id="gallery-heading">Galeria de Transformações</h2>
        <GallerySection />
      </section>

      {/* Testimoniais */}
      <section className="testimonials-section" aria-labelledby="testimonials-heading">
        <h2 id="testimonials-heading">O que nossos pacientes dizem</h2>
        <TestimonialsSection />
      </section>

      {/* Call-to-Action Principal */}
      <section className="cta-section" aria-labelledby="cta-heading">
        <h2 id="cta-heading">Pronto para transformar seu sorriso?</h2>
        <CTASection />
      </section>

      {/* FAQ */}
      <section className="faq-section" aria-labelledby="faq-heading">
        <h2 id="faq-heading">Perguntas Frequentes</h2>
        <FAQSection />
      </section>
    </>
  )
}
```

### 2.3 Service Page Template

```typescript
// src/app/(services)/[service]/page.tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ServiceHero from '@/components/services/ServiceHero'
import ServiceContent from '@/components/services/ServiceContent'
import ServiceGallery from '@/components/services/ServiceGallery'
import ServiceCTA from '@/components/services/ServiceCTA'
import RelatedServices from '@/components/services/RelatedServices'

interface Props {
  params: { service: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getServiceData(params.service)
  
  if (!service) return { title: 'Serviço não encontrado' }

  return {
    title: `${service.name} | Roncolato Dental`,
    description: service.description,
    openGraph: {
      title: service.name,
      description: service.description,
      images: [{ url: service.image, width: 1200, height: 630 }],
    },
  }
}

export default function ServicePage({ params }: Props) {
  return (
    <article className="service-page">
      {/* Hero do Serviço */}
      <ServiceHero service={params.service} />

      {/* Conteúdo Principal */}
      <section className="service-content-section" aria-labelledby="content-heading">
        <h1 id="content-heading" className="sr-only">{params.service}</h1>
        <ServiceContent service={params.service} />
      </section>

      {/* Galeria Específica do Serviço */}
      <section className="service-gallery-section" aria-labelledby="gallery-heading">
        <h2 id="gallery-heading">Resultados de {params.service}</h2>
        <ServiceGallery service={params.service} />
      </section>

      {/* CTA */}
      <section className="service-cta-section" aria-labelledby="cta-heading">
        <h2 id="cta-heading">Agende sua consulta</h2>
        <ServiceCTA service={params.service} />
      </section>

      {/* Serviços Relacionados */}
      <section className="related-services-section" aria-labelledby="related-heading">
        <h2 id="related-heading">Serviços Relacionados</h2>
        <RelatedServices currentService={params.service} />
      </section>
    </article>
  )
}
```

---

## 3. CSS3 ESTRATÉGIA

### 3.1 Design Tokens (variables.css)

```css
/* src/styles/variables.css */

:root {
  /* Cores Primárias */
  --color-primary: #0066cc;
  --color-primary-dark: #004499;
  --color-primary-light: #3399ff;

  /* Cores Secundárias */
  --color-secondary: #009933;
  --color-secondary-light: #66cc99;
  --color-secondary-dark: #006622;

  /* Paleta Neutra */
  --color-white: #ffffff;
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;
  --color-black: #000000;

  /* Status Colors */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-info: #3b82f6;

  /* Spacing Scale (8px base) */
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-7: 1.75rem;   /* 28px */
  --space-8: 2rem;      /* 32px */
  --space-9: 2.25rem;   /* 36px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */

  /* Typography */
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-serif: 'Georgia', 'Garamond', serif;
  --font-mono: 'Courier New', monospace;

  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
  --font-size-4xl: 2.25rem;   /* 36px */
  --font-size-5xl: 3rem;      /* 48px */

  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  --line-height-loose: 2;

  /* Border Radius */
  --radius-sm: 0.25rem;    /* 4px */
  --radius-base: 0.375rem; /* 6px */
  --radius-md: 0.5rem;     /* 8px */
  --radius-lg: 0.75rem;    /* 12px */
  --radius-xl: 1rem;       /* 16px */
  --radius-2xl: 1.5rem;    /* 24px */
  --radius-full: 9999px;

  /* Shadows */
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-base: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

  /* Transitions */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);

  /* Breakpoints */
  --breakpoint-xs: 320px;
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-white: #111827;
    --color-gray-50: #0f172a;
    --color-gray-900: #f9fafb;
    --color-black: #ffffff;
  }
}
```

### 3.2 Global Styles

```css
/* src/app/globals.css */

/* Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-sans);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  color: var(--color-gray-900);
  background-color: var(--color-white);
  transition: background-color var(--transition-base), color var(--transition-base);
}

/* Typography */
h1 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  margin-bottom: var(--space-4);
}

h2 {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  margin-bottom: var(--space-3);
}

h3 {
  font-size: clamp(1.25rem, 3vw, 1.875rem);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
  margin-bottom: var(--space-2);
}

h4, h5, h6 {
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-2);
}

p {
  margin-bottom: var(--space-4);
}

/* Links */
a {
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--transition-base);
}

a:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

a:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* Lists */
ul, ol {
  margin-left: var(--space-6);
  margin-bottom: var(--space-4);
}

li {
  margin-bottom: var(--space-2);
}

/* Images */
img {
  max-width: 100%;
  height: auto;
  display: block;
}

picture {
  display: block;
}

/* Forms */
input, textarea, select {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-3);
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

label {
  display: block;
  margin-bottom: var(--space-2);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
}

/* Buttons */
button {
  font-family: inherit;
  font-size: inherit;
  font-weight: var(--font-weight-medium);
  padding: var(--space-3) var(--space-6);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
}

button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Utility Classes */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

@media (min-width: 768px) {
  .container {
    padding: 0 var(--space-6);
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### 3.3 Animations

```css
/* src/styles/animations.css */

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

/* Utility Animation Classes */
.animate-fade-in {
  animation: fadeIn 0.3s var(--transition-base);
}

.animate-slide-in-up {
  animation: slideInUp 0.4s var(--transition-base);
}

.animate-slide-in-down {
  animation: slideInDown 0.4s var(--transition-base);
}

.animate-scale-in {
  animation: scaleIn 0.3s var(--transition-base);
}

/* Glassmorphism */
.glass-effect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-lg);
}

/* Responsive Utilities */
@media (max-width: 768px) {
  .hide-mobile {
    display: none !important;
  }
}

@media (min-width: 769px) {
  .hide-desktop {
    display: none !important;
  }
}
```

---

## 4. JAVASCRIPT MODERNO

### 4.1 Custom Hooks

```typescript
// src/hooks/useIntersection.ts
'use client'

import { useEffect, useRef, useState } from 'react'

interface UseIntersectionOptions {
  threshold?: number | number[]
  rootMargin?: string
  triggerOnce?: boolean
}

export function useIntersection<T extends HTMLElement>(
  options: UseIntersectionOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
  } = options

  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (triggerOnce && ref.current) {
            observer.unobserve(ref.current)
          }
        }
      },
      { threshold, rootMargin }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [threshold, rootMargin, triggerOnce])

  return { ref, isVisible }
}
```

### 4.2 Form Validation

```typescript
// src/utils/validators.ts

export interface ValidationError {
  field: string
  message: string
}

export interface FormValidationRules {
  [key: string]: {
    required?: boolean | string
    minLength?: number | { value: number; message: string }
    maxLength?: number | { value: number; message: string }
    pattern?: { value: RegExp; message: string }
    custom?: (value: any) => string | undefined
  }
}

export function validateForm(
  data: Record<string, any>,
  rules: FormValidationRules
): ValidationError[] {
  const errors: ValidationError[] = []

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field]

    // Required validation
    if (fieldRules.required) {
      if (!value || (typeof value === 'string' && !value.trim())) {
        const message = typeof fieldRules.required === 'string'
          ? fieldRules.required
          : `${field} é obrigatório`
        errors.push({ field, message })
        continue
      }
    }

    // MinLength validation
    if (fieldRules.minLength && value) {
      const config = typeof fieldRules.minLength === 'number'
        ? { value: fieldRules.minLength, message: `Mínimo ${fieldRules.minLength} caracteres` }
        : fieldRules.minLength

      if (value.length < config.value) {
        errors.push({ field, message: config.message })
      }
    }

    // Pattern validation
    if (fieldRules.pattern && value) {
      if (!fieldRules.pattern.value.test(value)) {
        errors.push({ field, message: fieldRules.pattern.message })
      }
    }

    // Custom validation
    if (fieldRules.custom && value) {
      const customError = fieldRules.custom(value)
      if (customError) {
        errors.push({ field, message: customError })
      }
    }
  }

  return errors
}

// Common validators
export const validators = {
  email: (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(value) ? undefined : 'Email inválido'
  },
  phone: (value: string) => {
    const regex = /^(?:[\+]?55)?\s?(?:[\(]?[0-9]{2}[\)]?)?\s?9?[0-9]{4}[\-]?[0-9]{4}$/
    return regex.test(value) ? undefined : 'Telefone inválido'
  },
  cpf: (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length !== 11) return 'CPF deve ter 11 dígitos'
    return undefined
  },
}
```

### 4.3 API Client

```typescript
// src/lib/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: Record<string, any>
}

export async function apiCall<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    headers = {},
    body,
  } = options

  const url = `${API_BASE_URL}${endpoint}`

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}

// Appointment API
export const appointmentAPI = {
  submit: (data: AppointmentFormData) =>
    apiCall('/appointment', { method: 'POST', body: data }),

  getAvailableSlots: (date: string) =>
    apiCall(`/appointment/available-slots?date=${date}`),
}

// Contact API
export const contactAPI = {
  submit: (data: ContactFormData) =>
    apiCall('/contact', { method: 'POST', body: data }),
}
```

---

## 5. PERFORMANCE CHECKLIST

### 5.1 Image Optimization

```typescript
// Usar Next.js Image component SEMPRE
import Image from 'next/image'

// ✅ Bom
<Image
  src="/dental-clinic.jpg"
  alt="Clínica Roncolato"
  width={1200}
  height={630}
  priority // apenas para hero/LCP images
  quality={85}
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 1200px"
/>

// ❌ Ruim
<img src="/dental-clinic.jpg" alt="Clínica" />
```

### 5.2 Core Web Vitals Targets

```
LCP (Largest Contentful Paint)  < 2.5s ✅
INP (Interaction to Next Paint)  < 200ms ✅
CLS (Cumulative Layout Shift)    < 0.1 ✅
```

### 5.3 Performance Monitoring

```typescript
// src/lib/analytics.ts

export function reportWebVitals(metric: any) {
  if (typeof window === 'undefined') return

  // Google Analytics
  if (window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'web_vitals',
      value: Math.round(metric.value),
      event_label: metric.id,
      non_interaction: true,
    })
  }

  // Console logging (dev)
  if (process.env.NODE_ENV === 'development') {
    console.log(metric)
  }
}
```

---

## 6. ACCESSIBILITY IMPLEMENTATION

### 6.1 Keyboard Navigation Component

```typescript
// src/components/shared/AccessibleMenu.tsx
'use client'

import { useState, useRef, useEffect } from 'react'

export function AccessibleMenu({ items }: { items: MenuItem[] }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const [focusIndex, setFocusIndex] = useState(0)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusIndex((prev) => (prev + 1) % items.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusIndex((prev) => (prev - 1 + items.length) % items.length)
        break
      case 'Escape':
        setOpen(false)
        break
      case 'Enter':
        e.preventDefault()
        // Handle selection
        break
    }
  }

  return (
    <div ref={menuRef} role="navigation" aria-label="Main menu">
      <button
        aria-expanded={open}
        aria-controls="menu-items"
        onClick={() => setOpen(!open)}
      >
        Menu
      </button>

      {open && (
        <ul id="menu-items" role="menu" onKeyDown={handleKeyDown}>
          {items.map((item, index) => (
            <li key={item.id} role="none">
              <a
                href={item.href}
                role="menuitem"
                tabIndex={index === focusIndex ? 0 : -1}
                autoFocus={index === focusIndex}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

### 6.2 Accessible Form Component

```typescript
// src/components/forms/AccessibleForm.tsx
'use client'

import { useState } from 'react'
import { validateForm, ValidationError } from '@/utils/validators'

export function AccessibleForm() {
  const [errors, setErrors] = useState<ValidationError[]>()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)

    const validationErrors = validateForm(data, {
      name: { required: 'Nome é obrigatório' },
      email: { required: true, custom: validators.email },
      phone: { required: true, custom: validators.phone },
    })

    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    // Submit form
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {errors && (
        <div role="alert" aria-live="assertive" className="error-summary">
          <h2>Verifique os erros abaixo:</h2>
          <ul>
            {errors.map((error) => (
              <li key={error.field}>
                <a href={`#${error.field}`}>{error.message}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="name">Nome *</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          aria-describedby={errors?.find(e => e.field === 'name') ? 'name-error' : undefined}
        />
        {errors?.find(e => e.field === 'name') && (
          <span id="name-error" role="alert">
            {errors.find(e => e.field === 'name')?.message}
          </span>
        )}
      </div>

      <button type="submit">Enviar</button>
    </form>
  )
}
```

---

## 7. DEPLOYMENT & MONITORING

### 7.1 Vercel Deployment

```bash
# 1. Push para GitHub
git push origin main

# 2. Vercel auto-deploys (configurado)

# 3. Vercel Analytics
# Já incluído no Next.js automaticamente

# 4. Environment variables
# .env.local (local)
# Settings → Environment Variables (Vercel Dashboard)
NEXT_PUBLIC_API_URL=https://api.roncolatodental.com.br
DATABASE_URL=...
SMTP_TOKEN=...
```

### 7.2 GitHub Actions CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test-and-build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'

      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm test
      - run: npm run build

      - uses: actions/upload-artifact@v3
        with:
          name: build
          path: .next

  lighthouse:
    needs: test-and-build
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: treosh/lighthouse-ci-action@v9
        with:
          uploadArtifacts: true
          temporaryPublicStorage: true
```

### 7.3 Monitoring Setup

```typescript
// src/app/layout.tsx (adicionar)

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout(...) {
  return (
    <html lang="pt-BR">
      {/* ... */}
      <body>
        {/* ... */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

---

## 📊 RESUMO DE CHECKLIST FINAL

### Antes de Deploy

- [ ] HTML5 semântico em todas as páginas
- [ ] Imagens otimizadas (WebP, lazy loading, responsive)
- [ ] CSS minificado, design tokens definidos
- [ ] JavaScript tree-shaken, async/defer aplicado
- [ ] Lighthouse score >= 90
- [ ] Mobile responsividade testada (320px, 768px, 1024px)
- [ ] Acessibilidade WCAG 2.2 AA confirmada
- [ ] Core Web Vitals no target (LCP, INP, CLS)
- [ ] Meta tags e Open Graph setup
- [ ] Sitemap.xml e robots.txt
- [ ] HTTPS configurado
- [ ] Monitoring setup (Analytics, Sentry)

### Após Deploy

- [ ] Monitorar Web Vitals diariamente
- [ ] Check Analytics para user behavior
- [ ] Error tracking ativo
- [ ] Mobile performance verificada
- [ ] Uptime monitoring setup

---

## 🚀 PRÓXIMOS PASSOS

1. **Clonar repositório Next.js starter**
   ```bash
   npx create-next-app@latest roncolato-dental --typescript --tailwind
   ```

2. **Seguir arquitetura de pasta acima**

3. **Implementar componentes principais**
   - Header/Navigation
   - Hero Section
   - Services Grid
   - Gallery com Lightbox
   - Testimonials Carousel
   - Contact/Appointment Form
   - Footer

4. **Setup Vercel deployment**
   - Connect GitHub repo
   - Configure environment variables
   - Auto-deploy on main push

5. **Monitoring & Analytics**
   - Google Analytics 4
   - Vercel Analytics
   - Web Vitals tracking
   - Error tracking (Sentry)

---

**Documento criado:** 30 de Março, 2026  
**Para:** Projeto Roncolato Dental  
**Versão:** 1.0 - Production Ready
