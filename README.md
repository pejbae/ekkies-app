# Ekkies — Setup Guide

A step-by-step guide to get this app running on your iPhone.
No coding experience needed. Takes about 20–30 minutes the first time.

---

## What you're installing

| Tool | What it does | Cost |
|------|-------------|------|
| Homebrew | Package manager — installs other tools | Free |
| Node.js | Runs JavaScript on your computer | Free |
| Expo Go | Shows the app on your iPhone (for testing) | Free |
| Xcode | Required by Apple for iOS builds | Free |

---

## Step 1 — Install Homebrew

Open **Terminal** (press `Cmd + Space`, type "Terminal", press Enter).

Paste this and press Enter:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

It will ask for your Mac password. Type it (you won't see the characters) and press Enter.
This takes 2–5 minutes. Wait for it to finish.

---

## Step 2 — Install Node.js

In Terminal, paste this and press Enter:

```bash
brew install node
```

When it's done, verify it worked:

```bash
node --version
```

You should see something like `v22.x.x`. That means it worked.

---

## Step 3 — Install the Expo CLI

```bash
npm install -g expo-cli
```

---

## Step 4 — Clone the project from GitHub

Replace `YOUR-GITHUB-USERNAME` with your actual username:

```bash
cd ~/Desktop
git clone https://github.com/YOUR-GITHUB-USERNAME/ekkies.git
cd ekkies
```

---

## Step 5 — Install project dependencies

```bash
npm install
```

This downloads all the libraries the app needs. Takes 1–2 minutes.

---

## Step 6 — Install Expo Go on your iPhone

Open the App Store on your iPhone and search for **"Expo Go"**.
Install it. It's free. This is what runs the app on your phone during development.

---

## Step 7 — Run the app

Make sure your iPhone and Mac are on the same WiFi network. Then:

```bash
npx expo start
```

A QR code will appear in Terminal. Open the **Camera app** on your iPhone,
point it at the QR code, and tap the notification that appears.

**Ekkies should open on your phone. 🎉**

---

## Daily workflow (after first setup)

Every time you want to work on the app:

```bash
cd ~/Desktop/ekkies
npx expo start
```

That's it. When I push new code to GitHub, you pull it with:

```bash
git pull
npx expo start
```

---

## Troubleshooting

**"command not found: brew"**
→ Homebrew didn't install. Run Step 1 again.

**"command not found: node"**
→ Close Terminal, open it again, and try `node --version` again.

**QR code doesn't work on iPhone**
→ Make sure iPhone and Mac are on the same WiFi. Try pressing `w` in Terminal to open web preview instead.

**App shows an error screen**
→ Screenshot it and send it to me. I'll fix it.

---

## Installing Xcode (for later — App Store submission)

You don't need this yet. When we're ready to submit:

1. Open the App Store on your Mac
2. Search "Xcode"
3. Install it (it's 14GB — give it time)

We'll go through the App Store submission process together when the app is ready.

---

## Questions?

Just ask. We'll figure it out together.
