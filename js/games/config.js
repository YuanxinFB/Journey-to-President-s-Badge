// Shared configuration, assets, and utilities used by both games
export const LEFT_IMAGES = [
  "image/Left/Dofe Bronze.png",
  "image/Left/Dofe Gold.png",
  "image/Left/Dofe Silver.png",
  "image/Left/Founder.png",
  "image/Left/Gold.png",
  "image/Left/Junior One-Year.png",
  "image/Left/Link Badge.png",
  "image/Left/NCO Proficiency Star.png",
  "image/Left/One-Year.png",
  "image/Left/Presidents.png",
  "image/Left/Scholastic Bronze.png",
  "image/Left/Scholastic Gold.png",
  "image/Left/Scholastic Silver.png",
  "image/Left/Three-Years.png",
];

export const RIGHT_IMAGES = [
  "image/Right/Arts.png",
  "image/Right/Athletics.png",
  "image/Right/Bandsmans.png",
  "image/Right/Buglers.png",
  "image/Right/Camping.png",
  "image/Right/Christian Education.png",
  "image/Right/Citizenship.png",
  "image/Right/Communication.png",
  "image/Right/Community Service.png",
  "image/Right/Computer Knowledge.png",
  "image/Right/Crafts.png",
  "image/Right/Drill.png",
  "image/Right/Drummers.png",
  "image/Right/Environmental Conservation.png",
  "image/Right/Expedition.png",
  "image/Right/Financial Stewardship.png",
  "image/Right/Fireman.png",
  "image/Right/First Aid.png",
  "image/Right/Gymnastics.png",
  "image/Right/Hobbies.png",
  "image/Right/International Relations.png",
  "image/Right/Life Saving.png",
  "image/Right/Martial Art.png",
  "image/Right/Nature Awareness.png",
  "image/Right/Physical Training.png",
  "image/Right/Pipers.png",
  "image/Right/Recruitment.png",
  "image/Right/Safety.png",
  "image/Right/Social Entreprenuership.png",
  "image/Right/Sports.png",
  "image/Right/Sustainability.png",
  "image/Right/Swimming.png",
  "image/Right/Target.png",
  "image/Right/Water Adventure.png",
];

export const ALL_IMAGES = [...LEFT_IMAGES, ...RIGHT_IMAGES];

export const GAME_LEVELS = {
  matching: {
    1: { pairs: 8, cols: 4, rows: 4 },
    2: { pairs: 15, cols: 5, rows: 5 },
    3: { pairs: 18, cols: 6, rows: 6 }
  },
  solitaire: {
    1: { uniqueTiles: 10, copies: 3, stackLimit: 8 },
    2: { uniqueTiles: 15, copies: 3, stackLimit: 8 },
    3: { uniqueTiles: 20, copies: 3, stackLimit: 8 }
  }
};

//Shuffle
export function shuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

//Picks N random unique items from a list
export function pickRandom(list, count) {
  return shuffle(list).slice(0, Math.max(0, Math.min(count, list.length)));
}
