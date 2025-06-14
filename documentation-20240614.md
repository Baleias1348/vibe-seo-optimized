# Vibe SEO Optimized - Project Documentation
*Last Updated: June 14, 2024*

## Project Overview
Vibe SEO Optimized is a modern, responsive web application built with React and Vite, designed to provide information about restaurants, currency exchange rates, weather, and tours in Chile. The application features a clean, user-friendly interface with a focus on performance and search engine optimization.

## Table of Contents
1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Key Features](#key-features)
4. [Setup Instructions](#setup-instructions)
5. [Component Documentation](#component-documentation)
6. [Styling System](#styling-system)
7. [State Management](#state-management)
8. [API Integrations](#api-integrations)
9. [Deployment](#deployment)
10. [SEO Implementation](#seo-implementation)

## Tech Stack

### Core Technologies
- **Frontend Framework**: React 18
- **Build Tool**: Vite 4.4.5
- **Styling**: CSS3 with Tailwind CSS
- **Routing**: React Router v6
- **Icons**: React Icons (v5.5.0)
- **Animation**: Framer Motion
- **Form Handling**: React Hook Form

### Key Dependencies
- `@supabase/supabase-js`: For database and authentication
- `react-helmet-async`: For SEO management
- `date-fns`: For date manipulation
- `react-toastify`: For user notifications

## Project Structure

```
vibe-seo-optimized/
├── public/                  # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── auth/           # Authentication components
│   │   ├── layout/         # Layout components
│   │   ├── restaurants/    # Restaurant-specific components
│   │   └── ui/             # Base UI components (buttons, inputs, etc.)
│   │
│   ├── hooks/             # Custom React hooks
│   ├── lib/                # Utilities and helpers
│   └── pages/              # Page components
│       ├── restaurants/    # Restaurant listing and details
│       ├── currency/       # Currency exchange
│       ├── weather/        # Weather information
│       └── tours/          # Tour packages
│
├── .gitignore
├── package.json
├── README.md
└── vite.config.js
```

## Key Features

### 1. Restaurant Listings
- Responsive grid layout for restaurant cards
- Advanced filtering by cuisine and neighborhood
- Detailed restaurant information with images
- Favorites functionality
- Opening hours with real-time status

### 2. Currency Exchange
- Real-time currency conversion
- Historical exchange rate data
- Interactive currency selector

### 3. Weather Information
- Current weather conditions
- 5-day forecast
- Location-based weather data

### 4. Tour Packages
- Featured tour listings
- Filtering by activity type and difficulty
- Booking functionality

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account (for database and authentication)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/vibe-seo-optimized.git
   cd vibe-seo-optimized
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

## Component Documentation

### Restaurant Components

#### `RestaurantsPage`
- **Location**: `src/pages/restaurants/RestaurantsPage.jsx`
- **Purpose**: Main page for displaying restaurant listings
- **Features**:
  - Filtering by cuisine and neighborhood
  - Search functionality
  - Responsive grid layout
  - Favorite functionality

#### `RestaurantCard`
- **Location**: `src/components/restaurants/RestaurantCard.jsx`
- **Purpose**: Displays individual restaurant information
- **Props**:
  - `restaurant`: Object containing restaurant details
  - `isFavorite`: Boolean indicating if restaurant is favorited
  - `onFavoriteClick`: Function to handle favorite toggle

### Currency Components

#### `CurrencyConverter`
- **Location**: `src/pages/currency/CurrencyConverter.jsx`
- **Purpose**: Handles currency conversion
- **Features**:
  - Real-time conversion
  - Historical rate charts
  - Multiple currency support

## Styling System

The application uses a combination of:

1. **Tailwind CSS** for utility-first styling
2. **CSS Modules** for component-specific styles
3. **CSS Variables** for theming

### Theme Configuration
Colors and other design tokens are defined in `src/styles/theme.css`:

```css
:root {
  --primary: #1268f5;
  --primary-light: #e6f0ff;
  --secondary: #e8094b;
  --accent: #2ecc71;
  --text: #2c3e50;
  --text-light: #7f8c8d;
  --background: #ffffff;
  --gray-light: #f8f9fa;
  --gray: #e9ecef;
  --gray-dark: #6c757d;
}
```

## State Management

### Local State
- React's built-in `useState` and `useReducer` hooks
- Context API for global state
- URL parameters for filter states

### Data Fetching
- Custom hooks for data fetching
- React Query for server state management
- Supabase client for database operations

## API Integrations

### Supabase
- Used for:
  - Authentication
  - Database operations
  - File storage

### External APIs
- OpenWeatherMap API for weather data
- ExchangeRate-API for currency conversion
- Google Maps API for location services

## Deployment

The application is configured for deployment on Vercel, but can be deployed to any static hosting service.

### Production Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

## SEO Implementation

### Key SEO Features
1. **React Helmet Async** for dynamic meta tags
2. **Semantic HTML5** elements
3. **Responsive design** for all device sizes
4. **Performance optimizations**:
   - Code splitting
   - Lazy loading of images and components
   - Optimized asset loading

### Sitemap and Robots
- Dynamic sitemap generation
- Custom robots.txt configuration

## Performance Optimizations

1. **Code Splitting**:
   - Route-based code splitting
   - Dynamic imports for heavy components

2. **Image Optimization**:
   - Responsive images with srcset
   - Lazy loading for below-the-fold images
   - WebP format with fallbacks

3. **Bundle Analysis**:
   - Source map exploration
   - Bundle size monitoring

## Testing

### Unit Testing
- Jest with React Testing Library
- Test coverage reporting

### E2E Testing
- Cypress for end-to-end tests
- Visual regression testing

## Future Improvements

1. **Performance**:
   - Implement service workers for offline support
   - Add more granular code splitting

2. **Features**:
   - User reviews and ratings
   - Advanced search filters
   - Integration with booking systems

3. **Accessibility**:
   - Full WCAG 2.1 AA compliance
   - Screen reader optimization
   - Keyboard navigation

## Troubleshooting

### Common Issues
1. **Environment Variables Not Loading**
   - Ensure `.env` file is in the root directory
   - Restart the development server after adding new variables

2. **API Rate Limiting**
   - Check API quotas
   - Implement proper error handling and fallbacks

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*Documentation generated on June 14, 2024*
