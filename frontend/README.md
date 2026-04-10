# CRM Pro Frontend

A complete, modern CRM Frontend built with React, Vite, and Tailwind CSS.

## Features

- **Dashboard**: High-level stats, revenue growth chart (placeholder), recent activity, and tasks.
- **Customers**: Full CRUD with search and modal-based forms.
- **Leads**: Pipeline status badges and estimated value tracking.
- **Tasks**: Priority-based task management with completion toggles.
- **Deals**: Kanban-style sales pipeline grouped by stages.
- **Settings**: Professional profile and company settings UI.
- **Auth**: Frontend-only login protection with localStorage persistence.
- **Data Layer**: Simulated API using localStorage (ready for backend integration).

## Tech Stack

- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS (Premium SaaS aesthetic)
- **Icons**: Lucide React
- **Routing**: React Router DOM v6
- **HTTP**: Axios (prepared for backend)

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Login Credentials**
   - **Email**: `admin@crm.com`
   - **Password**: `password123`

## Folder Structure

```
src/
├── components/      # Reusable UI components (Sidebar, Navbar, StatsCard, etc.)
├── pages/           # Page components
├── services/        # Storage and API logic
├── App.jsx          # Routing and main application logic
└── index.css        # Tailwind and global styles
```
