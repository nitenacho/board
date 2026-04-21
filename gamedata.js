// gamedata.js — The Island: static data and initial state factory

const TERRAIN_CONFIG = {
  Mar:     { label:'Mar',     height:0, bg:'transparent',                border:'rgba(255,255,255,0.08)', text:'rgba(255,255,255,0.3)'  },
  Playa:   { label:'Playa',   height:1, bg:'#e8c87a',                    border:'#c4983a',                text:'#7a5a18'                },
  Bosque:  { label:'Bosque',  height:2, bg:'#4a8c3f',                    border:'#2d6b28',                text:'#c8f0c0'                },
  Montana: { label:'Montaña', height:3, bg:'#8a7ba0',                    border:'#5e4d7a',                text:'#ede8f8'                },
};

const PLAYER_DATA = {
  1: { name:'Jugador 1', colorName:'Rojo',       hex:'#ff3366', glow:'rgba(255,51,102,0.3)',  bg:'rgba(255,51,102,0.1)'  },
  2: { name:'Jugador 2', colorName:'Turquesa',   hex:'#00e5cc', glow:'rgba(0,229,204,0.3)',   bg:'rgba(0,229,204,0.1)'   },
  3: { name:'Jugador 3', colorName:'Amarillo',   hex:'#ffd700', glow:'rgba(255,215,0,0.3)',   bg:'rgba(255,215,0,0.1)'   },
  4: { name:'Jugador 4', colorName:'Verde',      hex:'#39d98a', glow:'rgba(57,217,138,0.3)',  bg:'rgba(57,217,138,0.1)'  },
  5: { name:'Jugador 5', colorName:'Púrpura',    hex:'#b44dff', glow:'rgba(180,77,255,0.3)',  bg:'rgba(180,77,255,0.1)'  },
  6: { name:'Jugador 6', colorName:'Salmón',     hex:'#ff8070', glow:'rgba(255,128,112,0.3)', bg:'rgba(255,128,112,0.1)' },
};

// Board: 7 rows × 10 cols (0-indexed). Island = rows 2-6, cols 2-9
const BOARD_TERRAIN = [
  ['Mar','Mar','Mar','Mar','Mar','Mar','Mar','Mar','Mar','Mar'],
  ['Mar','Mar','Mar','Mar','Mar','Mar','Mar','Mar','Mar','Mar'],
  ['Mar','Mar','Playa','Playa','Playa','Montana','Bosque','Bosque','Bosque','Playa'],
  ['Mar','Mar','Playa','Montana','Bosque','Bosque','Bosque','Bosque','Playa','Montana'],
  ['Mar','Mar','Montana','Bosque','Playa','Bosque','Bosque','Bosque','Montana','Bosque'],
  ['Mar','Mar','Bosque','Bosque','Montana','Montana','Playa','Playa','Montana','Bosque'],
  ['Mar','Mar','Playa','Playa','Playa','Playa','Playa','Bosque','Playa','Playa'],
];

// All 40 island tiles (r,c are 0-indexed; data was 1-indexed so subtract 1)
const TILES_INIT = [
  {id:1, tipo:'Playa',  altura:1, accion:'INM_Barco',    r:2,c:2},
  {id:2, tipo:'Playa',  altura:1, accion:'INM_Barco',    r:2,c:3},
  {id:3, tipo:'Playa',  altura:1, accion:'INM_Barco',    r:2,c:4},
  {id:4, tipo:'Montana',altura:3, accion:'INM_Volcan',   r:2,c:5},
  {id:5, tipo:'Bosque', altura:2, accion:'MAN_Vientos',  r:2,c:6},
  {id:6, tipo:'Bosque', altura:2, accion:'INM_Barco',    r:2,c:7},
  {id:7, tipo:'Bosque', altura:2, accion:'INM_Tiburon',  r:2,c:8},
  {id:8, tipo:'Playa',  altura:1, accion:'INM_Ballena',  r:2,c:9},
  {id:9, tipo:'Playa',  altura:1, accion:'INM_Remolino', r:3,c:2},
  {id:10,tipo:'Montana',altura:3, accion:'MAN_Delfin',   r:3,c:3},
  {id:11,tipo:'Bosque', altura:2, accion:'MAN_Vientos',  r:3,c:4},
  {id:12,tipo:'Bosque', altura:2, accion:'INM_Barco',    r:3,c:5},
  {id:13,tipo:'Bosque', altura:2, accion:'MAN_Ballena',  r:3,c:6},
  {id:14,tipo:'Bosque', altura:2, accion:'INM_Tiburon',  r:3,c:7},
  {id:15,tipo:'Playa',  altura:1, accion:'INM_Remolino', r:3,c:8},
  {id:16,tipo:'Montana',altura:3, accion:'INM_Tiburon',  r:3,c:9},
  {id:17,tipo:'Montana',altura:3, accion:'MAN_Delfin',   r:4,c:2},
  {id:18,tipo:'Bosque', altura:2, accion:'INM_Barco',    r:4,c:3},
  {id:19,tipo:'Playa',  altura:1, accion:'MAN_Serpiente',r:4,c:4},
  {id:20,tipo:'Bosque', altura:2, accion:'MAN_Vientos',  r:4,c:5},
  {id:21,tipo:'Bosque', altura:2, accion:'INM_Tiburon',  r:4,c:6},
  {id:22,tipo:'Bosque', altura:2, accion:'MAN_Tiburon',  r:4,c:7},
  {id:23,tipo:'Montana',altura:3, accion:'DEF_Tiburon',  r:4,c:8},
  {id:24,tipo:'Bosque', altura:2, accion:'INM_Ballena',  r:4,c:9},
  {id:25,tipo:'Bosque', altura:2, accion:'INM_Barco',    r:5,c:2},
  {id:26,tipo:'Bosque', altura:2, accion:'INM_Barco',    r:5,c:3},
  {id:27,tipo:'Montana',altura:3, accion:'INM_Barco',    r:5,c:4},
  {id:28,tipo:'Montana',altura:3, accion:'INM_Barco',    r:5,c:5},
  {id:29,tipo:'Playa',  altura:1, accion:'INM_Remolino', r:5,c:6},
  {id:30,tipo:'Playa',  altura:1, accion:'INM_Ballena',  r:5,c:7},
  {id:31,tipo:'Montana',altura:3, accion:'INM_Barco',    r:5,c:8},
  {id:32,tipo:'Bosque', altura:2, accion:'INM_Ballena',  r:5,c:9},
  {id:33,tipo:'Playa',  altura:1, accion:'INM_Remolino', r:6,c:2},
  {id:34,tipo:'Playa',  altura:1, accion:'INM_Ballena',  r:6,c:3},
  {id:35,tipo:'Playa',  altura:1, accion:'MAN_Serpiente',r:6,c:4},
  {id:36,tipo:'Playa',  altura:1, accion:'MAN_Delfin',   r:6,c:5},
  {id:37,tipo:'Playa',  altura:1, accion:'INM_Tiburon',  r:6,c:6},
  {id:38,tipo:'Bosque', altura:2, accion:'INM_Barco',    r:6,c:7},
  {id:39,tipo:'Playa',  altura:1, accion:'DEF_Ballena',  r:6,c:8},
  {id:40,tipo:'Playa',  altura:1, accion:'INM_Remolino', r:6,c:9},
];

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
  {id:'S1',tipo:'Serpiente',r:0,c:1,estado:'activo'},
  {id:'S2',tipo:'Serpiente',r:0,c:8,estado:'activo'},
  {id:'S3',tipo:'Serpiente',r:3,c:0,estado:'activo'},
  {id:'S4',tipo:'Serpiente',r:6,c:1,estado:'activo'},
  {id:'S5',tipo:'Serpiente',r:6,c:8,estado:'activo'},
  {id:'T1',tipo:'Tiburon',r:null,c:null,estado:'reserva'},
  {id:'T2',tipo:'Tiburon',r:null,c:null,estado:'reserva'},
  {id:'T3',tipo:'Tiburon',r:null,c:null,estado:'reserva'},
  {id:'T4',tipo:'Tiburon',r:null,c:null,estado:'reserva'},
  {id:'T5',tipo:'Tiburon',r:null,c:null,estado:'reserva'},
  {id:'B1',tipo:'Ballena',r:null,c:null,estado:'reserva'},
  {id:'B2',tipo:'Ballena',r:null,c:null,estado:'reserva'},
  {id:'B3',tipo:'Ballena',r:null,c:null,estado:'reserva'},
  {id:'D1',tipo:'Delfin',r:null,c:null,estado:'reserva'},
  {id:'D2',tipo:'Delfin',r:null,c:null,estado:'reserva'},
];

const EXPLORER_VALUES = [1,1,1,2,2,3,3,4,5,6]; // 10 per player: 28 pts total

function createInitialExplorers(numPlayers) {
  const explorers = [];
  const tilesPerPlayer = Math.floor(40 / numPlayers);
  for (let p = 1; p <= numPlayers; p++) {
    const startIdx = (p - 1) * tilesPerPlayer;
    for (let i = 0; i < 10; i++) {
      const tile = TILES_INIT[(startIdx + i) % 40];
      explorers.push({
        id: (p-1)*10 + i + 1,
        player: p,
        value: EXPLORER_VALUES[i],
        r: tile.r, c: tile.c,
        state: 'tierra', // tierra | nadando | barco | salvado | eliminado
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
  return r >= 2 && r <= 6 && c >= 2 && c <= 9;
}

function isSeaCell(r, c) {
  return !isIslandCell(r, c);
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
