# Google Maps API Setup Guide

This guide will help you set up Google Maps API for the restaurant location picker feature.

## Error: ApiNotActivatedMapError

If you see this error in the browser console, it means the **Maps JavaScript API** is not enabled for your API key.

## Step-by-Step Setup

### 1. Go to Google Cloud Console

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)

### 2. Enable Required APIs

You need to enable the following APIs:

#### Maps JavaScript API
1. Go to **APIs & Services** > **Library**
2. Search for "Maps JavaScript API"
3. Click on it and press **Enable**

#### Places API (for address autocomplete)
1. In the same library, search for "Places API"
2. Click on it and press **Enable**

#### Geocoding API (for reverse geocoding)
1. In the same library, search for "Geocoding API"
2. Click on it and press **Enable**

### 3. Create or Verify API Key

1. Go to **APIs & Services** > **Credentials**
2. If you don't have an API key, click **Create Credentials** > **API Key**
3. Copy your API key

### 4. Restrict API Key (Recommended for Production)

For security, restrict your API key:

1. Click on your API key to edit it
2. Under **API restrictions**, select **Restrict key**
3. Check the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Under **Application restrictions**, you can:
   - For development: Select **HTTP referrers** and add `http://localhost:*`
   - For production: Add your production domain (e.g., `https://yourdomain.com/*`)

### 5. Add API Key to Environment Variables

Add your API key to the `.env` file in the frontend directory:

```env
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### 6. Restart Development Server

After adding the API key, restart your development server:

```bash
npm run dev
```