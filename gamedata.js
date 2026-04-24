// gamedata.js — The Island: static data and initial state factory

const TERRAIN_CONFIG = {
  Mar:      { label:'Mar',          height:0, bg:'transparent', border:'rgba(255,255,255,0.08)', text:'rgba(255,255,255,0.3)' },
  Playa:    { label:'Playa',        height:1, bg:'#e8c87a',     border:'#c4983a',                text:'#7a5a18' },
  Bosque:   { label:'Bosque',       height:2, bg:'#4a8c3f',     border:'#2d6b28',                text:'#c8f0c0' },
  Montana:  { label:'Montaña',      height:3, bg:'#8a7ba0',     border:'#5e4d7a',                text:'#ede8f8' },
  Mainland: { label:'Tierra Firme', height:9, bg:'#d9c9a7',     border:'#8a6b3a',                text:'#3b2a10' },
};

const PLAYER_DATA = {
  1: { name:'Jugador 1', colorName:'Rojo',       hex:'#ff3366', glow:'rgba(255,51,102,0.3)',  bg:'rgba(255,51,102,0.1)'  },
  2: { name:'Jugador 2', colorName:'Turquesa',   hex:'#00e5cc', glow:'rgba(0,229,204,0.3)',   bg:'rgba(0,229,204,0.1)'   },
  3: { name:'Jugador 3', colorName:'Amarillo',   hex:'#ffd700', glow:'rgba(255,215,0,0.3)',   bg:'rgba(255,215,0,0.1)'   },
  4: { name:'Jugador 4', colorName:'Verde',      hex:'#39d98a', glow:'rgba(57,217,138,0.3)',  bg:'rgba(57,217,138,0.1)'  },
  5: { name:'Jugador 5', colorName:'Púrpura',    hex:'#b44dff', glow:'rgba(180,77,255,0.3)',  bg:'rgba(180,77,255,0.1)'  },
  6: { name:'Jugador 6', colorName:'Salmón',     hex:'#ff8070', glow:'rgba(255,128,112,0.3)', bg:'rgba(255,128,112,0.1)' },
};

// ── Pseudo-hex concentric island on a 7×10 odd-r offset grid ─────────────────
const BOARD_ROWS = 7, BOARD_COLS = 10;
const ISLAND_CENTER = { r: 3, c: 4 };                  // exact middle
const CORNERS = [[0,0],[0,BOARD_COLS-1],[BOARD_ROWS-1,0],[BOARD_ROWS-1,BOARD_COLS-1]];

function _toCube(r, c) {                               // odd-r offset → cube
  const x = c - ((r - (r & 1)) >> 1);
  const z = r;
  return { x, y: -x - z, z };
}
function hexDistance(r1, c1, r2, c2) {
  const a = _toCube(r1, c1), b = _toCube(r2, c2);
  return (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z)) / 2;
}
function ringOf(r, c) {
  return hexDistance(r, c, ISLAND_CENTER.r, ISLAND_CENTER.c);
}
function isCornerCell(r, c) {
  return CORNERS.some(([cr, cc]) => cr === r && cc === c);
}

// Ring → terrain mapping (spec: 1=Rock, 2=Forest, 3=Sand, 0=empty center)
const RING_TERRAIN = { 1:'Montana', 2:'Bosque', 3:'Playa' };

const BOARD_TERRAIN = (() => {
  const grid = [];
  for (let r = 0; r < BOARD_ROWS; r++) {
    const row = [];
    for (let c = 0; c < BOARD_COLS; c++) {
      if (isCornerCell(r, c))       row.push('Mainland');
      else if (r === ISLAND_CENTER.r && c === ISLAND_CENTER.c) row.push('Mar'); // strictly empty
      else {
        const d = ringOf(r, c);
        row.push(RING_TERRAIN[d] || 'Mar');
      }
    }
    grid.push(row);
  }
  return grid;
})();

// Deterministic action allocation per ring — keeps the original flavour mix
const _ACTION_POOL = {
  Montana: ['INM_Volcan','INM_Tiburon','MAN_Delfin','DEF_Tiburon','INM_Barco','MAN_Delfin'],
  Bosque:  ['INM_Barco','MAN_Vientos','INM_Tiburon','MAN_Ballena','MAN_Vientos','MAN_Tiburon',
            'INM_Barco','INM_Ballena','INM_Barco','INM_Tiburon','MAN_Vientos','INM_Ballena'],
  Playa:   ['INM_Remolino','INM_Ballena','MAN_Serpiente','INM_Remolino','DEF_Ballena',
            'INM_Remolino','MAN_Delfin','INM_Tiburon','INM_Barco','MAN_Serpiente',
            'INM_Ballena','INM_Remolino','INM_Barco','INM_Ballena','INM_Barco',
            'INM_Remolino','INM_Ballena','INM_Barco'],
};

const TILES_INIT = (() => {
  const tiles = [];
  const cursors = { Montana: 0, Bosque: 0, Playa: 0 };
  let id = 1;
  for (let r = 0; r < BOARD_ROWS; r++) {
    for (let c = 0; c < BOARD_COLS; c++) {
      const terrain = BOARD_TERRAIN[r][c];
      if (!['Montana','Bosque','Playa'].includes(terrain)) continue;
      const pool = _ACTION_POOL[terrain];
      const accion = pool[cursors[terrain]++ % pool.length];
      tiles.push({ id: id++, tipo: terrain, altura: TERRAIN_CONFIG[terrain].height, accion, r, c });
    }
  }
  return tiles;
})();

const ACTION_INFO = {
  INM_Barco:    { label:'Barco',        color:'#60a5fa', symbol:'⛵', desc:'Coloca un barco en el mar adyacente' },
  INM_Volcan:   { label:'¡VOLCÁN!',     color:'#ef4444', symbol:'🌋', desc:'Volcán revelado — fin del juego' },
  INM_Tiburon:  { label:'Tiburón',      color:'#f97316', symbol:'◆', desc:'Coloca un tiburón en el mar adyacente' },
  INM_Ballena:  { label:'Ballena',      color:'#3b82f6', symbol:'◉', desc:'Coloca una ballena en el mar adyacente' },
  INM_Remolino: { label:'Remolino',     color:'#8b5cf6', symbol:'◎', desc:'El remolino hunde barcos y nadadores' },
  MAN_Vientos:  { label:'Vientos',      color:'#94a3b8', symbol:'≋', desc:'Mueve un barco hasta 2 espacios' },
  MAN_Delfin:   { label:'Delfín',       color:'#22d3ee', symbol:'◑', desc:'Mueve un delfín (lleva exploradores)' },
  MAN_Serpiente:{ label:'Serpiente',    color:'#a3e635', symbol:'~', desc:'Mueve una serpiente marina' },
  MAN_Ballena:  { label:'Mv. Ballena',  color:'#3b82f6', symbol:'◉', desc:'Mueve una ballena existente' },
  MAN_Tiburon:  { label:'Mv. Tiburón',  color:'#f97316', symbol:'◆', desc:'Mueve un tiburón existente' },
  DEF_Tiburon:  { label:'Def. Tiburón', color:'#f97316', symbol:'◈', desc:'Defiéndete de un tiburón esta fase' },
  DEF_Ballena:  { label:'Def. Ballena', color:'#3b82f6', symbol:'◎', desc:'Defiéndete de una ballena esta fase' },
};

const CREATURES_INIT = [
  // Mandatory spawn: Sea Serpent occupies the strictly-empty center tile
  { id:'S_CENTER', tipo:'Serpiente', r: ISLAND_CENTER.r, c: ISLAND_CENTER.c, estado:'activo' },
  { id:'S2', tipo:'Serpiente', r:0, c:1, estado:'activo' },
  { id:'S3', tipo:'Serpiente', r:0, c:8, estado:'activo' },
  { id:'S4', tipo:'Serpiente', r:6, c:1, estado:'activo' },
  { id:'S5', tipo:'Serpiente', r:6, c:8, estado:'activo' },
  { id:'T1', tipo:'Tiburon', r:null, c:null, estado:'reserva' },
  { id:'T2', tipo:'Tiburon', r:null, c:null, estado:'reserva' },
  { id:'T3', tipo:'Tiburon', r:null, c:null, estado:'reserva' },
  { id:'T4', tipo:'Tiburon', r:null, c:null, estado:'reserva' },
  { id:'T5', tipo:'Tiburon', r:null, c:null, estado:'reserva' },
  { id:'B1', tipo:'Ballena', r:null, c:null, estado:'reserva' },
  { id:'B2', tipo:'Ballena', r:null, c:null, estado:'reserva' },
  { id:'B3', tipo:'Ballena', r:null, c:null, estado:'reserva' },
  { id:'D1', tipo:'Delfin',  r:null, c:null, estado:'reserva' },
  { id:'D2', tipo:'Delfin',  r:null, c:null, estado:'reserva' },
];

const EXPLORER_VALUES = [1,1,1,2,2,3,3,4,5,6]; // 10 per player: 28 pts total

function createInitialExplorers(numPlayers) {
  const explorers = [];
  for (let p = 1; p <= numPlayers; p++) {
    const corner = CORNERS[(p - 1) % 4];                // 4 safe zones
    for (let i = 0; i < 10; i++) {
      explorers.push({
        id: (p-1)*10 + i + 1,
        player: p,
        value: EXPLORER_VALUES[i],
        r: corner[0], c: corner[1],
        state: 'mainland', // mainland | tierra | nadando | barco | salvado | eliminado
      });
    }
  }
  return explorers;
}

function createInitialBoats(tiles) {
  // No boats at game start — placed when INM_Barco tiles are removed
  return [];
}

function isIslandCell(r, c) {
  const t = BOARD_TERRAIN[r]?.[c];
  return t === 'Playa' || t === 'Bosque' || t === 'Montana';
}

function isMainlandCell(r, c) {
  return BOARD_TERRAIN[r]?.[c] === 'Mainland';
}

function isSeaCell(r, c) {
  return BOARD_TERRAIN[r]?.[c] === 'Mar';
}

function getAdjacentCells(r, c) {
  return [[r-1,c],[r+1,c],[r,c-1],[r,c+1]]
    .filter(([ar,ac]) => ar >= 0 && ar < 7 && ac >= 0 && ac < 10);
}

function getEdgeTiles(tiles) {
  // A tile is removable if it's on the edge (adjacent to sea or a removed tile)
  const removedSet = new Set(tiles.filter(t => t.removed).map(t => `${t.r},${t.c}`));
  return tiles.filter(t => {
    if (t.removed) return false;
    const adj = getAdjacentCells(t.r, t.c);
    return adj.some(([ar, ac]) => isSeaCell(ar, ac) || removedSet.has(`${ar},${ac}`));
  });
}

// Dice: 1-2=Tiburon, 3-4=Serpiente, 5-6=Ballena
const DICE_MAP = ['Tiburon','Tiburon','Serpiente','Serpiente','Ballena','Ballena'];

const PHASE_INFO = [
  {id:1, label:'Ficha de Mano',   desc:'Juega una ficha de tu mano (opcional)'},
  {id:2, label:'Movimiento',      desc:'Mueve exploradores o barcos (3 puntos)'},
  {id:3, label:'Retirar Terreno', desc:'Retira una ficha del borde de la isla'},
  {id:4, label:'Dado & Criatura', desc:'Lanza el dado y mueve la criatura'},
];

// Hand tile types (action cards players hold)
const HAND_TILE_TYPES = [
  { id:'vientos',   label:'Vientos',     symbol:'≋', color:'#64748b', desc:'Mueve un barco hasta 2 espacios extra' },
  { id:'delfin',    label:'Delfín',      symbol:'◑', color:'#0ea5e9', desc:'Lleva un explorador sobre un delfín' },
  { id:'serpiente', label:'Serpiente',   symbol:'〜', color:'#84cc16', desc:'Mueve una serpiente en cualquier dir.' },
  { id:'tiburon',   label:'Tiburón',     symbol:'◆', color:'#f97316', desc:'Mueve un tiburón en cualquier dir.' },
  { id:'ballena',   label:'Ballena',     symbol:'●', color:'#3b82f6', desc:'Mueve una ballena en cualquier dir.' },
  { id:'remolino',  label:'Remolino',    symbol:'◎', color:'#8b5cf6', desc:'Activa un remolino en una casilla mar' },
  { id:'defensa',   label:'Defensa',     symbol:'◈', color:'#10b981', desc:'Protege a un explorador de criatura' },
  { id:'remo',      label:'Remo Extra',  symbol:'⟿', color:'#f59e0b', desc:'Gana 2 puntos de movimiento extra' },
];

function generateHand(count = 3) {
  const shuffled = [...HAND_TILE_TYPES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((t, i) => ({ ...t, uid: `${t.id}_${i}_${Date.now()}` }));
}

// ── Google Sheets REST bridge (via Apps Script Web App) ──────────────────────
// Flip USE_MOCK_BACKEND to false once the Apps Script Web App is deployed and
// both ENDPOINT + TOKEN are filled in. While true, the bridge short-circuits
// through localStorage (key: 'island_mock_state') and simulates a 120 ms RTT
// so the UI can exercise the same async code path.
const USE_MOCK_BACKEND = true;

const SHEETS_API = {
  ENDPOINT: 'https://script.google.com/macros/s/REPLACE_WITH_YOUR_DEPLOYMENT_ID/exec',
  TOKEN:    'REPLACE_WITH_SHARED_SECRET',    // simple bearer, rotated in Script Properties
};

const _MOCK = {
  KEY: 'island_mock_state',
  LATENCY_MS: 120,
  _memory: null,
  _delay() { return new Promise(r => setTimeout(r, this.LATENCY_MS)); },
  _load() {
    if (this._memory) return this._memory;
    try {
      const raw = localStorage.getItem(this.KEY);
      if (raw) this._memory = JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return this._memory;
  },
  _save(state) {
    this._memory = state;
    try { localStorage.setItem(this.KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  },
};

async function fetchBoardState() {
  if (USE_MOCK_BACKEND) {
    await _MOCK._delay();
    const state = _MOCK._load();
    if (!state) {
      // First call: tell caller nothing persisted yet so it can keep its local default.
      return { __empty: true };
    }
    return state;
  }
  const url = `${SHEETS_API.ENDPOINT}?action=getState&token=${encodeURIComponent(SHEETS_API.TOKEN)}`;
  const res = await fetch(url, { method: 'GET', redirect: 'follow' });
  if (!res.ok) throw new Error(`getState ${res.status}`);
  return res.json();        // { tiles, explorers, creatures, boats, hands, turn, phase, currentPlayer, scores, log }
}

async function pushTurnUpdate(partialState) {
  if (USE_MOCK_BACKEND) {
    await _MOCK._delay();
    const merged = { ...(_MOCK._load() || {}), ...partialState, __updatedAt: Date.now() };
    _MOCK._save(merged);
    return { ok: true, mock: true };
  }
  // Apps Script doGet/doPost both accept text/plain to avoid CORS preflight.
  const body = JSON.stringify({ action: 'applyTurn', token: SHEETS_API.TOKEN, patch: partialState });
  const res = await fetch(SHEETS_API.ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body, redirect: 'follow',
  });
  if (!res.ok) throw new Error(`applyTurn ${res.status}`);
  return res.json();
}

async function pollBoardState(intervalMs, onUpdate) {
  let alive = true;
  (async function loop() {
    while (alive) {
      try {
        const s = await fetchBoardState();
        if (s && !s.__empty) onUpdate(s);
      } catch (e) { console.warn('poll', e); }
      await new Promise(r => setTimeout(r, intervalMs));
    }
  })();
  return () => { alive = false; };
}

// Expose everything globally so Babel scripts can access them
window.TERRAIN_CONFIG = TERRAIN_CONFIG;
window.PLAYER_DATA = PLAYER_DATA;
window.BOARD_TERRAIN = BOARD_TERRAIN;
window.TILES_INIT = TILES_INIT;
window.ACTION_INFO = ACTION_INFO;
window.CREATURES_INIT = CREATURES_INIT;
window.HAND_TILE_TYPES = HAND_TILE_TYPES;
window.PHASE_INFO = PHASE_INFO;
window.DICE_MAP = DICE_MAP;
window.EXPLORER_VALUES = EXPLORER_VALUES;
window.generateHand = generateHand;
window.createInitialExplorers = createInitialExplorers;
window.isIslandCell = isIslandCell;
window.isSeaCell = isSeaCell;
window.getAdjacentCells = getAdjacentCells;
window.getEdgeTiles = getEdgeTiles;
window.hexDistance = hexDistance;
window.ringOf = ringOf;
window.isMainlandCell = isMainlandCell;
window.ISLAND_CENTER = ISLAND_CENTER;
window.CORNERS = CORNERS;
window.USE_MOCK_BACKEND = USE_MOCK_BACKEND;
window.SHEETS_API = SHEETS_API;
window.fetchBoardState = fetchBoardState;
window.pushTurnUpdate = pushTurnUpdate;
window.pollBoardState = pollBoardState;
