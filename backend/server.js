import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3001;
const MEDIASTACK_API_KEY = process.env.MEDIASTACK_API_KEY;
const MEDIASTACK_BASE_URL = 'https://api.mediastack.com/v1/news';

// Enable CORS for frontend requests
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

// 🔒 SECURE NEWS API ENDPOINT - API key is hidden here
app.get('/api/news', async (req, res) => {
  try {
    // Extract query parameters from frontend request
    const { categories, limit = 12, offset = 0 } = req.query;

    if (!MEDIASTACK_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Build URL with secure API key (hidden from client)
    const url = new URL(MEDIASTACK_BASE_URL);
    url.searchParams.append('access_key', MEDIASTACK_API_KEY);
    url.searchParams.append('categories', categories || 'general');
    url.searchParams.append('countries', 'in');
    url.searchParams.append('limit', limit);
    url.searchParams.append('offset', offset);

    console.log(`📰 Fetching news: categories=${categories}, limit=${limit}, offset=${offset}`);
    console.log(`🔗 MediaStack URL: ${url.toString().replace(MEDIASTACK_API_KEY, '***SECRET***')}`);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (!response.ok) {
      console.error('❌ MediaStack error (status ' + response.status + '):', data);
      return res.status(response.status).json(data);
    }

    console.log(`✅ Got ${data.data?.length || 0} articles`);
    res.json(data);
  } catch (error) {
    console.error('Backend error:', error);
    res.status(500).json({ error: 'Failed to fetch news', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running at http://localhost:${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/news`);
  console.log(`🔒 API key is hidden and secure on this server`);
});
