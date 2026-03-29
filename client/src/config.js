const API_URL = 
  process.env.NODE_ENV === 'production' 
    ? 'https://your-render-app-name.onrender.com/api' // Replace with actual Render URL later
    : 'http://localhost:5000/api';

export default API_URL;
