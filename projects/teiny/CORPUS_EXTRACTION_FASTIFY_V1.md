# Corpus Extraction — Fastify (v1 draft)

Repo: Fastify
URL: https://github.com/fastify/fastify
Date: 2026-02-24

## Architecture patterns worth stealing
- Plugin architecture for clean extension
- Schema-first validation for speed and safety
- Lifecycle hooks for composable middleware behavior

## API/design ergonomics
- Minimal core, explicit composition
- Performance-oriented defaults

## Error handling strategy
- Structured error objects and predictable responses
- Strong emphasis on validation failures upfront

## Testing strategy
- Lightweight test patterns that mirror runtime behavior

## Reusable checklist entries for Teiny
- “Could this be a plugin instead of hardcoding?”
- “Are request/response schemas explicit?”
- “Do hooks introduce hidden coupling?”
