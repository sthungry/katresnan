const fs = require('fs');
let c = fs.readFileSync('src/app/undangan/[slug]/templates/noir-minimal.tsx', 'utf8');

const svgs = `
const Ics = {
  Cal: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
  Clk: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
  Pin: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
  Chk: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
  X: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  Q: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
  User: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
  Ring: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21a9 9 0 0 0 9-9h-2a7 7 0 0 1-7 7v2z"></path><path d="M3 12a9 9 0 0 0 9 9v-2a7 7 0 0 1-7-7H3z"></path><path d="M12 3a9 9 0 0 0-9 9h2a7 7 0 0 1 7-7V3z"></path><path d="M21 12a9 9 0 0 0-9-9v2a7 7 0 0 1 7 7h2z"></path><circle cx="12" cy="3" r="2"></circle></svg>,
  Box: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>,
  Star: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>,
  Env: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
}
`;

if (!c.includes('const Ics = {')) {
  c = c.replace('// ── Utility Components ───────────────────────────────────────────────', '// ── Utility Components ───────────────────────────────────────────────\n' + svgs);
}

// 1. Acara Icons
c = c.replace(/<span>📅<\/span>/g, '<span className="mt-0.5"><Ics.Cal /></span>');
c = c.replace(/<span>⏰<\/span>/g, '<span className="mt-0.5"><Ics.Clk /></span>');
c = c.replace(/<span className='flex-shrink-0'>📍<\/span>/g, '<span className="flex-shrink-0 mt-0.5"><Ics.Pin /></span>');
c = c.replace(/📍 Lihat Lokasi/g, '<span className="flex items-center"><Ics.Pin /> <span className="ml-1">Lihat Lokasi</span></span>');
c = c.replace(/📅 Tambah ke Kalender/g, '<span className="flex items-center"><Ics.Cal /> <span className="ml-1">Tambah ke Kalender</span></span>');

// 2. RSVP Icons
c = c.replace(/✅ Hadir/g, '<span className="flex items-center justify-center gap-1"><Ics.Chk /> Hadir</span>');
c = c.replace(/❌ Tidak/g, '<span className="flex items-center justify-center gap-1"><Ics.X /> Tidak</span>');
c = c.replace(/🤔 Mungkin/g, '<span className="flex items-center justify-center gap-1"><Ics.Q /> Mungkin</span>');
c = c.replace(/'✅' : u.hadir === 'tidak' \? '❌' : '🤔'/g, "(<Ics.Chk />) : u.hadir === 'tidak' ? (<Ics.X />) : (<Ics.Q />)");
c = c.replace(/Kirim Ucapan 💌/g, '<span className="flex items-center justify-center gap-1.5">Kirim Ucapan <Ics.Env /></span>');

// 3. Gift Icons
c = c.replace(/\`🤵 \$\{w.pria_nama_panggilan\}\`/g, "(<><Ics.User /> <span style={{marginLeft:4}}>{w.pria_nama_panggilan}</span></>)");
c = c.replace(/\`👰 \$\{w.wanita_nama_panggilan\}\`/g, "(<><Ics.User /> <span style={{marginLeft:4}}>{w.wanita_nama_panggilan}</span></>)");
c = c.replace(/'💍 Bersama'/g, "(<><Ics.Ring /> <span style={{marginLeft:4}}>Bersama</span></>)");
c = c.replace(/📦 Alamat Kado Fisik/g, '<span className="flex items-center gap-1.5"><Ics.Box /> Alamat Kado Fisik</span>');

// 4. Miscelaneous
c = c.replace(/🎉 Hari Bahagia Telah Tiba!/g, '<span className="flex items-center justify-center gap-2"><Ics.Star /> Hari Bahagia Telah Tiba!</span>');

// 5. Square Photos in SectionMempelai
// We change: width: 140, height: 140, border: ... borderRadius: '50%'
c = c.replace(/<div className='relative mx-auto mb-5' style=\{\{ width: 140, height: 140 \}\}>/, "<div className='relative mx-auto mb-5' style={{ width: 130, height: 160 }}>");
c = c.replace(/<div style=\{\{ position: 'absolute', inset: '-4px', border: \`1px solid \$\{C\.border\}\`, borderRadius: '50%' \}\} \/>/, "<div style={{ position: 'absolute', inset: '-4px', border: `1px solid ${C.border}`, borderRadius: '4px' }} />");
c = c.replace(/<div className='w-full h-full rounded-sm overflow-hidden' style=\{\{ border: \`2px solid \$\{C\.accent\}\`, boxShadow: \`0 8px 32px rgba\(0,0,0,0\.4\)\` \}\}>/, "<div className='w-full h-full rounded-sm overflow-hidden' style={{ border: `1px solid ${C.accent}`, boxShadow: `0 8px 32px rgba(0,0,0,0.4)` }}>");
c = c.replace(/'🤵' : '👰'/g, "p ? <Ics.User /> : <Ics.User />");

fs.writeFileSync('src/app/undangan/[slug]/templates/noir-minimal.tsx', c);
