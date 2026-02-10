# Energy Platform - Developer Onboarding Questions

Use these questions to assess a new developer's readiness to contribute to the energy platform codebase. Questions are grouped by domain area and progress from foundational to advanced.

---

## 1. Project Architecture & Structure

1. The energy platform is split into two main application directories. What framework does each use, and on which ports do they run in development?
2. What role does `docker-compose.yml` play in local development, and which services does it orchestrate?
3. Explain the purpose of the `nginx.conf` file and when it comes into play.
4. Walk through what happens when you run `npm run dev` from the project root.

---

## 2. Backend (Node.js / Express / TypeScript)

### Core Concepts

5. Describe the middleware chain a typical authenticated API request passes through from entry to response.
6. What is the `asyncHandler` wrapper in `errorMiddleware.ts`, and why is it needed for Express route handlers?
7. How does the custom `ApiError` class differ from a standard JavaScript `Error`, and where is it caught?
8. Explain how `authMiddleware.ts` implements role-based access control. What roles exist in the system?

### Data Layer (Prisma / PostgreSQL)

9. What is Prisma's role in this project, and where is its schema defined?
10. List the core domain models in `schema.prisma` and describe how they relate to each other (e.g., User -> Quote -> QuoteItem -> Product).
11. What product categories does the platform support, and how are they represented in the data model?
12. Explain the lifecycle of a Quote: what statuses can it have, and which endpoints transition it between them?
13. What is the difference between a `Product` and a `Bundle`? How are bundles composed?
14. Walk through the order lifecycle from creation to installation. What models and status enums are involved?
15. How would you run a database migration after changing the Prisma schema? What command seeds the database with sample data?

### API Routes

16. Describe the filtering and pagination strategy used in the `GET /api/products` endpoint.
17. What inputs does the `POST /api/calculator/estimate` endpoint accept, and what does it return?
18. How does the quote-to-order conversion work? Can an order be created without a quote?

### Security

19. What security middleware is applied globally in `index.ts`, and what does each one protect against?
20. How are passwords stored, and what library handles hashing? What is the salt round configuration?
21. What is the JWT expiration policy, and where are tokens validated?
22. Explain the rate limiting configuration. What are its limits, and which routes does it apply to?

---

## 3. Frontend (Next.js 14 / TypeScript / Tailwind)

### Framework & Routing

23. This project uses Next.js 14 with the App Router. What is the difference between a Server Component and a Client Component, and how does the `'use client'` directive control this?
24. How is the page routing structured under `src/app/`? List the main pages and their purposes.
25. What does `ProtectedRoute` do, and how does it interact with the authentication state?

### State Management & Data Fetching

26. How is authentication state managed across the frontend? Describe the `AuthContext` and what it provides.
27. What library handles server-state and data fetching? How is the query client configured?
28. Explain how `api-client.ts` works: what do the request and response interceptors do?
29. What happens in the frontend when the API returns a 401 status code?

### System Builder Page

30. The builder page (`builder/page.tsx`) is one of the most complex pages. Walk through how a user would use it to size an energy system.
31. What calculations does the builder perform client-side? Explain the formulas for inverter sizing, battery capacity, and solar recommendations.
32. How does the builder handle the transition from calculation to checkout?

### UI & Design System

33. What component library provides the base UI primitives (buttons, cards, inputs, etc.)? Where do those components live in the codebase?
34. Describe the role of Framer Motion in the landing page. What types of animations are used?
35. What is Lenis (`@studio-freight/lenis`), and why is it used instead of native browser scrolling?

---

## 4. Domain Knowledge (Energy Systems)

36. What are the three target market segments this platform serves? How do their system requirements differ?
37. Explain what "depth of discharge" (DOD) means for batteries and why it matters for capacity calculations.
38. What is the difference between a backup, hybrid, and off-grid energy system? How does the builder page reflect these options?
39. What system components make up a typical residential installation on this platform?

---

## 5. DevOps & Tooling

40. How would you bring up the full development stack using Docker? What persistent volumes are used?
41. What TypeScript configuration choices have been made (check `tsconfig.json` for both frontend and backend)? Are path aliases used?
42. How is the frontend configured for static export (e.g., Netlify deployment)? What trade-offs does this create?

---

## 6. Integration & Payments

43. What payment provider is integrated, and what environment variables are required for it?
44. How is email sending configured? What service does it use?
45. Describe the relationship between the `Payment` model and the `Order` model. What payment methods are supported?

---

## 7. Scenario-Based Questions

46. A customer reports that their quote PDF download returns a blank page. Where would you start debugging? Trace the code path from the button click to the PDF generation.
47. You need to add a new product category called "EV_CHARGER". What files and models would you need to update?
48. The system builder is recommending an inverter that is too small for a customer's load. Where would you look to adjust the sizing algorithm and safety factors?
49. A new role "TECHNICIAN" needs to be added with permissions to view installations but not modify orders. What changes are required across the stack?
50. The product listing page is slow when there are 500+ products. What caching or optimization strategies could you apply using the existing Redis infrastructure?
