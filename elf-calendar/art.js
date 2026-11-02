// Core art: the elf and small reusable drawings.
const RED = '#d62839', GREEN = '#1f7a4d', GOLD = '#f2b134', SKIN = '#f6d2b0', INK = '#2b2b2b';
// ---------- art ----------
function elf({ w = 120, outline = false } = {}) {
  const f = (c) => (outline ? '#fff' : c);
  const h = Math.round((w * 170) / 120);
  return `<svg class="elf" width="${w}" height="${h}" viewBox="0 0 120 170" xmlns="http://www.w3.org/2000/svg">
  <g stroke="${INK}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">
    <rect x="47" y="134" width="10" height="26" rx="4" fill="${f(RED)}"/>
    <rect x="63" y="134" width="10" height="26" rx="4" fill="${f(RED)}"/>
    <ellipse cx="47" cy="162" rx="9" ry="5" fill="${f(GREEN)}"/>
    <ellipse cx="73" cy="162" rx="9" ry="5" fill="${f(GREEN)}"/>
    <rect x="30" y="106" width="10" height="30" rx="5" transform="rotate(20 35 106)" fill="${f(RED)}"/>
    <rect x="83" y="80" width="10" height="30" rx="5" transform="rotate(30 88 110)" fill="${f(RED)}"/>
    <circle cx="25" cy="136" r="5.5" fill="${f(SKIN)}"/>
    <circle cx="103" cy="82" r="5.5" fill="${f(SKIN)}"/>
    <path d="M40 104 Q60 96 80 104 L84 140 Q60 146 36 140 Z" fill="${f(RED)}"/>
    <path d="M38 98 L45 109 L52 100 L60 111 L68 100 L75 109 L82 98 Q60 90 38 98 Z" fill="#fff"/>
    <ellipse cx="37" cy="78" rx="5" ry="7" fill="${f(SKIN)}"/>
    <ellipse cx="83" cy="78" rx="5" ry="7" fill="${f(SKIN)}"/>
    <circle cx="60" cy="77" r="22" fill="${f(SKIN)}"/>
    <path d="M36 64 Q40 30 70 18 Q88 12 100 22 Q84 26 80 40 Q82 52 84 64 Z" fill="${f(RED)}"/>
    <circle cx="100" cy="22" r="7" fill="#fff"/>
    <rect x="33" y="57" width="54" height="11" rx="5.5" fill="#fff"/>
    <path d="M53 88 Q60 95 67 88" fill="none"/>
  </g>
  <circle cx="52" cy="78" r="2.8" fill="${INK}"/><circle cx="68" cy="78" r="2.8" fill="${INK}"/>
  ${outline ? '' : `<circle cx="46" cy="86" r="4" fill="#f59ca9" opacity=".7"/><circle cx="74" cy="86" r="4" fill="#f59ca9" opacity=".7"/>`}
</svg>`;
}

function snowflake(size = 30, color = '#9cc3e6') {
  const arms = [0, 60, 120].map((a) => `<g transform="rotate(${a} 15 15)"><line x1="15" y1="1" x2="15" y2="29"/><path d="M11 5 L15 9 L19 5 M11 25 L15 21 L19 25" fill="none"/></g>`).join('');
  return `<svg width="${size}" height="${size}" viewBox="0 0 30 30"><g stroke="${color}" stroke-width="2" stroke-linecap="round">${arms}</g></svg>`;
}

function snowball(x, y, r = 13) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="#5f86ad" stroke-width="2.2"/><path d="M${x - r * 0.5} ${y - r * 0.2} q${r * 0.3} -${r * 0.45} ${r * 0.75} -${r * 0.4}" stroke="#c6dbef" stroke-width="2" fill="none" stroke-linecap="round"/>`;
}

function die(n, s = 44) {
  const p = { 1: [[2, 2]], 2: [[1, 1], [3, 3]], 3: [[1, 1], [2, 2], [3, 3]], 4: [[1, 1], [3, 1], [1, 3], [3, 3]], 5: [[1, 1], [3, 1], [2, 2], [1, 3], [3, 3]], 6: [[1, 1], [3, 1], [1, 2], [3, 2], [1, 3], [3, 3]] }[n];
  return `<svg width="${s}" height="${s}" viewBox="0 0 40 40"><rect x="2" y="2" width="36" height="36" rx="7" fill="#fff" stroke="${INK}" stroke-width="2.5"/>${p.map(([c, r]) => `<circle cx="${c * 9 + 2}" cy="${r * 9 + 2}" r="3.6" fill="${INK}"/>`).join('')}</svg>`;
}

function fish(w = 60, color = '#f28c28') {
  return `<svg width="${w}" height="${w * 0.6}" viewBox="0 0 60 36"><path d="M6 18 Q22 0 42 12 L56 4 L54 18 L56 32 L42 24 Q22 36 6 18 Z" fill="${color}" stroke="${INK}" stroke-width="2"/><circle cx="16" cy="15" r="2.5" fill="${INK}"/></svg>`;
}

// snowman parts for the roll game
const snowParts = {
  1: `<svg width="70" height="60" viewBox="0 0 70 60"><circle cx="35" cy="32" r="25" fill="#fff" stroke="${INK}" stroke-width="2.5"/></svg>`,
  2: `<svg width="70" height="60" viewBox="0 0 70 60"><circle cx="35" cy="32" r="19" fill="#fff" stroke="${INK}" stroke-width="2.5"/></svg>`,
  3: `<svg width="70" height="60" viewBox="0 0 70 60"><circle cx="35" cy="32" r="14" fill="#fff" stroke="${INK}" stroke-width="2.5"/></svg>`,
  4: `<svg width="70" height="60" viewBox="0 0 70 60"><rect x="22" y="12" width="26" height="28" fill="${INK}"/><rect x="12" y="38" width="46" height="7" rx="3" fill="${INK}"/><rect x="22" y="31" width="26" height="5" fill="${RED}"/></svg>`,
  5: `<svg width="70" height="60" viewBox="0 0 70 60"><circle cx="35" cy="30" r="16" fill="#fff" stroke="${INK}" stroke-width="2"/><circle cx="29" cy="25" r="2.8" fill="${INK}"/><circle cx="41" cy="25" r="2.8" fill="${INK}"/><path d="M34 30 L50 33 L34 35 Z" fill="#f28c28" stroke="${INK}" stroke-width="1.2"/></svg>`,
  6: `<svg width="70" height="60" viewBox="0 0 70 60"><g stroke="#7a4a21" stroke-width="3.5" stroke-linecap="round" fill="none"><path d="M4 40 L24 28 M12 35 L8 26"/><path d="M66 40 L46 28 M58 35 L62 26"/></g><path d="M26 18 h18 v8 h-18z M38 26 h6 v18 h-6z" fill="${RED}" stroke="${INK}" stroke-width="1.5"/></svg>`,
};
const snowNames = { 1: 'Big bottom snowball', 2: 'Middle snowball', 3: 'Small head', 4: 'Top hat', 5: 'Eyes &amp; carrot nose', 6: 'Stick arms &amp; scarf' };

// photo booth props
const props = [
  ['Elf Hat', `<svg width="230" height="170" viewBox="0 0 120 90"><path d="M14 74 Q24 26 66 12 Q92 4 108 18 Q86 22 80 40 Q82 58 92 74 Z" fill="${RED}" stroke="${INK}" stroke-width="2.5"/><circle cx="108" cy="18" r="9" fill="#fff" stroke="${INK}" stroke-width="2.5"/><rect x="8" y="68" width="92" height="16" rx="8" fill="#fff" stroke="${INK}" stroke-width="2.5"/></svg>`],
  ['Reindeer Antlers', `<svg width="260" height="160" viewBox="0 0 130 80"><g stroke="#7a4a21" stroke-width="7" stroke-linecap="round" fill="none"><path d="M40 72 Q34 40 18 14 M32 46 L10 40 M28 30 L36 10"/><path d="M90 72 Q96 40 112 14 M98 46 L120 40 M102 30 L94 10"/></g><path d="M22 74 Q65 56 108 74" stroke="${GREEN}" stroke-width="9" fill="none" stroke-linecap="round"/></svg>`],
  ['Silly Glasses', `<svg width="260" height="110" viewBox="0 0 130 55"><g stroke="${GREEN}" stroke-width="6" fill="#e9f6ff"><circle cx="35" cy="28" r="20"/><circle cx="95" cy="28" r="20"/></g><path d="M55 26 Q65 18 75 26" stroke="${GREEN}" stroke-width="6" fill="none"/><path d="M15 24 L3 18 M115 24 L127 18" stroke="${GREEN}" stroke-width="6" stroke-linecap="round"/><circle cx="35" cy="28" r="4" fill="${INK}"/><circle cx="95" cy="28" r="4" fill="${INK}"/></svg>`],
  ['Fancy Mustache', `<svg width="250" height="110" viewBox="0 0 100 44"><path d="M50 18 Q36 2 20 14 Q10 22 2 16 Q6 34 24 34 Q40 34 50 24 Q60 34 76 34 Q94 34 98 16 Q90 22 80 14 Q64 2 50 18 Z" fill="#6b3e1f" stroke="${INK}" stroke-width="2"/></svg>`],
  ['Rudolph Nose', `<svg width="150" height="150" viewBox="0 0 60 60"><circle cx="30" cy="30" r="25" fill="${RED}" stroke="${INK}" stroke-width="2.5"/><ellipse cx="22" cy="21" rx="7" ry="4" fill="#fff" opacity=".7"/></svg>`],
  ['Nice List Sign', `<svg width="250" height="170" viewBox="0 0 125 85"><path d="M10 6 H115 Q121 6 121 12 V56 Q121 62 115 62 H50 L30 80 L34 62 H10 Q4 62 4 56 V12 Q4 6 10 6 Z" fill="#fff" stroke="${RED}" stroke-width="4"/><text x="62.5" y="30" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="15" fill="${GREEN}">I'm on the</text><text x="62.5" y="50" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="17" fill="${RED}">NICE LIST!</text></svg>`],
];
module.exports = { RED, GREEN, GOLD, SKIN, INK, elf, snowflake, snowball, die, fish, snowParts, snowNames, photoProps: props };
