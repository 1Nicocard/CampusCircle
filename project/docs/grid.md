# Grid System — CampusCircle

## Breakpoints (Tailwind)
- sm: 640px
- md: 768px (tablet)
- lg: 1024px (laptop)
- xl: 1280px
- 2xl: 1440px

## Container
Usar `<div class="container">...</div>` para centrar contenido y respetar el padding responsive definido en `tailwind.config.js`.

## Reglas
- Base mobile-first: `col-span-12`.
- Tablet: dividir 6/6 (`md:col-span-6`).
- Desktop: 4/4/4 o 3/9 según pantalla.
- Gutters: `gap-4 md:gap-6 lg:gap-8`.

## Patrones según el prototipo
- **Landing hero**: `lg:col-span-6` + `lg:col-span-6`.
- **Feed**: sidebar `lg:col-span-3`, main `lg:col-span-9`.
- **Profile settings**: info `md:col-span-4`, form `md:col-span-8`.
- **Planner**: filtros arriba, calendario `col-span-12`.

## Ejemplo
```html
<section class="container py-8">
  <div class="grid grid-cols-12 gap-4 md:gap-6 lg:gap-8">
    <div class="col-span-12 lg:col-span-3">Sidebar</div>
    <div class="col-span-12 lg:col-span-9">Content</div>
  </div>
</section>
