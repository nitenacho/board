// HUD.jsx — daylight theme, hand cards, phase stepper, log

// ── Hand Card ─────────────────────────────────────────────────────────────────
function HandCard({ card, onPlay, disabled }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onClick={() => !disabled && onPlay(card)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1, minWidth: 64, maxWidth: 90,
        background: hovered && !disabled ? '#fff' : '#f9f7f4',
        border: `1.5px solid ${hovered && !disabled ? card.color : '#ddd5c8'}`,
        borderRadius: 8, padding: '10px 6px 8px',
        textAlign: 'center', cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'all 0.15s',
        boxShadow: hovered && !disabled
          ? `0 4px 12px rgba(0,0,0,0.12), 0 0 0 1px ${card.color}44`
          : '0 1px 4px rgba(0,0,0,0.06)',
        transform: hovered && !disabled ? 'translateY(-2px)' : 'none',
        userSelect: 'none',
      }}
      title={card.desc}
    >
      <div style={{ fontSize: 20, marginBottom: 4, lineHeight: 1, color: card.color }}>
        {card.symbol}
      </div>
      <div style={{ fontSize: 9, fontWeight: 700, color: '#374151', lineHeight: 1.3, letterSpacing: '0.02em' }}>
        {card.label}
      </div>
    </div>
  );
}

function HandCards({ hand, onPlay, phase }) {
  if (!hand || hand.length === 0) return (
    <div style={{ fontSize: 11, color: '#9ca3af', fontStyle: 'italic', textAlign: 'center', padding: '8px 0' }}>
      Sin fichas en mano
    </div>
  );
  return (
    <div>
      <div style={{ fontSize: 9, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
        Fichas en mano {phase !== 1 && <span style={{ color: '#d1c4b0' }}>(solo fase 1)</span>}
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {hand.map(card => (
          <HandCard key={card.uid} card={card} onPlay={onPlay} disabled={phase !== 1} />
        ))}
      </div>
    </div>
  );
}

// ── Phase Step ─────────────────────────────────────────────────────────────────
function PhaseStep({ phase, current }) {
  const active = phase.id === current;
  const done = phase.id < current;
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      opacity: active ? 1 : done ? 0.6 : 0.3,
      transition: 'opacity 0.3s',
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: '50%', flexShrink: 0, marginTop: 1,
        background: active ? '#2563eb' : done ? '#d1fae5' : '#f3f4f6',
        border: `1.5px solid ${active ? '#2563eb' : done ? '#10b981' : '#e5e7eb'}`,
        boxShadow: active ? '0 2px 8px rgba(37,99,235,0.4)' : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 9, fontWeight: 700,
        color: active ? '#fff' : done ? '#059669' : '#9ca3af',
        transition: 'all 0.3s',
      }}>
        {done ? '✓' : phase.id}
      </div>
      <div style={{ paddingTop: 2 }}>
        <div style={{
          fontSize: 12, fontWeight: active ? 600 : 400,
          color: active ? '#111827' : done ? '#6b7280' : '#9ca3af',
        }}>{phase.label}</div>
        {active && (
          <div style={{ fontSize: 10, color: '#6b7280', marginTop: 2, lineHeight: 1.4 }}>
            {phase.desc}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Score Row ─────────────────────────────────────────────────────────────────
function ScoreRow({ player, scores, currentPlayer, numPlayers }) {
  if (player > numPlayers) return null;
  const p = PLAYER_DATA[player];
  const isActive = player === currentPlayer;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '5px 8px', borderRadius: 6,
      background: isActive ? `${p.hex}18` : 'transparent',
      border: `1px solid ${isActive ? p.hex + '44' : 'transparent'}`,
      transition: 'all 0.3s',
    }}>
      <div style={{
        width: 9, height: 9, borderRadius: '50%',
        background: p.hex,
        boxShadow: isActive ? `0 0 6px ${p.hex}` : 'none',
        flexShrink: 0,
      }} />
      <span style={{ flex: 1, fontSize: 11, color: isActive ? '#111827' : '#6b7280', fontWeight: isActive ? 600 : 400 }}>
        {p.name} <span style={{ fontWeight: 400, color: '#9ca3af', fontSize: 10 }}>({p.colorName})</span>
      </span>
      <span style={{ fontSize: 13, fontWeight: 700, color: isActive ? p.hex : '#9ca3af', fontFamily: 'monospace' }}>
        {scores[player] || 0}
      </span>
      <span style={{ fontSize: 9, color: '#d1d5db' }}>pts</span>
    </div>
  );
}

// ── Dice Display ──────────────────────────────────────────────────────────────
function DiceDisplay({ result, rolling, onRoll }) {
  const labels = {
    Tiburon:   { label:'TIBURÓN',   color:'#ef4444', symbol:'◆', bg:'#fef2f2' },
    Serpiente: { label:'SERPIENTE', color:'#84cc16', symbol:'〜', bg:'#f7fee7' },
    Ballena:   { label:'BALLENA',   color:'#3b82f6', symbol:'●', bg:'#eff6ff' },
  };
  const info = result ? labels[result] : null;
  return (
    <div style={{
      border: '1.5px solid #e5e7eb', borderRadius: 8, overflow: 'hidden',
      background: info ? info.bg : '#f9f7f4',
      transition: 'background 0.4s',
    }}>
      <div style={{ padding: '10px 14px', textAlign: 'center' }}>
        <div style={{ fontSize: 9, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
          Dado de Criaturas
        </div>
        <div style={{
          fontSize: 36, lineHeight: 1,
          animation: rolling ? 'spin 0.3s linear infinite' : 'none',
          color: info ? info.color : '#d1d5db',
          transition: 'color 0.3s',
          filter: info ? `drop-shadow(0 2px 6px ${info.color}66)` : 'none',
        }}>
          {rolling ? '◌' : info ? info.symbol : '◌'}
        </div>
        {info && !rolling && (
          <div style={{ fontSize: 12, color: info.color, fontWeight: 700, marginTop: 6, letterSpacing: '0.04em' }}>
            {info.label}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Move Points ───────────────────────────────────────────────────────────────
function MovePtsBar({ movePts }) {
  return (
    <div style={{
      padding: '10px 12px', background: '#f0fdf4',
      border: '1.5px solid #bbf7d0', borderRadius: 8,
    }}>
      <div style={{ fontSize: 9, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
        Puntos de Movimiento
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
        {[1,2,3].map(i => (
          <div key={i} style={{
            flex: 1, height: 8, borderRadius: 4,
            background: i <= movePts ? '#10b981' : '#e5e7eb',
            boxShadow: i <= movePts ? '0 1px 4px rgba(16,185,129,0.4)' : 'none',
            transition: 'all 0.2s',
          }} />
        ))}
      </div>
      <div style={{ fontSize: 10, color: '#6b7280' }}>
        {movePts}/3 puntos restantes
      </div>
    </div>
  );
}

// ── Event Log ─────────────────────────────────────────────────────────────────
function ActionLog({ entries }) {
  const logRef = React.useRef(null);
  React.useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [entries]);
  return (
    <div>
      <div style={{ fontSize: 9, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
        Log de Eventos
      </div>
      <div ref={logRef} style={{
        maxHeight: 140, overflowY: 'auto', fontFamily: 'monospace',
        fontSize: 10, color: '#6b7280', lineHeight: 1.7,
        background: '#faf9f6', borderRadius: 6, padding: '8px 10px',
        border: '1px solid #e8e0d4',
      }}>
        {entries.map((entry, i) => (
          <div key={i} style={{
            color: entry.type === 'action' ? '#059669'
              : entry.type === 'warn' ? '#d97706'
              : entry.type === 'error' ? '#dc2626'
              : '#9ca3af',
          }}>
            <span style={{ color: '#d1d5db' }}>›</span> {entry.text}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Selected Cell Info ────────────────────────────────────────────────────────
function SelectedInfo({ info }) {
  if (!info) return null;
  return (
    <div style={{
      padding: '10px 12px', background: '#fefce8',
      border: '1.5px solid #fde68a', borderRadius: 8,
    }}>
      <div style={{ fontSize: 9, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
        Seleccionado
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 4 }}>{info.coord}</div>
      {info.tile && !info.tile.removed && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 10, padding: '2px 7px', borderRadius: 10,
            background: TERRAIN_CONFIG[info.tile.tipo]?.bg || '#eee',
            color: TERRAIN_CONFIG[info.tile.tipo]?.border || '#333',
            fontWeight: 600, border: `1px solid ${TERRAIN_CONFIG[info.tile.tipo]?.border || '#ccc'}`,
          }}>{info.tile.tipo}</span>
          {info.tile.accion && (
            <span style={{ fontSize: 10, color: ACTION_INFO[info.tile.accion]?.color || '#666', fontWeight: 600 }}>
              {ACTION_INFO[info.tile.accion]?.symbol} {ACTION_INFO[info.tile.accion]?.label}
            </span>
          )}
        </div>
      )}
      {info.explorers?.length > 0 && (
        <div style={{ marginTop: 6, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {info.explorers.map(e => (
            <span key={e.id} style={{
              fontSize: 10, padding: '1px 6px', borderRadius: 10,
              background: `${PLAYER_DATA[e.player]?.hex}22`,
              color: PLAYER_DATA[e.player]?.hex,
              border: `1px solid ${PLAYER_DATA[e.player]?.hex}44`,
              fontWeight: 600,
            }}>J{e.player}</span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Tweak Toggle ──────────────────────────────────────────────────────────────
function TweakToggle({ label, value, onChange }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
      <span style={{ fontSize:11, color:'#374151' }}>{label}</span>
      <div onClick={() => onChange(!value)} style={{
        width:34, height:20, borderRadius:10,
        background: value ? '#2563eb' : '#e5e7eb',
        cursor:'pointer', position:'relative', transition:'background 0.2s',
        flexShrink:0,
      }}>
        <div style={{
          position:'absolute', top:3, left: value ? 16 : 3,
          width:14, height:14, borderRadius:'50%',
          background:'#fff', transition:'left 0.2s',
          boxShadow:'0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </div>
    </div>
  );
}

// ── Button Style ──────────────────────────────────────────────────────────────
function btnStyle(bg, text, border) {
  return {
    background: bg || '#2563eb',
    color: text || '#fff',
    border: `1.5px solid ${border || bg || '#2563eb'}`,
    padding: '10px 16px', borderRadius: 6,
    fontSize: 11, fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.06em',
    cursor: 'pointer', transition: 'all 0.15s',
    width: '100%', fontFamily: 'inherit',
  };
}

// ── HUD ───────────────────────────────────────────────────────────────────────
function HUD({
  currentPlayer, numPlayers, turn, phase,
  scores, log, diceResult, diceRolling, movePts,
  hand, onPlayCard,
  onNextPhase, onRollDice, onPassPhase,
  selectedInfo,
  tweaks, setTweaks, showTweaks,
}) {
  const p = PLAYER_DATA[currentPlayer];

  return (
    <aside style={{
      width: 300, flexShrink: 0,
      background: '#faf9f6',
      borderLeft: '1.5px solid #e8e0d4',
      display: 'flex', flexDirection: 'column',
      height: '100%', overflow: 'hidden',
      fontFamily: "'Space Grotesk', sans-serif",
    }}>
      {/* Player header */}
      <div style={{
        padding: '14px 18px',
        borderBottom: '1.5px solid #e8e0d4',
        background: `linear-gradient(135deg, ${p.hex}18 0%, transparent 100%)`,
        flexShrink: 0,
      }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <div style={{ fontSize:9, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:4 }}>
              Jugador Activo
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <Meeple color={p.hex} size={20} />
              <div>
                <div style={{ fontSize:16, fontWeight:700, color:'#111827' }}>{p.name}</div>
                <div style={{ fontSize:10, color: p.hex, fontWeight:600 }}>{p.colorName}</div>
              </div>
            </div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:9, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:4 }}>
              Turno
            </div>
            <div style={{ fontSize:24, fontWeight:700, color:'#111827', fontFamily:'monospace' }}>
              {String(turn).padStart(2,'0')}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex:1, overflowY:'auto', padding:'14px 18px', display:'flex', flexDirection:'column', gap:14 }}>
        {/* Phase stepper */}
        <div>
          <div style={{ fontSize:9, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:10 }}>
            Fases del Turno
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {PHASE_INFO.map(ph => <PhaseStep key={ph.id} phase={ph} current={phase} />)}
          </div>
        </div>

        {/* Phase-specific widgets */}
        {phase === 1 && hand && (
          <HandCards hand={hand} onPlay={onPlayCard} phase={phase} />
        )}
        {phase === 2 && <MovePtsBar movePts={movePts} />}
        {phase === 4 && <DiceDisplay result={diceResult} rolling={diceRolling} onRoll={onRollDice} />}

        {/* Selected cell */}
        <SelectedInfo info={selectedInfo} />

        {/* Scoreboard */}
        <div>
          <div style={{ fontSize:9, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:8 }}>
            Puntuación
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
            {[1,2,3,4,5,6].map(i => (
              <ScoreRow key={i} player={i} scores={scores} currentPlayer={currentPlayer} numPlayers={numPlayers} />
            ))}
          </div>
        </div>

        <ActionLog entries={log} />
      </div>

      {/* Action buttons */}
      <div style={{ padding:'12px 18px', borderTop:'1.5px solid #e8e0d4', flexShrink:0, display:'flex', flexDirection:'column', gap:8 }}>
        {phase === 4 && !diceResult && (
          <button onClick={onRollDice} style={btnStyle('#2563eb')}>
            ◎ Lanzar Dado
          </button>
        )}
        {(phase !== 4 || diceResult) && (
          <button onClick={onNextPhase} style={btnStyle('#2563eb')}>
            {phase === 1 ? '→ Confirmar / Siguiente' : phase === 2 ? '✓ Fin Movimiento' : phase === 3 ? '✓ Confirmar Retiro' : '✓ Fin Turno'}
          </button>
        )}
        <button onClick={onPassPhase} style={btnStyle('transparent', '#9ca3af', '#e5e7eb')}>
          Omitir Fase
        </button>
      </div>
    </aside>
  );
}

Object.assign(window, { HUD, TweakToggle, HandCard, HandCards, btnStyle });
