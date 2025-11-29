# Logi-Ops - Temperature-Controlled Food Shipping Marketplace

A comprehensive digital freight marketplace for temperature-controlled food shipping, built with Next.js 15 and Node.js/TypeScript.

## Features

### Core Functionality

- **Shipper & Carrier Registration**: Complete registration system with vetting process
- **Load Posting & Bidding**: Post loads and receive bids from verified carriers
- **Real-Time Tracking**: WebSocket-based real-time shipment tracking with simulated IoT sensor data
- **Temperature Monitoring**: Live temperature and humidity monitoring with alert thresholds
- **Carrier Vetting**: Automated vetting system checking equipment, insurance, safety records, and experience
- **Load Matching**: AI-powered matching algorithm considering equipment compatibility, routes, temperature requirements, and timing
- **Compliance Checking**: Automated detection of temperature excursions, HACCP violations, and documentation gaps
- **Rating & Reviews**: Carrier and shipper rating and review system

### Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript, WebSocket
- **State Management**: Zustand with persistence
- **Storage**: IndexedDB and LocalStorage for client-side caching
- **Real-Time**: WebSocket for live updates
- **Visualization**: Recharts for graphs, Leaflet for maps

## Project Structure

```
logi-ops-temp-control/
├── frontend/              # Next.js 15 frontend application
│   ├── src/
│   │   ├── app/           # Next.js app router pages
│   │   ├── components/    # React components
│   │   │   ├── layout/    # Layout components (Navbar, etc.)
│   │   │   ├── ui/        # Reusable UI components
│   │   │   ├── registration/ # Registration forms
│   │   │   ├── loads/     # Load-related components
│   │   │   ├── shipments/ # Shipment tracking components
│   │   │   ├── reviews/   # Review components
│   │   │   └── vetting/   # Vetting components
│   │   ├── stores/        # Zustand state stores
│   │   └── lib/           # Utilities (API client, storage)
│   └── package.json
├── backend/               # Node.js/Express backend
│   ├── src/
│   │   ├── data/          # Database (in-memory)
│   │   ├── services/      # Business logic services
│   │   │   ├── vettingService.ts
│   │   │   ├── matchingService.ts
│   │   │   └── complianceService.ts
│   │   ├── utils/         # Utilities (data generator)
│   │   └── server.ts      # Express server + WebSocket
│   └── package.json
├── shared/                # Shared TypeScript types
│   └── types.ts
└── package.json           # Root package.json with workspace scripts
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- TypeScript knowledge helpful but not required

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory

2. **Install all dependencies**:

   ```bash
   npm run install:all
   ```

   This will install dependencies for root, frontend, and backend.

   Or install manually:

   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   ```

### Running the Application

1. **Start both frontend and backend** (recommended):

   ```bash
   npm run dev
   ```

   This runs both servers concurrently.

2. **Or start them separately**:

   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   # Backend runs on http://localhost:3001
   # WebSocket runs on ws://localhost:3002

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   # Frontend runs on http://localhost:3000
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

## API Endpoints

### Backend API (http://localhost:3001/api)

- `GET /api/shippers` - Get all shippers
- `GET /api/shippers/:id` - Get shipper by ID
- `POST /api/shippers` - Create new shipper
- `GET /api/carriers` - Get all carriers
- `GET /api/carriers/:id` - Get carrier by ID
- `POST /api/carriers` - Create new carrier
- `POST /api/carriers/:id/vetting` - Run vetting process
- `GET /api/loads` - Get all loads (with optional query params: status, shipperId)
- `GET /api/loads/:id` - Get load by ID
- `POST /api/loads` - Create new load
- `GET /api/loads/:id/matches` - Get matching carriers for a load
- `POST /api/loads/:id/bids` - Submit a bid
- `POST /api/loads/:id/assign` - Assign load to carrier
- `GET /api/shipments` - Get all shipments (with optional query params)
- `GET /api/shipments/:id` - Get shipment by ID
- `POST /api/shipments/:id/iot-data` - Add IoT sensor data
- `GET /api/shipments/:id/compliance` - Check compliance status
- `GET /api/reviews` - Get reviews (with optional query params)
- `POST /api/reviews` - Create new review

### WebSocket (ws://localhost:3002)

Subscribe to shipment updates:

```javascript
{
  type: 'subscribe',
  shipmentId: 'shipment-id'
}
```

Receive updates:

```javascript
{
  type: 'shipment_update',
  shipmentId: 'shipment-id',
  data: {
    iotData: [...],
    currentLocation: {...},
    complianceStatus: 'compliant'
  }
}
```

## Dummy Data

The application comes pre-loaded with:

- **30+ Shipper profiles** (food processors, distributors)
- **50+ Carrier profiles** with various equipment types
- **100+ Historical shipment records** with routes and pricing
- **Simulated IoT sensor data** (temperature, humidity, location)

All data is generated on backend startup and stored in-memory. In production, this would be replaced with a real database.

## Key Modules

### 1. Registration & Vetting

- Shipper registration with business license and food handling permit
- Carrier registration with equipment, insurance, and certifications
- Automated vetting process checking:
  - Equipment specifications and certifications
  - Insurance coverage
  - Safety records
  - Food handling experience

### 2. Load Management

- Post loads with temperature requirements, routes, and timing
- View matching carriers based on:
  - Equipment compatibility
  - Geographic proximity
  - Temperature range compatibility
  - Carrier ratings and experience
- Bidding system for carriers to submit proposals

### 3. Real-Time Tracking

- WebSocket-based live updates
- Map view showing route and current location
- Temperature and humidity graphs with threshold alerts
- ETA predictions and delay alerts

### 4. Compliance Monitoring

- Automatic temperature excursion detection
- HACCP protocol violation checking
- Documentation gap identification
- Real-time compliance status updates

### 5. Reviews & Ratings

- Shipper reviews of carriers
- Carrier reviews of shippers
- Rating aggregation and display

## Development Notes

### State Management

- Zustand stores with persistence to LocalStorage
- IndexedDB for caching API responses
- WebSocket client for real-time updates

### Component Structure

- Components are organized by feature/module
- UI components are reusable
- Business logic separated from presentation

### Data Flow

1. User action triggers store method
2. Store calls API client
3. API client makes HTTP request
4. Response cached in IndexedDB
5. Store updates state
6. Components re-render

### Real-Time Updates

- WebSocket connection established on shipment view
- Server broadcasts updates every 30 seconds for in-transit shipments
- Client subscribes to specific shipment IDs
- Updates trigger store state changes and UI refresh

## Environment Variables

Create `.env.local` in the frontend directory:

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=ws://localhost:3002
```

## Building for Production

```bash
# Build both frontend and backend
npm run build

# Or build separately
cd frontend && npm run build
cd ../backend && npm run build
```

## Future Enhancements

- Real database integration (PostgreSQL/MongoDB)
- Authentication and authorization
- Payment processing
- Email notifications
- Advanced analytics dashboard
- Mobile app
- Real IoT device integration

## License

This is a demonstration project. Use as needed for learning and development purposes.
