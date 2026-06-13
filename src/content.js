/* ============================================================
   ✏️  EDIT ME — all the personal content lives here.
   This is the ONLY file you need to touch to personalise the site.
   (No build step — just save and refresh.)
   ============================================================ */

export const config = {
  name: 'Disha',
  age: 25,
  // Your name — shown on the letter. Leave '' to hide.
  fromName: '',
  // How many photos in /photos  (photo1.jpg … photoN.jpg)
  photoCount: 25,
};

/* ── MODULE 2 · "25 Perfect Memories" ────────────────────────
   One entry per photo: photo1.jpg ↔ memories[0], photo2 ↔ [1] … */
export const memories = [
  { title: 'Our Most Controversial Photo', caption: 'Announcing to the world in the most flashy way possible. Proper West Delhi behavior.' },          // photo1
  { title: 'Cute Roxy Photo',          caption: 'A random ahh photo from where our journey began.' },                                                   // photo2
  { title: 'Mexicoooo Baby',           caption: 'Thank you so much for taking me to the best trip of my life.' },                                       // photo3
  { title: 'On the Water',             caption: 'Sun going down, your head on my shoulder, the whole ocean to ourselves.' },                            // photo4
  { title: 'Valentine’s Day 2026',     caption: 'All those glowing orbs in the trees — and you still outshone every one.' },                            // photo5
  { title: 'Diwali 2025',              caption: 'Extremely cutely hosted Diwali! Always love seeing you in a saree!' },                                 // photo6
  { title: 'Happy 1 Official Year',    caption: 'Shittiest tasting menu where you forgot your IDs — but the Japanese whiskey later made up for it.' },  // photo7
  { title: 'Fav Photo Ever',           caption: 'Shutting you up and having silence is absolute bliss.' },                                              // photo8
  { title: 'Sneaky Viewpoint with Hisham', caption: 'Sneaky linking which Hisham somehow did not get to know. Hope you remember ;)' },                  // photo9
  { title: 'Lazy Morning',             caption: 'No plans, no rush, just your sleepy face beside mine. Heaven, basically.' },                           // photo10
  { title: 'Grapey',                   caption: 'Forcing me to come into a “Khopcha” is the creepiest thing you have ever done :O' },                    // photo11
  { title: 'Hickey City',              caption: 'My favourite hickey I have ever given. One more please?' },                                            // photo12
  { title: 'Dressed in Gold',          caption: 'You in green and gold, glowing — I genuinely lost my train of thought.' },                             // photo13
  { title: 'Our Inside Joke',          caption: 'Only we get it. “Happy one year of…” — peace sign and all. 😌' },                                       // photo14
  { title: 'Happy 6 Months',           caption: 'That dress, that mirror — I could not look away if I tried.' },                                        // photo15
  { title: 'Birthday Girl',            caption: 'Crown on, balloons up, my whole world dressed in pink.' },                                             // photo16
  { title: 'Cheers To Us',             caption: 'The bartender said we looked like a fresh couple when we’d been dating ages — best compliment from a stranger!' }, // photo17
  { title: 'Weeknd',                   caption: 'My first concert ever! Soo grateful — an absolutely blissful experience.' },                           // photo18
  { title: 'Golden Hour',              caption: 'A kiss on the sand as the sky caught fire. I’ll keep that one forever.' },                             // photo19
  { title: 'Make a Wish',              caption: 'Most adorable celebration of my birthday ever! You made it so special — I remember every bit of it.' }, // photo20
  { title: 'Even Like This',           caption: 'Sleepy, hooded, pulling a face — still the prettiest girl I know.' },                                  // photo21
  { title: 'I’m So Proud of You',      caption: 'One of us had to do it! And I am so proud you are the one HAHAHAHA!' },                                 // photo22
  { title: 'Drink for Drink',          caption: 'You never back down from a challenge — one of a hundred reasons I adore you. You’re a lil bih cz u lost tho :P' }, // photo23
  { title: 'The Puppy Café',           caption: 'You, glowing, a puppy in your arms — I didn’t know my heart could do that.' },                         // photo24
  { title: 'Completely You',           caption: 'Mid-party, you kissed my cheek and the whole room blurred. Happy 25th, my love. 💕' },                 // photo25
];

/* ── MODULE 3 · "10 Things I Love About You" ─────────────────
   ✏️  REPLACE these 10 lines with your own. Keep them short &
   from the heart — they reveal one at a time, like little gifts. */
export const loves = [
  'The way your whole face lights up when you laugh.',                                                  // 1  (placeholder — send me #1)
  'How you make even an ordinary day feel like something.',                                            // 2  (placeholder — send me #2)
  'The amount of talking you do despite me telling you to shut up.',                                   // 3
  'That you let me see every version of you.',                                                         // 4  (placeholder — send me #4)
  'How hard you work, and how proud it makes me.',                                                     // 5  (placeholder — send me #5)
  "How you have your two cents to give in every conversation. Also one of the things I hate about you the most, but I adjust :'(", // 6
  'How big of a foodie you are — having a meal with you is always going to be my favourite thing to do with you!', // 7
  'How you try so hard to be funny but are only half as funny as me :P',                               // 8
  'The way you believe in me louder than I believe in myself.',                                        // 9  (placeholder — send me #9)
  'You are the best partner one could ask for. Cheers to being yourself in every moment!',             // 10
];

/* ── The letter (shown after the last memory) ────────────────
   ✏️  REPLACE THIS with your own words — write it from the heart.
   Use a blank line between paragraphs.                            */
export const letter = `Hello Baby,

Happiest 25th Birthday! You have always cribbed about not having a letter from me, but now you have a whole ass website with your domain name lol. Only you can login to this thing (and anyone you give access to).

I am so thankful to have you by my side in times of happiness and chaos. I could never have asked for a partner who would be this supportive and happy in all my small ass achievements. You are an incredible, hard-working, affectionate, and crazy human being.

I am one of the lucky ones for sure who gets this crazy ass package of turmoil, love, and care. This day is big for you, you have reached all your big accomplishments which you set for yourself. I am so proud of you, I hope you keep soaring to extreme heights, never stop and always flex on people who are obstacles in your life at any point.

Cheers to 25 years and many more to come with me. I will always trouble you, but I will also always be by your side.

I love you so much and I hope you like all the gifts, especially this one!

Your Favourite,
Devansh`;

/* photos: photo1.jpg … photoN.jpg inside /photos */
export const photos = Array.from(
  { length: config.photoCount },
  (_, i) => `photos/photo${i + 1}.jpg`
);
