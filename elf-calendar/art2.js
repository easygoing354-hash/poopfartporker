// Extra art for the v2 packet: elf doors, door accessories, and new prop drawings.
const { RED, GREEN, GOLD, INK } = require('./art.js');
const BLUE = '#3b7dbf', BROWN = '#7a4a21';

const st = `stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"`;
const OUT = 'M8 300 V92 A72 72 0 0 1 152 92 V300 Z';   // frame outline (arched)
const IN = 'M24 296 V94 A56 56 0 0 1 136 94 V296 Z';    // door panel
const step = `<rect x="2" y="290" width="156" height="12" rx="3" fill="#9a9a9a" ${st}/>`;
const knob = (x = 118, y = 196, c = GOLD) => `<circle cx="${x}" cy="${y}" r="6" fill="${c}" ${st}/>`;
const doorSvg = (inner, w = 3.25) => `<svg width="${w * 96}" height="${w * 96 * 1.9}" viewBox="0 0 160 304">${inner}</svg>`;
const wreathG = (cx, cy, r = 22) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${GREEN}" stroke-width="12"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#155c39" stroke-width="12" stroke-dasharray="3 6"/>${[0, 60, 120, 180, 240, 300].map((a) => `<circle cx="${cx + r * Math.cos((a * Math.PI) / 180)}" cy="${cy + r * Math.sin((a * Math.PI) / 180)}" r="3.2" fill="${RED}"/>`).join('')}<path d="M${cx - 10} ${cy + r} l-8 12 l8 -3 l3 8 z M${cx + 10} ${cy + r} l8 12 l-8 -3 l-3 8 z" fill="${RED}" ${st} stroke-width="1.5"/><circle cx="${cx}" cy="${cy + r}" r="5" fill="${RED}" ${st} stroke-width="1.5"/>`;

const doors = [
  ['Classic Red Door', doorSvg(`
    <path d="${OUT}" fill="#d9cfc2" ${st}/>${[120, 160, 200, 240, 280].map((y) => `<path d="M8 ${y} H24 M136 ${y} H152" stroke="#a89c8e" stroke-width="2"/>`).join('')}
    <path d="${IN}" fill="${RED}" ${st}/>${[52, 80, 108].map((x) => `<line x1="${x}" y1="${x === 80 ? 38 : 50}" x2="${x}" y2="296" stroke="#a81d2d" stroke-width="2"/>`).join('')}
    <path d="M44 96 A36 36 0 0 1 116 96 Z" fill="#ffe28a" ${st}/><path d="M80 60 V96 M56 82 L80 96 L104 82" stroke="${INK}" stroke-width="2" fill="none"/>
    ${wreathG(80, 150)}${knob()}${step}`)],
  ['Gingerbread Door', doorSvg(`
    <path d="${OUT}" fill="#b8733f" ${st}/>
    <path d="M16 96 A64 64 0 0 1 144 96" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="1 9" stroke-linecap="round"/>
    <path d="${IN}" fill="#8b4f26" ${st}/>
    <path d="M36 130 q11 -12 22 0 t22 0 t22 0 t22 0 M36 230 q11 -12 22 0 t22 0 t22 0 t22 0" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>
    <rect x="44" y="150" width="72" height="64" rx="8" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="7 5"/>
    ${[[16, 140, RED], [16, 190, GREEN], [16, 240, GOLD], [144, 140, GOLD], [144, 190, RED], [144, 240, GREEN]].map(([x, y, c]) => `<path d="M${x - 7} ${y + 5} a7 8 0 0 1 14 0 z" fill="${c}" ${st} stroke-width="1.5"/>`).join('')}
    <circle cx="80" cy="88" r="16" fill="#fff" ${st}/><path d="M80 72 a16 16 0 0 1 0 32 M64 88 h32 M80 72 v32" stroke="${RED}" stroke-width="5" fill="none"/>
    <path d="M114 230 V196 a8 8 0 0 1 16 0" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/><path d="M114 230 V196 a8 8 0 0 1 16 0" fill="none" stroke="${RED}" stroke-width="7" stroke-dasharray="5 5" stroke-linecap="round"/>
    ${step}`)],
  ['Candy Cane Door', doorSvg(`
    <defs><pattern id="ccStripe" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="20" height="20" fill="#fff"/><rect width="10" height="20" fill="${RED}"/></pattern></defs>
    <path d="${OUT}" fill="${GREEN}" ${st}/><path d="${IN}" fill="url(#ccStripe)" ${st}/>
    <path d="M60 64 q-30 -26 -36 2 q14 14 36 -2 M100 64 q30 -26 36 2 q-14 14 -36 -2" fill="${GOLD}" ${st}/><circle cx="80" cy="64" r="10" fill="${GOLD}" ${st}/><path d="M74 72 l-12 34 M86 72 l12 34" stroke="${GOLD}" stroke-width="7" stroke-linecap="round"/>
    <circle cx="118" cy="196" r="10" fill="#fff" ${st}/><path d="M118 186 a10 10 0 0 1 0 20 M108 196 h20" stroke="${RED}" stroke-width="3.5" fill="none"/>
    ${step}`)],
  ['North Pole Door', doorSvg(`
    <path d="${OUT}" fill="#5a3412" ${st}/><path d="${IN}" fill="#2e7d4f" ${st}/>
    ${[46, 68, 90, 112].map((x) => `<line x1="${x}" y1="60" x2="${x}" y2="296" stroke="#1f5c39" stroke-width="2"/>`).join('')}
    ${[130, 250].map((y) => `<rect x="24" y="${y}" width="40" height="9" rx="3" fill="#333" ${st} stroke-width="1.5"/>`).join('')}
    <circle cx="80" cy="110" r="18" fill="#ffe28a" ${st}/><path d="M80 92 v36 M62 110 h36" stroke="${INK}" stroke-width="2"/>
    <path d="M10 96 Q14 22 80 20 Q146 22 150 96 Q140 80 128 88 Q118 70 104 80 Q92 64 80 76 Q66 62 56 80 Q42 70 32 88 Q20 80 10 96 Z" fill="#fff" ${st}/>
    <rect x="30" y="160" width="100" height="26" rx="5" fill="${RED}" ${st}/><text x="80" y="179" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="14" fill="#fff">NORTH POLE</text>
    ${knob(118, 214)}${step}`)],
  ['Snowy Cabin Door', doorSvg(`
    <path d="${OUT}" fill="#8b5a2b" ${st}/>${[110, 140, 170, 200, 230, 260].map((y) => `<path d="M8 ${y} H24 M136 ${y} H152" stroke="#5a3412" stroke-width="2"/>`).join('')}
    <path d="${IN}" fill="${BLUE}" ${st}/>
    <rect x="50" y="88" width="60" height="54" rx="4" fill="#ffd966" ${st}/><path d="M80 88 v54 M50 115 h60" stroke="${INK}" stroke-width="2.5"/>
    <rect x="44" y="164" width="72" height="44" rx="4" fill="none" stroke="#2c6aa8" stroke-width="3"/><rect x="44" y="222" width="72" height="44" rx="4" fill="none" stroke="#2c6aa8" stroke-width="3"/>
    ${[30, 50, 70, 90, 110, 130].map((x, i) => `<path d="M${x} ${40 + Math.abs(80 - x) * 0.55} l4 ${12 + (i % 2) * 8} l4 -${12 + (i % 2) * 8} z" fill="#e7f2fc" stroke="#7aa3c8" stroke-width="1.2"/>`).join('')}
    <path d="M2 296 Q20 262 46 276 Q66 254 90 274 Q118 258 134 276 Q150 266 158 296 Z" fill="#fff" ${st}/>
    ${knob(118, 190)}`)],
  ["Santa's Workshop Door", doorSvg(`
    <path d="${OUT}" fill="${RED}" ${st}/><path d="${IN}" fill="#c08a4e" ${st}/>
    ${[46, 68, 90, 112].map((x) => `<line x1="${x}" y1="44" x2="${x}" y2="296" stroke="#8b5a2b" stroke-width="2"/>`).join('')}
    <path d="M30 150 H130 M30 270 H130 M34 266 L126 154" stroke="#8b5a2b" stroke-width="9" stroke-linecap="round"/>
    <rect x="28" y="72" width="104" height="48" rx="6" fill="#fff8e7" ${st}/><text x="80" y="92" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="9.5" fill="${RED}">SANTA'S WORKSHOP</text><text x="80" y="110" text-anchor="middle" font-family="Fredoka" font-weight="600" font-size="11" fill="${GREEN}">Elves Only!</text>
    <path d="M80 26 l5 11 l12 1 l-9 8 l3 12 l-11 -7 l-11 7 l3 -12 l-9 -8 l12 -1 z" fill="${GOLD}" ${st} stroke-width="1.5"/>
    ${knob(118, 210)}${step}`)],
];

const welcomeMat = `<svg width="330" height="140" viewBox="0 0 110 46"><rect x="2" y="2" width="106" height="42" rx="6" fill="#a0522d" ${st}/><rect x="7" y="7" width="96" height="32" rx="4" fill="none" stroke="#f4d03f" stroke-width="1.5" stroke-dasharray="3 2"/><text x="55" y="29" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="15" fill="#fff">WELCOME</text></svg>`;
const crossing = (elfSvg) => `<div style="position:relative;width:230px;height:300px"><svg width="230" height="300" viewBox="0 0 76 100"><rect x="35" y="66" width="6" height="34" fill="#888" ${st} stroke-width="1.5"/><path d="M38 2 L74 38 L38 74 L2 38 Z" fill="#ffd400" ${st}/><path d="M38 8 L68 38 L38 68 L8 38 Z" fill="none" stroke="${INK}" stroke-width="1.5"/><rect x="8" y="78" width="60" height="16" rx="3" fill="#fff" ${st} stroke-width="1.8"/><text x="38" y="90" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="9" fill="${INK}">ELF CROSSING</text></svg><div style="position:absolute;left:83px;top:50px">${elfSvg}</div></div>`;
const miniWreath = `<svg width="190" height="200" viewBox="0 0 70 74">${wreathG(35, 32, 24)}</svg>`;
const lantern = `<svg width="130" height="230" viewBox="0 0 44 78"><path d="M16 10 a6 6 0 0 1 12 0" fill="none" stroke="${INK}" stroke-width="2.5"/><path d="M8 14 H36 L32 20 H12 Z" fill="${INK}"/><rect x="10" y="20" width="24" height="44" rx="2" fill="#fff4c2" ${st}/><path d="M22 34 q-6 8 0 14 q6 -6 0 -14" fill="#f2b134"/><rect x="18" y="46" width="8" height="12" fill="#fff" stroke="${INK}" stroke-width="1.2"/><line x1="22" y1="20" x2="22" y2="64" stroke="${INK}" stroke-width="1.2" opacity=".4"/><path d="M6 64 H38 L34 72 H10 Z" fill="${INK}"/></svg>`;

const redPen = `<svg width="440" height="90" viewBox="0 0 160 32"><path d="M10 16 L26 6 H132 a6 6 0 0 1 6 6 V20 a6 6 0 0 1 -6 6 H26 Z" fill="${RED}" ${st}/><path d="M10 16 L26 6 V26 Z" fill="#f6d2b0" ${st}/><path d="M10 16 L16 12.5 V19.5 Z" fill="${RED}"/><rect x="120" y="3" width="8" height="26" rx="2" fill="#999" ${st} stroke-width="1.5"/><text x="74" y="21" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="11" fill="#fff">ELF GRADING PEN</text></svg>`;
const duck = `<svg width="190" height="170" viewBox="0 0 70 62"><path d="M8 34 Q8 56 34 56 Q62 56 62 36 Q54 40 46 36 Q50 22 40 14 Q30 8 22 16 Q16 22 20 32 Q12 34 8 34 Z" fill="#ffd400" ${st}/><path d="M18 22 Q8 22 4 26 Q10 30 20 28 Z" fill="#f28c28" ${st} stroke-width="1.8"/><circle cx="28" cy="20" r="2.6" fill="${INK}"/><path d="M30 42 q10 6 20 -2" fill="none" stroke="#e0b400" stroke-width="2.5"/></svg>`;
const towel = `<svg width="200" height="230" viewBox="0 0 60 70"><rect x="4" y="4" width="52" height="62" rx="4" fill="#fff" ${st}/>${[14, 22, 50, 58].map((y) => `<rect x="4" y="${y}" width="52" height="4" fill="${y < 30 ? RED : GREEN}"/>`).join('')}<text x="30" y="42" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="9" fill="${INK}">ELF</text></svg>`;
const shampoo = `<svg width="150" height="260" viewBox="0 0 44 76"><rect x="16" y="2" width="12" height="10" rx="2" fill="${GREEN}" ${st} stroke-width="1.8"/><path d="M8 14 Q8 10 14 10 H30 Q36 10 36 14 V70 Q36 74 32 74 H12 Q8 74 8 70 Z" fill="#9fd6f5" ${st}/><rect x="11" y="28" width="22" height="30" rx="3" fill="#fff" stroke="${INK}" stroke-width="1.2"/><text x="22" y="38" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="5.5" fill="${RED}">ELF</text><text x="22" y="45" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="4.2" fill="${GREEN}">SHAMPOO</text><text x="22" y="53" text-anchor="middle" font-family="Fredoka" font-size="3.6" fill="${INK}">extra bubbly!</text>${[[14, 6], [6, 2], [34, 4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="#fff" stroke="#9fd6f5" stroke-width="1"/>`).join('')}</svg>`;
const bulb = (c) => `<svg width="74" height="118" viewBox="0 0 30 48"><rect x="10" y="2" width="10" height="12" rx="2" fill="#5a5a5a" ${st} stroke-width="1.6"/><circle cx="15" cy="6" r="2" fill="#fff" stroke="#999" stroke-width=".8"/><path d="M10 14 Q2 24 6 36 Q10 46 15 46 Q20 46 24 36 Q28 24 20 14 Z" fill="${c}" ${st} stroke-width="1.8"/><path d="M10 22 q-2 6 0 12" stroke="#fff" stroke-width="2.4" fill="none" opacity=".7" stroke-linecap="round"/></svg>`;
const apple = `<svg width="160" height="170" viewBox="0 0 50 54"><path d="M25 14 Q8 6 5 24 Q3 44 18 50 Q22 52 25 49 Q28 52 32 50 Q47 44 45 24 Q42 6 25 14 Z" fill="${RED}" ${st}/><path d="M25 14 Q24 6 28 2" fill="none" stroke="${BROWN}" stroke-width="3" stroke-linecap="round"/><path d="M27 9 Q36 2 42 8 Q34 14 27 9 Z" fill="${GREEN}" ${st} stroke-width="1.5"/><ellipse cx="15" cy="24" rx="4" ry="7" fill="#fff" opacity=".5"/></svg>`;
const candyX = `<svg width="105" height="105" viewBox="0 0 44 44"><g stroke-linecap="round"><path d="M8 8 L36 36 M36 8 L8 36" stroke="${INK}" stroke-width="10"/><path d="M8 8 L36 36 M36 8 L8 36" stroke="#fff" stroke-width="7"/><path d="M8 8 L36 36 M36 8 L8 36" stroke="${RED}" stroke-width="7" stroke-dasharray="4 4"/></g></svg>`;
const wreathO = `<svg width="105" height="105" viewBox="0 0 44 44">${wreathG(22, 20, 13)}</svg>`;
const discoBall = `<svg width="300" height="330" viewBox="0 0 90 100"><line x1="45" y1="0" x2="45" y2="12" stroke="${INK}" stroke-width="2"/><defs><clipPath id="dball"><circle cx="45" cy="54" r="40"/></clipPath></defs><circle cx="45" cy="54" r="40" fill="#cfd8e3"/><g clip-path="url(#dball)">${Array.from({ length: 10 }, (_, r) => Array.from({ length: 10 }, (_, c) => `<rect x="${5 + c * 8}" y="${14 + r * 8}" width="7" height="7" fill="${['#e9eef5', '#b9c6d6', '#fff', '#9fb0c6', '#f5d76e', '#a7d8f5'][(r * 3 + c * 7) % 6]}"/>`).join('')).join('')}</g><circle cx="45" cy="54" r="40" fill="none" ${st}/>${[[10, 18], [82, 22], [8, 90], [84, 92]].map(([x, y]) => `<path d="M${x} ${y - 6} l1.6 4.4 l4.4 1.6 l-4.4 1.6 l-1.6 4.4 l-1.6 -4.4 l-4.4 -1.6 l4.4 -1.6 z" fill="${GOLD}"/>`).join('')}</svg>`;

// simple seeded maze for "Untangle the Elf"
function maze(cols = 9, rows = 11, seed = 7, cell = 52) {
  let s = seed; const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const vis = Array.from({ length: rows }, () => Array(cols).fill(false));
  const wallsH = Array.from({ length: rows + 1 }, () => Array(cols).fill(true)); // horizontal walls above row r
  const wallsV = Array.from({ length: rows }, () => Array(cols + 1).fill(true)); // vertical walls left of col c
  const stack = [[0, 0]]; vis[0][0] = true;
  while (stack.length) {
    const [r, c] = stack[stack.length - 1];
    const nb = [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].filter(([a, b]) => a >= 0 && b >= 0 && a < rows && b < cols && !vis[a][b]);
    if (!nb.length) { stack.pop(); continue; }
    const [a, b] = nb[Math.floor(rnd() * nb.length)];
    if (a < r) wallsH[r][c] = false; if (a > r) wallsH[a][c] = false; if (b < c) wallsV[r][c] = false; if (b > c) wallsV[r][b] = false;
    vis[a][b] = true; stack.push([a, b]);
  }
  wallsV[0][0] = false; wallsV[rows - 1][cols] = false; // entrance / exit
  const W = cols * cell, H = rows * cell, pad = 8;
  let lines = '', bulbs = '';
  const colors = [RED, GREEN, GOLD, BLUE];
  let k = 0;
  const seg = (x1, y1, x2, y2) => {
    lines += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
    if (k++ % 3 === 0) bulbs += `<ellipse cx="${(x1 + x2) / 2}" cy="${(y1 + y2) / 2}" rx="5" ry="7" fill="${colors[k % 4]}" stroke="${INK}" stroke-width="1.2"/>`;
  };
  for (let r = 0; r <= rows; r++) for (let c = 0; c < cols; c++) if (wallsH[r][c]) seg(pad + c * cell, pad + r * cell, pad + (c + 1) * cell, pad + r * cell);
  for (let r = 0; r < rows; r++) for (let c = 0; c <= cols; c++) if (wallsV[r][c]) seg(pad + c * cell, pad + r * cell, pad + c * cell, pad + (r + 1) * cell);
  return `<svg width="100%" viewBox="0 0 ${W + pad * 2} ${H + pad * 2}"><g stroke="${GREEN}" stroke-width="4" stroke-linecap="round">${lines}</g>${bulbs}</svg>`;
}

module.exports = { doors, welcomeMat, crossing, miniWreath, lantern, redPen, duck, towel, shampoo, bulb, apple, candyX, wreathO, discoBall, maze, wreathG };
