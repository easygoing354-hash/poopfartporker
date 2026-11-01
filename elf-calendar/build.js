// Builds the Classroom Elf December calendar + printables PDF.
// Usage: node elf-calendar/build.js
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const OUT_DIR = __dirname;
const HTML_FILE = path.join(OUT_DIR, 'elf-calendar.html');
const PDF_FILE = path.join(OUT_DIR, 'Classroom-Elf-Calendar-December-2026.pdf');

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

// ---------- content ----------
const days = [
  { d: 1, dow: 'Tue', title: 'The Elf Arrives!', cal: 'The elf flies in with a welcome letter. Read it together and learn the "no touching" rule.',
    scene: 'Sit the elf on a stack of books near the board, holding the Welcome Letter. Sprinkle cotton balls or paper "snow" around it.',
    fun: 'Read the letter aloud. Teach the big rule: you can look and talk, but don\'t touch. It keeps the elf\'s magic!',
    need: 'The elf, cotton balls or white paper scraps', p: [1] },
  { d: 2, dow: 'Wed', title: 'Name Our Elf', cal: 'The elf sits on a ballot box. Everyone votes on its name!',
    scene: 'Cut a slot in a tissue box, label it "Ballot Box," and sit the elf on top with the blank ballots beside it.',
    fun: 'Each child writes or draws a name idea. Pick the top 3 and vote with a show of hands. Fill in the "Meet Our Elf" sign.',
    need: 'Tissue box, pencils', p: [2, 3] },
  { d: 3, dow: 'Thu', title: 'Snowball Fight!', cal: 'A marshmallow snowball fight behind a paper-cup fort. Count the snowballs!',
    scene: 'Build a small fort of paper cups. Put the elf behind it, a stuffed animal "opponent" across the desk, and scatter mini marshmallows.',
    fun: 'Who won? Count the "snowballs" together, then do the counting page.',
    need: 'Paper cups, mini marshmallows or cotton balls, a stuffed animal', p: [4] },
  { d: 4, dow: 'Fri', title: 'Zip Line Adventure', cal: 'The elf zips across the room on a string. Draw where it will fly next.',
    scene: 'Tie yarn from a high spot to a lower one (e.g., a cabinet to a chair). Hang the elf from it with a binder clip or a paper-cup "gondola."',
    fun: 'Talk about where the elf might zip next, then draw it.',
    need: 'Yarn or string, a binder clip or paper cup', p: [5] },
  { d: 7, dow: 'Mon', title: 'Wrapping Paper Mischief', cal: 'The elf wrapped the teacher\'s things in wrapping paper! File a Mischief Report.',
    scene: 'Wrap a few desk items (stapler, tape, a mug, your chair) in holiday wrapping paper. Leave the elf on top with tape stuck to its hand.',
    fun: 'Let students help unwrap. Then they fill out a Mischief Report about what they think happened.',
    need: 'Wrapping paper or newspaper, tape', p: [6] },
  { d: 8, dow: 'Tue', title: 'Gone Fishing', cal: 'The elf goes fishing in a bowl of fish crackers. Everyone earns a fishing license!',
    scene: 'Make a fishing pole from a pencil, string, and a paperclip hook. Sit the elf on the edge of a bowl of fish-shaped crackers.',
    fun: 'Share the "catch" at snack time (check for allergies first). Hand out fishing licenses to fill in.',
    need: 'Pencil, string, paperclip, bowl, fish crackers', p: [7] },
  { d: 9, dow: 'Wed', title: 'Elf Art Studio', cal: 'The elf is caught coloring, with crayons everywhere. Color your own elf!',
    scene: 'Leave the elf lying on a half-colored page, surrounded by crayons, with one silly scribble on the whiteboard.',
    fun: 'Free coloring time. Hang finished pages as an "Elf Art Gallery."',
    need: 'Crayons', p: [8] },
  { d: 10, dow: 'Thu', title: 'Hide &amp; Seek Hunt', cal: 'The elf hides and leaves clues. Follow the scavenger hunt to find it!',
    scene: 'Hide the elf in a final spot. Tape Clue 1 to the board and the other clues at each spot (door, library, sink, cubbies, pencil sharpener).',
    fun: 'Read each clue together and walk to the next spot until you find the elf. Swap spots to fit your room.',
    need: 'Tape', p: [9] },
  { d: 11, dow: 'Fri', title: 'Snow Angel', cal: 'A snow angel in powdered sugar! Play Roll &amp; Build a Snowman.',
    scene: 'Spread a thin layer of flour or powdered sugar on a dark tray or black paper. Press the elf in to make a "snow angel" and leave it lying there.',
    fun: 'Play Roll &amp; Build a Snowman with a partner or in small groups.',
    need: 'Dark tray or black paper, flour or powdered sugar, dice', p: [10] },
  { d: 14, dow: 'Mon', title: 'Elf Movie Morning', cal: 'The elf has popcorn and movie tickets ready. Enjoy a short holiday cartoon.',
    scene: 'Set the elf in front of the board with a small bag of popcorn and a stack of movie tickets.',
    fun: 'Hand out tickets, then watch a short holiday cartoon or read-aloud video (5–15 min) when it fits your day.',
    need: 'Popcorn (optional), a short video', p: [11] },
  { d: 15, dow: 'Tue', title: 'Story Time with Stuffies', cal: 'The elf reads to the stuffed animals. Everyone gets an elf bookmark.',
    scene: 'Set the elf in the reading corner holding an open book, with stuffed animals sitting in a circle "listening."',
    fun: 'Give everyone a bookmark to color. Do buddy reading or read a holiday story aloud.',
    need: 'A picture book, a few stuffed animals', p: [12] },
  { d: 16, dow: 'Wed', title: 'North Pole Mail', cal: 'The elf brings a North Pole mailbox. Write letters to Santa.',
    scene: 'Label a shoebox "North Pole Mail" and sit the elf on top.',
    fun: 'Kids write or draw a letter to Santa and "mail" it. The elf takes the letters to the North Pole tonight!',
    need: 'Shoebox, marker', p: [13] },
  { d: 17, dow: 'Thu', title: 'Elf Friends Visit', cal: 'Paper elf friends are hiding all over the room. Find all 15!',
    scene: 'Cut out the mini paper elves and hide them around the room: on shelves, under chairs, in plants. The real elf holds the sign.',
    fun: 'Find all 15 friends, counting them together as they turn up.',
    need: 'Scissors, tape', p: [14] },
  { d: 18, dow: 'Fri', title: 'Cocoa Bath', cal: 'The elf soaks in a mug of cotton-ball "marshmallows" and sends home PJ Day invites.',
    scene: 'Put the elf in a big mug filled with cotton balls ("marshmallows"), with the PJ Day invitations stacked beside it.',
    fun: 'Read the invitation together and send it home for Monday\'s PJ Day. (Check your school\'s dress policy.)',
    need: 'Large mug, cotton balls', p: [15] },
  { d: 21, dow: 'Mon', title: 'PJ Day Photo Booth', cal: 'PJ Day! The elf is in pajamas, with a photo booth. Say "cheese!"',
    scene: 'Dress the elf in pajamas (a sock "sleeping bag" or a tissue "blanket" works) next to the photo booth props.',
    fun: 'Kids pose with the props for class photos (follow your school\'s photo policy).',
    need: 'Craft sticks, tape, a phone or camera', p: [16] },
  { d: 22, dow: 'Tue', title: 'Goodbye, Elf!', cal: 'The elf says goodbye with a letter and Nice List certificates.',
    scene: 'Sit the elf in its very first spot with the Goodbye Letter and a stack of certificates (plus candy canes, if you like).',
    fun: 'Read the letter, hand out certificates, and wave goodbye as the elf "flies home" tonight.',
    need: 'Candy canes (optional)', p: [17, 18] },
];
const dayByNum = Object.fromEntries(days.map((x) => [x.d, x]));

const printableTitles = {
  1: 'Welcome Letter', 2: 'Name Ballots', 3: 'Meet Our Elf Sign', 4: 'Count the Snowballs', 5: 'Where Will I Zip Next?',
  6: 'Elf Mischief Report', 7: 'Elf Fishing License', 8: 'Elf Coloring Page', 9: 'Scavenger Hunt Clues',
  10: 'Roll &amp; Build a Snowman', 11: 'Elf Cinema Tickets', 12: 'Elf Bookmarks', 13: 'Letter to Santa',
  14: 'Mini Elf Friends', 15: 'PJ Day Invitations', 16: 'Photo Booth Props', 17: 'Goodbye Letter', 18: 'Nice List Certificate',
};
const dayForPrintable = {};
days.forEach((x) => x.p.forEach((n) => (dayForPrintable[n] = x.d)));

const pTag = (ps) => (ps.length > 1 ? 'Printables ' + ps.join(' &amp; ') : 'Printable ' + ps[0]);

// ---------- page helpers ----------
let pageNo = 0;
function page(inner, { cls = '', landscape = false } = {}) {
  pageNo++;
  return `<section class="page ${landscape ? 'land' : ''} ${cls}">${inner}</section>`;
}
function printable(n, inner, { landscape = false, frame = true } = {}) {
  const d = dayForPrintable[n];
  return page(`${frame ? '<div class="frame">' : ''}<div class="ptag">Dec ${d} · Printable ${n}</div>${inner}${frame ? '</div>' : ''}`, { cls: 'printable', landscape });
}
const hw = (n = 1, extra = '') => Array.from({ length: n }, () => `<div class="hw" ${extra}></div>`).join('');

// ---------- pages ----------
const pages = [];

// Cover
pages.push(page(`
<div class="cover">
  <div class="flakes">${Array.from({ length: 14 }, (_, i) => `<span style="left:${(i * 53) % 95}%;top:${(i * 37) % 88}%">${snowflake(18 + (i % 3) * 10, '#ffffff')}</span>`).join('')}</div>
  <div class="cover-top">
    <div class="kicker">December 2026 · Grades K–2</div>
    <h1>Classroom Elf<br/>Calendar</h1>
    <div class="sub">16 fun, low-prep Elf on the Shelf ideas for every school day,<br/>Tuesday, Dec 1 – Tuesday, Dec 22, plus 18 printables</div>
  </div>
  <div class="cover-elf">${elf({ w: 210 })}</div>
  <div class="cover-box">
    <h3>What's inside</h3>
    <ul>
      <li><b>Page 2:</b> Monday–Friday calendar with a different idea every day</li>
      <li><b>Pages 3–4:</b> Teacher guide: how to set up each scene, plus what you'll need</li>
      <li><b>Pages 5–22:</b> Printables 1–18, numbered to match the calendar</li>
    </ul>
    <h3>Quick tips</h3>
    <ul>
      <li>Set up each scene after school the day before, so it's ready first thing.</li>
      <li>Check for food allergies before any snack idea (Dec 3, Dec 8, Dec 14).</li>
      <li>Did someone touch the elf? Sprinkle a little cinnamon "magic" nearby and the elf is good as new!</li>
      <li>Not every family celebrates. Keep it light and playful, and welcome everyone to join the fun.</li>
    </ul>
  </div>
  <div class="disclaimer">Not affiliated with or endorsed by The Elf on the Shelf®. For classroom use.</div>
</div>`, { cls: 'cover-page' }));

// Calendar (landscape)
function calCell(n) {
  const x = dayByNum[n];
  return `<div class="cell"><div class="cell-head"><span class="num">${n}</span><span class="ctitle">${x.title}</span></div><div class="ctext">${x.cal}</div><div class="cprint">${pTag(x.p)}</div></div>`;
}
const weeks = [
  [`<div class="cell off"><span class="num dim">30</span><div class="offtxt">Nov 30<br/>Get ready! The elf arrives tomorrow.</div></div>`, calCell(1), calCell(2), calCell(3), calCell(4)],
  [7, 8, 9, 10, 11].map(calCell),
  [14, 15, 16, 17, 18].map(calCell),
  [calCell(21), calCell(22), `<div class="cell break" style="grid-column: span 3"><div class="breaktxt">${snowflake(30, '#9cc3e6')}<div><b>Dec 23–25: Winter Break!</b><br/>The elf is back at the North Pole helping Santa.</div>${snowflake(30, '#9cc3e6')}</div></div>`],
];
pages.push(page(`
<div class="cal">
  <div class="cal-header"><div><div class="cal-title">December 2026</div><div class="cal-sub">Classroom Elf Calendar · Monday–Friday</div></div>${elf({ w: 52 })}</div>
  <div class="grid">
    ${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((d) => `<div class="dow">${d}</div>`).join('')}
    ${weeks.flat().join('')}
  </div>
</div>`, { landscape: true }));

// Teacher guide (2 pages)
function guideBlock(x) {
  return `<div class="gblock">
    <div class="gdate"><div class="gdow">${x.dow}</div><div class="gnum">${x.d}</div><div class="gmon">Dec</div></div>
    <div class="gbody">
      <div class="gtitle">${x.title} <span class="gp">${pTag(x.p)}</span></div>
      <div><b class="lab">Set the scene:</b> ${x.scene}</div>
      <div><b class="lab">Morning fun:</b> ${x.fun}</div>
      <div><b class="lab">You'll need:</b> ${x.need}</div>
    </div></div>`;
}
pages.push(page(`<div class="guide"><h2>Teacher Guide <span>Week 1 &amp; Week 2</span></h2>${days.slice(0, 8).map(guideBlock).join('')}</div>`));
pages.push(page(`<div class="guide"><h2>Teacher Guide <span>Week 3 &amp; Week 4</span></h2>${days.slice(8).map(guideBlock).join('')}</div>`));

// P1 Welcome letter
pages.push(printable(1, `
<div class="letter">
  <div class="letter-head">${elf({ w: 90 })}<h2 class="ptitle">Hello from the North Pole!</h2></div>
  <div class="hand">
    <p>Dear Friends,</p>
    <p>Santa sent me to your classroom to spend December with you! Every night I fly back to the North Pole to tell Santa about all the kind and helpful things I see.</p>
    <p>I have one very important rule: <b>please do not touch me!</b> If you touch me, I might lose my Christmas magic. But you can talk to me anytime. I'm a great listener!</p>
    <p>Every school morning, look for me. I'll be hiding somewhere new, and I might bring a surprise!</p>
    <p>Oh, and one more thing... I don't have a name yet! Can you help me think of one?</p>
    <p class="sign">Your new friend,<br/><span class="big">Your Classroom Elf</span></p>
  </div>
</div>`));

// P2 Name ballots
const ballot = `<div class="ballot cut">${elf({ w: 46 })}<div><div class="btitle">Name the Elf Ballot</div><div class="bq">I think our elf should be named:</div>${hw(1)}<div class="bname">Voter: ____________________</div></div></div>`;
pages.push(printable(2, `<h2 class="ptitle">Name Our Elf!</h2><div class="psub">Cut apart. Write or draw your best elf name, then drop it in the ballot box.</div><div class="ballots">${ballot.repeat(8)}</div>`));

// P3 Meet our elf sign
pages.push(printable(3, `
<div class="meet">
  <h2 class="ptitle huge">Meet Our Elf!</h2>
  <div class="meet-elf">${elf({ w: 230 })}</div>
  <div class="meet-lines">
    <div class="mrow"><span>My name is</span><div class="mline"></div></div>
    <div class="mrow"><span>I arrived on</span><div class="mline pre">December 1, 2026</div></div>
    <div class="mrow"><span>I live at</span><div class="mline pre">The North Pole</div></div>
    <div class="mrow"><span>Please</span><div class="mline pre red">look, but don't touch!</div></div>
  </div>
</div>`));

// P4 Count the snowballs
function seeded(seed) { let s = seed; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); }
function snowBox(count, seed) {
  const rnd = seeded(seed);
  const slots = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) slots.push([c, r]);
  for (let i = slots.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [slots[i], slots[j]] = [slots[j], slots[i]]; }
  const balls = slots.slice(0, count).map(([c, r]) => snowball(28 + c * 48 + rnd() * 10 - 5, 26 + r * 40 + rnd() * 8 - 4)).join('');
  return `<div class="sbox"><svg width="100%" viewBox="0 0 200 130">${balls}</svg><div class="sans">There are <span class="nbox"></span> snowballs.</div></div>`;
}
pages.push(printable(4, `<h2 class="ptitle">Count the Snowballs!</h2><div class="psub">The elf had a snowball fight! Count the snowballs in each box and write the number.</div>
<div class="sgrid">${[[4, 3], [7, 11], [2, 5], [9, 17], [6, 23], [10, 29]].map(([c, s]) => snowBox(c, s)).join('')}</div>
<div class="bonus">${elf({ w: 44 })}<div><b>Bonus:</b> Which box has the <u>most</u> snowballs? Color it in!</div></div>`));

// P5 Zip next
pages.push(printable(5, `<h2 class="ptitle">Where Will I Zip Next?</h2><div class="psub">Draw where you think the elf will zip to next!</div>
<div class="drawbox zip"><svg class="zipline" viewBox="0 0 600 120" preserveAspectRatio="none"><path d="M0 10 Q300 60 600 110" stroke="#888" stroke-width="3" stroke-dasharray="10 8" fill="none"/></svg><div class="zipelf">${elf({ w: 70 })}</div></div>
<div class="wrow">I think the elf will zip to</div>${hw(2)}<div class="byline">Name: ______________________</div>`));

// P6 Mischief report
pages.push(printable(6, `<div class="report-head"><h2 class="ptitle">Elf Mischief Report</h2><div class="stamp">CASE FILE</div></div>
<div class="fields"><div>Reporter: ________________________</div><div>Date: December ____, 2026</div></div>
<div class="q">1. Draw what the elf did:</div><div class="drawbox short"></div>
<div class="q">2. Was the elf... <span class="circleopts">(circle one)</span></div>
<div class="opts"><span>Naughty</span><span>Silly</span><span>BOTH!</span></div>
<div class="q">3. Why do you think the elf did it?</div>${hw(2)}
<div class="footelf">${elf({ w: 50 })}<span>Case closed! Thank you, Detective.</span></div>`));

// P7 Fishing license
const license = `<div class="license cut"><div class="lic-top"><span>OFFICIAL</span> North Pole Fishing License</div>
<div class="lic-body"><div class="photo">Draw<br/>yourself<br/>here!</div><div class="lic-fields">
<div>Name: _____________________</div><div>Favorite fish: ________________</div><div>Fish I can catch: <span class="fishrow">${fish(34)}${fish(34, '#4fa3d9')}${fish(34, '#f2b134')}</span></div>
<div>Issued: December 8, 2026</div></div></div>
<div class="lic-foot">Approved by: <span class="hand">the Classroom Elf</span> ${elf({ w: 26 })}</div></div>`;
pages.push(printable(7, `<h2 class="ptitle">Gone Fishing!</h2><div class="psub">Cut out your license. Fill it in and draw your picture.</div>${license}${license}`));

// P8 Coloring page
pages.push(printable(8, `<h2 class="ptitle outline-title">Our Classroom Elf</h2>
<div class="color-scene"><svg class="presents" viewBox="0 0 600 220" width="100%">
<g stroke="${INK}" stroke-width="3" fill="#fff" stroke-linejoin="round">
<rect x="20" y="90" width="130" height="120"/><rect x="75" y="90" width="20" height="120"/><path d="M85 90 Q55 50 45 75 Q60 90 85 90 Q115 50 125 75 Q110 90 85 90"/>
<rect x="450" y="120" width="130" height="90"/><rect x="450" y="155" width="130" height="18"/><path d="M515 120 Q490 85 480 105 Q495 120 515 120 Q540 85 550 105 Q535 120 515 120"/>
<rect x="165" y="150" width="70" height="60"/><rect x="195" y="150" width="12" height="60"/>
</g></svg><div class="color-elf">${elf({ w: 380, outline: true })}</div>
<div class="cflakes">${[0, 1, 2, 3, 4, 5].map((i) => `<span style="left:${[4, 80, 12, 88, 40, 62][i]}%;top:${[2, 6, 40, 38, 0, 3][i]}%">${snowflake(46, INK)}</span>`).join('')}</div></div>
<div class="byline center">Colored by: ______________________</div>`));

// P9 Scavenger hunt
const clues = [
  ['Clue 1', 'Hello, friends! Let\'s play a game.<br/>Go where we line up... I\'ll do the same!', 'Tape to the board'],
  ['Clue 2', 'Books and stories, big and small.<br/>Look where we read. I\'m near them all!', 'Place at the door'],
  ['Clue 3', 'Wash your hands, scrub, scrub, scrub!<br/>Check by the sink, rub-a-dub-dub!', 'Place in the library'],
  ['Clue 4', 'Where do you put your things each day?<br/>Peek by the cubbies, hip hooray!', 'Place by the sink'],
  ['Clue 5', 'Pencils sharp and ready to go.<br/>Look by the sharpener down below!', 'Place by the cubbies'],
  ['You found me!', 'Hooray, hooray, you found my chair!<br/>Thanks for playing, I was hiding there!', 'Place with the elf'],
];
pages.push(printable(9, `<h2 class="ptitle">Elf Hide &amp; Seek Hunt</h2><div class="psub">Cut apart. The small gray note on each card says where to put it. Change spots to fit your room!</div>
<div class="clues">${clues.map(([t, c, w], i) => `<div class="clue cut"><div class="cnum">${i === 5 ? elf({ w: 36 }) : i + 1}</div><div class="cl-t">${t}</div><div class="cl-c hand">${c}</div><div class="cl-w">Teacher: ${w}</div></div>`).join('')}</div>`));

// P10 Roll a snowman
pages.push(printable(10, `<h2 class="ptitle">Roll &amp; Build a Snowman</h2><div class="psub">Take turns rolling a die. Draw the part that matches your roll. Start with a 1! First to finish the whole snowman wins.</div>
<div class="rolltable">${[1, 2, 3, 4, 5, 6].map((n) => `<div class="rrow">${die(n)}<div class="rpart">${snowParts[n]}</div><div class="rname">${snowNames[n]}</div></div>`).join('')}</div>
<div class="buildbox"><div class="ground"></div><span>Build your snowman here!</span></div><div class="byline">Name: ______________________</div>`));

// P11 Movie tickets
const ticket = `<div class="ticket cut"><div class="t-stub"><span>ADMIT<br/>ONE</span></div><div class="t-main"><div class="t-brand">ELF CINEMA</div><div class="t-show">Now showing: a holiday surprise!</div><div class="t-row"><span>Seat: ____</span><span>Popcorn: Yes / No</span></div></div>${elf({ w: 34 })}</div>`;
pages.push(printable(11, `<h2 class="ptitle">Elf Cinema Tickets</h2><div class="psub">Cut apart and hand one to every movie-goer!</div><div class="tickets">${ticket.repeat(10)}</div>`));

// P12 Bookmarks
const bms = ['Snow much fun to read!', 'Shhh... the elf is reading!', 'I read with our elf!', 'Elf-ishly good reader!'];
pages.push(printable(12, `<h2 class="ptitle">Elf Bookmarks</h2><div class="psub">Color, cut out, and use with your favorite book!</div>
<div class="bookmarks">${bms.map((t) => `<div class="bm cut"><div class="bm-t">${t}</div>${elf({ w: 140, outline: true })}<div class="bm-flakes">${snowflake(28, INK)}${snowflake(20, INK)}</div><div class="bm-name">Name:<br/>____________</div></div>`).join('')}</div>`));

// P13 Letter to Santa
pages.push(printable(13, `<div class="letter-head">${elf({ w: 70 })}<h2 class="ptitle">North Pole Mail</h2></div>
<div class="santa">
<div class="srow hand">Dear Santa,</div>
<div class="srow">This year I was kind when I</div>${hw(1)}
<div class="srow">My favorite thing about December is</div>${hw(1)}
<div class="srow">I would love</div>${hw(1)}
<div class="q">Here is a picture for you:</div><div class="drawbox short2"></div>
<div class="srow">Love,</div>${hw(1, 'style="width:60%"')}
</div>`));

// P14 Mini elves
const miniCells = Array.from({ length: 15 }, () => `<div class="mini cut">${elf({ w: 84 })}</div>`).join('') +
  `<div class="mini cut sign"><div>My friends are hiding!<br/><b>Can you find all 15?</b></div></div>`;
pages.push(printable(14, `<h2 class="ptitle">Mini Elf Friends</h2><div class="psub">Cut out the 15 elf friends and hide them around the room. Give the sign to your real elf to hold!</div><div class="minis">${miniCells}</div>`));

// P15 PJ invites
const invite = `<div class="invite cut"><div class="inv-t">You're Invited!</div><div class="inv-big">PJ Day</div><div class="inv-date">Monday, December 21, 2026</div><div class="inv-txt">Wear your coziest pajamas to school! Bring your best smile for our elf photo booth.</div><div class="inv-from">Love, <span class="hand">your Classroom Elf</span></div>${elf({ w: 52 })}</div>`;
pages.push(printable(15, `<h2 class="ptitle">PJ Day Invitations</h2><div class="psub">Cut apart and send one home with each student.</div><div class="invites">${invite.repeat(4)}</div>`));

// P16 Photo props
pages.push(printable(16, `<h2 class="ptitle">Elf Photo Booth Props</h2><div class="psub">Cut out each prop and tape it to a craft stick. Strike a pose!</div>
<div class="props">${props.map(([n, s]) => `<div class="prop cut"><div class="prop-art">${s}</div><div class="prop-n">${n}</div></div>`).join('')}</div>`));

// P17 Goodbye letter
pages.push(printable(17, `
<div class="letter">
  <div class="letter-head">${elf({ w: 90 })}<h2 class="ptitle">Goodbye for Now!</h2></div>
  <div class="hand">
    <p>Dear Friends,</p>
    <p>Today is my last day in your classroom. Tonight I'm flying home to the North Pole to help Santa get ready for the big night!</p>
    <p>I had SO much fun with you: snowball fights, fishing, zip lining, story time, and our PJ Day photo booth!</p>
    <p>I told Santa how kind, helpful, and silly you all are. You made my heart as warm as a cup of hot cocoa.</p>
    <p>Have a wonderful winter break. Be kind, read lots of books, and get plenty of rest.</p>
    <p>I'll miss you! See you next year!</p>
    <p class="sign">Love,<br/><span class="big">____________________</span></p>
  </div>
</div>`));

// P18 Certificate (landscape)
pages.push(printable(18, `
<div class="cert">
  <div class="cert-inner">
    <div class="cert-elf left">${elf({ w: 110 })}</div><div class="cert-elf right">${elf({ w: 110 })}</div>
    <div class="cert-k">Official</div>
    <div class="cert-t">Nice List Certificate</div>
    <div class="cert-s">This certifies that</div>
    <div class="cert-name"></div>
    <div class="cert-s">was spotted being <b>kind</b>, <b>helpful</b>, and full of <b>holiday cheer</b><br/>by our Classroom Elf and is officially on the <span class="red">Nice List!</span></div>
    <div class="cert-sigs"><div><div class="sigline hand">Santa Claus</div>North Pole</div><div><div class="sigline pre">December 22, 2026</div>Date</div><div><div class="sigline"></div>Teacher</div></div>
  </div>
</div>`, { landscape: true, frame: false }));

// ---------- styles ----------
const css = `
@font-face { font-family: 'Fredoka'; src: url('fonts/Fredoka.ttf'); font-weight: 300 700; }
@font-face { font-family: 'Patrick Hand'; src: url('fonts/PatrickHand-Regular.ttf'); }
@page { size: 8.5in 11in; margin: 0; }
@page land { size: 11in 8.5in; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body { font-family: 'Fredoka', sans-serif; color: ${INK}; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { width: 8.5in; height: 11in; position: relative; overflow: hidden; page-break-after: always; break-after: page; }
.page.land { page: land; width: 11in; height: 8.5in; }
.hand { font-family: 'Patrick Hand', cursive; }
.red { color: ${RED}; }
b { font-weight: 600; }

/* cover */
.cover-page { background: linear-gradient(170deg, ${RED} 0 46%, #fffaf0 46%); }
.cover { position: absolute; inset: 0; }
.flakes span { position: absolute; opacity: .55; }
.flakes { position: absolute; left: 0; right: 0; top: 0; height: 46%; }
.cover-top { position: relative; text-align: center; color: #fff; padding-top: .75in; }
.kicker { display: inline-block; background: ${GREEN}; padding: 6px 18px; border-radius: 20px; font-weight: 600; letter-spacing: 1px; font-size: 14pt; }
.cover h1 { font-size: 64pt; line-height: .98; margin: 18px 0 14px; font-weight: 700; text-shadow: 0 4px 0 rgba(0,0,0,.18); }
.sub { font-size: 14pt; line-height: 1.4; }
.cover-elf { position: absolute; left: 50%; transform: translateX(-50%); top: 4.05in; }
.cover-box { position: absolute; left: .8in; right: .8in; top: 7.15in; background: #fff; border: 3px dashed ${GREEN}; border-radius: 18px; padding: 10px 24px 6px; font-size: 10.5pt; }
.cover-box h3 { margin: 6px 0 2px; color: ${RED}; font-size: 13pt; }
.cover-box ul { margin: 0 0 6px; padding-left: 18px; line-height: 1.35; }
.disclaimer { position: absolute; bottom: .25in; width: 100%; text-align: center; font-size: 8pt; color: #888; }

/* calendar */
.cal { position: absolute; inset: .35in; display: flex; flex-direction: column; }
.cal-header { display: flex; justify-content: space-between; align-items: center; background: ${RED}; color: #fff; border-radius: 14px 14px 0 0; padding: 4px 22px; background-image: repeating-linear-gradient(135deg, rgba(255,255,255,.08) 0 14px, transparent 14px 28px); }
.cal-title { font-size: 34pt; font-weight: 700; line-height: 1; }
.cal-sub { font-size: 12pt; opacity: .95; }
.grid { flex: 1; display: grid; grid-template-columns: repeat(5, 1fr); grid-template-rows: 26px repeat(4, 1fr); border: 3px solid ${RED}; border-top: none; border-radius: 0 0 14px 14px; overflow: hidden; }
.dow { background: ${GREEN}; color: #fff; text-align: center; font-weight: 600; font-size: 11pt; line-height: 26px; }
.cell { border-right: 1.5px solid #e5c9cd; border-bottom: 1.5px solid #e5c9cd; padding: 5px 7px; display: flex; flex-direction: column; background: #fff; }
.cell:nth-child(5n+5) { border-right: none; }
.cell-head { display: flex; align-items: center; gap: 6px; }
.num { flex: none; width: 26px; height: 26px; border-radius: 50%; background: ${RED}; color: #fff; font-weight: 700; font-size: 12pt; display: flex; align-items: center; justify-content: center; }
.num.dim { background: #cfcfcf; }
.ctitle { font-weight: 600; color: ${GREEN}; font-size: 11.5pt; line-height: 1.05; }
.ctext { font-size: 10pt; line-height: 1.28; margin-top: 4px; flex: 1; }
.cprint { align-self: flex-start; font-size: 8pt; font-weight: 600; background: #fdecc8; color: #8a5a00; padding: 1px 7px; border-radius: 8px; }
.cell.off { background: #f6f6f6; }
.offtxt { font-size: 9pt; color: #777; margin-top: 8px; }
.cell.break { background: #eef5fc; border-right: none; }
.breaktxt { margin: auto; display: flex; align-items: center; gap: 16px; text-align: center; font-size: 11pt; color: #3b6b97; }

/* guide */
.guide { padding: .45in .5in; }
.guide h2 { margin: 0 0 10px; font-size: 24pt; color: ${RED}; border-bottom: 3px solid ${GREEN}; }
.guide h2 span { font-size: 12pt; color: ${GREEN}; font-weight: 500; margin-left: 8px; }
.gblock { display: flex; gap: 12px; padding: 7px 0; border-bottom: 1.5px dashed #e3c3c7; font-size: 10.2pt; line-height: 1.32; }
.gdate { flex: none; width: 54px; height: 66px; border-radius: 10px; background: ${RED}; color: #fff; text-align: center; padding-top: 3px; }
.gdow { font-size: 8.5pt; font-weight: 600; }
.gnum { font-size: 22pt; font-weight: 700; line-height: 1; }
.gmon { font-size: 8pt; }
.gtitle { font-size: 12.5pt; font-weight: 700; color: ${GREEN}; margin-bottom: 1px; }
.gp { font-size: 8pt; font-weight: 600; background: #fdecc8; color: #8a5a00; padding: 1px 8px; border-radius: 8px; margin-left: 6px; vertical-align: 2px; }
.lab { color: ${RED}; }

/* printables shared */
.printable .frame { position: absolute; inset: .3in; border: 14px solid; border-image: repeating-linear-gradient(45deg, ${RED} 0 12px, #fff 12px 24px, ${GREEN} 24px 36px, #fff 36px 48px) 14; padding: .3in .4in; display: flex; flex-direction: column; }
.ptag { position: absolute; top: .06in; right: .45in; font-size: 8pt; color: #999; }
.printable .frame .ptag { top: 2px; right: 8px; }
.ptitle { font-size: 30pt; font-weight: 700; color: ${RED}; margin: 0 0 4px; text-align: center; line-height: 1.05; }
.ptitle.huge { font-size: 54pt; }
.psub { text-align: center; font-size: 12pt; color: #555; margin-bottom: 14px; }
.cut { border: 2px dashed #9a9a9a; border-radius: 10px; }
.hw { height: .62in; border-top: 1.5px solid #666; border-bottom: 1.5px solid #666; margin: 6px 0 12px; background: repeating-linear-gradient(to right, #b8b8b8 0 7px, transparent 7px 14px) center / 100% 1.5px no-repeat; }
.drawbox { border: 3px solid ${GREEN}; border-radius: 14px; flex: 1; margin: 6px 0 14px; position: relative; background: #fff; }
.drawbox.short { flex: none; height: 3.1in; }
.drawbox.short2 { flex: none; height: 2.4in; }
.wrow, .q, .srow { font-size: 15pt; font-weight: 500; margin-top: 6px; }
.byline { font-size: 14pt; margin-top: auto; }
.byline.center { text-align: center; }

/* letters */
.letter-head { display: flex; align-items: center; justify-content: center; gap: 14px; margin-bottom: 8px; }
.letter .hand { font-size: 19pt; line-height: 1.35; }
.letter .hand p { margin: 0 0 11px; }
.sign { text-align: right; }
.sign .big { font-size: 24pt; color: ${GREEN}; }

/* ballots */
.ballots { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; flex: 1; }
.ballot { display: flex; gap: 10px; align-items: center; padding: 10px 12px; }
.ballot > div { flex: 1; }
.btitle { font-weight: 700; color: ${GREEN}; font-size: 13pt; }
.bq { font-size: 11pt; }
.ballot .hw { margin: 4px 0 6px; height: .5in; }
.bname { font-size: 10pt; color: #555; }

/* meet */
.meet { display: flex; flex-direction: column; align-items: center; flex: 1; }
.meet-elf { margin: 8px 0 14px; }
.meet-lines { width: 100%; }
.mrow { display: flex; align-items: flex-end; gap: 12px; font-size: 20pt; font-weight: 600; margin: 14px 0; }
.mrow span { white-space: nowrap; color: ${GREEN}; }
.mline { flex: 1; border-bottom: 3px solid ${INK}; height: .6in; font-family: 'Patrick Hand'; font-size: 24pt; font-weight: 400; text-align: center; }
.mline.pre { height: auto; }

/* snowballs */
.sgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; flex: 1; }
.sbox { border: 3px solid #9cc3e6; border-radius: 14px; padding: 6px 10px; display: flex; flex-direction: column; justify-content: space-between; background: #f6fbff; }
.sans { font-size: 14pt; text-align: center; display: flex; align-items: center; justify-content: center; gap: 8px; }
.nbox { display: inline-block; width: .6in; height: .5in; border: 2.5px solid ${INK}; border-radius: 8px; background: #fff; }
.bonus { display: flex; align-items: center; gap: 12px; font-size: 14pt; margin-top: 12px; }

/* zip */
.zip { overflow: hidden; }
.zipline { position: absolute; left: 0; top: 0; width: 100%; height: 1.4in; }
.zipelf { position: absolute; left: 12px; top: 6px; transform: rotate(-8deg); }

/* report */
.report-head { display: flex; align-items: center; justify-content: center; gap: 14px; }
.stamp { border: 3px solid ${RED}; color: ${RED}; font-weight: 700; padding: 2px 10px; transform: rotate(-8deg); border-radius: 6px; letter-spacing: 2px; }
.fields { display: flex; justify-content: space-between; font-size: 13pt; margin: 8px 0; }
.circleopts { font-size: 11pt; color: #777; }
.opts { display: flex; justify-content: space-around; font-size: 22pt; font-weight: 600; color: ${GREEN}; margin: 8px 0 10px; }
.footelf { display: flex; align-items: center; gap: 10px; font-size: 13pt; margin-top: auto; color: ${GREEN}; font-weight: 600; }

/* license */
.license { margin: 10px auto 18px; width: 6.4in; padding: 0; overflow: hidden; border-radius: 16px; border-color: ${GREEN}; border-style: dashed; border-width: 3px; }
.lic-top { background: ${GREEN}; color: #fff; text-align: center; font-weight: 700; font-size: 16pt; padding: 6px; }
.lic-top span { background: ${GOLD}; color: ${INK}; border-radius: 6px; padding: 0 8px; font-size: 11pt; margin-right: 6px; vertical-align: 3px; }
.lic-body { display: flex; gap: 16px; padding: 14px 18px; }
.photo { flex: none; width: 1.6in; height: 1.9in; border: 2.5px solid ${INK}; border-radius: 10px; display: flex; align-items: center; justify-content: center; text-align: center; color: #aaa; font-size: 11pt; }
.lic-fields { display: flex; flex-direction: column; justify-content: space-around; font-size: 13pt; }
.fishrow svg { vertical-align: middle; margin-left: 3px; }
.lic-foot { border-top: 2px dashed #ccc; padding: 4px 18px; font-size: 11pt; display: flex; align-items: center; gap: 8px; justify-content: flex-end; }
.lic-foot .hand { font-size: 16pt; color: ${RED}; }

/* coloring */
.outline-title { color: #fff; -webkit-text-stroke: 2px ${INK}; font-size: 44pt; }
.color-scene { position: relative; flex: 1; }
.presents { position: absolute; bottom: 0; left: -10px; width: calc(100% + 20px); }
.color-elf { position: absolute; left: 50%; transform: translateX(-50%); bottom: 10px; }
.cflakes span { position: absolute; }

/* clues */
.clues { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; flex: 1; }
.clue { padding: 10px 14px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #fffaf0; position: relative; }
.cnum { width: 44px; height: 44px; border-radius: 50%; background: ${RED}; color: #fff; font-weight: 700; font-size: 20pt; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.clue:last-child .cnum { background: ${GREEN}; height: 56px; width: 56px; }
.cl-t { font-weight: 700; font-size: 15pt; color: ${GREEN}; margin: 4px 0; }
.cl-c { font-size: 17pt; line-height: 1.25; }
.cl-w { font-size: 8pt; color: #999; margin-top: 8px; }

/* roll */
.rolltable { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 18px; }
.rrow { display: flex; align-items: center; gap: 10px; border-bottom: 1.5px dashed #ddd; padding: 2px 0; }
.rpart { width: 70px; display: flex; justify-content: center; }
.rname { font-size: 12.5pt; font-weight: 500; }
.buildbox { flex: 1; border: 3px solid #9cc3e6; border-radius: 14px; margin: 12px 0; position: relative; background: #f6fbff; }
.buildbox span { position: absolute; top: 8px; width: 100%; text-align: center; color: #8aa9c6; font-size: 13pt; }
.ground { position: absolute; bottom: 0; left: 0; right: 0; height: .5in; background: #fff; border-top: 3px solid #9cc3e6; border-radius: 0 0 11px 11px; }

/* tickets */
.tickets { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; flex: 1; }
.ticket { display: flex; align-items: center; padding: 0; overflow: hidden; background: #fffaf0; }
.t-stub { flex: none; width: .65in; align-self: stretch; background: ${RED}; color: #fff; font-weight: 700; display: flex; align-items: center; justify-content: center; text-align: center; font-size: 10pt; border-right: 2px dashed #fff; }
.t-main { flex: 1; padding: 4px 8px; }
.t-brand { font-weight: 700; color: ${GREEN}; font-size: 15pt; letter-spacing: 1px; }
.t-show { font-size: 9.5pt; }
.t-row { display: flex; justify-content: space-between; font-size: 9pt; color: #555; margin-top: 4px; }
.ticket .elf { margin-right: 8px; }

/* bookmarks */
.bookmarks { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; flex: 1; }
.bm { display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 14px 6px; text-align: center; }
.bm-t { font-weight: 700; font-size: 15pt; color: ${GREEN}; line-height: 1.15; }
.bm-flakes { display: flex; gap: 10px; align-items: center; }
.bm-name { font-size: 11pt; }

/* santa */
.santa { flex: 1; display: flex; flex-direction: column; }
.santa .srow.hand { font-size: 24pt; color: ${GREEN}; }
.santa .hw { margin-bottom: 4px; }

/* minis */
.minis { display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(4, 1fr); gap: 8px; flex: 1; }
.mini { display: flex; align-items: center; justify-content: center; }
.mini.sign { background: #fdecc8; text-align: center; font-size: 12pt; padding: 6px; border-color: ${GOLD}; }

/* invites */
.invites { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 14px; flex: 1; }
.invite { text-align: center; padding: 14px 12px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; background: #f2f9f4; border-color: ${GREEN}; }
.inv-t { font-size: 13pt; color: ${GREEN}; font-weight: 600; }
.inv-big { font-size: 34pt; font-weight: 700; color: ${RED}; line-height: 1; }
.inv-date { font-weight: 600; font-size: 12pt; }
.inv-txt { font-size: 11pt; line-height: 1.3; }
.inv-from { font-size: 11pt; }
.inv-from .hand { font-size: 15pt; color: ${GREEN}; }

/* props */
.props { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: repeat(3, 1fr); gap: 12px; flex: 1; }
.prop { display: flex; flex-direction: column; align-items: center; justify-content: center; }
.prop-n { font-size: 10pt; color: #888; }

/* certificate */
.cert { position: absolute; inset: .35in; border: 10px solid ${GREEN}; border-radius: 10px; padding: 8px; background: #fffaf0; }
.cert-inner { position: relative; height: 100%; border: 3px solid ${GOLD}; border-radius: 6px; text-align: center; padding-top: .45in; }
.cert-elf { position: absolute; bottom: .3in; }
.cert-elf.left { left: .3in; } .cert-elf.right { right: .3in; transform: scaleX(-1); }
.cert-k { font-size: 18pt; letter-spacing: 6px; color: ${GREEN}; font-weight: 600; text-transform: uppercase; }
.cert-t { font-size: 46pt; font-weight: 700; color: ${RED}; line-height: 1.1; margin-bottom: 14px; }
.cert-s { font-size: 16pt; line-height: 1.45; }
.cert-name { width: 6in; margin: 14px auto 16px; border-bottom: 3px solid ${INK}; height: .6in; }
.cert-sigs { display: flex; justify-content: center; gap: .5in; margin-top: .45in; font-size: 11pt; color: #666; }
.sigline { width: 1.9in; border-bottom: 2px solid ${INK}; height: .45in; font-size: 18pt; color: ${GREEN}; display: flex; align-items: flex-end; justify-content: center; }
.sigline.pre { font-family: 'Fredoka'; font-size: 12pt; color: ${INK}; }
`;

const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Classroom Elf Calendar · December 2026</title><style>${css}</style></head><body>${pages.join('\n')}</body></html>`;
fs.writeFileSync(HTML_FILE, html);

(async () => {
  const browser = await chromium.launch();
  const pg = await browser.newPage();
  await pg.goto('file://' + HTML_FILE, { waitUntil: 'load' });
  await pg.evaluate(() => document.fonts.ready);
  await pg.pdf({ path: PDF_FILE, preferCSSPageSize: true, printBackground: true });
  await browser.close();
  console.log(`Wrote ${PDF_FILE} (${pageNo} pages)`);
})();
