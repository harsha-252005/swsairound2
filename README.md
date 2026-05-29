# SmartDocHub

Full-stack PDF document management with real-time WebSocket notifications.

- **Frontend** → Vercel
- **Backend** → Railway / Render / any Java host
- **Database** → PlanetScale / Railway MySQL / any MySQL host

---

## Local Development

### Backend
```bash
cd smartdochubs
.\mvnw spring-boot:run
```
Runs on `http://localhost:8080`

### Frontend
```bash
cd smartdocs-frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`

---

## Deploy Frontend to Vercel

### 1. Push to GitHub

```bash
cd C:\Users\nirru\Downloads\smartdochubs
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/smartdochubs.git
git push -u origin main
```

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Set **Root Directory** to `smartdocs-frontend`
4. Framework preset: **Vite**
5. Add environment variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.com` (your deployed backend)
6. Click **Deploy**

---

## Deploy Backend to Railway

1. Go to [railway.app](https://railway.app) → New Project
2. Deploy from GitHub → select repo → set root to `smartdochubs`
3. Add a **MySQL** plugin in Railway
4. Set environment variables in Railway:
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://...
   SPRING_DATASOURCE_USERNAME=root
   SPRING_DATASOURCE_PASSWORD=...
   FILE_UPLOAD_DIR=uploads/
   ```
5. Copy the Railway backend URL → paste into Vercel `VITE_API_URL`

---

## Environment Variables

### Frontend (`smartdocs-frontend`)

| Variable | Local | Production |
|----------|-------|------------|
| `VITE_API_URL` | `http://localhost:8080` | `https://your-backend.railway.app` |

### Backend (`smartdochubs`)

| Variable | Description |
|----------|-------------|
| `SPRING_DATASOURCE_URL` | MySQL JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | DB username |
| `SPRING_DATASOURCE_PASSWORD` | DB password |
| `FILE_UPLOAD_DIR` | Upload folder path |

---

## Project Structure

```
smartdochubs/                   ← root (git repo)
├── smartdochubs/               ← Spring Boot backend
│   ├── src/
│   ├── uploads/
│   └── pom.xml
├── smartdocs-frontend/         ← React frontend (deployed to Vercel)
│   ├── src/
│   ├── vercel.json
│   └── vite.config.js
└── README.md
```
