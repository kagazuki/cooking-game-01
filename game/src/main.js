// Culinary Rush: Main Game Loop, Screen States, and Event Routing
import { createRandom } from './random.js';
import { createWorld, EVENT_GAME_OVER } from './world.js';
import { ACTION_CLEAR, ACTION_CONFIRM, ACTION_RESTART, ACTION_SERVE, createInput } from './input.js';
import { createRenderer, SCREEN_OVER, SCREEN_PLAY, SCREEN_TITLE } from './render.js';
import { stageShot } from './shots.js';
import { INGREDIENTS, STATIONS, STEP } from './config.js';

const canvas = document.getElementById('game');
const renderer = createRenderer(canvas);
const input = createInput(canvas);

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
const seedParam = Number.parseInt(params.get('seed') ?? '', 10);
const seed = Number.isInteger(seedParam) ? seedParam : Math.floor(Math.random() * 4294967296);
const random = createRandom(seed);

let world = createWorld(random);
let screen = SCREEN_TITLE;
let lastTime = 0;

if (shot) {
  stageShot(shot, world, renderer);
} else {
  function loop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const dt = Math.min((timestamp - lastTime) / 1000, 0.1);
    lastTime = timestamp;

    const actions = input.pollActions();
    const click = input.pollClick();

    if (screen === SCREEN_TITLE) {
      if ((actions & ACTION_CONFIRM) || click) {
        screen = SCREEN_PLAY;
      }
    } else if (screen === SCREEN_PLAY) {
      if (actions & ACTION_SERVE) {
        world.servePlate();
      }
      if (actions & ACTION_CLEAR) {
        world.clearAssembly();
      }

      if (click) {
        // Check Pantry clicks
        const sPrep = STATIONS.PREP_COUNTER;
        const keys = Object.keys(INGREDIENTS);
        keys.forEach((key, idx) => {
          const ix = sPrep.x + 20 + (idx % 2) * 170;
          const iy = sPrep.y + 80 + Math.floor(idx / 2) * 90;
          if (click.x >= ix && click.x <= ix + 155 && click.y >= iy && click.y <= iy + 75) {
            world.addIngredient(INGREDIENTS[key].id);
          }
        });

        // Check Serve Button click
        const sPass = STATIONS.ASSEMBLY_PASS;
        if (click.x >= sPass.x + 20 && click.x <= sPass.x + 180 && click.y >= sPass.y + 400 && click.y <= sPass.y + 446) {
          world.servePlate();
        }
        // Check Clear Button click
        if (click.x >= sPass.x + 200 && click.x <= sPass.x + 360 && click.y >= sPass.y + 400 && click.y <= sPass.y + 446) {
          world.clearAssembly();
        }
      }

      const events = world.step(dt);
      if (events & EVENT_GAME_OVER) {
        screen = SCREEN_OVER;
      }
    } else if (screen === SCREEN_OVER) {
      if ((actions & (ACTION_CONFIRM | ACTION_RESTART)) || click) {
        world = createWorld(random);
        screen = SCREEN_PLAY;
      }
    }

    renderer.render(screen, world);
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}
