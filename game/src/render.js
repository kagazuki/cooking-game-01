// Culinary Rush: High-Fidelity Canvas 2D Kitchen Renderer
// Renders kitchen stations, order board with live timers, counter ingredients, assembly plate, and HUD.
import { FONT, INGREDIENTS, PALETTE, STATIONS } from './config.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_OVER = 'over';

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = 1280;
    canvas.height = 720;
  }
  resize();

  function drawKitchenBackground() {
    ctx.fillStyle = PALETTE.bg;
    ctx.fillRect(0, 0, 1280, 720);

    // Floor tile grid pattern
    ctx.strokeStyle = PALETTE.tileGrid;
    ctx.lineWidth = 1;
    for (let x = 0; x < 1280; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 180);
      ctx.lineTo(x, 720);
      ctx.stroke();
    }
    for (let y = 180; y < 720; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1280, y);
      ctx.stroke();
    }
  }

  function drawOrderBoard(orders) {
    const b = STATIONS.ORDER_BOARD;
    ctx.fillStyle = PALETTE.boardBg;
    ctx.strokeStyle = PALETTE.boardBorder;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(b.x, b.y, b.w, b.h, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = PALETTE.accentGold;
    ctx.font = 'bold 15px "Segoe UI", sans-serif';
    ctx.fillText('ACTIVE ORDERS & CHEF TICKET QUEUE', b.x + 20, b.y + 24);

    const cardW = 260;
    const cardH = 92;
    orders.forEach((ord, idx) => {
      const cx = b.x + 20 + idx * (cardW + 25);
      const cy = b.y + 36;
      ctx.fillStyle = '#283144';
      ctx.strokeStyle = ord.remainingTime < 10 ? PALETTE.timerCritical : PALETTE.counterEdge;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(cx, cy, cardW, cardH, 8);
      ctx.fill();
      ctx.stroke();

      // Title
      ctx.fillStyle = PALETTE.textLight;
      ctx.font = 'bold 14px "Segoe UI", sans-serif';
      ctx.fillText(ord.name, cx + 10, cy + 22);

      // Ingredients icons
      let iconStr = ord.needed.map(k => INGREDIENTS[k.toUpperCase()]?.icon || k).join(' ');
      ctx.font = '16px "Segoe UI", sans-serif';
      ctx.fillText(iconStr, cx + 10, cy + 50);

      // Timer Bar
      const pct = Math.max(0, ord.remainingTime / ord.maxTime);
      ctx.fillStyle = '#11141b';
      ctx.fillRect(cx + 10, cy + 64, cardW - 20, 8);
      ctx.fillStyle = pct < 0.25 ? PALETTE.timerCritical : pct < 0.5 ? PALETTE.timerWarning : PALETTE.timerNormal;
      ctx.fillRect(cx + 10, cy + 64, (cardW - 20) * pct, 8);

      // Seconds text
      ctx.fillStyle = PALETTE.textMuted;
      ctx.font = '11px monospace';
      ctx.fillText(`${Math.ceil(ord.remainingTime)}s`, cx + cardW - 32, cy + 86);
    });
  }

  function drawPrepCounter(world) {
    const s = STATIONS.PREP_COUNTER;
    ctx.fillStyle = PALETTE.counterTop;
    ctx.strokeStyle = PALETTE.counterEdge;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(s.x, s.y, s.w, s.h, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = PALETTE.accentCyan;
    ctx.font = FONT.header;
    ctx.fillText('1. Pantry & Prep Station', s.x + 20, s.y + 36);

    ctx.fillStyle = PALETTE.textMuted;
    ctx.font = FONT.small;
    ctx.fillText('Click to pick ingredients for assembly', s.x + 20, s.y + 60);

    const keys = Object.keys(INGREDIENTS);
    keys.forEach((key, idx) => {
      const item = INGREDIENTS[key];
      const ix = s.x + 20 + (idx % 2) * 170;
      const iy = s.y + 80 + Math.floor(idx / 2) * 90;

      ctx.fillStyle = '#1d2331';
      ctx.strokeStyle = '#3d4b66';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(ix, iy, 155, 75, 10);
      ctx.fill();
      ctx.stroke();

      ctx.font = '28px "Segoe UI", sans-serif';
      ctx.fillText(item.icon, ix + 12, iy + 45);

      ctx.fillStyle = PALETTE.textLight;
      ctx.font = 'bold 13px "Segoe UI", sans-serif';
      ctx.fillText(item.name, ix + 50, iy + 35);
      ctx.fillStyle = PALETTE.textMuted;
      ctx.font = '11px "Segoe UI", sans-serif';
      ctx.fillText('Ready for prep', ix + 50, iy + 52);
    });
  }

  function drawCookingStove() {
    const s = STATIONS.COOKING_STOVE;
    ctx.fillStyle = PALETTE.counterTop;
    ctx.strokeStyle = PALETTE.counterEdge;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(s.x, s.y, s.w, s.h, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = PALETTE.flameOrange;
    ctx.font = FONT.header;
    ctx.fillText('2. Hot Searing Griddle', s.x + 20, s.y + 36);

    ctx.fillStyle = PALETTE.textMuted;
    ctx.font = FONT.small;
    ctx.fillText('Cast-iron flat top grill (380°F)', s.x + 20, s.y + 60);

    // Griddle surface
    ctx.fillStyle = '#191f2c';
    ctx.strokeStyle = '#38445d';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(s.x + 20, s.y + 80, s.w - 40, 360, 12);
    ctx.fill();
    ctx.stroke();

    // Searing patties and bacon graphic
    for (let i = 0; i < 3; i++) {
      const gx = s.x + 50 + (i % 2) * 160;
      const gy = s.y + 110 + Math.floor(i / 2) * 140;

      // Burner ring
      ctx.strokeStyle = '#44516d';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(gx + 50, gy + 50, 48, 0, Math.PI * 2);
      ctx.stroke();

      // Sizzling patty
      ctx.fillStyle = '#5c2d13';
      ctx.beginPath();
      ctx.arc(gx + 50, gy + 50, 38, 0, Math.PI * 2);
      ctx.fill();

      // Grill marks
      ctx.strokeStyle = '#2d1407';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(gx + 25, gy + 40);
      ctx.lineTo(gx + 75, gy + 40);
      ctx.moveTo(gx + 25, gy + 60);
      ctx.lineTo(gx + 75, gy + 60);
      ctx.stroke();

      // Steam & sizzle sparks
      ctx.fillStyle = PALETTE.flameYellow;
      ctx.fillRect(gx + 40, gy + 15, 4, 8);
      ctx.fillRect(gx + 62, gy + 18, 3, 6);
    }
  }

  function drawAssemblyPass(currentAssembly) {
    const s = STATIONS.ASSEMBLY_PASS;
    ctx.fillStyle = PALETTE.counterTop;
    ctx.strokeStyle = PALETTE.counterEdge;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(s.x, s.y, s.w, s.h, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = PALETTE.accentGreen;
    ctx.font = FONT.header;
    ctx.fillText('3. Assembly & Plating', s.x + 20, s.y + 36);

    ctx.fillStyle = PALETTE.textMuted;
    ctx.font = FONT.small;
    ctx.fillText('Stack dish items in exact order and ring bell', s.x + 20, s.y + 60);

    // Serving plate
    const px = s.x + s.w / 2;
    const py = s.y + 240;
    ctx.fillStyle = '#e8ecf4';
    ctx.beginPath();
    ctx.ellipse(px, py, 140, 75, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#c5ccd9';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Plate rim inner shadow
    ctx.strokeStyle = '#9aa5b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(px, py, 110, 55, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Draw stacked dish in mid-assembly
    if (currentAssembly.length === 0) {
      ctx.fillStyle = '#6b7a99';
      ctx.font = 'italic 16px "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('(Plate is empty - select ingredients)', px, py);
      ctx.textAlign = 'left';
    } else {
      let stackY = py + 20;
      currentAssembly.forEach((ingId, idx) => {
        const item = INGREDIENTS[ingId.toUpperCase()] || { icon: '🍽️', color: '#ffb300', name: ingId };
        ctx.fillStyle = item.color;
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(px - 70, stackY - idx * 26, 140, 24, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${item.icon} ${item.name}`, px, stackY - idx * 26 + 17);
        ctx.textAlign = 'left';
      });
    }

    // Serve and Clear buttons
    const btnW = 160;
    const btnH = 46;
    // Serve Button
    ctx.fillStyle = PALETTE.accentGreen;
    ctx.beginPath();
    ctx.roundRect(s.x + 20, s.y + 400, btnW, btnH, 10);
    ctx.fill();
    ctx.fillStyle = '#0a2e12';
    ctx.font = 'bold 16px "Segoe UI", sans-serif';
    ctx.fillText('🔔 SERVE DISH', s.x + 40, s.y + 429);

    // Clear Button
    ctx.fillStyle = '#455a64';
    ctx.beginPath();
    ctx.roundRect(s.x + 200, s.y + 400, btnW, btnH, 10);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px "Segoe UI", sans-serif';
    ctx.fillText('🗑️ CLEAR PLATE', s.x + 215, s.y + 429);
  }

  function drawHUD(world) {
    // Score, Lives, Dishes served
    ctx.fillStyle = PALETTE.accentGold;
    ctx.font = FONT.score;
    ctx.fillText(`SCORE: ${world.score}`, 40, 695);

    ctx.fillStyle = PALETTE.accentCyan;
    ctx.font = 'bold 20px "Segoe UI", sans-serif';
    ctx.fillText(`COMBO: x${world.combo}`, 300, 695);

    ctx.fillStyle = PALETTE.textLight;
    ctx.font = 'bold 18px "Segoe UI", sans-serif';
    ctx.fillText(`SERVED: ${world.dishesServed} ORDERS`, 520, 695);

    // Chef Lives
    ctx.fillStyle = PALETTE.accentRed;
    let hearts = '';
    for (let i = 0; i < world.lives; i++) hearts += '❤️ ';
    ctx.font = '22px "Segoe UI", sans-serif';
    ctx.fillText(`CHEF LIVES: ${hearts}`, 860, 695);
  }

  function render(screen, world) {
    drawKitchenBackground();
    drawOrderBoard(world.activeOrders);
    drawPrepCounter(world);
    drawCookingStove();
    drawAssemblyPass(world.currentAssembly);
    drawHUD(world);

    if (screen === SCREEN_TITLE) {
      ctx.fillStyle = 'rgba(10, 14, 23, 0.82)';
      ctx.fillRect(0, 0, 1280, 720);

      ctx.fillStyle = PALETTE.accentGold;
      ctx.font = FONT.brand;
      ctx.textAlign = 'center';
      ctx.fillText('🍳 CULINARY RUSH: 5-STAR MASTER CHEF', 640, 260);

      ctx.fillStyle = PALETTE.textLight;
      ctx.font = '20px "Segoe UI", sans-serif';
      ctx.fillText('A High-Pressure Gourmet Kitchen Simulation Game', 640, 310);

      ctx.fillStyle = PALETTE.accentCyan;
      ctx.font = '16px "Segoe UI", sans-serif';
      ctx.fillText('Prepare fresh ingredients • Sizzle cuts on the griddle • Assemble exact recipes • Beat the clock', 640, 350);

      ctx.fillStyle = PALETTE.accentGreen;
      ctx.font = 'bold 24px "Segoe UI", sans-serif';
      ctx.fillText('PRESS SPACE OR CLICK ANYWHERE TO START SERVICE', 640, 460);
      ctx.textAlign = 'left';
    } else if (screen === SCREEN_OVER) {
      ctx.fillStyle = 'rgba(18, 5, 5, 0.88)';
      ctx.fillRect(0, 0, 1280, 720);

      ctx.fillStyle = PALETTE.accentRed;
      ctx.font = FONT.brand;
      ctx.textAlign = 'center';
      ctx.fillText('KITCHEN SERVICE CLOSED - SHIFT FINISHED', 640, 260);

      ctx.fillStyle = PALETTE.accentGold;
      ctx.font = FONT.score;
      ctx.fillText(`FINAL GOURMET SCORE: ${world.score}`, 640, 320);

      ctx.fillStyle = PALETTE.textLight;
      ctx.font = '20px "Segoe UI", sans-serif';
      ctx.fillText(`Total Orders Mastered: ${world.dishesServed}`, 640, 370);

      ctx.fillStyle = PALETTE.accentCyan;
      ctx.font = 'bold 22px "Segoe UI", sans-serif';
      ctx.fillText('PRESS SPACE OR CLICK TO OPEN NEXT DINNER SHIFT', 640, 470);
      ctx.textAlign = 'left';
    }
  }

  return { render };
}
