// Builds the Classroom Elf December calendar packet (calendar, teacher guide,
// printables, and laminate-and-reuse props), grouped day by day.
// Usage: node elf-calendar/build.js
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { RED, GREEN, GOLD, INK, elf, snowflake, die, snowParts, snowNames, photoProps } = require('./art.js');
const K = require('./kit.js');
const A = require('./art2.js');
const baseCss = require('./styles.js');
const { lam, sign, bubble, free, dryBox, star, BLUE, ICE } = K;

const OUT_DIR = __dirname;
const HTML_FILE = path.join(OUT_DIR, 'elf-calendar.html');
const PDF_FILE = path.join(OUT_DIR, 'Classroom-Elf-Calendar-December-2026.pdf');

const hw = (n = 1, extra = '') => Array.from({ length: n }, () => `<div class="hw" ${extra}></div>`).join('');

// ---------------------------------------------------------------------------
// Day-by-day content. Each entry has calendar text (elf + idea), a teacher
// guide (scene / fun / need), student printables, and laminate props pages.
// ---------------------------------------------------------------------------

const welcomeLetter = `
<div class="letter">
  <div class="letter-head">${elf({ w: 84 })}<h2 class="ptitle">Hello from the North Pole!</h2></div>
  <div class="hand l2">
    <p>Dear Friends,</p>
    <p>Surprise! I just came through my magic elf door. Santa sent me to spend December in your classroom! Every night I fly to the North Pole to tell Santa about all the kind and helpful things I see.</p>
    <p><b>My Elf Rules:</b></p>
    <ol>
      <li>You may <b>look</b> at me.</li>
      <li>You may <b>talk</b> to me. I love jokes and secrets!</li>
      <li>Please <b>don't touch</b> me, or my magic might fizzle out!</li>
    </ol>
    <p>Oh, and I don't have a name yet! Can you think of a good one? Tomorrow everyone gets to vote.</p>
    <p class="ps"><b>P.S.</b> Bet you can't find me tomorrow. I'm the best hider at the North Pole! Last year I hid in a cup of cocoa for three whole days. (Santa is <i>still</i> looking for his socks... that was me too.)</p>
    <p class="sign">Your new friend,<br/><span class="big">Your Classroom Elf</span></p>
  </div>
</div>`;

const goodbyeLetter = `
<div class="letter">
  <div class="letter-head">${elf({ w: 84 })}<h2 class="ptitle">Goodbye for Now!</h2></div>
  <div class="hand l2">
    <p>Dear Friends,</p>
    <p>Today is my last day in your classroom. Tonight I fly home through my magic door to help Santa get ready for the big night!</p>
    <p>We had SO much fun: my morning message (sorry about the spelling!), our secret passwords, my bubble bath, getting tangled in lights, and being your teacher for a day!</p>
    <p>I told Santa how kind, helpful, and silly you all are. You made my heart as warm as a cup of hot cocoa.</p>
    <p>Have a wonderful winter break. Be kind, read lots of books, and get plenty of rest.</p>
    <p>I'll miss you! See you next year!</p>
    <p class="sign">Love,<br/><span class="big">____________________</span></p>
  </div>
</div>`;

const ballot = `<div class="ballot cut">${elf({ w: 46 })}<div><div class="btitle">Name the Elf Ballot</div><div class="bq">I think our elf should be named:</div>${hw(1)}<div class="bname">Voter: ____________________</div></div></div>`;

const clues = [
  ['Clue 1', 'Hello, friends! Let\'s play a game.<br/>Go where we line up... I\'ll do the same!', 'Tape to the board'],
  ['Clue 2', 'Books and stories, big and small.<br/>Look where we read. I\'m near them all!', 'Place at the door'],
  ['Clue 3', 'Wash your hands, scrub, scrub, scrub!<br/>Check by the sink, rub-a-dub-dub!', 'Place in the library'],
  ['Clue 4', 'Where do you put your things each day?<br/>Peek by the cubbies, hip hooray!', 'Place by the sink'],
  ['Clue 5', 'Pencils sharp and ready to go.<br/>Look by the sharpener down below!', 'Place by the cubbies'],
  ['You found me!', 'Hooray, hooray, you found my chair!<br/>Thanks for playing, I was hiding there!', 'Place with the elf'],
];

const mmText = 'gud morning clas! today we wil have recess for 4 hours and lunch is candy canes. pleez do not tell your teecher.<br/>love, your elf';
const mmFix = [['gud', 'Good'], ['clas', 'class'], ['today', 'Today'], ['wil', 'will'], ['pleez', 'Please'], ['teecher', 'teacher'], ['love', 'Love']];

const passwords = ['Jingle Banana', 'Snowman Burp', 'Reindeer Pancake', 'Candy Cane Kazoo', 'Twinkle Pickle', 'Frosty Noodle', 'Sleigh Bell Burrito', 'Jolly Meatball', 'Wiggly Mittens', 'Sparkly Sock'];

const teacherGrades = [
  ['Singing', 'Needs Improvement<br/><small>(a little too loud!)</small>'],
  ['Dancing', 'A+'],
  ['Hiding snacks in the desk', 'Excellent'],
  ['Remembering where the coffee is', 'Needs Practice'],
  ['Laughing at elf jokes', 'A+++'],
];

const ticket = `<div class="ticket cut"><div class="t-stub"><span>ADMIT<br/>ONE</span></div><div class="t-main"><div class="t-brand">ELF CINEMA</div><div class="t-show">Now showing: a holiday surprise!</div><div class="t-row"><span>Seat: ____</span><span>Popcorn: Yes / No</span></div></div>${elf({ w: 34 })}</div>`;
const invite = `<div class="invite cut"><div class="inv-t">You're Invited!</div><div class="inv-big">PJ Day</div><div class="inv-date">Monday, December 21, 2026</div><div class="inv-txt">Wear your coziest pajamas to school! Bring your best smile for our elf photo booth.</div><div class="inv-from">Love, <span class="hand">your Classroom Elf</span></div>${elf({ w: 52 })}</div>`;
const bms = ['Snow much fun to read!', 'Shhh... the elf is reading!', 'I read with our elf!', 'Elf-ishly good reader!'];
const stickyNotes = [
  ['#fff59d', 'Knock knock!<br/>Who\'s there?<br/><b>Snow.</b><br/>Snow who?<br/><b>Snow time to waste, let\'s learn!</b>'],
  ['#ffcdd2', 'The elf was here!'], ['#c8e6c9', 'You are<br/><b>snow</b> awesome!'], ['#bbdefb', 'What do elves learn in school?<br/><b>The elf-abet!</b>'],
  ['#fff59d', 'Boo! Wait... wrong holiday.'], ['#ffe0b2', 'Hi! Have a jolly day!'], ['#c8e6c9', 'What do snowmen eat for breakfast?<br/><b>Frosted Flakes!</b>'],
  ['#ffcdd2', 'I left 1 more note somewhere...'], ['#bbdefb', 'Be kind today!<br/>Santa is watching.'], ['#fff59d', 'This desk smells like cookies.'],
  ['#ffe0b2', 'Why was the elf sad?<br/><b>Low elf-esteem!</b>'], ['#c8e6c9', 'Smile! You\'re on the Nice List!'],
];
const danceMoves = [['Reindeer Hop', 'Hands up like antlers and hop!'], ['Snowflake Spin', 'Spin slowly around one time.'], ['Elf Wiggle', 'Wiggle from your head to your toes!'], ['Penguin Waddle', 'Arms down, waddle in place.'], ['Santa Belly Laugh', 'Hold your belly: "Ho! Ho! Ho!"'], ['Frozen Snowman', 'FREEZE! Don\'t move a muscle!']];

const days = [
  { n: 1, dow: 'Tue', d: 1, title: 'Welcome, Elf!',
    elfDoes: 'Arrives through a magic elf door with a welcome letter.', idea: 'Read the letter, learn the rules, laugh at the joke.',
    scene: 'Tape an elf door to the wall at kid height. Sit the elf beside it with the Welcome Letter and the "I\'m Here!" sign.',
    fun: 'Read the letter aloud. Go over the 3 Elf Rules and giggle at the elf\'s joke. Ask kids to think of names for tomorrow.',
    need: 'One laminated elf door and its accessories, tape',
    printables: [{ title: 'Welcome Letter', html: welcomeLetter }],
    props: [
      { note: 'Pick a door! Tape it low on a wall, cabinet, or the back of your classroom door. Use a new door each year, or a different door for each class.', html: 'DOORS0' },
      { note: 'More doors to choose from. Cut them out before laminating for clean edges.', html: 'DOORS1' },
      { note: 'Our last two doors. The arched tops make them easy to cut with scissors.', html: 'DOORS2' },
      { note: 'Set these around the door: the mat under it, the wreath on it, the lantern beside it, and the sign nearby.', html: 'DOORACC' },
      { note: 'The elf holds the sign on arrival day. Keep the rules card up all month!', html: 'ARRIVE' },
    ],
    propList: '6 elf doors, welcome mat, "Elf Crossing" sign, mini wreath, lantern, "Knock" plaque, "I\'m Here!" sign, Elf Rules card' },
  { n: 2, dow: 'Wed', d: 2, title: 'Name Our Elf',
    elfDoes: 'Sits on top of a ballot box.', idea: 'Everyone votes on the elf\'s name!',
    scene: 'Cut a slot in a tissue box, tape on the Ballot Box label, and sit the elf on top with the blank ballots beside it.',
    fun: 'Each child writes or draws a name idea. Pick the top 3 and vote with a show of hands. Fill in the "Meet Our Elf" sign.',
    need: 'Tissue box, pencils',
    printables: [
      { title: 'Name Ballots', html: `<h2 class="ptitle">Name Our Elf!</h2><div class="psub">Cut apart. Write or draw your best elf name, then drop it in the ballot box.</div><div class="ballots">${ballot.repeat(8)}</div>` },
      { title: 'Meet Our Elf Sign', html: `<div class="meet"><h2 class="ptitle huge">Meet Our Elf!</h2><div class="meet-elf">${elf({ w: 230 })}</div><div class="meet-lines"><div class="mrow"><span>My name is</span><div class="mline"></div></div><div class="mrow"><span>I arrived on</span><div class="mline pre">December 1, 2026</div></div><div class="mrow"><span>I live at</span><div class="mline pre">The North Pole</div></div><div class="mrow"><span>Please</span><div class="mline pre red">look, but don't touch!</div></div></div></div>` },
    ],
    props: [{ note: 'Tape the label on a tissue box. Hang the sign above it on voting day.', html: sign({ w: 7, h: 2.4, bg: GREEN, title: `${star(34)} Ballot Box ${star(34)}`, sub: 'Name the elf! Drop your vote here.', size: 44 }) + sign({ w: 4.6, h: 3.6, bg: '#fff', fg: RED, bd: RED, title: 'Vote Here!', icon: `<div class="row">${K.check}${K.arrowDown}</div>`, size: 40 }) }],
    propList: 'Ballot Box label, "Vote Here!" sign' },
  { n: 3, dow: 'Thu', d: 3, title: 'The Elf Wrote the Morning Message',
    elfDoes: 'Wrote today\'s morning message... with LOTS of mistakes!', idea: 'Kids become editors and fix the spelling.',
    scene: 'Sit the elf on the board ledge holding a marker. Copy the elf\'s message onto your board (or use the laminated message board).',
    fun: 'Read it together and act shocked! Kids spot the 7 mistakes and fix them, then do the "Fix the Elf\'s Message" sheet.',
    need: 'A dry-erase marker',
    printables: [{ title: 'Fix the Elf\'s Message', html: `<h2 class="ptitle">Fix the Elf's Message!</h2><div class="psub">Oh no! The elf wrote our morning message. Circle the mistakes, then write each word the right way.</div>
      <div class="mm-board hand">${mmText}</div>
      <div class="fixgrid">${mmFix.slice(0, 6).map(([w]) => `<div class="fixrow"><span class="bad">${w}</span><span class="arrow">→</span>${hw(1)}</div>`).join('')}</div>
      <div class="footelf">${elf({ w: 46 })}<span>Bonus: Write a better message for the elf on the back!</span></div><div class="byline">Editor: ______________________</div>` }],
    props: [
      { note: 'Write the elf\'s message on this board with a dry-erase marker, or copy it onto your whiteboard. The answer key below is for you.', html: lam(`<div class="mmprop"><div class="mm-t">${star(26)} Morning Message by the Elf ${star(26)}</div>${dryBox(6.7, 2.6)}</div>`) + lam(`<div class="keycard"><div class="kc-t">Teacher Card: the Elf's Message</div><div class="kc-msg hand">${mmText}</div><div class="kc-k"><b>Answer key (7 mistakes):</b> ${mmFix.map(([a, b]) => `${a} → <b>${b}</b>`).join(' · ')}</div></div>`) },
      { note: 'Pin an Elf Editor badge on each helper who finds a mistake. Collect them at the end of the day to reuse.', html: `<div class="badges">${Array.from({ length: 12 }, () => free(`<div class="badge"><div class="b-in">${elf({ w: 34 })}<b>ELF</b><span>EDITOR</span></div></div>`)).join('')}</div>` },
    ],
    propList: 'Dry-erase "Morning Message by the Elf" board, teacher card with answer key, 12 "Elf Editor" badges' },
  { n: 4, dow: 'Fri', d: 4, title: 'Zip Line Adventure',
    elfDoes: 'Zips across the room on a string.', idea: 'Draw where the elf will zip next.',
    scene: 'Tie yarn from a high spot to a lower one (e.g., a cabinet to a chair). Hang the elf from it with a binder clip.',
    fun: 'Talk about where the elf might zip next, then draw it.',
    need: 'Yarn or string, a binder clip',
    printables: [{ title: 'Where Will I Zip Next?', html: `<h2 class="ptitle">Where Will I Zip Next?</h2><div class="psub">Draw where you think the elf will zip to next!</div>
      <div class="drawbox zip"><svg class="zipline" viewBox="0 0 600 120" preserveAspectRatio="none"><path d="M0 10 Q300 60 600 110" stroke="#888" stroke-width="3" stroke-dasharray="10 8" fill="none"/></svg><div class="zipelf">${elf({ w: 70 })}</div></div>
      <div class="wrow">I think the elf will zip to</div>${hw(2)}<div class="byline">Name: ______________________</div>` }],
    props: [{ note: 'Clip the bubble to the zip line. Punch holes in the flags and string them along the line.', html: bubble({ w: 4.8, h: 3.2, text: 'Wheee!', size: 54 }) + `<div class="flags">${['Z', 'I', 'P', '*', 'L', 'I', 'N', 'E'].map((ch, i) => K.pennant(ch, [RED, GREEN, GOLD][i % 3])).join('')}</div>` }],
    propList: '"Wheee!" speech bubble, zip line flags' },
  { n: 5, dow: 'Mon', d: 7, title: 'The Elf Graded the Teacher',
    elfDoes: 'Left a report card... for the TEACHER!', idea: 'Read the silly grades, then kids grade the elf.',
    scene: 'Sit the elf on your desk with the giant red pen, holding the Teacher Report Card.',
    fun: 'Read your "grades" aloud with lots of drama ("Needs Improvement in singing?!"). Then kids grade the elf on their own report card.',
    need: 'Nothing extra!',
    printables: [{ title: 'Grade the Elf!', html: `<h2 class="ptitle">Grade the Elf!</h2><div class="psub">The elf graded our teacher, so now it's your turn! Color the stars: 3 stars = super, 1 star = needs practice.</div>
      <table class="rc"><tr><th>Subject</th><th>Grade</th></tr>${['Hiding', 'Being silly', 'Following the rules', 'Dancing', 'Telling jokes', 'Keeping secrets'].map((s) => `<tr><td>${s}</td><td class="stars">${star(46, '#fff')}${star(46, '#fff')}${star(46, '#fff')}</td></tr>`).join('')}</table>
      <div class="q">Teacher comments: The elf is</div>${hw(2)}<div class="byline">Teacher: ______________________ (that's you!)</div>` }],
    props: [{ note: 'The elf "holds" the pen. Write your own name on the report card with a dry-erase marker, and add your own silly grades in the blank rows.', html: lam(`<div class="trc"><div class="trc-h"><div><div class="trc-k">Official North Pole</div><div class="trc-t">Report Card</div></div>${elf({ w: 56 })}</div><div class="trc-s">Student: ${dryBox(3.6, .45)}</div>
      <table>${teacherGrades.map(([s, g]) => `<tr><td>${s}</td><td class="hand">${g}</td></tr>`).join('')}<tr><td>${dryBox(2.9, .38)}</td><td>${dryBox(1.9, .38)}</td></tr></table>
      <div class="trc-c"><b>Elf's comments:</b> <span class="hand">Great teacher! Could use more recess.</span></div><div class="trc-sig">Graded by: <span class="hand">The Elf</span></div></div>`) + free(A.redPen) }],
    propList: 'Teacher Report Card (with dry-erase rows), giant "Elf Grading Pen"' },
  { n: 6, dow: 'Tue', d: 8, title: 'Secret Roll-Call Password',
    elfDoes: 'Left a note: "Don\'t say \'here\' today!"', idea: 'Answer attendance with "Jingle Banana!"',
    scene: 'Prop the elf on your attendance clipboard (or by the door) holding the "Today\'s Secret Password" sign.',
    fun: 'Take attendance. Everyone answers with the password instead of "here." Later, kids invent new passwords for the coming days.',
    need: 'A dry-erase marker',
    printables: [{ title: 'Silly Password Maker', html: `<h2 class="ptitle">Silly Password Maker</h2><div class="psub">Circle one word from each list to make a new secret password for the elf!</div>
      <div class="pwcols"><div class="pwcol"><h3>Word 1</h3>${['Jingle', 'Snowman', 'Reindeer', 'Candy Cane', 'Twinkle', 'Frosty'].map((w) => `<div>${w}</div>`).join('')}</div><div class="pwplus">+</div><div class="pwcol g"><h3>Word 2</h3>${['Banana', 'Burp', 'Pancake', 'Noodle', 'Pickle', 'Kazoo'].map((w) => `<div>${w}</div>`).join('')}</div></div>
      <div class="wrow">My silly password is:</div>${hw(1)}<div class="q">Draw your password!</div><div class="drawbox"></div><div class="byline">Name: ______________________</div>` }],
    props: [
      { note: 'Write the password on the sign with a dry-erase marker, or tape a password card in the window. Use a new card each morning for extra giggles!', html: lam(`<div class="pwsign"><div class="pw-k">Shhh! Today's</div><div class="pw-t">Secret Password</div><div class="pw-s">Don't say "here." Say:</div>${dryBox(6.2, 1.4)}${elf({ w: 50 })}</div>`) },
      { note: 'Ten ready-made passwords. Keep them on a ring and pull one out any morning.', html: `<div class="pwcards">${passwords.map((p, i) => lam(`<div class="pwc" style="background:${[RED, GREEN, BLUE, GOLD, '#8e44ad'][i % 5]}"><small>Today's password:</small><b>${p}!</b></div>`, { r: '.12in' })).join('')}</div>` },
    ],
    propList: 'Dry-erase "Secret Password" sign, 10 password cards' },
  { n: 7, dow: 'Wed', d: 9, title: 'Elf Bubble Bath',
    elfDoes: 'Relaxes in a cotton-ball "bubble bath" with a rubber duck.', idea: 'Guess how many bubbles, then count them.',
    scene: 'Fill a bowl or mug with cotton balls. Tuck the elf in with the rubber duck, towel, and shampoo bottle. Hang the "Do Not Disturb" sign nearby.',
    fun: 'Kids estimate how many "bubbles" are in the bath, then count them together. Was anyone close?',
    need: 'A bowl or mug, cotton balls (keep them to reuse)',
    printables: [{ title: 'Bubble Bath Estimation', html: `<h2 class="ptitle">How Many Bubbles?</h2><div class="psub">The elf is taking a bubble bath! Guess how many bubbles are in the tub, then count them.</div>
      <div class="est"><div><div class="est-l">My guess</div><div class="est-b"></div></div><div><div class="est-l">Real count</div><div class="est-b"></div></div></div>
      <div class="q">My guess was... <span class="circleopts">(circle one)</span></div><div class="opts"><span>Too high</span><span>Too low</span><span>Just right!</span></div>
      <div class="q">Draw the elf in the bubble bath:</div><div class="drawbox"></div><div class="byline">Name: ______________________</div>` }],
    props: [{ note: 'Tuck the duck, towel, and shampoo bottle in with the elf. Hang the door hanger on the bowl or mug.', html: sign({ w: 4.6, h: 2.6, bg: BLUE, title: 'Elf Spa', sub: 'Bubble bath in progress!', size: 50, flakes: true }) + lam(`<div class="hanger"><div class="hole"></div><div class="h-t">Shhh!</div><div class="h-s">Elf in the<br/>bath!</div>${A.duck.replace('width="190" height="170"', 'width="110" height="98"')}<div class="h-z">Do not disturb</div></div>`, { r: '.3in' }) + free(A.duck) + free(A.towel) + free(A.shampoo) }],
    propList: '"Elf Spa" sign, "Do Not Disturb" door hanger, rubber duck, towel, shampoo bottle' },
  { n: 8, dow: 'Thu', d: 10, title: 'Hide &amp; Seek Hunt',
    elfDoes: 'Hides and leaves rhyming clues.', idea: 'Follow the clues to find the elf!',
    scene: 'Hide the elf in a final spot. Tape Clue 1 to the board and the other clues at each spot (door, library, sink, cubbies, pencil sharpener).',
    fun: 'Read each clue together and walk to the next spot until you find the elf. Swap spots to fit your room.',
    need: 'Tape',
    printables: [{ title: 'Scavenger Hunt Clues', html: `<h2 class="ptitle">Elf Hide &amp; Seek Hunt</h2><div class="psub">Cut apart (or laminate to reuse). The small gray note on each card says where to put it.</div>
      <div class="clues">${clues.map(([t, c, w], i) => `<div class="clue cut"><div class="cnum">${i === 5 ? elf({ w: 36 }) : i + 1}</div><div class="cl-t">${t}</div><div class="cl-c hand">${c}</div><div class="cl-w">Teacher: ${w}</div></div>`).join('')}</div>` }],
    props: [{ note: 'Cut out the lens center before laminating. The laminate fills it in to make a see-through lens!', html: sign({ w: 5.4, h: 3.4, bg: GREEN, title: 'Can you<br/>find me?', size: 46, icon: K.qmarks }) + free(K.magnifier) }],
    propList: '"Can you find me?" sign, magnifying glass' },
  { n: 9, dow: 'Fri', d: 11, title: 'Tangled in Lights',
    elfDoes: 'Got all tangled up in paper holiday lights!', idea: 'Solve the maze to untangle the elf.',
    scene: 'String the paper bulbs on yarn and loosely wrap them around the elf. Add the "HELP!" bubble.',
    fun: 'Kids solve the maze to get the elf out of the lights. Then "untangle" the real elf together and hang the lights up.',
    need: 'Yarn',
    printables: [{ title: 'Untangle the Elf Maze', html: `<h2 class="ptitle">Untangle the Elf!</h2><div class="psub">The elf is stuck in the holiday lights! Draw a path from the elf to the star to help it get out.</div>
      <div class="mazewrap"><div class="mz-start">${elf({ w: 52 })}<span>Start</span></div><div class="mz">${A.maze(9, 11, 11)}</div><div class="mz-end">${star(54)}<span>Finish!</span></div></div><div class="byline">Name: ______________________</div>` }],
    props: [{ note: 'Punch a hole in each bulb\'s cap and string them on yarn. They make a cute classroom garland after the elf is free!', html: bubble({ w: 5.2, h: 3, text: 'HELP!<br/><span style="font-size:20pt">I\'m all tangled up!</span>', size: 44 }) + `<div class="bulbs">${Array.from({ length: 16 }, (_, i) => free(A.bulb([RED, GREEN, GOLD, BLUE][i % 4]))).join('')}</div>` }],
    propList: '"HELP! I\'m tangled!" bubble, 16 paper light bulbs' },
  { n: 10, dow: 'Mon', d: 14, title: 'The Elf Took Over the Desk',
    elfDoes: 'Sits in the teacher\'s chair as "Teacher Elf."', idea: 'Take the elf\'s silly pop quiz!',
    scene: 'Seat the elf in your chair with the "Teacher Elf" nameplate, mini apple, and "Pop Quiz!" card.',
    fun: 'The elf is in charge! Hand out the elf\'s silly pop quiz and share the funniest answers.',
    need: 'Nothing extra!',
    printables: [{ title: 'The Elf\'s Pop Quiz', html: `<div class="report-head"><h2 class="ptitle">The Elf's Pop Quiz!</h2><div class="stamp">NO PEEKING</div></div><div class="fields"><div>Name: ________________________</div><div>Teacher: <span class="hand big2">Teacher Elf</span></div></div>
      <div class="pq"><b>1.</b> How many candy canes tall is your teacher? <span class="nbox"></span></div>
      <div class="pq"><b>2.</b> Circle the silliest:<div class="opts small"><span>a reindeer in sneakers</span><span>a snowman in sunglasses</span><span>a penguin in pajamas</span></div></div>
      <div class="pq"><b>3.</b> Write a word that rhymes with <b>ELF</b>: ${hw(1, 'style="display:inline-block;width:3in;vertical-align:middle;margin:0"')}</div>
      <div class="pq"><b>4.</b> Count the jingle bells: <span class="bells">${Array.from({ length: 7 }, () => `<svg width="34" height="34" viewBox="0 0 20 20"><circle cx="10" cy="11" r="7.5" fill="${GOLD}" stroke="${INK}" stroke-width="1.2"/><line x1="4" y1="11" x2="16" y2="11" stroke="${INK}" stroke-width="1"/><circle cx="10" cy="15" r="1.4" fill="${INK}"/></svg>`).join('')}</span> <span class="nbox"></span></div>
      <div class="pq"><b>5.</b> Draw what the elf eats for breakfast:</div><div class="drawbox"></div>
      <div class="footelf">${elf({ w: 46 })}<span>Grade: A+ for being awesome! (Everyone passes!)</span></div>` }],
    props: [{ note: 'Fold the nameplate on the dotted line so it stands up. Write a quiz question on the card with a dry-erase marker, if you like.', html: lam(`<div class="tent"><div class="tent-top">${elf({ w: 44 })} Teacher Elf ${elf({ w: 44 })}</div><div class="tent-fold">fold here</div><div class="tent-bot">Teacher Elf</div></div>`, { r: '.08in' }) + free(A.apple) + lam(`<div class="quizcard"><div class="qc-t">POP QUIZ!</div>${dryBox(4, 1.4)}<div class="qc-s">— Teacher Elf</div></div>`) }],
    propList: '"Teacher Elf" desk nameplate, mini apple, dry-erase "Pop Quiz!" card' },
  { n: 11, dow: 'Tue', d: 15, title: 'Wrapping Paper Mischief',
    elfDoes: 'Wrapped the teacher\'s stapler and tape in paper!', idea: 'Unwrap them and file a Mischief Report.',
    scene: 'Wrap 2 or 3 small desk items (stapler, tape, a mug) in wrapping paper. Leave the elf on top with tape stuck to its hand.',
    fun: 'Let students help unwrap. Then they fill out a Mischief Report about what they think happened.',
    need: 'Wrapping paper or newspaper, tape',
    printables: [{ title: 'Elf Mischief Report', html: `<div class="report-head"><h2 class="ptitle">Elf Mischief Report</h2><div class="stamp">CASE FILE</div></div>
      <div class="fields"><div>Reporter: ________________________</div><div>Date: December ____, 2026</div></div>
      <div class="q">1. Draw what the elf did:</div><div class="drawbox short"></div>
      <div class="q">2. Was the elf... <span class="circleopts">(circle one)</span></div><div class="opts"><span>Naughty</span><span>Silly</span><span>BOTH!</span></div>
      <div class="q">3. Why do you think the elf did it?</div>${hw(2)}<div class="footelf">${elf({ w: 50 })}<span>Case closed! Thank you, Detective.</span></div>` }],
    props: [{ note: 'Prop the sign against the wrapped items. Tape the caution strips around the "crime scene."', html: sign({ w: 5.6, h: 3.4, bg: '#fff', fg: RED, bd: GREEN, title: 'Oops!', sub: `<span style="color:${INK}">I got a little carried away...</span>`, size: 64 }) + Array.from({ length: 2 }, () => lam(`<div class="caution"><span>CAUTION: ELF WRAPPING ZONE</span></div>`, { r: '.06in' })).join('') }],
    propList: '"Oops!" sign, 2 caution strips' },
  { n: 12, dow: 'Wed', d: 16, title: 'North Pole Mail',
    elfDoes: 'Brought a North Pole mailbox.', idea: 'Write letters to Santa.',
    scene: 'Tape the label on a shoebox and sit the elf on top holding a mini envelope.',
    fun: 'Kids write or draw a letter to Santa and "mail" it. The elf takes the letters to the North Pole tonight!',
    need: 'A shoebox',
    printables: [{ title: 'Letter to Santa', html: `<div class="letter-head">${elf({ w: 70 })}<h2 class="ptitle">North Pole Mail</h2></div><div class="santa"><div class="srow hand">Dear Santa,</div><div class="srow">This year I was kind when I</div>${hw(1)}<div class="srow">My favorite thing about December is</div>${hw(1)}<div class="srow">I would love</div>${hw(1)}<div class="q">Here is a picture for you:</div><div class="drawbox short2"></div><div class="srow">Love,</div>${hw(1, 'style="width:60%"')}</div>` }],
    props: [{ note: 'Tape the label on a shoebox mailbox. The elf can "carry" a mini envelope.', html: lam(`<div class="mailbox"><div class="mb-stamp">${star(40, RED)}<span>NORTH POLE<br/>POST</span></div><div><div class="mb-t">North Pole Mail</div><div class="mb-s">Letters to Santa go here!</div></div></div>`) + `<div class="envs">${K.envelope.repeat(4)}</div>` }],
    propList: '"North Pole Mail" label, 4 mini envelopes' },
  { n: 13, dow: 'Thu', d: 17, title: 'Elf Friends Visit',
    elfDoes: 'Invited 15 paper elf friends to hide.', idea: 'Find all the hiding friends!',
    scene: 'Hide the mini paper elves around the room: on shelves, under chairs, in plants. The real elf holds the sign.',
    fun: 'Find all 15 friends, counting them together on the dry-erase counter as they turn up.',
    need: 'Tape',
    printables: [{ title: 'Mini Elf Friends', html: `<h2 class="ptitle">Mini Elf Friends</h2><div class="psub">Cut out the 15 elf friends (laminate them to reuse!) and hide them around the room.</div><div class="minis">${Array.from({ length: 15 }, () => `<div class="mini cut">${elf({ w: 84 })}</div>`).join('')}<div class="mini cut sign"><div>My friends are hiding!<br/><b>Can you find all 15?</b></div></div></div>` }],
    props: [{ note: 'Update the counter with a dry-erase marker as students find each paper elf friend.', html: sign({ w: 6, h: 3.2, bg: RED, title: 'My friends are hiding!', sub: 'Can you find them all?', size: 36, icon: `<div class="row">${elf({ w: 60 })}${elf({ w: 60 })}${elf({ w: 60 })}</div>` }) + lam(`<div class="counter"><div class="ct-t">Elf Friends Found</div><div class="ct-row">${dryBox(1.6, 1.2)}<span>/ 15</span></div></div>`) }],
    propList: '"My friends are hiding!" sign, dry-erase counter' },
  { n: 14, dow: 'Fri', d: 18, title: 'Tic-Tac-Toe Challenge',
    elfDoes: 'Challenged a stuffed animal to tic-tac-toe.', idea: 'Play with a partner. Send home PJ Day invites!',
    scene: 'Set the elf across from a stuffed animal at the game board, mid-game, with the "Your move!" bubble.',
    fun: 'Who\'s winning? Kids play tic-tac-toe with a partner. Send home the PJ Day invitations for Monday.',
    need: 'A stuffed animal',
    printables: [
      { title: 'Tic-Tac-Toe vs. the Elf', html: `<h2 class="ptitle">Tic-Tac-Toe Challenge!</h2><div class="psub">Play with a partner. One player draws candy canes, the other draws wreaths.</div><div class="ttts">${Array.from({ length: 6 }, (_, i) => `<div class="ttt"><div class="ttt-l">Game ${i + 1}</div><svg viewBox="0 0 90 90" width="100%"><g stroke="${GREEN}" stroke-width="3.5" stroke-linecap="round"><line x1="30" y1="4" x2="30" y2="86"/><line x1="60" y1="4" x2="60" y2="86"/><line x1="4" y1="30" x2="86" y2="30"/><line x1="4" y1="60" x2="86" y2="60"/></g></svg><div class="ttt-w">Winner: __________</div></div>`).join('')}</div>` },
      { title: 'PJ Day Invitations', html: `<h2 class="ptitle">PJ Day Invitations</h2><div class="psub">Send these home today for Monday's PJ Day!</div><div class="invites">${invite.repeat(4)}</div>` },
    ],
    props: [
      { note: 'Laminate the board and draw moves with a dry-erase marker, or use the candy cane and wreath game pieces.', html: lam(`<div class="tttboard"><div class="tb-t">Elf vs. ${dryBox(1.8, .45)}</div><svg viewBox="0 0 90 90" width="100%"><g stroke="${RED}" stroke-width="3" stroke-linecap="round"><line x1="30" y1="4" x2="30" y2="86"/><line x1="60" y1="4" x2="60" y2="86"/><line x1="4" y1="30" x2="86" y2="30"/><line x1="4" y1="60" x2="86" y2="60"/></g></svg></div>`) },
      { note: 'Five candy canes and five wreaths. The bubble goes next to the elf.', html: `<div class="pieces">${Array.from({ length: 5 }, () => free(A.candyX)).join('')}${Array.from({ length: 5 }, () => free(A.wreathO)).join('')}</div>` + bubble({ w: 4.6, h: 3, text: 'Your move!', size: 44, color: GREEN }) },
    ],
    propList: 'Dry-erase game board, 5 candy cane + 5 wreath pieces, "Your move!" bubble' },
  { n: 15, dow: 'Mon', d: 21, title: 'PJ Day Photo Booth',
    elfDoes: 'Wears pajamas next to a photo booth.', idea: 'Pose with props for PJ Day photos!',
    scene: 'Dress the elf in pajamas (a sock "sleeping bag" or a tissue "blanket" works) next to the photo booth props.',
    fun: 'Kids pose with the props for class photos (follow your school\'s photo policy).',
    need: 'Craft sticks, tape, a phone or camera',
    printables: [{ title: 'Photo Booth Props', html: `<h2 class="ptitle">Elf Photo Booth Props</h2><div class="psub">Cut out each prop and tape it to a craft stick. Strike a pose!</div><div class="props">${photoProps.map(([n, s]) => `<div class="prop cut"><div class="prop-art">${s}</div><div class="prop-n">${n}</div></div>`).join('')}</div>` }],
    props: [{ note: 'Cut out the frame\'s center window before laminating. Kids hold the frame up for photos.', html: lam(`<div class="banner" style="background:${GREEN};color:#fff;width:7.2in">${star(32)} Happy PJ Day! ${star(32)}</div>`, { r: '.1in' }) + lam(`<div class="frame2"><div class="fr-t">I'm on the Nice List!</div><div class="fr-win">cut out</div><div class="fr-b">${elf({ w: 40 })} Classroom Elf Photo Booth · 2026 ${elf({ w: 40 })}</div></div>`, { r: '.2in' }) }],
    propList: '"Happy PJ Day!" banner, "Nice List" photo frame' },
  { n: 16, dow: 'Tue', d: 22, title: 'Goodbye, Elf!',
    elfDoes: 'Sits by its door with a goodbye letter.', idea: 'Read it and hand out Nice List certificates.',
    scene: 'Sit the elf next to its door, just like Day 1, with the Goodbye Letter and a stack of certificates.',
    fun: 'Read the letter, hand out certificates, and wave goodbye as the elf "flies home" through its door tonight.',
    need: 'Candy canes (optional)',
    printables: [
      { title: 'Goodbye Letter', html: goodbyeLetter },
      { title: 'Nice List Certificate', landscape: true, frame: false, html: `<div class="cert"><div class="cert-inner"><div class="cert-elf left">${elf({ w: 110 })}</div><div class="cert-elf right">${elf({ w: 110 })}</div><div class="cert-k">Official</div><div class="cert-t">Nice List Certificate</div><div class="cert-s">This certifies that</div><div class="cert-name"></div><div class="cert-s">was spotted being <b>kind</b>, <b>helpful</b>, and full of <b>holiday cheer</b><br/>by our Classroom Elf and is officially on the <span class="red">Nice List!</span></div><div class="cert-sigs"><div><div class="sigline hand">Santa Claus</div>North Pole</div><div><div class="sigline pre">December 22, 2026</div>Date</div><div><div class="sigline"></div>Teacher</div></div></div></div>` },
    ],
    props: [{ note: 'The elf holds these on its last day. Save them for next year!', html: sign({ w: 6, h: 3.4, bg: RED, title: 'See you<br/>next year!', size: 48, flakes: true }) + bubble({ w: 4.8, h: 3.2, text: 'Bye,<br/>friends!', size: 40, color: GREEN, tail: 'right' }) }],
    propList: '"See you next year!" sign, "Bye, friends!" bubble' },
];

const bonus = [
  { n: 'A', title: 'Elf Art Studio', elfDoes: 'Caught coloring, with crayons everywhere.', idea: 'Color your own elf.',
    scene: 'Leave the elf lying on a half-colored page surrounded by crayons, next to the easel and palette.', fun: 'Free coloring time. Hang finished pages as an "Elf Art Gallery."', need: 'Crayons',
    printables: [{ title: 'Elf Coloring Page', html: `<h2 class="ptitle outline-title">Our Classroom Elf</h2><div class="color-scene"><svg class="presents" viewBox="0 0 600 220" width="100%"><g stroke="${INK}" stroke-width="3" fill="#fff" stroke-linejoin="round"><rect x="20" y="90" width="130" height="120"/><rect x="75" y="90" width="20" height="120"/><path d="M85 90 Q55 50 45 75 Q60 90 85 90 Q115 50 125 75 Q110 90 85 90"/><rect x="450" y="120" width="130" height="90"/><rect x="450" y="155" width="130" height="18"/><path d="M515 120 Q490 85 480 105 Q495 120 515 120 Q540 85 550 105 Q535 120 515 120"/><rect x="165" y="150" width="70" height="60"/><rect x="195" y="150" width="12" height="60"/></g></svg><div class="color-elf">${elf({ w: 380, outline: true })}</div><div class="cflakes">${[0, 1, 2, 3, 4, 5].map((i) => `<span style="left:${[4, 80, 12, 88, 40, 62][i]}%;top:${[2, 6, 40, 38, 0, 3][i]}%">${snowflake(46, INK)}</span>`).join('')}</div></div><div class="byline center">Colored by: ______________________</div>` }],
    props: [{ note: 'Draw a silly "masterpiece" on the dry-erase canvas. Wipe it clean and reuse it each year.', html: free(K.easel) + free(K.palette) + lam(`<div class="banner" style="background:${GOLD};color:${INK}">${star(30, '#fff')} Elf Art Gallery ${star(30, '#fff')}</div>`, { r: '.1in' }) }],
    propList: 'Dry-erase easel, paint palette, "Elf Art Gallery" banner' },
  { n: 'B', title: 'Snow Angel', elfDoes: 'Makes a "snow angel" on white paper.', idea: 'Play Roll &amp; Build a Snowman.',
    scene: 'Lay the elf on a sheet of white paper with arms and legs out, surrounded by the laminated snowflakes. No mess!', fun: 'Play Roll &amp; Build a Snowman with a partner or in small groups.', need: 'White paper, dice',
    printables: [{ title: 'Roll &amp; Build a Snowman', html: `<h2 class="ptitle">Roll &amp; Build a Snowman</h2><div class="psub">Take turns rolling a die. Draw the part that matches your roll. Start with a 1! First to finish the whole snowman wins.</div><div class="rolltable">${[1, 2, 3, 4, 5, 6].map((n) => `<div class="rrow">${die(n)}<div class="rpart">${snowParts[n]}</div><div class="rname">${snowNames[n]}</div></div>`).join('')}</div><div class="buildbox"><div class="ground"></div><span>Build your snowman here!</span></div><div class="byline">Name: ______________________</div>` }],
    props: [{ note: 'Scatter the snowflakes around the elf\'s "snow angel," or tape them to the window.', html: sign({ w: 6, h: 3.2, bg: BLUE, title: 'Let it snow!', sub: 'Love, your Elf', size: 52, flakes: true }) + `<div class="discs">${Array.from({ length: 6 }, () => free(`<div class="disc">${K.flakeDisc}<span>${snowflake(120, BLUE)}</span></div>`)).join('')}</div>` }],
    propList: '"Let it snow!" sign, 6 snowflakes' },
  { n: 'C', title: 'Elf Movie Morning', elfDoes: 'Has popcorn and tickets ready.', idea: 'Watch a short holiday cartoon.',
    scene: 'Set the elf in front of the board with the popcorn box, the marquee, and a stack of tickets.', fun: 'Hand out tickets, then watch a short holiday cartoon or read-aloud video (5–15 min).', need: 'A short video',
    printables: [{ title: 'Elf Cinema Tickets', html: `<h2 class="ptitle">Elf Cinema Tickets</h2><div class="psub">Cut apart and hand one to every movie-goer!</div><div class="tickets">${ticket.repeat(10)}</div>` }],
    props: [{ note: 'Write the movie name on the marquee with a dry-erase marker. The elf can hold the popcorn box.', html: lam(`<div class="marquee"><div class="mq-in"><div class="mq-t">NOW SHOWING</div>${dryBox(5.2, 1.3)}<div class="mq-s">Elf Cinema · Showtime: ${dryBox(1.4, .4)}</div></div></div>`, { r: '.15in' }) + free(K.popcorn) }],
    propList: 'Dry-erase "Now Showing" marquee, popcorn box' },
  { n: 'D', title: 'Story Time with Stuffies', elfDoes: 'Reads a book to the stuffed animals.', idea: 'Buddy reading with elf bookmarks.',
    scene: 'Set the elf in the reading corner with an open book, the mini books, and stuffed animals sitting in a circle.', fun: 'Give everyone a bookmark to color. Do buddy reading or read a holiday story aloud.', need: 'A picture book, stuffed animals',
    printables: [{ title: 'Elf Bookmarks', html: `<h2 class="ptitle">Elf Bookmarks</h2><div class="psub">Color, cut out, and use with your favorite book!</div><div class="bookmarks">${bms.map((t) => `<div class="bm cut"><div class="bm-t">${t}</div>${elf({ w: 140, outline: true })}<div class="bm-flakes">${snowflake(28, INK)}${snowflake(20, INK)}</div><div class="bm-name">Name:<br/>____________</div></div>`).join('')}</div>` }],
    props: [{ note: 'Stand the mini books around the elf and stuffed animals in the reading corner.', html: sign({ w: 6.4, h: 2.6, bg: GREEN, title: 'Shhh... Story Time!', size: 38, sub: 'The elf is reading to friends.' }) + `<div class="books">${K.book('Santa\'s Busy Night', '#1d3b6f', K.moon)}${K.book('The Sleepy Snowman', '#2f8fce', K.snowman)}${K.book('Elf Jokes for Kids', RED, elf({ w: 52 }))}</div>` }],
    propList: '"Story Time" sign, 3 mini books' },
  { n: 'E', title: 'Sticky-Note Prank', elfDoes: 'Covered the door in "sticky notes" full of jokes.', idea: 'Read the jokes together.',
    scene: 'Tape the laminated "sticky notes" all over the classroom door or your desk with tape loops. The elf holds the sign.', fun: 'Kids find and read the notes (you read the jokes aloud). Take them down and reuse them next year!', need: 'Tape loops',
    printables: [],
    props: [{ note: 'Twelve reusable "sticky notes" plus the elf\'s sign. Tape loops on the back make them easy to move.', html: sign({ w: 5.6, h: 2.2, bg: RED, title: 'The Elf Was Here!', size: 34 }) + `<div class="stickies">${stickyNotes.map(([c, t], i) => lam(`<div class="sticky hand" style="background:${c};transform:rotate(${[-3, 2, -1, 3, -2, 1][i % 6]}deg)"><div>${t}</div></div>`, { r: '.04in' })).join('')}</div>` }],
    propList: '"The Elf Was Here!" sign, 12 joke "sticky notes"' },
  { n: 'F', title: 'Elf Disco Party', elfDoes: 'Throws a disco party with the stuffed animals.', idea: 'Have a 2-minute dance break!',
    scene: 'Hang the disco ball over the elf and stuffed animals and add the "Dance Party" banner.', fun: 'Play a song for a dance break. Draw a dance move card for each round; hold up "Freeze!" to stop.', need: 'A song to play',
    printables: [],
    props: [
      { note: 'Hang the disco ball from a string above the elf. Hold up the "Freeze!" sign to stop the music.', html: lam(`<div class="banner" style="background:#8e44ad;color:#fff;width:7.2in">${star(32)} Elf Dance Party! ${star(32)}</div>`, { r: '.1in' }) + free(A.discoBall) + sign({ w: 3.4, h: 3.4, bg: BLUE, title: 'FREEZE!', size: 40, flakes: true }) },
      { note: 'Six dance move cards. Draw one for each song!', html: `<div class="moves">${danceMoves.map(([t, s], i) => lam(`<div class="move" style="border-color:${[RED, GREEN, BLUE, GOLD, '#8e44ad', RED][i]}"><div class="mv-n">${i + 1}</div><div class="mv-t">${t}</div><div class="mv-s">${s}</div>${elf({ w: 46 })}</div>`)).join('')}</div>` },
    ],
    propList: '"Elf Dance Party!" banner, disco ball, "Freeze!" sign, 6 dance move cards' },
];

// ---------------------------------------------------------------------------
// Special prop layouts (Day 1 doors)
// ---------------------------------------------------------------------------
const special = {
  DOORS0: `<div class="doors">${A.doors.slice(0, 2).map(([n, s]) => `<div>${free(s)}<div class="door-n">${n}</div></div>`).join('')}</div>`,
  DOORS1: `<div class="doors">${A.doors.slice(2, 4).map(([n, s]) => `<div>${free(s)}<div class="door-n">${n}</div></div>`).join('')}</div>`,
  DOORS2: `<div class="doors">${A.doors.slice(4, 6).map(([n, s]) => `<div>${free(s)}<div class="door-n">${n}</div></div>`).join('')}</div>`,
  DOORACC: free(A.welcomeMat) + free(A.crossing(elf({ w: 60 }))) + free(A.miniWreath) + free(A.lantern) + lam(`<div class="knock"><div>Knock 3 times</div><b>for elf magic!</b>${star(26)}</div>`, { r: '.15in' }) + lam(`<div class="knock g"><div>Elf Door</div><b>Do not lock!</b></div>`, { r: '.15in' }),
  ARRIVE: sign({ w: 6.2, h: 3.4, title: 'I\'m Here!', sub: 'Hello from the North Pole!', size: 58, flakes: true }) +
    lam(`<div class="rules"><div class="rt">Elf Rules</div><div class="rr">${K.eye}<span>Look at me</span></div><div class="rr">${K.talk}<span>Talk to me</span></div><div class="rr">${K.noTouch}<span>Please don't touch me!<small>It keeps my Christmas magic.</small></span></div></div>`),
};

// ---------------------------------------------------------------------------
// Page assembly
// ---------------------------------------------------------------------------
const label = (e) => (typeof e.n === 'number' ? `Day ${e.n} · ${e.dow}, Dec ${e.d}` : `Bonus Idea ${e.n}`);
const page = (html, { cls = '', landscape = false } = {}) => ({ html, cls, landscape });

function sectionPages(e) {
  const out = [];
  for (const p of e.printables) {
    const frame = p.frame !== false;
    out.push(page(`${frame ? '<div class="frame">' : ''}<div class="ptag">${label(e)} · ${e.title}</div>${p.html}${frame ? '</div>' : ''}`, { cls: 'printable', landscape: !!p.landscape }));
  }
  e.props.forEach((p, i) => {
    out.push(page(`<div class="phead"><div class="pdate">${typeof e.n === 'number' ? `<small>DAY</small><b>${e.n}</b><span>${e.dow} · Dec ${e.d}</span>` : `<small>BONUS</small><b>${e.n}</b>`}</div><div class="ph-mid"><div class="ph-t">${e.title}</div><div class="ph-s">Laminate &amp; reuse props${e.props.length > 1 ? ` · ${i + 1} of ${e.props.length}` : ''}</div></div>${elf({ w: 40 })}</div>
      <div class="pnote">${p.note}</div><div class="parea">${special[p.html] || p.html}</div><div class="pfoot">Print on cardstock · laminate · cut on dashed lines</div>`, { cls: 'proppage' }));
  });
  return out;
}

const FRONT = 6; // cover, calendar, guide x3, how-to
const sections = [...days, ...bonus].map((e) => ({ e, pages: sectionPages(e) }));
let pn = FRONT + 1;
for (const s of sections) { s.e.start = pn; pn += s.pages.length; s.e.end = pn - 1; }
const total = pn - 1;
const pgs = (e) => (e.start === e.end ? `p. ${e.start}` : `pp. ${e.start}–${e.end}`);

// cover
const cover = page(`
<div class="cover">
  <div class="flakes">${Array.from({ length: 14 }, (_, i) => `<span style="left:${(i * 53) % 95}%;top:${(i * 37) % 88}%">${snowflake(18 + (i % 3) * 10, '#ffffff')}</span>`).join('')}</div>
  <div class="cover-top">
    <div class="kicker">December 2026 · Grades K–2</div>
    <h1>Classroom Elf<br/>Calendar</h1>
    <div class="sub">16 funny, low-prep Elf on the Shelf ideas for every school day<br/>(Tue, Dec 1 – Tue, Dec 22) + 6 bonus ideas,<br/>with printables and laminate &amp; reuse props</div>
  </div>
  <div class="cover-elf">${elf({ w: 195 })}</div>
  <div class="cover-box">
    <h3>What's inside</h3>
    <ul>
      <li><b>Page 2:</b> The calendar: what the elf does and the idea for every school day</li>
      <li><b>Pages 3–5:</b> Teacher guide for all 16 days + 6 bonus ideas</li>
      <li><b>Page 6:</b> How to laminate the props, and a list of every day's props</li>
      <li><b>Pages 7–${total}:</b> One section per day: printables, then props to laminate</li>
    </ul>
    <h3>Quick tips</h3>
    <ul>
      <li>Most days take under 5 minutes to set up, with little or no clean-up.</li>
      <li>Print the props once on cardstock and laminate them to reuse every year.</li>
      <li>Did someone touch the elf? Sprinkle a little cinnamon "magic" nearby and the elf is good as new!</li>
      <li>Not every family celebrates. Keep it light and playful, and welcome everyone to join the fun.</li>
    </ul>
  </div>
  <div class="disclaimer">Not affiliated with or endorsed by The Elf on the Shelf®. For classroom use.</div>
</div>`, { cls: 'cover-page' });

// calendar
const byDate = Object.fromEntries(days.map((e) => [e.d, e]));
function calCell(d) {
  const e = byDate[d];
  return `<div class="cell"><div class="cell-head"><span class="dayp">DAY ${e.n}</span><span class="num">${d}</span></div><div class="ctitle">${e.title}</div>
    <div class="ctext"><b>Elf:</b> ${e.elfDoes}</div><div class="ctext"><b>Idea:</b> ${e.idea}</div><div class="ctags"><span class="cprint">${pgs(e)}</span></div></div>`;
}
const calendar = page(`
<div class="cal">
  <div class="cal-header"><div><div class="cal-title">December 2026</div><div class="cal-sub">Classroom Elf Calendar · Monday–Friday · 16 school days</div></div>${elf({ w: 52 })}</div>
  <div class="grid">
    ${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((d) => `<div class="dow">${d}</div>`).join('')}
    <div class="cell off"><span class="num dim">30</span><div class="offtxt">Nov 30<br/>Get ready! The elf arrives tomorrow.</div></div>
    ${[1, 2, 3, 4, 7, 8, 9, 10, 11, 14, 15, 16, 17, 18, 21, 22].map(calCell).join('')}
    <div class="cell bonuscell" style="grid-column: span 3"><div class="bc-t">${star(22)} 6 Bonus Ideas: swap one in any day! ${star(22)}</div>
      <div class="bc-list">${bonus.map((b) => `<div><b>${b.n}. ${b.title}:</b> ${b.idea} <span class="cprint">${pgs(b)}</span></div>`).join('')}</div>
      <div class="bc-f">Dec 23–25: Winter Break! The elf is back at the North Pole.</div></div>
  </div>
</div>`, { landscape: true });

// guide
function guideBlock(e) {
  const num = typeof e.n === 'number';
  return `<div class="gblock">
    <div class="gdate"><div class="gdow">${num ? 'DAY' : 'BONUS'}</div><div class="gnum">${e.n}</div><div class="gmon">${num ? `${e.dow} ${e.d}` : 'any day'}</div></div>
    <div class="gbody">
      <div class="gtitle">${e.title} <span class="gp">${pgs(e)}</span></div>
      <div><b class="lab">Set the scene:</b> ${e.scene}</div>
      <div><b class="lab">Morning fun:</b> ${e.fun}</div>
      <div><b class="lab">You'll need:</b> ${e.need}</div>
    </div></div>`;
}
const guide = [
  page(`<div class="guide"><h2>Teacher Guide <span>Days 1–8</span></h2>${days.slice(0, 8).map(guideBlock).join('')}</div>`),
  page(`<div class="guide"><h2>Teacher Guide <span>Days 9–16</span></h2>${days.slice(8).map(guideBlock).join('')}</div>`),
  page(`<div class="guide"><h2>Teacher Guide <span>Bonus ideas: swap in any day</span></h2>${bonus.map(guideBlock).join('')}</div>`),
];

// how-to + props list
const howto = page(`<div class="pintro">
  <div class="pi-head">${elf({ w: 80 })}<div><h2>Laminate &amp; Reuse Props</h2><div class="pi-s">Every day has sturdy props for the elf. Make them once and use them every year!</div></div></div>
  <div class="pi-cols">
    <div class="pi-box"><h3>How to make them</h3><ol>
      <li>Print the props pages on <b>white cardstock</b>.</li>
      <li>Rough-cut each piece, then <b>laminate</b>.</li>
      <li>Cut on the dashed lines, leaving a small clear border.</li>
      <li>Add craft sticks, sticky tack, or Velcro dots so the elf can "hold" them.</li>
    </ol></div>
    <div class="pi-box"><h3>Teacher tips</h3><ul>
      <li><b>Dry-erase</b> areas wipe clean, so you can reuse names, scores, and messages.</li>
      <li>For see-through windows (magnifying glass, photo frame), <b>cut the window out before laminating</b>.</li>
      <li>Store each day's props in a labeled zip bag.</li>
    </ul></div>
  </div>
  <table class="pi-table"><colgroup><col style="width:9%"><col style="width:25%"><col style="width:53%"><col style="width:13%"></colgroup><tr><th>Day</th><th>Idea</th><th>Props to laminate</th><th>Pages</th></tr>
    ${[...days, ...bonus].map((e) => `<tr class="${typeof e.n === 'number' ? '' : 'bonusrow'}"><td>${typeof e.n === 'number' ? `Day ${e.n}` : `Bonus ${e.n}`}</td><td>${e.title}</td><td>${e.propList}</td><td>${e.start === e.end ? e.start : `${e.start}–${e.end}`}</td></tr>`).join('')}
  </table></div>`, { cls: 'proppage' });

const allPages = [cover, calendar, ...guide, howto, ...sections.flatMap((s) => s.pages)];
if (allPages.length !== total) throw new Error(`page count mismatch ${allPages.length} vs ${total}`);

// ---------------------------------------------------------------------------
// Extra styles for v2
// ---------------------------------------------------------------------------
const v2Css = `
.cell-head { justify-content: space-between; }
.dayp { background: ${GREEN}; color: #fff; font-weight: 700; font-size: 9pt; padding: 1px 8px; border-radius: 9px; letter-spacing: .5px; }
.cal .ctitle { font-size: 11pt; margin-top: 3px; line-height: 1.1; }
.cal .ctext { font-size: 8.6pt; line-height: 1.22; margin-top: 2px; flex: none; }
.cal .ctext b { color: ${RED}; }
.cal .ctags { margin-top: auto; }
.bonuscell { background: #fffaf0; border-right: none; padding: 6px 12px; }
.bc-t { font-weight: 700; color: ${RED}; font-size: 11.5pt; display: flex; align-items: center; gap: 6px; }
.bc-list { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 14px; font-size: 8.6pt; margin-top: 4px; line-height: 1.25; }
.bc-list b { color: ${GREEN}; }
.bc-list .cprint { font-size: 7pt; padding: 0 5px; white-space: nowrap; }
.bc-f { margin-top: auto; font-size: 8.5pt; color: #3b6b97; text-align: center; }
.gdate { height: 70px; } .gdow { font-size: 7.5pt; } .gmon { font-size: 7.5pt; }
.divpage { padding: .5in; display: flex; align-items: center; background: linear-gradient(170deg, #fff 0 70%, #fdf1f2 70%); }
.divider { display: flex; gap: .35in; align-items: flex-start; border: 4px solid ${RED}; border-radius: 24px; padding: .4in; background: #fff; box-shadow: 0 0 0 10px #fdecc8; width: 100%; }
.dv-badge { flex: none; width: 1.35in; height: 1.6in; border-radius: 18px; background: ${RED}; color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1; }
.dv-badge small { font-size: 13pt; letter-spacing: 2px; font-weight: 600; } .dv-badge b { font-size: 54pt; } .dv-badge span { font-size: 11pt; margin-top: 4px; }
.dv-main { flex: 1; }
.dv-t { font-size: 28pt; font-weight: 700; color: ${GREEN}; line-height: 1.05; margin-bottom: 12px; }
.dv-row { font-size: 13pt; line-height: 1.4; margin-bottom: 7px; }
.dv-l { font-weight: 700; color: ${RED}; }
.dv-list { margin-top: 14px; font-size: 10.5pt; background: #fdecc8; color: #6b4a00; padding: 6px 12px; border-radius: 10px; }
.pdate { width: 74px; height: 74px; } .pdate small { font-size: 7.5pt; letter-spacing: 1px; } .pdate b { font-size: 24pt; } .pdate span { font-size: 7pt; }
.l2 { font-size: 16.5pt !important; line-height: 1.32 !important; }
.l2 p { margin: 0 0 8px !important; } .l2 ol { margin: 0 0 8px; padding-left: 34px; } .l2 li { margin-bottom: 2px; }
.ps { background: #fdecc8; border-radius: 12px; padding: 6px 12px; }
.doors { display: flex; gap: .45in; justify-content: center; align-items: flex-end; width: 100%; }
.door-n { text-align: center; font-size: 11pt; color: #888; margin-top: 12px; }
.knock { background: #fff8e7; border: .07in solid ${RED}; border-radius: .15in; padding: .12in .25in; text-align: center; font-size: 14pt; color: ${INK}; display: flex; flex-direction: column; align-items: center; }
.knock b { color: ${RED}; font-size: 16pt; } .knock.g { border-color: ${GREEN}; } .knock.g b { color: ${GREEN}; }
.mm-board { background: #2f4f3a; color: #fff; border: 10px solid #8b5a2b; border-radius: 10px; font-size: 22pt; line-height: 1.35; padding: 14px 20px; margin: 4px 0 14px; }
.fixgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 .35in; }
.fixrow { display: flex; align-items: center; gap: 10px; } .fixrow .hw { flex: 1; margin: 6px 0; }
.bad { font-family: 'Patrick Hand'; font-size: 20pt; color: ${RED}; text-decoration: underline wavy; min-width: 1.1in; }
.arrow { font-size: 18pt; color: #888; }
.mmprop { width: 7.2in; background: #2f4f3a; border: .12in solid #8b5a2b; border-radius: .12in; padding: .12in; text-align: center; }
.mm-t { color: #fff; font-weight: 700; font-size: 20pt; display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 8px; }
.keycard { width: 7.2in; border: 3px dashed ${GOLD}; border-radius: .15in; padding: .12in .2in; background: #fffaf0; }
.kc-t { font-weight: 700; color: ${RED}; font-size: 14pt; } .kc-msg { font-size: 18pt; line-height: 1.3; margin: 6px 0; } .kc-k { font-size: 10pt; color: #555; }
.badges { display: grid; grid-template-columns: repeat(4, 1fr); gap: .22in; }
.badge { width: 1.55in; height: 1.55in; border-radius: 50%; background: ${GOLD}; display: flex; align-items: center; justify-content: center; border: 3px solid ${INK}; }
.b-in { width: 1.25in; height: 1.25in; border-radius: 50%; background: #fff; border: 2px dashed ${RED}; display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1; }
.b-in b { color: ${RED}; font-size: 13pt; } .b-in span { color: ${GREEN}; font-size: 11pt; font-weight: 700; }
.rc { width: 100%; border-collapse: collapse; margin: 4px 0 14px; }
.rc th { background: ${GREEN}; color: #fff; text-align: left; padding: 6px 12px; font-size: 14pt; }
.rc td { border-bottom: 2px dashed #ddd; padding: 4px 12px; font-size: 16pt; font-weight: 500; }
.stars { white-space: nowrap; } .stars svg { margin-right: 6px; }
.trc { width: 6.6in; background: #fffaf0; border: .1in solid ${GREEN}; border-radius: .18in; padding: .15in .25in; }
.trc-h { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid ${RED}; padding-bottom: 4px; }
.trc-k { font-size: 11pt; letter-spacing: 3px; color: ${GREEN}; font-weight: 600; text-transform: uppercase; } .trc-t { font-size: 30pt; font-weight: 700; color: ${RED}; line-height: 1; }
.trc-s { font-size: 13pt; margin: 8px 0; display: flex; align-items: center; gap: 10px; }
.trc table { width: 100%; border-collapse: collapse; }
.trc td { border-bottom: 1.5px solid #e5d5b5; padding: 4px 6px; font-size: 13pt; vertical-align: middle; }
.trc td.hand { font-size: 18pt; color: ${RED}; text-align: right; line-height: 1.05; } .trc td small { font-size: 12pt; color: #777; }
.trc-c { margin-top: 8px; font-size: 12pt; } .trc-c .hand { font-size: 17pt; color: ${GREEN}; }
.trc-sig { text-align: right; font-size: 11pt; } .trc-sig .hand { font-size: 20pt; color: ${RED}; }
.pwcols { display: flex; align-items: center; justify-content: center; gap: .3in; margin: 6px 0 10px; }
.pwcol { width: 2.6in; border: 3px solid ${RED}; border-radius: 14px; padding: 6px 14px; text-align: center; }
.pwcol.g { border-color: ${GREEN}; }
.pwcol h3 { margin: 0 0 4px; color: ${RED}; } .pwcol.g h3 { color: ${GREEN}; }
.pwcol div { font-size: 17pt; padding: 3px 0; border-bottom: 1.5px dashed #ddd; }
.pwplus { font-size: 40pt; font-weight: 700; color: ${GOLD}; }
.pwsign { width: 7in; background: ${GREEN}; color: #fff; border-radius: .18in; padding: .2in; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 4px; border: .09in solid #fff; box-shadow: 0 0 0 3px ${GREEN}; }
.pw-k { font-size: 16pt; } .pw-t { font-size: 40pt; font-weight: 700; line-height: 1; color: ${GOLD}; } .pw-s { font-size: 16pt; margin-bottom: 6px; }
.pwcards { display: grid; grid-template-columns: 1fr 1fr; gap: .22in .3in; }
.pwc { width: 3.4in; height: 1.35in; border-radius: .12in; color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 3px solid ${INK}; }
.pwc small { font-size: 10pt; opacity: .9; } .pwc b { font-size: 22pt; }
.est { display: flex; justify-content: center; gap: .6in; margin: 10px 0; text-align: center; }
.est-l { font-size: 16pt; font-weight: 600; color: ${GREEN}; } .est-b { width: 2in; height: 1.1in; border: 3px solid ${INK}; border-radius: 12px; margin-top: 6px; background: #fff; }
.mazewrap { flex: 1; display: flex; align-items: center; gap: 6px; }
.mz { flex: 1; }
.mz-start, .mz-end { display: flex; flex-direction: column; align-items: center; font-weight: 700; color: ${GREEN}; }
.mz-start { align-self: flex-start; } .mz-end { align-self: flex-end; }
.bulbs { display: grid; grid-template-columns: repeat(8, 1fr); gap: .14in; }
.pq { font-size: 14pt; margin: 8px 0; display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.pq .opts { width: 100%; margin: 4px 0 0; }
.opts.small { font-size: 13pt; } .opts.small span { border: 2px solid ${GREEN}; border-radius: 20px; padding: 2px 12px; }
.bells svg { margin-right: 3px; vertical-align: middle; }
.big2 { font-size: 18pt; color: ${RED}; }
.tent { width: 6.4in; border: 3px solid ${INK}; border-radius: .08in; overflow: hidden; }
.tent-top, .tent-bot { height: 1.3in; display: flex; align-items: center; justify-content: center; gap: 16px; font-size: 36pt; font-weight: 700; color: #fff; background: ${RED}; }
.tent-top { transform: rotate(180deg); background: ${GREEN}; }
.tent-fold { border-top: 2px dashed #999; text-align: center; font-size: 8pt; color: #999; background: #fff; }
.quizcard { width: 4.6in; background: #fff; border: .09in solid ${GOLD}; border-radius: .18in; padding: .15in; text-align: center; }
.qc-t { font-size: 30pt; font-weight: 700; color: ${RED}; } .qc-s { font-family: 'Patrick Hand'; font-size: 18pt; color: ${GREEN}; text-align: right; }
.ttts { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: .2in; flex: 1; align-content: center; }
.ttt { border: 2px dashed #bbb; border-radius: 12px; padding: 6px; text-align: center; }
.ttt-l { font-weight: 600; color: ${RED}; } .ttt-w { font-size: 10.5pt; color: #555; }
.tttboard { width: 6.6in; background: #fff; border: .1in solid ${GREEN}; border-radius: .2in; padding: .15in .3in; text-align: center; }
.tb-t { font-size: 26pt; font-weight: 700; color: ${GREEN}; display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 6px; }
.pieces { display: grid; grid-template-columns: repeat(5, 1fr); gap: .2in .25in; }
.stickies { display: grid; grid-template-columns: repeat(4, 1fr); gap: .2in; }
.sticky { width: 1.65in; height: 1.65in; padding: 8px; font-size: 13pt; line-height: 1.12; display: flex; align-items: center; justify-content: center; text-align: center; box-shadow: 0 3px 0 rgba(0,0,0,.12); border: 1px solid rgba(0,0,0,.15); }
.moves { display: grid; grid-template-columns: 1fr 1fr; gap: .25in .3in; }
.move { width: 3.4in; height: 2.6in; border: .09in solid; border-radius: .18in; background: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: .1in; position: relative; }
.mv-n { position: absolute; top: 6px; left: 12px; font-weight: 700; font-size: 18pt; color: #bbb; }
.mv-t { font-size: 24pt; font-weight: 700; color: ${RED}; line-height: 1.05; } .mv-s { font-size: 12pt; margin: 4px 0; }
.pi-table { font-size: 9.2pt !important; } .pi-table td { padding: 3px 7px !important; }
`;

const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Classroom Elf Calendar · December 2026</title><style>${baseCss}${K.propCss}${v2Css}</style></head><body>${allPages.map((p) => `<section class="page ${p.landscape ? 'land' : ''} ${p.cls}">${p.html}</section>`).join('\n')}</body></html>`;
fs.writeFileSync(HTML_FILE, html);

(async () => {
  const browser = await chromium.launch();
  const pg = await browser.newPage();
  await pg.goto('file://' + HTML_FILE, { waitUntil: 'load' });
  await pg.evaluate(() => document.fonts.ready);
  await pg.pdf({ path: PDF_FILE, preferCSSPageSize: true, printBackground: true });
  await browser.close();
  console.log(`Wrote ${PDF_FILE} (${total} pages)`);
})();
