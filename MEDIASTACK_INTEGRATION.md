# MediaStack API Integration Guide

## Issues Fixed ✅

### 1. **API Response Structure Mismatch**
**Problem**: NewsAPI returns `data.articles`, but MediaStack returns `data.data`
**Solution**: Updated to correctly access `data.data` array and `data.pagination` object

### 2. **Property Name Differences**
**Problem**: Different property names between APIs
| NewsAPI | MediaStack | Solution |
|---------|-----------|----------|
| `urlToImage` | `image` | Updated to use `element.image` |
| `publishedAt` | `published_at` | Updated to use `element.published_at` |
| `source.name` | `source` | Updated to use `element.source` directly |

### 3. **Pagination System Different**
**Problem**: NewsAPI uses page-based, MediaStack uses offset-based
**Solution**: Changed from `page` to `offset` state, using `offset += pageSize`

### 4. **Undefined Article Array Error**
**Problem**: `Cannot read properties of undefined (reading 'length')`
**Solution**: Added default empty array with `(this.state.articles || [])`

### 5. **CORS Image Loading Error**
**Problem**: Some images blocked by CORS policy
**Solution**: Added `onError` handler to fallback to placeholder image

### 6. **Error Handling**
**Added**: Try-catch blocks and error state management with user-friendly error messages

---

## MediaStack API Response Structure

### Request
```
GET https://api.mediastack.com/v1/news?access_key=YOUR_KEY&countries=in&limit=8&offset=0
```

### Response
```json
{
  "pagination": {
    "limit": 8,
    "offset": 0,
    "count": 8,
    "total": 10000
  },
  "data": [
    {
      "author": "Author Name",
      "title": "Article Title",
      "description": "Article description...",
      "image": "https://cdn.example.com/image.jpg",
      "url": "https://source.com/article",
      "source": "Source Name",
      "category": "general",
      "language": "en",
      "country": "in",
      "published_at": "2026-03-20T10:30:00+00:00"
    }
  ]
}
```

---

## Current Implementation

### updateNews() Method
- Fetches initial news from MediaStack API
- Uses `offset: 0` for first page
- Properly handles `data.data` array and pagination

### fetchMoreData() Method
- Infinite scroll handler
- Increments offset by pageSize
- Checks if new articles exist before updating state
- Properly concatenates new articles with existing ones

### Error Handling
- Try-catch blocks catch API errors
- User-friendly error messages displayed in alert
- Graceful fallbacks for missing data

---

## Important Notes

### API Key Security ⚠️
⚠️ **IMPORTANT**: Your API key is visible in the code. For production:
1. Move API key to environment variables (.env file)
2. Create a backend endpoint to proxy API requests
3. Never expose API keys in frontend code

### Example .env Setup
```
VITE_MEDIASTACK_API_KEY=your_api_key_here
VITE_MEDIASTACK_BASE_URL=https://api.mediastack.com/v1/news
```

### Image Loading
- Images might fail due to CORS restrictions
- Component now handles failures with placeholder fallback
- Use `onError` handler to gracefully degrade

---

## Testing Your Setup

### Check the browser console for:
- ✅ No "Cannot read properties of undefined" errors
- ✅ No CORS errors on API calls
- ✅ Images loading or showing placeholder
- ✅ Infinite scroll working properly

### API Limits
- MediaStack free tier: 100 requests/month
- Rate limit: 1 request/second
- Max results: 100 per request with pagination

---

## Troubleshooting

### Issue: Still getting errors
1. Check browser console (F12)
2. Verify API key is correct
3. Check network tab for failed requests
4. Ensure pagination isn't going out of bounds

### Issue: Images not loading
1. Check if URL is valid
2. Verify image isn't blocked by CORS
3. Placeholder should show instead
4. Use onError handler (already implemented)

### Issue: Infinite scroll not working
1. Check if articles array is populated
2. Verify hasMore state is true
3. Ensure fetchMoreData is being called

---

## Next Steps (Optional)

### 1. **Switch Back to NewsAPI (if needed)**
The code is structured to switch between APIs. Just comment/uncomment in news.jsx

### 2. **Add Multiple API Sources**
Create a config to switch between APIs:
```javascript
const API_CONFIG = {
  mediastack: { /* config */ },
  newsapi: { /* config */ }
};
```

### 3. **Move API Calls to Backend**
Create a Node.js backend to:
- Proxy API requests (avoid CORS issues)
- Cache results
- Keep API keys secret

### 4. **Add Image Proxy**
Use an image optimization service:
```javascript
const imageUrl = `https://imgproxy.example.com/insecure/.../${encodeURIComponent(imageUrl)}`;
```

---

## MediaStack API Documentation
- Docs: https://mediastack.com/documentation
- Free tier: 100 requests/month
- Supports: 160+ countries

---

## Quick Reference

### State Variables
- `articles`: Array of news articles
- `offset`: Current pagination offset
- `totalResults`: Total available articles
- `hasMore`: Whether more articles can be loaded
- `error`: Error message if any
- `loading`: Loading state

### Key Methods
- `updateNews()`: Fetch initial news
- `fetchMoreData()`: Fetch next page for infinite scroll
- `capitalizeFirstLetter()`: Format category names

### Media Stack vs NewsAPI Comparison

| Feature | MediaStack | NewsAPI |
|---------|-----------|---------|
| **Response Structure** | `data.data` | `data.articles` |
| **Pagination** | Offset-based | Page-based |
| **Image Property** | `image` | `urlToImage` |
| **Date Property** | `published_at` | `publishedAt` |
| **Source Format** | String | Object `{name}` |
| **Free Requests** | 100/month | ~500/month |

---

**All errors should now be fixed! Your app is ready to show articles from MediaStack.** 🎉
