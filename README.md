# Strada

A modern vehicle rental platform. Strada is a contemporary, performance-focused rental experience built with the React/Next.js ecosystem and a responsive Tailwind CSS UI. It delivers seamless vehicle discovery, booking management, and profile experiences while showcasing strong component architecture and responsive design best practices.

## What the site does

- Vehicle discovery with rich visuals and responsive layouts
- Secure sign in/sign up and session handling
- Booking flow with checkout integration
- User profile management and order history
- Admin tools for products and orders (private routes)

## Why this is useful

- Streamlines renting vehicles with a clear, mobile-first UX
- Reduces operational overhead via admin workflows (add product, manage orders)
- Built with modern web practices for speed, accessibility, and maintainability
- Scales easily thanks to modular components and clear separation of concerns

## Tech stack

- Framework: Next.js 15 and React 19
- Styling: Tailwind CSS, custom UI primitives
- Authentication/DB: Supabase
- Payments: Stripe (checkout + webhook routes)
- Utilities: date-fns, clsx, tailwind-merge, class-variance-authority, next-themes, Sonner

## Features

- Responsive landing page with animated media and modern typography
- Auth pages (login/signup) and protected app sections
- Product/vehicle listing pages and detail-driven components
- Booking workflow with Stripe checkout session and webhook handling
- Admin dashboard: add product, manage orders, overview metrics
- Reusable UI components (buttons, inputs, tables, tabs, etc.)

## Project structure

```text
src/
  app/
    (private)/
      admin/
        activeOrders/
        addProduct/
        allOrders/
        dashboard/
      bookings/
      dashboard/
      order/
      product/
      profile/
      vehicles/
    api/
      create-checkout-session/
      stripe-webhook/
    auth/
    ClientLayout.js
    globals.css
    layout.jsx
    page.jsx
  components/
    auth/
    context/
    ui/
    Navbar.jsx
    Footer.jsx
    VehicleCard.jsx
  hooks/
  lib/
public/
  sliderImages/
  logo.png
  logoBlack.png
```

## Getting started

```bash
npm install
npm run dev
# open http://localhost:3000
```

### Build

```bash
npm run build
```

### Run production locally

```bash
npm run start
```

## Deployment

- Recommended: Vercel
  - Push to GitHub and import the repo on Vercel
  - Set environment variables for Supabase (URL, anon/service keys) and Stripe (public key, secret key, webhook secret)
  - Configure the Stripe webhook to point to `/api/stripe-webhook`
  - Trigger a deploy; Vercel handles Next.js output automatically
