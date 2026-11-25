// Culinary Rush: Game World, Station State, Recipes, and Assembly Mechanics
import { INGREDIENTS, RECIPES, STATIONS } from './config.js';

export const EVENT_ORDER_COMPLETE = 1;
export const EVENT_ORDER_EXPIRED = 2;
export const EVENT_GAME_OVER = 4;
export const EVENT_INGREDIENT_ADDED = 8;

export function createWorld(random) {
  const activeOrders = [];
  const currentAssembly = [];
  let score = 0;
  let combo = 0;
  let dishesServed = 0;
  let lives = 3;
  let orderTimer = 0;
  let elapsed = 0;
  let orderSeq = 1;

  function spawnOrder() {
    if (activeOrders.length >= 4) return;
    const recipeIdx = Math.floor(random() * RECIPES.length);
    const template = RECIPES[recipeIdx];
    activeOrders.push({
      id: `ord_${orderSeq++}`,
      recipeId: template.id,
      name: template.name,
      needed: [...template.ingredients],
      current: [],
      maxTime: template.prepTime,
      remainingTime: template.prepTime,
      reward: template.rewardPoints,
    });
  }

  function addIngredient(ingId) {
    if (!ingId || typeof ingId !== 'string') return false;
    if (currentAssembly.length >= 8) return false;
    currentAssembly.push(ingId);
    return true;
  }

  function clearAssembly() {
    currentAssembly.length = 0;
  }

  function servePlate() {
    if (currentAssembly.length === 0) return false;
    let matchIndex = -1;
    for (let i = 0; i < activeOrders.length; i++) {
      const ord = activeOrders[i];
      if (ord.needed.length === currentAssembly.length) {
        // Compare ingredients independent of stacking order or match exact
        const matches = ord.needed.every((val, idx) => val === currentAssembly[idx]);
        if (matches) {
          matchIndex = i;
          break;
        }
      }
    }

    if (matchIndex !== -1) {
      const finished = activeOrders.splice(matchIndex, 1)[0];
      combo++;
      score += finished.reward + (combo * 25);
      dishesServed++;
      currentAssembly.length = 0;
      return true;
    } else {
      combo = 0;
      score = Math.max(0, score - 25);
      return false;
    }
  }

  function step(dt) {
    const validDt = Math.max(0, Math.min(Number.isFinite(dt) ? dt : 0.016, 0.25));
    elapsed += validDt;
    orderTimer += validDt;
    let events = 0;

    if (activeOrders.length < 2 || (orderTimer > 10 && activeOrders.length < 4)) {
      spawnOrder();
      orderTimer = 0;
    }

    for (let i = activeOrders.length - 1; i >= 0; i--) {
      activeOrders[i].remainingTime -= validDt;
      if (activeOrders[i].remainingTime <= 0) {
        activeOrders.splice(i, 1);
        lives--;
        combo = 0;
        events |= EVENT_ORDER_EXPIRED;
        if (lives <= 0) {
          events |= EVENT_GAME_OVER;
        }
      }
    }

    return events;
  }

  // Pre-seed initial orders deterministically
  spawnOrder();
  spawnOrder();
  spawnOrder();

  return {
    activeOrders,
    currentAssembly,
    get score() { return score; },
    get combo() { return combo; },
    get dishesServed() { return dishesServed; },
    get lives() { return lives; },
    get elapsed() { return elapsed; },
    addIngredient,
    clearAssembly,
    servePlate,
    step,
  };
}
