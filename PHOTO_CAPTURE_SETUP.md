# 📸 Photo Capture Setup Instructions

## Step 1: Get Your Resend API Key

1. Go to [resend.com](https://resend.com)
2. Sign up for free account (100 emails/day)
3. Go to **API Keys** in dashboard
4. Click **Create API Key**
5. Copy the key (starts with `re_...`)

## Step 2: Add API Key to `.env.local`

Open `.env.local` in your project root and replace the placeholder:

```env
RESEND_API_KEY=re_YOUR_ACTUAL_KEY_HERE
```

## Step 3: Restart Dev Server

After adding the key, restart your development server:

```bash
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

## How It Works

1. User clicks "Yes, Forever" → Explosion happens
2. Camera modal appears after 2.5 seconds
3. User captures selfie blowing a kiss
4. Photo is sent to `donaldfoxit@gmail.com`
5. Date cards appear after successful submission

## Testing

1. Click through to the proposal
2. Click "Yes, Forever"
3. Wait for camera modal
4. Grant camera permissions
5. Capture photo
6. Click "Send Kiss"
7. Check your email!

---

**Note:** Resend's free tier uses their domain for the "from" address. To use a custom domain, you'll need to verify it in Resend's dashboard.
