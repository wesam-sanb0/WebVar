# WebVar
WebVar is a website that helps users shop safely and save money online. It includes secure account features, checks links for phishing risk using smart security scans, and compares product prices across major stores to show the best available deal in one place.

This group project was develop by group 8 in the AI Club at Imam Abdulrahman Bin Faisal University (IAU) and present at the university's club Expo in 2025 May 1st.

# GROUP 8 MEMBERS:

- Wesam Sanbo
- Mona Alsubaie
- Layan Almudarra
- Norah Alsubaie
- Fatimah Al-Abdullah

## What WebVar Does

- User authentication: signup, login, email verification, profile, and password reset flows.
- Secure shopping check: scans URLs using manual heuristics + Google Safe Browsing API.
- Price comparison: scrapes product data and compares prices across supported stores.
- Contact support: sends user messages from the app to project email.

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)
- Extra services: Gmail SMTP, Cloudinary, Google Safe Browsing

## Project Structure

```
WEB 2/
	webvar-frontend/
	webvar-backend/
```

## Quick Start

### 1) Backend setup

Open terminal in `webvar-backend` and run:

```powershell
pnpm install
pnpm dev
```

Backend default port in code is `5000`, but the frontend currently calls APIs on `http://localhost:3000`.
To keep both sides aligned, set `PORT=3000` in the backend `.env` file.

### 2) Frontend setup

Open another terminal in `webvar-frontend` and run:

```powershell
pnpm install
pnpm dev
```

Frontend runs by default on:

`http://localhost:5173`

## Backend Environment Variables

Create `webvar-backend/.env` with values like:

```env
PORT=3000
NODE_ENV=development

MONGO_URL=mongodb://127.0.0.1:27017/webvar

JWT_SECRET=replace_with_strong_secret
JWT_ACCESS=replace_with_access_secret
JWT_RESET=replace_with_reset_secret

BASE_URL=http://localhost:5173

EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

Cloud_name=your_cloudinary_cloud_name
API_key=your_cloudinary_api_key
API_secret=your_cloudinary_api_secret

GOOGLE_API_KEY=your_google_safe_browsing_key
```

## Available Scripts

### Backend (`webvar-backend/package.json`)

- `pnpm dev`: run backend with nodemon
- `pnpm start`: run backend with node

### Frontend (`webvar-frontend/package.json`)

- `pnpm dev`: start Vite dev server
- `pnpm build`: create production build
- `pnpm preview`: preview production build locally
- `pnpm lint`: run ESLint

## Main API Routes

- `POST /api/auth/register`
- `GET /api/auth/verify-email`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `POST /api/auth/forget-password`
- `POST /api/auth/reset-password`
- `PUT /api/auth/change-password`
- `POST /api/auth/upload-profile-image`
- `POST /api/auth/contact-us`
- `POST /api/url-phishing`
- `POST /api/price-comparison`

## Notes for Teammates

- The frontend currently uses hardcoded backend URLs with port `3000`.
- If you change backend port, also update frontend API URLs.
- Puppeteer is used for scraping, so first run may take longer on some machines.

## Project Status

Current implementation includes:

- Authentication and profile flows
- URL phishing detection endpoint and frontend page
- Product price comparison endpoint and frontend page
- Contact form integration

