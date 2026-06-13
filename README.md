# Happy 25th, Disha 💛

An interactive birthday experience — four little chapters, built with plain HTML/CSS/JS (no build step) and deployed on Railway.

## The four chapters
1. **Make a Wish** — blow out the "25" candles (with your mic, or a tap) 🎂
2. **Memories** — 25 of our favourite moments, in photos 📸
3. **Us, A Quiz** — a playful "how well do we know us?" quiz 🧠
4. **For You** — a love letter, confetti & a wish to make 🎉

## Run it locally
You don't need Node installed — Python works fine:
```bash
python3 -m http.server 3456
# open http://localhost:3456
```
Or, if you have Node:
```bash
npm start        # serves on http://localhost:3456 (or $PORT)
```

## Make it yours (no coding needed)
Everything personal lives in **`src/content.js`**:
- her name & age (`config`)
- the 25 memory captions (`memories`)
- the quiz questions (`quiz`)
- the love letter (`letter`)

And drop the 25 photos into **`photos/`** as `photo1.jpg … photo25.jpg` (see `photos/README.txt`).

## Deploy (GitHub → Railway)
1. Push this repo to GitHub (`dv29mht/HBD`).
2. In Railway: **New Project → Deploy from GitHub repo → HBD**.
3. Railway auto-detects Node and runs `node server.js`. Done — it gives you a public URL.

No environment variables, no database, no secrets.
