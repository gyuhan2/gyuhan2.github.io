document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupSummerBackground();
  setupRandomProjectCard();
  setupSnakeGame();
  setupMinesweeperGame();
});

function setupNavigation() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };

  toggle.addEventListener('click', () => {
    setOpen(!nav.classList.contains('is-open'));
  });

  nav.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement && window.matchMedia('(max-width: 900px)').matches) {
      setOpen(false);
    }
  });

  document.addEventListener('click', (event) => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) {
      setOpen(false);
    }
  });
}

function setupSummerBackground() {
  const canvas = document.getElementById('matrix-canvas');
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const clouds = [];
  const waves = [
    { y: 0.76, amplitude: 10, speed: 0.028, phase: 0 },
    { y: 0.83, amplitude: 14, speed: 0.02, phase: 1.7 },
    { y: 0.9, amplitude: 18, speed: 0.016, phase: 3.2 }
  ];
  let width = 0;
  let height = 0;
  let dpr = window.devicePixelRatio || 1;

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    clouds.length = 0;
    const cloudCount = width < 700 ? 3 : 5;
    for (let i = 0; i < cloudCount; i += 1) {
      clouds.push({
        x: Math.random() * width,
        y: height * (0.12 + Math.random() * 0.22),
        size: 50 + Math.random() * 80,
        speed: 0.18 + Math.random() * 0.24
      });
    }
  };

  resize();
  window.addEventListener('resize', resize);

  const drawCloud = (cloud) => {
    ctx.save();
    ctx.globalAlpha = 0.88;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    const pieces = [
      [0, 0.08, 0.42],
      [0.24, -0.1, 0.5],
      [0.46, 0, 0.58],
      [0.7, 0.09, 0.42]
    ];
    pieces.forEach(([px, py, pr]) => {
      ctx.beginPath();
      ctx.arc(cloud.x + cloud.size * px, cloud.y + cloud.size * py, cloud.size * pr * 0.22, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  };

  const drawWaveLine = (wave, time) => {
    ctx.beginPath();
    const baseY = height * wave.y;
    for (let x = 0; x <= width; x += 20) {
      const y = baseY + Math.sin((x * 0.018) + time * wave.speed + wave.phase) * wave.amplitude;
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  };

  const render = () => {
    const time = Date.now() / 1000;
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, '#8fdcff');
    sky.addColorStop(0.45, '#d9f6ff');
    sky.addColorStop(0.67, '#82ddf0');
    sky.addColorStop(0.82, '#ffdca2');
    sky.addColorStop(1, '#f2b56f');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(255, 235, 170, 0.9)';
    ctx.beginPath();
    ctx.arc(width * 0.8, height * 0.18, Math.min(width, height) * 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 248, 220, 0.38)';
    ctx.beginPath();
    ctx.arc(width * 0.8, height * 0.18, Math.min(width, height) * 0.15, 0, Math.PI * 2);
    ctx.fill();

    const seaTop = height * 0.66;
    const sea = ctx.createLinearGradient(0, seaTop, 0, height);
    sea.addColorStop(0, 'rgba(63, 185, 214, 0.8)');
    sea.addColorStop(1, 'rgba(16, 90, 139, 0.92)');
    ctx.fillStyle = sea;
    ctx.fillRect(0, seaTop, width, height - seaTop);

    const sand = ctx.createLinearGradient(0, height * 0.84, 0, height);
    sand.addColorStop(0, 'rgba(255, 232, 178, 0.95)');
    sand.addColorStop(1, 'rgba(245, 182, 113, 0.98)');
    ctx.fillStyle = sand;
    ctx.fillRect(0, height * 0.86, width, height * 0.14);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.52)';
    ctx.lineWidth = 2;
    waves.forEach((wave) => drawWaveLine(wave, time));

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1.4;
    clouds.forEach((cloud) => {
      cloud.x += cloud.speed;
      if (cloud.x > width + cloud.size) {
        cloud.x = -cloud.size * 1.4;
        cloud.y = height * (0.1 + Math.random() * 0.18);
      }
      drawCloud(cloud);
    });

    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
}

function setupRandomProjectCard() {
  const title = document.getElementById('project-title');
  const description = document.getElementById('project-description');
  if (!(title instanceof HTMLElement) || !(description instanceof HTMLElement)) return;

  const projects = [
    {
      title: 'Ocean Drift Dashboard',
      description: '파도처럼 부드럽게 흐르는 정적 대시보드 컨셉입니다.'
    },
    {
      title: 'Sunset Signal Notes',
      description: '여름 저녁 분위기의 기록형 프로젝트 샘플입니다.'
    },
    {
      title: 'Palm Breeze Tracker',
      description: '휴가철 일정과 메모를 상정한 랜덤 샘플 프로젝트입니다.'
    }
  ];
  const choice = projects[Math.floor(Math.random() * projects.length)];
  title.textContent = choice.title;
  description.textContent = choice.description;
}

function setupSnakeGame() {
  const canvas = document.getElementById('snake-canvas');
  const overlay = document.getElementById('game-overlay');
  const scoreValue = document.getElementById('score-value');
  const bestValue = document.getElementById('best-value');
  const statusValue = document.getElementById('status-value');
  const startBtn = document.getElementById('start-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const restartBtn = document.getElementById('restart-btn');
  const dPadButtons = document.querySelectorAll('.d-pad button[data-direction]');

  if (
    !(canvas instanceof HTMLCanvasElement) ||
    !overlay ||
    !scoreValue ||
    !bestValue ||
    !statusValue ||
    !(startBtn instanceof HTMLButtonElement) ||
    !(pauseBtn instanceof HTMLButtonElement) ||
    !(restartBtn instanceof HTMLButtonElement)
  ) {
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const GRID = 24;
  const STEP_MS = 120;
  const ENEMY_STEP_MS = 220;
  const ENEMY_BURST_MS = 5000;
  const LOCAL_BEST_KEY = 'gyuhan-snake-best';
  const initialBest = readBestScore();
  const state = {
    mode: 'ready',
    score: 0,
    best: initialBest,
    snake: [],
    direction: { x: 1, y: 0 },
    queuedDirection: null,
    shiftHeld: false,
    food: { x: 0, y: 0 },
    enemies: [],
    burstActive: false
  };

  let cellSize = 0;
  let boardSize = 0;
  let gameTimer = null;
  let enemyTimer = null;
  let burstTimer = null;
  let recoverTimer = null;
  let boardObserver = null;

  function readBestScore() {
    try {
      return Number(localStorage.getItem(LOCAL_BEST_KEY) || '0') || 0;
    } catch {
      return 0;
    }
  }

  function writeBestScore(value) {
    state.best = Math.max(state.best, value);
    try {
      localStorage.setItem(LOCAL_BEST_KEY, String(state.best));
    } catch {
      /* ignore storage failures */
    }
    bestValue.textContent = String(state.best);
  }

  function setStatus(text) {
    statusValue.textContent = text;
    overlay.querySelector('.overlay-title').textContent = text;
    overlay.hidden = state.mode === 'playing';
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const size = Math.floor(Math.min(rect.width, rect.height));
    if (!size) return;
    const dpr = window.devicePixelRatio || 1;
    boardSize = size;
    cellSize = size / GRID;
    canvas.width = Math.floor(size * dpr);
    canvas.height = Math.floor(size * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
    render();
  }

  function clearTimers() {
    if (gameTimer) clearTimeout(gameTimer);
    if (enemyTimer) clearInterval(enemyTimer);
    if (burstTimer) clearInterval(burstTimer);
    if (recoverTimer) clearTimeout(recoverTimer);
    gameTimer = null;
    enemyTimer = null;
    burstTimer = null;
    recoverTimer = null;
  }

  function createSnake() {
    const center = Math.floor(GRID / 2);
    return [
      { x: center - 2, y: center },
      { x: center - 1, y: center },
      { x: center, y: center }
    ];
  }

  function occupiedCells(includeEnemies = true) {
    const occupied = new Set(state.snake.map((part) => `${part.x},${part.y}`));
    if (includeEnemies) {
      state.enemies.forEach((enemy) => occupied.add(`${enemy.x},${enemy.y}`));
    }
    return occupied;
  }

  function randomCell(avoidOccupied = true) {
    const occupied = avoidOccupied ? occupiedCells() : new Set();
    let tries = 0;
    while (tries < 2000) {
      const x = Math.floor(Math.random() * GRID);
      const y = Math.floor(Math.random() * GRID);
      if (!occupied.has(`${x},${y}`)) {
        return { x, y };
      }
      tries += 1;
    }
    return { x: 1, y: 1 };
  }

  function createEnemy() {
    const position = randomCell(true);
    const directions = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 }
    ];
    return {
      x: position.x,
      y: position.y,
      direction: directions[Math.floor(Math.random() * directions.length)],
      burst: 0
    };
  }

  function resetEnemies() {
    state.enemies = Array.from({ length: 5 }, createEnemy);
  }

  function spawnFood() {
    state.food = randomCell(true);
  }

  function applyQueuedDirection() {
    if (!state.queuedDirection) return;
    const { x, y } = state.direction;
    const next = state.queuedDirection;
    if (x + next.x === 0 && y + next.y === 0) {
      state.queuedDirection = null;
      return;
    }
    state.direction = next;
    state.queuedDirection = null;
  }

  function setDirection(nextDirection) {
    if (!nextDirection) return;
    const current = state.queuedDirection || state.direction;
    if (current.x + nextDirection.x === 0 && current.y + nextDirection.y === 0) return;
    state.queuedDirection = nextDirection;
  }

  function endGame(reason = 'Game Over') {
    state.mode = 'gameover';
    clearTimers();
    setStatus(reason);
    overlay.hidden = false;
    if (state.score > state.best) {
      writeBestScore(state.score);
    }
  }

  function startTimers() {
    clearTimers();
    scheduleGameTick();
    enemyTimer = setInterval(moveEnemies, ENEMY_STEP_MS);
    burstTimer = setInterval(triggerEnemyBurst, ENEMY_BURST_MS);
  }

  function scheduleGameTick() {
    if (gameTimer) {
      clearTimeout(gameTimer);
      gameTimer = null;
    }
    if (state.mode !== 'playing') return;
    gameTimer = setTimeout(() => {
      gameTimer = null;
      gameStep();
      if (state.mode === 'playing') {
        scheduleGameTick();
      }
    }, state.shiftHeld ? STEP_MS / 2 : STEP_MS);
  }

  function startGame() {
    if (state.mode === 'playing') return;
    if (state.mode !== 'paused') {
      state.score = 0;
      state.direction = { x: 1, y: 0 };
      state.queuedDirection = null;
      state.snake = createSnake();
      resetEnemies();
      spawnFood();
      updateScoreboard();
    }
    state.mode = 'playing';
    overlay.hidden = true;
    setStatus('Playing');
    startTimers();
    render();
  }

  function pauseGame() {
    if (state.mode !== 'playing') return;
    state.mode = 'paused';
    clearTimers();
    setStatus('Paused');
  }

  function restartGame() {
    clearTimers();
    state.mode = 'ready';
    state.score = 0;
    state.direction = { x: 1, y: 0 };
    state.queuedDirection = null;
    state.snake = createSnake();
    resetEnemies();
    spawnFood();
    state.burstActive = false;
    updateScoreboard();
    setStatus('Ready');
    overlay.hidden = false;
    render();
    startGame();
  }

  function updateScoreboard() {
    scoreValue.textContent = String(state.score);
    bestValue.textContent = String(state.best);
  }

  function wrapPosition(part) {
    return {
      x: (part.x + GRID) % GRID,
      y: (part.y + GRID) % GRID
    };
  }

  function moveEnemies() {
    if (state.mode !== 'playing' || state.burstActive) return;
    const directions = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 }
    ];

    state.enemies.forEach((enemy) => {
      if (Math.random() < 0.4) {
        enemy.direction = directions[Math.floor(Math.random() * directions.length)];
      }
      const moved = wrapPosition({ x: enemy.x + enemy.direction.x, y: enemy.y + enemy.direction.y });
      enemy.x = moved.x;
      enemy.y = moved.y;
      if (state.snake.some((segment) => segment.x === enemy.x && segment.y === enemy.y)) {
        endGame('Enemy collision');
      }
      if (enemy.x === state.food.x && enemy.y === state.food.y) {
        spawnFood();
      }
    });
    render();
  }

  function triggerEnemyBurst() {
    if (state.mode !== 'playing') return;
    state.burstActive = true;
    state.enemies.forEach((enemy) => {
      enemy.burst = 1;
    });
    render();
    if (recoverTimer) clearTimeout(recoverTimer);
    recoverTimer = setTimeout(() => {
      state.enemies.forEach((enemy) => {
        const position = randomCell(true);
        const directions = [
          { x: 1, y: 0 },
          { x: -1, y: 0 },
          { x: 0, y: 1 },
          { x: 0, y: -1 }
        ];
        enemy.x = position.x;
        enemy.y = position.y;
        enemy.direction = directions[Math.floor(Math.random() * directions.length)];
        enemy.burst = 0;
      });
      state.burstActive = false;
      render();
    }, 260);
  }

  function gameStep() {
    if (state.mode !== 'playing') return;
    applyQueuedDirection();

    const head = state.snake[state.snake.length - 1];
    const nextHead = { x: head.x + state.direction.x, y: head.y + state.direction.y };

    if (nextHead.x < 0 || nextHead.x >= GRID || nextHead.y < 0 || nextHead.y >= GRID) {
      endGame('Wall collision');
      return;
    }

    const selfCollision = state.snake.some((segment) => segment.x === nextHead.x && segment.y === nextHead.y);
    if (selfCollision) {
      endGame('Self collision');
      return;
    }

    if (state.enemies.some((enemy) => enemy.x === nextHead.x && enemy.y === nextHead.y)) {
      endGame('Enemy collision');
      return;
    }

    state.snake.push(nextHead);

    const ateFood = nextHead.x === state.food.x && nextHead.y === state.food.y;
    if (ateFood) {
      state.score += 10;
      updateScoreboard();
      if (state.score > state.best) {
        writeBestScore(state.score);
      }
      spawnFood();
    } else {
      state.snake.shift();
    }

    render();
  }

  function drawCell(x, y, color, inset = 0) {
    const padding = Math.max(1.5, cellSize * inset);
    ctx.fillStyle = color;
    ctx.fillRect(x * cellSize + padding, y * cellSize + padding, cellSize - padding * 2, cellSize - padding * 2);
  }

  function drawRoundedRect(x, y, w, h, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    ctx.fill();
  }

  function renderGrid() {
    ctx.strokeStyle = 'rgba(114, 255, 158, 0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID; i += 1) {
      const pos = i * cellSize;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, boardSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(boardSize, pos);
      ctx.stroke();
    }
  }

  function render() {
    if (!boardSize) return;
    ctx.clearRect(0, 0, boardSize, boardSize);
    ctx.fillStyle = 'rgba(2, 7, 4, 0.98)';
    ctx.fillRect(0, 0, boardSize, boardSize);

    const gradient = ctx.createLinearGradient(0, 0, boardSize, boardSize);
    gradient.addColorStop(0, 'rgba(114, 255, 158, 0.08)');
    gradient.addColorStop(1, 'rgba(114, 255, 158, 0.01)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, boardSize, boardSize);

    renderGrid();

    const foodPulse = 0.88 + Math.sin(Date.now() / 180) * 0.08;
    drawRoundedRect(
      state.food.x * cellSize + cellSize * 0.16,
      state.food.y * cellSize + cellSize * 0.16,
      cellSize * 0.68,
      cellSize * 0.68,
      cellSize * 0.18,
      `rgba(255, 121, 151, ${foodPulse})`
    );

    state.enemies.forEach((enemy) => {
      const baseX = enemy.x * cellSize;
      const baseY = enemy.y * cellSize;
      if (enemy.burst) {
        ctx.strokeStyle = 'rgba(255, 173, 92, 0.85)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(baseX + cellSize / 2, baseY + cellSize / 2, cellSize * 0.42, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255, 173, 92, 0.28)';
        ctx.fillRect(baseX + cellSize * 0.1, baseY + cellSize * 0.1, cellSize * 0.8, cellSize * 0.8);
      } else {
        ctx.fillStyle = 'rgba(114, 255, 158, 0.14)';
        ctx.fillRect(baseX + cellSize * 0.12, baseY + cellSize * 0.12, cellSize * 0.76, cellSize * 0.76);
        ctx.fillStyle = 'rgba(114, 255, 158, 0.92)';
        ctx.fillRect(baseX + cellSize * 0.3, baseY + cellSize * 0.3, cellSize * 0.4, cellSize * 0.4);
      }
    });

    state.snake.forEach((segment, index) => {
      const ratio = index / Math.max(1, state.snake.length - 1);
      const hue = Math.round(135 + ratio * 18);
      const alpha = index === state.snake.length - 1 ? 1 : 0.88;
      drawRoundedRect(
        segment.x * cellSize + cellSize * 0.08,
        segment.y * cellSize + cellSize * 0.08,
        cellSize * 0.84,
        cellSize * 0.84,
        cellSize * 0.2,
        `hsla(${hue}, 95%, ${index === state.snake.length - 1 ? '74%' : '52%'}, ${alpha})`
      );
    });

    if (state.mode !== 'playing') {
      overlay.hidden = false;
    }
  }

  function mapDirection(key) {
    const normalized = key.toLowerCase();
    switch (normalized) {
      case 'arrowup':
      case 'w':
        return { x: 0, y: -1 };
      case 'arrowdown':
      case 's':
        return { x: 0, y: 1 };
      case 'arrowleft':
      case 'a':
        return { x: -1, y: 0 };
      case 'arrowright':
      case 'd':
        return { x: 1, y: 0 };
      default:
        return null;
    }
  }

  function setShiftBoost(active) {
    if (state.shiftHeld === active) return;
    state.shiftHeld = active;
    if (state.mode === 'playing') {
      scheduleGameTick();
    }
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Shift') {
      setShiftBoost(true);
      return;
    }

    const direction = mapDirection(event.key);
    if (direction) {
      event.preventDefault();
      if (state.mode === 'ready' || state.mode === 'gameover') {
        state.snake = createSnake();
        state.direction = { x: 1, y: 0 };
        state.queuedDirection = null;
        state.score = 0;
        resetEnemies();
        spawnFood();
        updateScoreboard();
        state.mode = 'playing';
        overlay.hidden = true;
        setStatus('Playing');
        startTimers();
      }
      setDirection(direction);
      return;
    }

    if (event.key === ' ' || event.code === 'Space') {
      event.preventDefault();
      if (state.mode === 'playing') {
        pauseGame();
      } else if (state.mode === 'paused') {
        state.mode = 'playing';
        setStatus('Playing');
        startTimers();
      } else {
        startGame();
      }
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      if (state.mode === 'playing') return;
      startGame();
    }
  }, { passive: false });

  document.addEventListener('keyup', (event) => {
    if (event.key === 'Shift') {
      setShiftBoost(false);
    }
  });

  startBtn.addEventListener('click', () => {
    if (state.mode === 'playing') return;
    startGame();
  });
  pauseBtn.addEventListener('click', () => {
    if (state.mode === 'playing') {
      pauseGame();
      return;
    }
    if (state.mode === 'paused') {
      state.mode = 'playing';
      setStatus('Playing');
      startTimers();
      overlay.hidden = true;
      return;
    }
    startGame();
  });
  restartBtn.addEventListener('click', () => {
    restartGame();
  });

  dPadButtons.forEach((button) => {
    button.addEventListener('pointerdown', () => {
      const direction = mapDirection(button.dataset.direction || '');
      if (!direction) return;
      if (state.mode === 'ready' || state.mode === 'gameover') {
        state.snake = createSnake();
        state.direction = { x: 1, y: 0 };
        state.queuedDirection = null;
        state.score = 0;
        resetEnemies();
        spawnFood();
        updateScoreboard();
        state.mode = 'playing';
        overlay.hidden = true;
        setStatus('Playing');
        startTimers();
      }
      setDirection(direction);
    });
  });

  function initialize() {
    state.snake = createSnake();
    resetEnemies();
    spawnFood();
    state.score = 0;
    updateScoreboard();
    state.best = readBestScore();
    updateScoreboard();
    setStatus('Ready');
    overlay.hidden = false;
    resizeCanvas();
    render();
  }

  if ('ResizeObserver' in window) {
    boardObserver = new ResizeObserver(() => resizeCanvas());
    boardObserver.observe(canvas);
  } else {
    window.addEventListener('resize', resizeCanvas);
  }

  initialize();
}

function setupMinesweeperGame() {
  const board = document.getElementById('minesweeper-board');
  const mineSelect = document.getElementById('mine-count-select');
  const newBtn = document.getElementById('minesweeper-new-btn');
  const openBtn = document.getElementById('minesweeper-open-btn');
  const flagBtn = document.getElementById('minesweeper-flag-btn');
  const mineLeftValue = document.getElementById('mine-left-value');
  const revealedValue = document.getElementById('revealed-value');
  const statusValue = document.getElementById('ms-status-value');

  if (
    !(board instanceof HTMLElement) ||
    !(mineSelect instanceof HTMLSelectElement) ||
    !(newBtn instanceof HTMLButtonElement) ||
    !(openBtn instanceof HTMLButtonElement) ||
    !(flagBtn instanceof HTMLButtonElement) ||
    !(mineLeftValue instanceof HTMLElement) ||
    !(revealedValue instanceof HTMLElement) ||
    !(statusValue instanceof HTMLElement)
  ) {
    return;
  }

  const SIZE = 20;
  const CELL_TOTAL = SIZE * SIZE;
  const state = {
    mineCount: Number(mineSelect.value) || 5,
    actionMode: 'open',
    firstReveal: true,
    gameOver: false,
    won: false,
    revealed: 0,
    flags: 0,
    mines: new Set(),
    counts: Array.from({ length: SIZE }, () => Array(SIZE).fill(0)),
    opened: new Set(),
    flagged: new Set(),
    cells: []
  };

  function key(row, col) {
    return `${row},${col}`;
  }

  function setStatus(text) {
    statusValue.textContent = text;
  }

  function updateStats() {
    mineLeftValue.textContent = String(Math.max(0, state.mineCount - state.flags));
    revealedValue.textContent = String(state.revealed);
  }

  function setActionMode(mode) {
    state.actionMode = mode;
    openBtn.classList.toggle('button-primary', mode === 'open');
    openBtn.classList.toggle('button-secondary', mode !== 'open');
    flagBtn.classList.toggle('button-primary', mode === 'flag');
    flagBtn.classList.toggle('button-secondary', mode !== 'flag');
    openBtn.setAttribute('aria-pressed', String(mode === 'open'));
    flagBtn.setAttribute('aria-pressed', String(mode === 'flag'));
  }

  function clearBoard() {
    state.cells.forEach((cell) => {
      cell.className = 'ms-cell';
      cell.textContent = '';
      cell.disabled = false;
      cell.removeAttribute('data-number');
    });
  }

  function paintCell(row, col) {
    const cell = state.cells[row * SIZE + col];
    if (!(cell instanceof HTMLButtonElement)) return;

    const cellKey = key(row, col);
    const open = state.opened.has(cellKey);
    const flagged = state.flagged.has(cellKey);
    const mine = state.mines.has(cellKey);
    const count = state.counts[row][col];

    cell.className = 'ms-cell';
    if (open) cell.classList.add('is-open');
    if (flagged) cell.classList.add('is-flagged');
    if (mine && state.gameOver) cell.classList.add('is-mine');
    if (mine && state.gameOver && state.lastTriggerKey === cellKey) cell.classList.add('is-triggered');
    if (open && count === 0) cell.classList.add('is-empty');
    if (open && count > 0) {
      cell.dataset.number = String(count);
      cell.textContent = String(count);
    } else if (flagged) {
      cell.textContent = '⚑';
    } else if (mine && state.gameOver) {
      cell.textContent = '✹';
    } else {
      cell.textContent = '';
    }
    cell.disabled = state.gameOver || state.won || open;
    cell.setAttribute('aria-label', `행 ${row + 1}, 열 ${col + 1}`);
  }

  function paintAllCells() {
    for (let row = 0; row < SIZE; row += 1) {
      for (let col = 0; col < SIZE; col += 1) {
        paintCell(row, col);
      }
    }
  }

  function buildBoard() {
    board.innerHTML = '';
    state.cells = [];
    for (let row = 0; row < SIZE; row += 1) {
      for (let col = 0; col < SIZE; col += 1) {
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'ms-cell';
        cell.setAttribute('aria-label', `행 ${row + 1}, 열 ${col + 1}`);
        cell.addEventListener('click', () => {
          if (state.actionMode === 'flag') {
            toggleFlag(row, col);
          } else {
            revealCell(row, col);
          }
        });
        cell.addEventListener('contextmenu', (event) => {
          event.preventDefault();
          toggleFlag(row, col);
        });
        board.appendChild(cell);
        state.cells.push(cell);
      }
    }
  }

  function resetGame(nextMineCount = state.mineCount) {
    state.mineCount = nextMineCount;
    state.firstReveal = true;
    state.gameOver = false;
    state.won = false;
    state.revealed = 0;
    state.flags = 0;
    state.mines = new Set();
    state.counts = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
    state.opened = new Set();
    state.flagged = new Set();
    state.lastTriggerKey = null;
    mineSelect.value = String(nextMineCount);
    setStatus('Ready');
    updateStats();
    clearBoard();
  }

  function placeMines(excludeRow, excludeCol) {
    const safe = new Set();
    for (let row = excludeRow - 1; row <= excludeRow + 1; row += 1) {
      for (let col = excludeCol - 1; col <= excludeCol + 1; col += 1) {
        if (row >= 0 && row < SIZE && col >= 0 && col < SIZE) {
          safe.add(key(row, col));
        }
      }
    }

    while (state.mines.size < state.mineCount) {
      const row = Math.floor(Math.random() * SIZE);
      const col = Math.floor(Math.random() * SIZE);
      const cellKey = key(row, col);
      if (safe.has(cellKey) || state.mines.has(cellKey)) {
        continue;
      }
      state.mines.add(cellKey);
    }

    for (let row = 0; row < SIZE; row += 1) {
      for (let col = 0; col < SIZE; col += 1) {
        const cellKey = key(row, col);
        if (state.mines.has(cellKey)) continue;
        let count = 0;
        for (let r = row - 1; r <= row + 1; r += 1) {
          for (let c = col - 1; c <= col + 1; c += 1) {
            if (r === row && c === col) continue;
            if (r < 0 || r >= SIZE || c < 0 || c >= SIZE) continue;
            if (state.mines.has(key(r, c))) count += 1;
          }
        }
        state.counts[row][col] = count;
      }
    }
  }

  function revealNeighbors(startRow, startCol) {
    const stack = [[startRow, startCol]];
    while (stack.length) {
      const [row, col] = stack.pop();
      if (row < 0 || row >= SIZE || col < 0 || col >= SIZE) continue;
      const cellKey = key(row, col);
      if (state.opened.has(cellKey) || state.flagged.has(cellKey)) continue;
      if (state.mines.has(cellKey)) continue;

      state.opened.add(cellKey);
      state.revealed += 1;
      const count = state.counts[row][col];
      if (count === 0) {
        for (let r = row - 1; r <= row + 1; r += 1) {
          for (let c = col - 1; c <= col + 1; c += 1) {
            if (r === row && c === col) continue;
            stack.push([r, c]);
          }
        }
      }
    }
  }

  function winGame() {
    state.won = true;
    setStatus('Cleared');
    paintAllCells();
    updateStats();
  }

  function loseGame(triggerRow, triggerCol) {
    state.gameOver = true;
    state.lastTriggerKey = key(triggerRow, triggerCol);
    setStatus('Boom');
    state.mines.forEach((mineKey) => {
      const [row, col] = mineKey.split(',').map((value) => Number(value));
      const cell = state.cells[row * SIZE + col];
      if (cell instanceof HTMLButtonElement) {
        cell.classList.add('is-mine');
        cell.textContent = '✹';
      }
    });
    paintAllCells();
  }

  function revealCell(row, col) {
    if (state.gameOver || state.won) return;
    const cellKey = key(row, col);
    if (state.flagged.has(cellKey) || state.opened.has(cellKey)) return;

    if (state.firstReveal) {
      placeMines(row, col);
      state.firstReveal = false;
      setStatus('Playing');
    }

    if (state.mines.has(cellKey)) {
      loseGame(row, col);
      return;
    }

    revealNeighbors(row, col);
    paintAllCells();
    updateStats();

    if (state.revealed >= CELL_TOTAL - state.mineCount) {
      winGame();
    }
  }

  function toggleFlag(row, col) {
    if (state.gameOver || state.won) return;
    const cellKey = key(row, col);
    if (state.opened.has(cellKey)) return;

    if (state.flagged.has(cellKey)) {
      state.flagged.delete(cellKey);
      state.flags -= 1;
    } else {
      if (state.flags >= state.mineCount) return;
      state.flagged.add(cellKey);
      state.flags += 1;
    }

    paintCell(row, col);
    updateStats();
  }

  newBtn.addEventListener('click', () => {
    resetGame(Number(mineSelect.value) || 5);
  });

  mineSelect.addEventListener('change', () => {
    resetGame(Number(mineSelect.value) || 5);
  });

  openBtn.addEventListener('click', () => {
    setActionMode('open');
  });

  flagBtn.addEventListener('click', () => {
    setActionMode('flag');
  });

  buildBoard();
  resetGame(state.mineCount);
  setActionMode('open');
}
