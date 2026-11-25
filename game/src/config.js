// Culinary Rush: Game Configuration & Palette
// 1280x720 fixed logical canvas for pixel-crisp HD rendering

export const FIELD = { width: 1280, height: 720 };
export const STEP = 1 / 60;

export const STATIONS = {
  ORDER_BOARD: { x: 40, y: 30, w: 1200, h: 140 },
  PREP_COUNTER: { x: 40, y: 190, w: 380, h: 480 },
  COOKING_STOVE: { x: 450, y: 190, w: 380, h: 480 },
  ASSEMBLY_PASS: { x: 860, y: 190, w: 380, h: 480 },
};

export const INGREDIENTS = {
  BUN: { id: 'bun', name: 'Artisan Brioche', icon: '🍞', color: '#e0a96d' },
  PATTY: { id: 'patty', name: 'Wagyu Beef Patty', icon: '🥩', color: '#8d4004' },
  CHEESE: { id: 'cheese', name: 'Sharp Cheddar', icon: '🧀', color: '#ffb300' },
  TOMATO: { id: 'tomato', name: 'Vine Tomato', icon: '🍅', color: '#e53935' },
  LETTUCE: { id: 'lettuce', name: 'Crisp Lettuce', icon: '🥬', color: '#43a047' },
  ONION: { id: 'onion', name: 'Caramelized Onion', icon: '🧅', color: '#ab47bc' },
  MUSHROOM: { id: 'mushroom', name: 'Wild Truffle Mushroom', icon: '🍄', color: '#8d6e63' },
};

export const RECIPES = [
  {
    id: 'classic_burger',
    name: 'Gourmet Classic Wagyu',
    ingredients: ['bun', 'patty', 'cheese', 'lettuce', 'tomato'],
    prepTime: 35,
    rewardPoints: 150,
  },
  {
    id: 'truffle_melt',
    name: 'Truffle Mushroom Melt',
    ingredients: ['bun', 'patty', 'cheese', 'onion', 'mushroom'],
    prepTime: 40,
    rewardPoints: 180,
  },
  {
    id: 'double_deluxe',
    name: 'Double Deluxe Stack',
    ingredients: ['bun', 'patty', 'cheese', 'patty', 'onion', 'tomato'],
    prepTime: 45,
    rewardPoints: 220,
  },
  {
    id: 'garden_fresh',
    name: 'Garden Harvest Special',
    ingredients: ['bun', 'lettuce', 'tomato', 'onion', 'cheese'],
    prepTime: 30,
    rewardPoints: 130,
  },
];

export const PALETTE = {
  bg: '#14171f',
  floor: '#1d222e',
  tileGrid: '#252c3c',
  counterTop: '#2b3448',
  counterEdge: '#3b4760',
  boardBg: '#1f2636',
  boardBorder: '#4a5b7d',
  textLight: '#f3f5f9',
  textMuted: '#9aa5b9',
  accentGold: '#ffb300',
  accentRed: '#ff5252',
  accentGreen: '#00e676',
  accentCyan: '#00e5ff',
  timerNormal: '#00e676',
  timerWarning: '#ffb300',
  timerCritical: '#ff1744',
  flameOrange: '#ff6d00',
  flameYellow: '#ffd600',
};

export const FONT = {
  brand: 'bold 36px "Segoe UI", system-ui, sans-serif',
  header: 'bold 24px "Segoe UI", system-ui, sans-serif',
  body: '16px "Segoe UI", system-ui, sans-serif',
  small: '13px "Segoe UI", system-ui, sans-serif',
  timer: 'bold 22px monospace',
  score: 'bold 28px "Segoe UI", system-ui, sans-serif',
};
