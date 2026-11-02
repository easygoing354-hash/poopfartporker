// Base page + printable styles.
const { RED, GREEN, GOLD, INK } = require('./art.js');
module.exports = `
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
.cover-elf { position: absolute; left: 50%; transform: translateX(-50%); top: 4.22in; }
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
.ctags { display: flex; gap: 4px; flex-wrap: wrap; }
.cprop { font-size: 8pt; font-weight: 600; background: #dff0e6; color: ${GREEN}; padding: 1px 7px; border-radius: 8px; }
.gp.prop { background: #dff0e6; color: ${GREEN}; }
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
