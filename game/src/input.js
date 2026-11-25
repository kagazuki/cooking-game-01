// Culinary Rush: Input Handling (Mouse click, drag-drop, and Keyboard Shortcuts)

export const ACTION_CONFIRM = 1;
export const ACTION_RESTART = 2;
export const ACTION_SERVE = 4;
export const ACTION_CLEAR = 8;

export function createInput(canvas) {
  let actions = 0;
  const mouse = { x: 0, y: 0, isDown: false, clicked: false };

  function updatePos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = 1280 / rect.width;
    const scaleY = 720 / rect.height;
    mouse.x = (e.clientX - rect.left) * scaleX;
    mouse.y = (e.clientY - rect.top) * scaleY;
  }

  canvas.addEventListener('mousemove', (e) => updatePos(e));
  canvas.addEventListener('mousedown', (e) => {
    updatePos(e);
    mouse.isDown = true;
    mouse.clicked = true;
  });
  canvas.addEventListener('mouseup', () => {
    mouse.isDown = false;
  });

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'Enter') {
      actions |= ACTION_CONFIRM;
      actions |= ACTION_SERVE;
      e.preventDefault();
    } else if (e.code === 'KeyR') {
      actions |= ACTION_RESTART;
      e.preventDefault();
    } else if (e.code === 'KeyC') {
      actions |= ACTION_CLEAR;
      e.preventDefault();
    }
  });

  function pollActions() {
    const act = actions;
    actions = 0;
    return act;
  }

  function pollClick() {
    const clk = mouse.clicked;
    mouse.clicked = false;
    return clk ? { x: mouse.x, y: mouse.y } : null;
  }

  return { mouse, pollActions, pollClick };
}
