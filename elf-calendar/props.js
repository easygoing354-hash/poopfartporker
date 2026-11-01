// Reusable "laminate & cut" props: one page per school day, plus a bonus page.
// Exported as a function so build.js can pass in its shared art helpers.
module.exports = function buildProps({ elf, snowflake, page, days, dayByNum, propPg, C }) {
  const { RED, GREEN, GOLD, INK } = C;
  const BLUE = '#3b7dbf', ICE = '#e7f2fc', BROWN = '#7a4a21';

  // ---------- building blocks ----------
  const lam = (inner, { r = '.18in', cls = '' } = {}) => `<div class="lam ${cls}" style="border-radius:${r}">${inner}</div>`;

  function sign({ w, h, bg = RED, fg = '#fff', bd = '#fff', title, sub = '', size = 34, icon = '', flakes = false }) {
    const fl = flakes ? `<span class="sfl a">${snowflake(26, 'rgba(255,255,255,.65)')}</span><span class="sfl b">${snowflake(20, 'rgba(255,255,255,.65)')}</span><span class="sfl c">${snowflake(22, 'rgba(255,255,255,.65)')}</span>` : '';
    return lam(`<div class="sign" style="width:${w}in;height:${h}in;background:${bg};color:${fg};--bd:${bd}">${fl}${icon}<div class="st" style="font-size:${size}pt">${title}</div>${sub ? `<div class="ss">${sub}</div>` : ''}</div>`);
  }

  function bubble({ w, h, text, size = 40, color = RED, dry = false, tail = 'left' }) {
    const t = tail === 'left' ? 'M40 108 L28 138 L72 108' : 'M128 108 L172 138 L160 108';
    return lam(`<div class="bub ${dry ? 'drybub' : ''}" style="width:${w}in;height:${h}in">
      <svg viewBox="0 0 200 140" preserveAspectRatio="none" width="100%" height="100%"><path d="M18 2 H182 Q198 2 198 18 V92 Q198 108 182 108 ${tail === 'left' ? 'H72' : 'H160'} ${tail === 'left' ? 'L28 138 L40 108' : 'L172 138 L128 108'} H18 Q2 108 2 92 V18 Q2 2 18 2 Z" fill="#fff" stroke="${color}" stroke-width="5" vector-effect="non-scaling-stroke"/></svg>
      <div class="bt" style="font-size:${size}pt;color:${color}">${text}</div>${dry ? '<div class="drytag">dry-erase</div>' : ''}</div>`, { r: '.2in', cls: 'free' });
  }

  const free = (svg) => lam(`<div class="freeart">${svg}</div>`, { r: '.15in', cls: 'free' });
  const dryBox = (w, h, label = '') => `<div class="dry" style="width:${w}in;height:${h}in">${label ? `<span>${label}</span>` : ''}<i>dry-erase</i></div>`;

  // icons
  const eye = `<svg width="62" height="38" viewBox="0 0 40 24"><path d="M2 12 Q20 -6 38 12 Q20 30 2 12Z" fill="#fff" stroke="${INK}" stroke-width="2"/><circle cx="20" cy="12" r="6" fill="${GREEN}"/><circle cx="20" cy="12" r="2.5" fill="${INK}"/></svg>`;
  const talk = `<svg width="50" height="42" viewBox="0 0 40 34"><path d="M6 2 H34 Q38 2 38 6 V20 Q38 24 34 24 H16 L8 32 L10 24 H6 Q2 24 2 20 V6 Q2 2 6 2Z" fill="#fff" stroke="${INK}" stroke-width="2"/><circle cx="12" cy="13" r="2.2" fill="${INK}"/><circle cx="20" cy="13" r="2.2" fill="${INK}"/><circle cx="28" cy="13" r="2.2" fill="${INK}"/></svg>`;
  const noTouch = `<svg width="46" height="46" viewBox="0 0 40 40"><path d="M14 32 V14 Q14 9 18 9 Q22 9 22 14 V20 L27 16 Q31 14 32 18 L24 32 Z" fill="#f6d2b0" stroke="${INK}" stroke-width="2"/><circle cx="20" cy="20" r="17" fill="none" stroke="${RED}" stroke-width="4"/><line x1="8" y1="8" x2="32" y2="32" stroke="${RED}" stroke-width="4"/></svg>`;
  const check = `<svg width="46" height="46" viewBox="0 0 40 40"><rect x="3" y="3" width="34" height="34" rx="6" fill="#fff" stroke="${INK}" stroke-width="2.5"/><path d="M10 20 L17 28 L31 11" fill="none" stroke="${GREEN}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const arrowDown = `<svg width="40" height="44" viewBox="0 0 40 44"><path d="M14 2 H26 V24 H36 L20 42 L4 24 H14 Z" fill="${GOLD}" stroke="${INK}" stroke-width="2"/></svg>`;
  const star = (s = 28, c = GOLD) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 1.5 L15 8.5 L22.5 9.2 L16.8 14.2 L18.5 21.8 L12 17.8 L5.5 21.8 L7.2 14.2 L1.5 9.2 L9 8.5 Z" fill="${c}" stroke="${INK}" stroke-width="1.2"/></svg>`;
  const mug = (s = 60) => `<svg width="${s}" height="${s}" viewBox="0 0 50 50"><path d="M8 16 H36 V38 Q36 46 28 46 H16 Q8 46 8 38 Z" fill="#fff" stroke="${INK}" stroke-width="2.5"/><path d="M36 21 Q46 21 46 29 Q46 37 36 36" fill="none" stroke="${INK}" stroke-width="2.5"/><rect x="8" y="16" width="28" height="7" fill="#8b5a2b"/><circle cx="16" cy="15" r="4" fill="#fff" stroke="${INK}" stroke-width="1.5"/><circle cx="25" cy="13" r="4" fill="#fff" stroke="${INK}" stroke-width="1.5"/><path d="M18 9 q-3 -4 0 -7 M26 7 q-3 -4 0 -6" stroke="#aaa" stroke-width="2" fill="none"/></svg>`;
  const qmarks = `<span class="qm a">?</span><span class="qm b">?</span><span class="qm c">?</span>`;

  function fishN(n, color, w = 2.0) {
    return free(`<svg width="${w * 96}" height="${w * 96 * 0.6}" viewBox="0 0 60 36"><path d="M6 18 Q22 0 42 12 L56 4 L54 18 L56 32 L42 24 Q22 36 6 18 Z" fill="${color}" stroke="${INK}" stroke-width="1.8"/><circle cx="13" cy="15" r="2.2" fill="${INK}"/><path d="M33 9 Q37 18 33 27" stroke="${INK}" stroke-width="1.2" fill="none" opacity=".5"/><text x="24" y="23" font-family="Fredoka" font-weight="700" font-size="13" text-anchor="middle" fill="#fff" stroke="${INK}" stroke-width=".6">${n}</text></svg>`);
  }
  const ball = `<svg width="98" height="98" viewBox="0 0 44 44"><circle cx="22" cy="22" r="20" fill="#fff" stroke="${BLUE}" stroke-width="2"/><path d="M10 16 q4 -7 12 -7" stroke="#c6dbef" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="28" cy="27" r="1.6" fill="#c6dbef"/><circle cx="16" cy="29" r="1.2" fill="#c6dbef"/></svg>`;
  const flakeDisc = `<svg width="170" height="170" viewBox="0 0 60 60"><circle cx="30" cy="30" r="28" fill="${ICE}" stroke="${BLUE}" stroke-width="1.8"/></svg>`;
  const pennant = (ch, c) => free(`<svg width="125" height="150" viewBox="0 0 50 60"><rect x="0" y="0" width="50" height="7" fill="#fff" stroke="${INK}" stroke-width="1.5"/><circle cx="8" cy="3.5" r="1.8" fill="#fff" stroke="#999"/><circle cx="42" cy="3.5" r="1.8" fill="#fff" stroke="#999"/><path d="M0 7 H50 L25 58 Z" fill="${c}" stroke="${INK}" stroke-width="1.5"/>${ch === '*' ? `<g transform="translate(15 13) scale(.85)"><path d="M12 1.5 L15 8.5 L22.5 9.2 L16.8 14.2 L18.5 21.8 L12 17.8 L5.5 21.8 L7.2 14.2 L1.5 9.2 L9 8.5 Z" fill="#fff"/></g>` : `<text x="25" y="31" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="20" fill="#fff">${ch}</text>`}</svg>`);

  const easel = `<svg width="300" height="380" viewBox="0 0 100 126"><g stroke="${BROWN}" stroke-width="5" stroke-linecap="round"><line x1="50" y1="4" x2="50" y2="20"/><line x1="30" y1="70" x2="14" y2="122"/><line x1="70" y1="70" x2="86" y2="122"/><line x1="50" y1="80" x2="50" y2="116"/></g><rect x="20" y="78" width="60" height="6" rx="2" fill="${BROWN}"/><rect x="14" y="14" width="72" height="62" rx="3" fill="#fff" stroke="${INK}" stroke-width="2.5"/><text x="50" y="72" text-anchor="middle" font-family="Fredoka" font-size="5" fill="#bbb">dry-erase canvas</text></svg>`;
  const palette = `<svg width="300" height="220" viewBox="0 0 100 74"><path d="M50 4 Q90 4 96 34 Q100 58 76 64 Q64 66 62 56 Q60 48 50 52 Q38 58 40 68 Q30 74 14 64 Q0 52 6 30 Q14 4 50 4 Z" fill="#e8c79a" stroke="${INK}" stroke-width="2.5"/><circle cx="24" cy="44" r="6" fill="#fff" stroke="${INK}" stroke-width="2"/>${[[28, 20, RED], [46, 14, GOLD], [66, 16, GREEN], [82, 30, BLUE], [80, 48, '#8e44ad']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="7" fill="${c}" stroke="${INK}" stroke-width="1.5"/>`).join('')}<path d="M40 40 L74 70" stroke="${BROWN}" stroke-width="4" stroke-linecap="round"/><path d="M36 36 L44 44" stroke="${INK}" stroke-width="6" stroke-linecap="round"/></svg>`;
  const magnifier = `<svg width="330" height="330" viewBox="0 0 100 100"><rect x="56" y="62" width="14" height="38" rx="6" transform="rotate(-45 63 81)" fill="${BROWN}" stroke="${INK}" stroke-width="2.5"/><circle cx="40" cy="40" r="30" fill="${ICE}" stroke="${GOLD}" stroke-width="10"/><circle cx="40" cy="40" r="35" fill="none" stroke="${INK}" stroke-width="2"/><circle cx="40" cy="40" r="25" fill="none" stroke="${INK}" stroke-width="2"/><text x="40" y="44" text-anchor="middle" font-family="Fredoka" font-size="6" fill="#7aa3c8">cut out for a</text><text x="40" y="51" text-anchor="middle" font-family="Fredoka" font-size="6" fill="#7aa3c8">clear lens!</text></svg>`;
  const popcorn = `<svg width="230" height="320" viewBox="0 0 70 98"><defs><clipPath id="pc"><path d="M8 34 H62 L54 96 H16 Z"/></clipPath></defs>${[[16, 24], [26, 18], [36, 14], [46, 18], [56, 24], [22, 30], [34, 26], [48, 28], [60, 32], [10, 32]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8" fill="#fff6d6" stroke="${INK}" stroke-width="1.5"/>`).join('')}<g clip-path="url(#pc)"><rect x="0" y="30" width="70" height="70" fill="#fff"/>${[0, 1, 2, 3, 4].map((i) => `<rect x="${4 + i * 14}" y="30" width="7" height="70" fill="${RED}"/>`).join('')}</g><path d="M8 34 H62 L54 96 H16 Z" fill="none" stroke="${INK}" stroke-width="2.5"/><rect x="18" y="52" width="34" height="16" rx="4" fill="#fff" stroke="${INK}" stroke-width="1.5"/><text x="35" y="63.5" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="8.5" fill="${RED}">POP!</text></svg>`;

  const book = (title, bg, art) => lam(`<div class="book" style="background:${bg}"><div class="spine"></div><div class="btitle2">${title}</div><div class="bart">${art}</div><div class="bauth">by A. Elf</div></div>`, { r: '.08in' });
  const moon = `<svg width="70" height="70" viewBox="0 0 40 40"><path d="M26 4 A16 16 0 1 0 36 28 A13 13 0 1 1 26 4 Z" fill="${GOLD}" stroke="${INK}" stroke-width="1.5"/>${star(12, '#fff')}</svg>`;
  const snowman = `<svg width="60" height="80" viewBox="0 0 40 54"><circle cx="20" cy="40" r="12" fill="#fff" stroke="${INK}" stroke-width="1.8"/><circle cx="20" cy="18" r="9" fill="#fff" stroke="${INK}" stroke-width="1.8"/><path d="M14 10 h12 v-8 h-12 z M10 10 h20" stroke="${INK}" stroke-width="2" fill="${INK}"/><circle cx="17" cy="17" r="1.3" fill="${INK}"/><circle cx="23" cy="17" r="1.3" fill="${INK}"/><path d="M19 20 l7 1.5 l-7 1.5z" fill="#f28c28"/><path d="M15 21 q5 4 10 0" stroke="${INK}" stroke-width="1" fill="none"/></svg>`;

  const envelope = lam(`<div class="env"><svg class="flap" viewBox="0 0 100 60" preserveAspectRatio="none"><path d="M0 0 L50 34 L100 0" fill="none" stroke="#c9b48a" stroke-width="1.5" vector-effect="non-scaling-stroke"/></svg><div class="stamp">${star(22, RED)}</div><div class="addr"><b>To: Santa Claus</b><br/>1 Candy Cane Lane<br/>North Pole</div></div>`, { r: '.06in' });

  // ---------- per-day props ----------
  const P = {
    1: {
      note: 'Have the elf hold the sign on arrival day. Keep the rules card up all month!',
      html: sign({ w: 6.2, h: 3.6, title: 'I\'m Here!', sub: 'Hello from the North Pole!', size: 58, flakes: true }) +
        lam(`<div class="rules"><div class="rt">Elf Rules</div><div class="rr">${eye}<span>Look at me</span></div><div class="rr">${talk}<span>Talk to me</span></div><div class="rr">${noTouch}<span>Please don't touch me!<small>It keeps my Christmas magic.</small></span></div></div>`),
    },
    2: {
      note: 'Tape the label on a tissue box. Hang the sign above it on voting day.',
      html: sign({ w: 7, h: 2.4, bg: GREEN, title: `${star(34)} Ballot Box ${star(34)}`, sub: 'Name the elf! Drop your vote here.', size: 44 }) +
        sign({ w: 4.6, h: 3.6, bg: '#fff', fg: RED, bd: RED, title: 'Vote Here!', icon: `<div class="row">${check}${arrowDown}</div>`, size: 40 }),
    },
    3: {
      note: 'Toss the laminated snowballs around the "battle." Write the score on the scoreboard with a dry-erase marker.',
      html: sign({ w: 5.4, h: 2.3, bg: BLUE, title: 'Snowball Fight Zone', sub: 'Enter at your own risk!', size: 28, flakes: true }) +
        lam(`<div class="score" style="width:5in"><div class="sc-t">Snowball Scoreboard</div><div class="sc-row"><div><b>Elf</b>${dryBox(1.5, 1)}</div><div class="vs">VS</div><div><b>${dryBox(1.5, .42)}</b>${dryBox(1.5, 1)}</div></div></div>`) +
        `<div class="balls">${Array.from({ length: 12 }, () => free(ball)).join('')}</div>`,
    },
    4: {
      note: 'Clip the bubble to the zip line. Punch holes in the flags and string them along the line.',
      html: bubble({ w: 4.8, h: 3.2, text: 'Wheee!', size: 54 }) +
        `<div class="flags">${['Z', 'I', 'P', '*', 'L', 'I', 'N', 'E'].map((ch, i) => pennant(ch, [RED, GREEN, GOLD][i % 3])).join('')}</div>`,
    },
    7: {
      note: 'Prop the sign against the wrapped items. Tape the caution strips around the "crime scene."',
      html: sign({ w: 5.6, h: 3.4, bg: '#fff', fg: RED, bd: GREEN, title: 'Oops!', sub: '<span style="color:' + INK + '">I got a little carried away...</span>', size: 64 }) +
        Array.from({ length: 2 }, () => lam(`<div class="caution"><span>CAUTION: ELF WRAPPING ZONE</span></div>`, { r: '.06in' })).join(''),
    },
    8: {
      note: 'Slide a paperclip on each fish\'s mouth and "fish" with a magnet on a string. The numbers make it a counting game too!',
      html: lam(`<div class="plank"><div>Gone Fishing</div><small>Back soon! — Elf</small></div>`, { r: '.1in' }) +
        `<div class="fishes">${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n, i) => fishN(n, ['#f28c28', '#4fa3d9', GOLD, '#e85d75', '#5cb85c'][i % 5])).join('')}</div>`,
    },
    9: {
      note: 'Draw a silly "masterpiece" on the dry-erase canvas. Wipe it clean and reuse it each year.',
      html: free(easel) + free(palette) +
        lam(`<div class="banner" style="background:${GOLD};color:${INK}">${star(30, '#fff')} Elf Art Gallery ${star(30, '#fff')}</div>`, { r: '.1in' }),
    },
    10: {
      note: 'Cut out the lens center before laminating. The laminate fills it in to make a see-through lens!',
      html: sign({ w: 5.4, h: 3.4, bg: GREEN, title: 'Can you<br/>find me?', size: 46, icon: qmarks }) + free(magnifier),
    },
    11: {
      note: 'Hang the snowflakes around the snow angel, or tape them to the window.',
      html: sign({ w: 6, h: 3.2, bg: BLUE, title: 'Let it snow!', sub: 'Love, your Elf', size: 52, flakes: true }) +
        `<div class="discs">${Array.from({ length: 6 }, () => free(`<div class="disc">${flakeDisc}<span>${snowflake(120, BLUE)}</span></div>`)).join('')}</div>`,
    },
    14: {
      note: 'Write the name of the movie on the marquee with a dry-erase marker. The elf can hold the popcorn box.',
      html: lam(`<div class="marquee"><div class="mq-in"><div class="mq-t">NOW SHOWING</div>${dryBox(5.2, 1.3)}<div class="mq-s">Elf Cinema · Showtime: ${dryBox(1.4, .4)}</div></div></div>`, { r: '.15in' }) + free(popcorn),
    },
    15: {
      note: 'Stand the mini books around the elf and stuffed animals in the reading corner.',
      html: sign({ w: 6.4, h: 2.6, bg: GREEN, title: 'Shhh... Story Time!', size: 38, sub: 'The elf is reading to friends.' }) +
        `<div class="books">${book('Santa\'s Busy Night', '#1d3b6f', moon)}${book('The Sleepy Snowman', '#2f8fce', snowman)}${book('Elf Jokes for Kids', RED, elf({ w: 52 }))}</div>`,
    },
    16: {
      note: 'Tape the label on a shoebox mailbox. The elf can "carry" a mini envelope.',
      html: lam(`<div class="mailbox"><div class="mb-stamp">${star(40, RED)}<span>NORTH POLE<br/>POST</span></div><div><div class="mb-t">North Pole Mail</div><div class="mb-s">Letters to Santa go here!</div></div></div>`) +
        `<div class="envs">${envelope.repeat(4)}</div>`,
    },
    17: {
      note: 'Update the counter with a dry-erase marker as students find each paper elf friend.',
      html: sign({ w: 6, h: 3.2, bg: RED, title: 'My friends are hiding!', sub: 'Can you find them all?', size: 36, icon: `<div class="row">${elf({ w: 60 })}${elf({ w: 60 })}${elf({ w: 60 })}</div>` }) +
        lam(`<div class="counter"><div class="ct-t">Elf Friends Found</div><div class="ct-row">${dryBox(1.6, 1.2)}<span>/ 15</span></div></div>`),
    },
    18: {
      note: 'Set the sign next to the cocoa mug. Hang the door hanger on the mug handle.',
      html: sign({ w: 5.4, h: 3.4, bg: '#6b3e1f', title: 'Cocoa Bar', sub: 'Marshmallows included!', size: 50, icon: mug(70) }) +
        lam(`<div class="hanger"><div class="hole"></div><div class="h-t">Elf Spa</div><div class="h-s">Do Not<br/>Disturb!</div>${mug(56)}<div class="h-z">Zzz...</div></div>`, { r: '.3in' }),
    },
    21: {
      note: 'Cut out the frame\'s center window. Kids hold the frame up for photos. Hang the banner by the photo booth.',
      html: lam(`<div class="banner" style="background:${GREEN};color:#fff;width:7.2in">${star(32)} Happy PJ Day! ${star(32)}</div>`, { r: '.1in' }) +
        lam(`<div class="frame2"><div class="fr-t">I'm on the Nice List!</div><div class="fr-win">cut out</div><div class="fr-b">${elf({ w: 40 })} Classroom Elf Photo Booth · 2026 ${elf({ w: 40 })}</div></div>`, { r: '.2in' }),
    },
    22: {
      note: 'The elf holds these on its last day. Save them for next year!',
      html: sign({ w: 6, h: 3.4, bg: RED, title: 'See you<br/>next year!', size: 48, flakes: true }) +
        bubble({ w: 4.8, h: 3.2, text: 'Bye,<br/>friends!', size: 40, color: GREEN, tail: 'right' }),
    },
  };

  const pages = [];
  pages.push(page(`<div class="pintro">
    <div class="pi-head">${elf({ w: 90 })}<div><div class="pi-k">Pages ${propPg(1)}–${propPg(22) + 1}</div><h2>Laminate &amp; Reuse Props</h2><div class="pi-s">One set of sturdy props for every school day. Make them once and use them every year!</div></div></div>
    <div class="pi-cols">
      <div class="pi-box"><h3>How to make them</h3><ol>
        <li>Print the pages on <b>white cardstock</b> (65–110 lb).</li>
        <li>Rough-cut each piece, then <b>laminate</b>.</li>
        <li>Cut on the dashed lines, leaving a small clear border.</li>
        <li>Add craft sticks, sticky tack, or Velcro dots so the elf can "hold" them.</li>
      </ol></div>
      <div class="pi-box"><h3>Teacher tips</h3><ul>
        <li><b>Dry-erase</b> areas wipe clean with a tissue, so you can change names, scores, and movie titles every year.</li>
        <li>For see-through windows (Dec 10 lens, Dec 21 frame), <b>cut the window out before laminating</b>.</li>
        <li>Store each day's props in a labeled zip bag or envelope.</li>
        <li>A drop of hot glue on a craft stick keeps signs sturdy.</li>
      </ul></div>
    </div>
    <table class="pi-table"><colgroup><col style="width:11%"><col style="width:24%"><col style="width:57%"><col style="width:8%"></colgroup><tr><th>Day</th><th>Theme</th><th>Props</th><th>Page</th></tr>
      ${days.map((x) => `<tr><td>${x.dow} ${x.d}</td><td>${x.title}</td><td>${x.props}</td><td>${propPg(x.d)}</td></tr>`).join('')}
      <tr class="bonusrow"><td>Any day</td><td>Bonus</td><td>"Elf Says..." message bubble, winter break countdown</td><td>${propPg(22) + 1}</td></tr>
    </table></div>`, { cls: 'proppage' }));

  for (const x of days) {
    const p = P[x.d];
    pages.push(page(`<div class="phead"><div class="pdate"><b>${x.d}</b><span>${x.dow} · Dec</span></div><div class="ph-mid"><div class="ph-t">${x.title}</div><div class="ph-s">Reusable props · laminate &amp; cut</div></div>${elf({ w: 40 })}</div>
      <div class="pnote">${p.note}</div><div class="parea">${p.html}</div><div class="pfoot">Print on cardstock · laminate · cut on dashed lines · Page ${propPg(x.d)}</div>`, { cls: 'proppage' }));
  }

  pages.push(page(`<div class="phead"><div class="pdate"><b>${star(40, '#fff')}</b><span>Any day</span></div><div class="ph-mid"><div class="ph-t">Bonus: Use Every Day</div><div class="ph-s">Reusable props · laminate &amp; cut</div></div>${elf({ w: 40 })}</div>
    <div class="pnote">Write a new message from the elf each morning, and update the countdown every day with a dry-erase marker.</div>
    <div class="parea">${bubble({ w: 7, h: 4.3, text: 'Elf Says...', size: 30, dry: true })}
    ${lam(`<div class="countdown"><div class="cd-row">${dryBox(1.8, 1.6)}<div class="cd-t">days until<br/><b>Winter Break!</b></div></div><div class="cd-s">${snowflake(26, '#fff')} Love, your Classroom Elf ${snowflake(26, '#fff')}</div></div>`)}</div>
    <div class="pfoot">Print on cardstock · laminate · cut on dashed lines · Page ${propPg(22) + 1}</div>`, { cls: 'proppage' }));

  const css = `
.proppage { padding: .4in .45in; display: flex; flex-direction: column; }
.phead { display: flex; align-items: center; gap: 14px; background: ${RED}; color: #fff; border-radius: 14px; padding: 6px 16px; background-image: repeating-linear-gradient(135deg, rgba(255,255,255,.08) 0 14px, transparent 14px 28px); }
.pdate { width: 64px; height: 64px; border-radius: 12px; background: ${GREEN}; display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1; }
.pdate b { font-size: 26pt; } .pdate span { font-size: 8pt; margin-top: 2px; }
.ph-mid { flex: 1; } .ph-t { font-size: 24pt; font-weight: 700; line-height: 1.1; } .ph-s { font-size: 11pt; opacity: .9; }
.pnote { margin: 10px 4px 4px; font-size: 11pt; color: #555; text-align: center; }
.parea { flex: 1; display: flex; flex-wrap: wrap; align-content: space-evenly; justify-content: space-evenly; gap: .3in .25in; padding: .15in 0; }
.pfoot { text-align: center; font-size: 8.5pt; color: #999; }
.lam { outline: 2px dashed #9a9a9a; outline-offset: .09in; }
.lam.free { outline-offset: .04in; }
.freeart { display: flex; padding: 2px; }
.sign { position: relative; border-radius: .18in; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; box-shadow: inset 0 0 0 .07in var(--bd), inset 0 0 0 .1in rgba(0,0,0,.08); padding: .2in; overflow: hidden; }
.st { font-weight: 700; line-height: 1.02; display: flex; align-items: center; gap: 10px; text-align: center; }
.ss { font-size: 14pt; margin-top: 6px; font-weight: 500; }
.sign .row { display: flex; gap: 8px; align-items: flex-end; margin-bottom: 6px; }
.sfl { position: absolute; } .sfl.a { top: 10px; left: 14px; } .sfl.b { bottom: 12px; right: 16px; } .sfl.c { top: 14px; right: 22px; }
.qm { position: absolute; font-weight: 700; color: rgba(255,255,255,.35); font-size: 48pt; } .qm.a { top: -6px; left: 16px; transform: rotate(-15deg); } .qm.b { bottom: -10px; right: 20px; transform: rotate(12deg); } .qm.c { top: 6px; right: 46px; font-size: 30pt; }
.bub { position: relative; }
.bub svg { position: absolute; inset: 0; }
.bt { position: absolute; left: 0; right: 0; top: 0; height: 77%; display: flex; align-items: center; justify-content: center; text-align: center; font-weight: 700; line-height: 1.05; }
.drytag, .dry i { position: absolute; right: 10px; bottom: 6px; font-size: 7pt; color: #bbb; font-style: normal; }
.drybub .drytag { bottom: 26%; right: 18px; }
.drybub .bt { align-items: flex-start; justify-content: flex-start; padding: 16px 26px; }
.dry { position: relative; background: #fff; border: 2px solid #bfbfbf; border-radius: 10px; display: inline-flex; align-items: flex-start; }
.dry span { font-size: 10pt; color: #888; padding: 4px 8px; }
.rules { width: 5in; border: .09in solid ${GREEN}; border-radius: .18in; padding: .14in .25in; background: #fff; }
.rt { text-align: center; font-size: 28pt; font-weight: 700; color: ${RED}; }
.rr { display: flex; align-items: center; gap: 16px; font-size: 20pt; font-weight: 600; margin: 6px 0; }
.rr > svg { flex: none; width: 62px; }
.rr small { display: block; font-size: 11pt; font-weight: 400; color: #666; }
.score { width: 5.6in; background: ${ICE}; border: .09in solid ${BLUE}; border-radius: .18in; padding: .12in .2in; }
.sc-t { text-align: center; font-size: 22pt; font-weight: 700; color: ${BLUE}; }
.sc-row { display: flex; align-items: center; justify-content: center; gap: .25in; }
.sc-row > div { display: flex; flex-direction: column; align-items: center; gap: 6px; font-size: 16pt; }
.vs { font-size: 26pt; font-weight: 700; color: ${RED}; }
.balls { gap: .14in !important; }
.balls, .flags, .fishes, .discs, .books, .envs { display: flex; flex-wrap: wrap; justify-content: center; gap: .2in; width: 100%; }
.caution { width: 7.4in; height: 1.05in; background: repeating-linear-gradient(-45deg, ${RED} 0 22px, #fff 22px 44px); border: 3px solid ${INK}; display: flex; align-items: center; justify-content: center; }
.caution span { background: #fff; border: 3px solid ${INK}; padding: 4px 16px; font-weight: 700; font-size: 20pt; letter-spacing: 1px; }
.plank { width: 5.6in; height: 2.6in; background: repeating-linear-gradient(0deg, #b0773f 0 .62in, #8f5a2c .62in .65in); border: 4px solid #5a3412; border-radius: .1in; color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; text-shadow: 0 3px 0 #5a3412; }
.plank div { font-size: 50pt; font-weight: 700; line-height: 1; } .plank small { font-size: 18pt; }
.banner { width: 7.2in; height: 1.5in; border-radius: .1in; display: flex; align-items: center; justify-content: center; gap: 14px; font-size: 40pt; font-weight: 700; border: 4px solid ${INK}; }
.disc { position: relative; width: 170px; height: 170px; } .disc span { position: absolute; left: 25px; top: 25px; }
.marquee { width: 6.6in; padding: .3in; background-color: ${RED}; background-image: radial-gradient(circle, #ffe680 0 6px, #c9a400 6px 7.5px, transparent 8px); background-size: 26px 26px; background-position: 4px 4px; border-radius: .15in; border: 3px solid ${INK}; }
.mq-in { background: #fffaf0; border-radius: .1in; border: 3px solid ${INK}; padding: .12in .2in; text-align: center; }
.mq-t { font-size: 32pt; font-weight: 700; color: ${RED}; letter-spacing: 3px; }
.mq-s { font-size: 14pt; margin-top: 8px; display: flex; align-items: center; justify-content: center; gap: 8px; }
.book { position: relative; width: 2.1in; height: 2.9in; color: #fff; padding: .18in .14in .14in .3in; display: flex; flex-direction: column; align-items: center; justify-content: space-between; text-align: center; border-radius: .08in; border: 2px solid ${INK}; }
.spine { position: absolute; left: 0; top: 0; bottom: 0; width: .16in; background: rgba(0,0,0,.25); border-right: 2px solid rgba(255,255,255,.5); }
.btitle2 { font-weight: 700; font-size: 17pt; line-height: 1.05; } .bauth { font-size: 10pt; opacity: .9; }
.bart { background: rgba(255,255,255,.18); border-radius: 50%; width: 1.15in; height: 1.15in; display: flex; align-items: center; justify-content: center; }
.mailbox { width: 7in; height: 2.3in; background: #2c5aa0; color: #fff; border: .09in solid #fff; box-shadow: 0 0 0 3px #2c5aa0; border-radius: .18in; display: flex; align-items: center; gap: .3in; padding: 0 .35in; }
.mb-stamp { width: 1.45in; height: 1.45in; background: #fff; color: ${RED}; border: 4px dashed ${RED}; display: flex; flex-direction: column; align-items: center; justify-content: center; font-weight: 700; font-size: 12pt; text-align: center; line-height: 1.05; }
.mb-t { font-size: 40pt; font-weight: 700; line-height: 1; } .mb-s { font-size: 15pt; margin-top: 6px; }
.env { position: relative; width: 3.1in; height: 1.95in; background: #fff4dc; border: 2px solid #c9b48a; border-radius: .06in; }
.flap { position: absolute; inset: 0; width: 100%; height: 100%; }
.stamp { position: absolute; top: 8px; right: 8px; width: .55in; height: .62in; border: 2px dashed ${RED}; background: #fff; display: flex; align-items: center; justify-content: center; }
.addr { position: absolute; left: .35in; bottom: .2in; font-size: 11pt; line-height: 1.25; color: ${INK}; }
.counter { width: 5in; background: #fff; border: .09in solid ${GREEN}; border-radius: .18in; padding: .14in; text-align: center; }
.ct-t { font-size: 26pt; font-weight: 700; color: ${GREEN}; }
.ct-row { display: flex; align-items: center; justify-content: center; gap: 14px; font-size: 44pt; font-weight: 700; color: ${RED}; margin-top: 6px; }
.hanger { position: relative; width: 2.7in; height: 5.6in; background: ${ICE}; border: .09in solid ${BLUE}; border-radius: .3in; display: flex; flex-direction: column; align-items: center; padding-top: 1.35in; text-align: center; }
.hole { position: absolute; top: .3in; width: .9in; height: .9in; border-radius: 50%; background: #fff; border: 2px dashed #9a9a9a; }
.h-t { font-size: 32pt; font-weight: 700; color: ${BLUE}; } .h-s { font-size: 22pt; font-weight: 700; color: ${RED}; line-height: 1.05; margin: 6px 0 10px; } .h-z { font-size: 18pt; color: #7aa3c8; }
.frame2 { width: 7.2in; height: 5.2in; background: ${RED}; border-radius: .2in; padding: .14in .35in; display: flex; flex-direction: column; align-items: center; color: #fff; border: 4px solid ${GOLD}; }
.fr-t { font-size: 30pt; font-weight: 700; } .fr-b { font-size: 13pt; display: flex; align-items: center; gap: 10px; }
.fr-win { flex: 1; width: 100%; margin: .08in 0; background: #fff; border: 3px dashed #9a9a9a; border-radius: .14in; display: flex; align-items: center; justify-content: center; color: #bbb; font-size: 16pt; }
.countdown { width: 6.6in; background: ${GREEN}; color: #fff; border-radius: .18in; border: .09in solid #fff; box-shadow: 0 0 0 3px ${GREEN}; padding: .2in .3in; }
.cd-row { display: flex; align-items: center; gap: .3in; justify-content: center; }
.cd-t { font-size: 28pt; line-height: 1.1; } .cd-t b { color: ${GOLD}; font-size: 34pt; }
.cd-s { display: flex; justify-content: center; align-items: center; gap: 10px; margin-top: 10px; font-size: 13pt; }
.pintro h2 { margin: 0; font-size: 32pt; color: ${RED}; line-height: 1.05; }
.pi-head { display: flex; align-items: center; gap: 18px; border-bottom: 3px solid ${GREEN}; padding-bottom: 8px; }
.pi-k { display: inline-block; background: ${GREEN}; color: #fff; border-radius: 12px; padding: 1px 12px; font-size: 10pt; font-weight: 600; }
.pi-s { font-size: 12pt; color: #555; }
.pi-cols { display: flex; gap: .2in; margin: 12px 0; }
.pi-box { flex: 1; background: #fffaf0; border: 2px dashed ${GOLD}; border-radius: 12px; padding: 4px 14px; font-size: 11pt; line-height: 1.4; }
.pi-box h3 { margin: 6px 0 2px; color: ${GREEN}; font-size: 13pt; } .pi-box ol, .pi-box ul { margin: 0 0 6px; padding-left: 18px; }
.pi-table { width: 100%; border-collapse: collapse; font-size: 10.5pt; table-layout: fixed; }
.pi-table th { background: ${RED}; color: #fff; text-align: left; padding: 4px 8px; }
.pi-table td { padding: 5px 8px; border-bottom: 1px solid #eedadd; }
.pi-table td:first-child { white-space: nowrap; font-weight: 600; color: ${GREEN}; }
.pi-table td:last-child { text-align: center; }
.pi-table tr.bonusrow td { background: #fdecc8; }
`;
  return { pages, css };
};
