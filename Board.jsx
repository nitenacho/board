// Board.jsx — daylight ocean theme, meeple tokens, sink animations

// ── Meeple SVG ────────────────────────────────────────────────────────────────
function Meeple({ color, size = 14, glow }) {
  return (
    <svg width={size} height={Math.round(size * 1.5)} viewBox="0 0 20 30"
      style={{ filter: glow ? `drop-shadow(0 0 4px ${color})` : 'none', flexShrink: 0 }}
      title={`Explorador`}>
      <circle cx="10" cy="6" r="5.2" fill={color} />
      <path d="M3.5 14 Q1 20 4.5 24 L8 24 L8 29 L12 29 L12 24 L15.5 24 Q19 20 16.5 14 Q13.5 11 10 11 Q6.5 11 3.5 14Z"
        fill={color} />
    </svg>
  );
}

// ── Creature Badge ─────────────────────────────────────────────────────────────
const CREATURE_CFG = {
  Serpiente: { bg:'#84cc16', border:'#65a30d', icon:'〜', label:'S' },
  Tiburon:   { bg:'#ef4444', border:'#dc2626', icon:'▲', label:'T' },
  Ballena:   { bg:'#3b82f6', border:'#2563eb', icon:'●', label:'B' },
  Delfin:    { bg:'#06b6d4', border:'#0891b2', icon:'◑', label:'D' },
};

function CreatureBadge({ creature, selected, onClick }) {
  const cfg = CREATURE_CFG[creature.tipo] || { bg:'#888', border:'#666', icon:'?', label:'?' };
  return (
    <div onClick={e => { e.stopPropagation(); onClick && onClick(creature); }}
      style={{
        width: 20, height: 20, borderRadius: '50%',
        background: cfg.bg,
        border: `2px solid ${selected ? '#fff' : cfg.border}`,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize: 9, color:'#fff', fontWeight:700, flexShrink:0,
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: selected
          ? `0 0 0 2px #fff, 0 2px 8px ${cfg.bg}`
          : `0 2px 4px rgba(0,0,0,0.25)`,
        transition:'all 0.15s',
      }}>
      {cfg.icon}
    </div>
  );
}

// ── Boat Token ─────────────────────────────────────────────────────────────────
function BoatToken({ boat }) {
  const occupied = boat.explorers?.length || 0;
  return (
    <div style={{
      display:'flex', flexDirection:'column', alignItems:'center',
      gap:1, flexShrink:0,
    }} title={`Barco · ${occupied}/3 exploradores`}>
      <div style={{
        fontSize:13, lineHeight:1,
        filter:'drop-shadow(0 1px 3px rgba(0,0,0,0.4))',
      }}>⛵</div>
      <div style={{ display:'flex', gap:1 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width:4, height:4, borderRadius:'50%',
            background: i < occupied ? '#f59e0b' : 'rgba(255,255,255,0.3)',
            border:'1px solid rgba(0,0,0,0.2)',
          }} />
        ))}
      </div>
    </div>
  );
}

// ── Height Pips ───────────────────────────────────────────────────────────────
function HeightPips({ altura }) {
  const colors = { 1:'#c4983a', 2:'#2d6b28', 3:'#5e4d7a' };
  return (
    <div style={{ display:'flex', gap:2, position:'absolute', top:3, left:3, zIndex:2 }}>
      {Array.from({length:altura}).map((_,i) => (
        <div key={i} style={{
          width:5, height:5, borderRadius:'50%',
          background: colors[altura] || '#888',
          border:'1px solid rgba(0,0,0,0.2)',
          boxShadow:'0 1px 2px rgba(0,0,0,0.3)',
        }} />
      ))}
    </div>
  );
}

// ── Action Badge ──────────────────────────────────────────────────────────────
function ActionBadge({ accion }) {
  const info = ACTION_INFO[accion] || {};
  return (
    <div style={{
      position:'absolute', top:3, right:3, zIndex:2,
      fontSize:8, fontWeight:700,
      background:'rgba(0,0,0,0.18)',
      borderRadius:3, padding:'1px 3px',
      color: info.color || '#fff',
      lineHeight:1,
    }} title={info.desc}>
      {info.symbol || '?'}
    </div>
  );
}

// ── Ripple / Sink Overlay ─────────────────────────────────────────────────────
function SinkOverlay() {
  return (
    <div style={{
      position:'absolute', inset:0, zIndex:10,
      display:'flex', alignItems:'center', justifyContent:'center',
      pointerEvents:'none',
    }}>
      <div style={{
        width:32, height:32, borderRadius:'50%',
        border:'2px solid rgba(255,255,255,0.8)',
        animation:'ripple 0.6s ease-out forwards',
      }} />
    </div>
  );
}

// ── Cell ──────────────────────────────────────────────────────────────────────
function Cell({
  r, c, terrain, tile, explorers, creatures, boats,
  selected, movable, removable,
  onSelect, onCreatureClick, selectedCreature,
  showValues, showLabels,
}) {
  const cfg = TERRAIN_CONFIG[terrain] || TERRAIN_CONFIG.Mar;
  const isIsland = tile && !tile.removed && !tile.removing;
  const isRemoving = tile?.removing;
  const isSea = !isIsland && !isRemoving;

  let borderColor = cfg.border;
  let glowShadow = 'none';
  let extraBg = 'none';

  if (selected) {
    borderColor = '#fbbf24';
    glowShadow = '0 0 0 2px #fbbf24, 0 0 12px rgba(251,191,36,0.6)';
  } else if (removable) {
    borderColor = '#f97316';
    glowShadow = '0 0 8px rgba(249,115,22,0.5)';
    extraBg = 'rgba(249,115,22,0.08)';
  } else if (movable) {
    borderColor = '#22d3ee';
    glowShadow = '0 0 8px rgba(34,211,238,0.4)';
    extraBg = 'rgba(34,211,238,0.1)';
  } else if (isIsland) {
    glowShadow = '0 2px 6px rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.15)';
  }

  const cellStyle = {
    position:'relative',
    background: isRemoving ? 'rgba(255,255,255,0.15)'
      : isIsland ? cfg.bg
      : isSea ? 'rgba(255,255,255,0.04)'
      : cfg.bg,
    border: `1.5px solid ${borderColor}`,
    borderRadius: isIsland ? 5 : 3,
    display:'flex', flexDirection:'column',
    alignItems:'center', justifyContent:'center',
    cursor:'pointer', overflow:'hidden',
    boxShadow: glowShadow,
    transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
    transform: isRemoving ? 'scale(0.5)' : 'scale(1)',
    opacity: isRemoving ? 0 : 1,
    animation: removable ? 'pulse-orange 1.4s ease-in-out infinite' : 'none',
  };

  if (extraBg !== 'none') cellStyle.background = extraBg;

  // Active creatures for this cell
  const activeCrits = creatures.filter(cr => cr.r === r && cr.c === c && cr.estado === 'activo');

  return (
    <div style={cellStyle} onClick={() => onSelect(r, c)}>
      {/* Sea shimmer */}
      {isSea && (
        <div style={{
          position:'absolute', inset:0, opacity:0.04,
          backgroundImage:'repeating-linear-gradient(90deg,rgba(255,255,255,0.5) 0px,rgba(255,255,255,0.5) 1px,transparent 1px,transparent 8px)',
        }} />
      )}
      {isIsland && <HeightPips altura={tile.altura} />}
      {isIsland && <ActionBadge accion={tile.accion} />}
      {isRemoving && <SinkOverlay />}

      {/* Tokens cluster */}
      <div style={{
        display:'flex', flexWrap:'wrap', gap:2,
        alignItems:'center', justifyContent:'center',
        padding:'14px 2px 2px',
        maxWidth:'100%', zIndex:1,
      }}>
        {explorers.slice(0,5).map(e => (
          <Meeple key={e.id}
            color={PLAYER_DATA[e.player]?.hex || '#888'}
            size={13}
            glow={selected}
          />
        ))}
        {explorers.length > 5 && (
          <span style={{fontSize:7,color:'rgba(255,255,255,0.8)',fontWeight:700}}>
            +{explorers.length-5}
          </span>
        )}
        {activeCrits.map(cr => (
          <CreatureBadge key={cr.id} creature={cr}
            selected={selectedCreature === cr.id}
            onClick={onCreatureClick}
          />
        ))}
        {boats.map(b => <BoatToken key={b.id} boat={b} />)}
      </div>

      {/* Coord label */}
      {showLabels && (
        <div style={{
          position:'absolute', bottom:1, left:0, right:0,
          textAlign:'center', fontSize:6,
          color: isIsland ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.25)',
          fontFamily:'monospace', pointerEvents:'none',
        }}>
          {r+1},{c+1}
        </div>
      )}
    </div>
  );
}

// ── Board ─────────────────────────────────────────────────────────────────────
function Board({
  tiles, explorers, creatures, boats,
  phase, selected, movableSet, removableSet,
  onSelectCell, onCreatureClick, selectedCreature,
  showValues, showLabels,
}) {
  const tileMap = {};
  tiles.forEach(t => { tileMap[`${t.r},${t.c}`] = t; });

  const explorersByCell = {};
  explorers.forEach(e => {
    const k = `${e.r},${e.c}`;
    (explorersByCell[k] = explorersByCell[k] || []).push(e);
  });

  const boatsByCell = {};
  boats.forEach(b => {
    const k = `${b.r},${b.c}`;
    (boatsByCell[k] = boatsByCell[k] || []).push(b);
  });

  return (
    <div style={{
      display:'grid',
      gridTemplateColumns:'repeat(10,1fr)',
      gridTemplateRows:'repeat(7,1fr)',
      gap:3, width:'100%', height:'100%',
    }}>
      {BOARD_TERRAIN.map((row, r) =>
        row.map((terrain, c) => {
          const key = `${r},${c}`;
          return (
            <Cell key={key}
              r={r} c={c} terrain={terrain}
              tile={tileMap[key]}
              explorers={explorersByCell[key] || []}
              creatures={creatures}
              boats={boatsByCell[key] || []}
              selected={selected === key}
              movable={movableSet.has(key)}
              removable={removableSet.has(key)}
              onSelect={onSelectCell}
              onCreatureClick={onCreatureClick}
              selectedCreature={selectedCreature}
              showValues={showValues}
              showLabels={showLabels}
            />
          );
        })
      )}
    </div>
  );
}

Object.assign(window, { Board, Meeple, CreatureBadge, CREATURE_CFG });
