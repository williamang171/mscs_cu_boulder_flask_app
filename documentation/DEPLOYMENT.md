# Deployment Instructions

## Building and Deploying the App

### Step 1: Build the React Frontend

```bash
# In your React project directory
npm run build
```

This will create a `dist` folder with your production-ready static files.

### Step 2: Copy Build Files to Flask App

```bash
# Copy the entire dist folder to your Flask app directory
# The Flask app is configured to serve files from the 'dist' folder
cp -r dist /path/to/your/flask/app/
```

### Step 3: Run Flask App

```bash
# In your Flask app directory
python app.py
```

Or use a production WSGI server like Gunicorn:

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## How It Works

### Development Mode

- **Frontend**: Runs on `http://localhost:5173` (Vite dev server)
- **Backend**: Runs on `http://localhost:5000` (Flask)
- **API calls**: Frontend makes requests to `http://localhost:5000/api/breweries`

### Production Mode

- **Everything**: Runs on the same domain (e.g., `http://yourserver.com`)
- **API calls**: Frontend makes relative requests to `/api/breweries`
- **Static files**: Flask serves the React build from the `dist` folder

## Environment Detection

The frontend automatically detects the environment:

- `import.meta.env.MODE === 'production'` → Uses relative API paths
- `import.meta.env.MODE === 'development'` → Uses localhost:5000

## File Structure

```
your-flask-app/
├── app.py                 # Flask backend
├── breweries.db          # SQLite database
├── dist/                 # React build output (after npm run build)
│   ├── index.html
│   ├── assets/
│   └── ...
└── requirements.txt
```

## Notes

- The Flask app is configured with `static_folder='dist'` to serve React files
- All non-API routes fall back to `index.html` for client-side routing
- API routes are prefixed with `/api/` to avoid conflicts with frontend routes
- CORS is enabled for development but not needed in production (same domain)
