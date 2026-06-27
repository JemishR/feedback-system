# Feedback System

## About
A modern, full-stack feedback and roadmap management system built with a robust Laravel (PHP) backend and a dynamic React (TypeScript) frontend. This platform allows users to submit, vote on, and discuss feature requests, while providing administrators with a powerful dashboard to manage feedback and publish changelogs.

## Features

- **Backend:** Laravel
- **Frontend:** React with TypeScript
- **Styling:** Tailwind CSS

## Getting Started

### Prerequisites
- PHP 8.x
- Composer
- Node.js & npm/pnpm

### Installation

1. Clone the repository
2. Install PHP dependencies:
   ```bash
   composer install
   ```
3. Install Node dependencies:
   ```bash
   npm install
   ```
4. Copy `.env.example` to `.env` and configure your database
   ```bash
   cp .env.example .env
   ```
5. Generate the application key:
   ```bash
   php artisan key:generate
   ```
6. Run database migrations:
   ```bash
   php artisan migrate
   ```
7. Start the development servers:
   ```bash
   php artisan serve
   npm run dev
   ```
