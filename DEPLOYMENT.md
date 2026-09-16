# 🚀 Free Cloud Deployment & Mobile Setup Guide
## MoneyMate — Personal Wealth Portal for Uday Pedakota

This guide explains how to deploy your **MoneyMate** personal finance web application to free cloud hosting and use it on your phone every day.

---

## 1. Free Cloud Database: MongoDB Atlas (M0 — Free Forever)

1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Select the **M0 Shared Cluster** (100% Free, 512MB storage — lasts for 10+ years of daily personal transactions).
3. Choose the **AWS Mumbai (`ap-south-1`)** cloud region for fastest speed in India.
4. Set a database username and password (e.g. `uday` and your secure password).
5. In **Network Access**, click **"Add IP Address"** -> select **"Allow Access from Anywhere (`0.0.0.0/0`)"** (required so your free cloud server can access it).
6. Click **"Connect"** -> **"Drivers"** -> Copy your connection string:
   ```env
   mongodb+srv://uday:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
   ```
7. Paste this connection string into your project's `.env` file as `MONGODB_URI`.

---

## 2. Free Backend Deployment: Render.com (100% Free)

1. Push this project to your GitHub repository (e.g. `https://github.com/<your-username>/wealth-profile-app`).
2. Go to [Render.com](https://render.com) and log in with GitHub.
3. Click **"New +"** -> **"Web Service"** -> Select your repository.
4. Set:
   - **Root Directory**: leave blank or `./`
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
   - **Environment Variables**:
     - `PORT`: `5000`
     - `MONGODB_URI`: `<your MongoDB Atlas connection string>`
5. Click **"Deploy Web Service"**. Render will give you a free live URL:
   `https://moneymate-api-xxxx.onrender.com`

---

## 3. Free Frontend Deployment: Vercel or Netlify (100% Free)

1. Go to [Vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **"Add New Project"** -> Select `wealth-profile-app`.
3. Set:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **"Deploy"**. Vercel will give you a live frontend domain:
   `https://uday-moneymate.vercel.app`

---

## 4. How to Use on Your Mobile Phone (Install as App)

1. Open your live frontend URL on your Android or iPhone Chrome / Safari browser.
2. In Chrome: Tap the **three dots menu (`⋮`)** in the top right -> tap **"Add to Home Screen"** or **"Install app"**.
3. In Safari (iOS): Tap the **Share icon** at the bottom -> tap **"Add to Home Screen"**.
4. The **MoneyMate** green icon will appear on your phone's home screen just like a regular app!
5. Open it anytime to quickly record expenses in 5 seconds (`+ Record Expense`).
