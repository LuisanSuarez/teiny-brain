# Corpus Extraction — NestJS (v1 draft)

Repo: NestJS
URL: https://github.com/nestjs/nest
Date: 2026-02-24

## Architecture patterns worth stealing
- Module boundaries with explicit providers/controllers
- Dependency injection for testability and composability
- Convention-first folder structure for maintainability

## API/design ergonomics
- Strong decorator-driven DX
- Clear structure at app scale
- Risk: abstractions can hide fundamentals for juniors

## Error handling strategy
- Exception filters centralize handling
- Consistent HTTP error responses

## Testing strategy
- Good separation of unit vs e2e patterns
- Test modules make dependency isolation easier

## Reusable checklist entries for Teiny
- “Did we preserve clear module boundaries?”
- “Can this component be tested with swapped dependencies?”
- “Are errors normalized at boundaries?”
