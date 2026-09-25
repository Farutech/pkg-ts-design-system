# Checklist de migración del catálogo (TASK-201)

Fuentes: `faridmaloof/dashboard` → `src/components/ui/*` (49 archivos) · `website-farutech` → `apps/frontend/src/components/{primitives,patterns}.tsx`.
Regla de oro (doc 08 req. 2): **reconciliar antes de migrar** — una sola API por componente, estilos en tokens (`--ft-*`), nunca Tailwind quemado dentro del paquete.

| # | Componente | Origen | Estado | Notas |
|---|---|---|---|---|
| 1 | Button | ambos | ✅ MIGRADO (reconciliado) | superset: solid+outline/ghost, loading, icon, fullWidth, to/href vía LinkComponent |
| 2 | Badge / Tag / StatusBadge | ambos | ✅ MIGRADO (reconciliado) | Badge con `variant/dot/mono`; StatusBadge = preset |
| 3 | Input | dashboard | ✅ MIGRADO | reescrito con tokens; label/error/hint accesibles |
| 4 | Alert | dashboard | ✅ MIGRADO | reescrito con tokens; dismissible accesible |
| 5 | Spinner | dashboard | ✅ MIGRADO | + LabelLoading cubre `Loading`/`LogoSpinner` |
| 6 | DesignSystemProvider + tokens | nuevo | ✅ MIGRADO | tema por app sin fork (doc 08 req. 4) |
| 7 | ButtonGroup | dashboard | ⬜ pendiente | |
| 8 | Checkbox | dashboard | ⬜ pendiente | accesibilidad: input nativo + label |
| 9 | RadioGroup | dashboard | ⬜ pendiente | |
| 10 | Switch | dashboard | ⬜ pendiente | role="switch" |
| 11 | Select | dashboard | ⬜ pendiente | |
| 12 | Textarea | dashboard | ⬜ pendiente | |
| 13 | MaskedInput | dashboard | ⬜ pendiente | evaluar dependencia externa |
| 14 | PhoneInput | dashboard | ⬜ pendiente | |
| 15 | TagInput | dashboard | ⬜ pendiente | |
| 16 | DatePicker / DateControls | dashboard | ⬜ pendiente | |
| 17 | Form | dashboard | ⬜ pendiente | |
| 18 | DataTable | dashboard | ⬜ pendiente | tiene README propio en origen |
| 19 | Charts | dashboard | ⬜ pendiente | |
| 20 | StatsCard | dashboard | ⬜ pendiente | |
| 21 | ListBox / ListGroup | dashboard | ⬜ pendiente | |
| 22 | Scheduler | dashboard | ⬜ pendiente | |
| 23 | Stepper | dashboard | ⬜ pendiente | |
| 24 | ProgressBar | dashboard | ⬜ pendiente | |
| 25 | CrudActions/Filters/Pagination/Table | dashboard | ⬜ pendiente | compuestos CRUD |
| 26 | Tooltip | dashboard | ⬜ pendiente | |
| 27 | Modal | dashboard | ⬜ pendiente | focus trap |
| 28 | Drawer | dashboard | ⬜ pendiente | |
| 29 | Toast | dashboard | ⬜ pendiente | |
| 30 | NotificationPanel | dashboard | ⬜ pendiente | |
| 31 | Skeleton | dashboard | ⬜ pendiente | |
| 32 | EmptyState | dashboard | ⬜ pendiente | |
| 33 | GlobalLoading | dashboard | ⬜ pendiente | |
| 34 | Breadcrumb | dashboard | ⬜ pendiente | |
| 35 | Tabs | dashboard | ⬜ pendiente | |
| 36 | Dropdown | dashboard | ⬜ pendiente | |
| 37 | CommandPalette | dashboard | ⬜ pendiente | |
| 38 | Carousel | dashboard | ⬜ pendiente | |
| 39 | Divider | dashboard | ⬜ pendiente | |
| 40 | Avatar | dashboard | ⬜ pendiente | |
| 41 | IconRenderer | dashboard | ⬜ pendiente | |
| 42 | Card | dashboard | ⬜ pendiente | |
| 43 | CodePreview | dashboard | ⬜ pendiente | |
| 44 | ImageUpload | dashboard | ⬜ pendiente | |
| 45 | FloatingActionButton | dashboard | ⬜ pendiente | |
| 46 | ModuleSwitcher | dashboard | ⬜ pendiente | revisar si es de negocio → fuera del paquete (doc 04 B.1) |
| 47 | Eyebrow / SectionHeading | apps/frontend | ✅ MIGRADO | componente `Content`; estilos 100% tokens |
| 48 | Reveal | apps/frontend | ✅ MIGRADO | reescrito con IntersectionObserver nativo — elimina framer-motion (doc 08 PERFORMANCE) |
| 49 | Sidebar / Navbar / MainLayout / RequireAuth | dashboard layout | ⬜ pendiente | requieren tokens + RequireAuth decide sesión en TASK-203 |
| 50 | **Menú horizontal** | — | ⬜ pendiente | TASK-204 (nueva construcción) |
| 51 | Login / ForgotPassword / Register | dashboard + nuevo | ✅ MIGRADO | `auth-screens/`: endpoint por props (`onSubmit`), sin backend fijo, sin storage de token (SECURITY doc 08). Register conecta al contrato real del backend Lumen (`POST /register`) |

**Documentación viva (doc 08 req. 5):** la base son las páginas `dashboard/pages/design-system/*` (TokensPage, ColorsPage, ComponentsLibraryPage, ChartsLibraryPage, TypographyPage) — se adaptan cuando el catálogo alcance masa crítica; la decisión de Storybook queda descartada salvo evaluación contraria (anti-overengineering).
