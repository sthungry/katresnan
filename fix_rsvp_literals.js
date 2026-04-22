const fs = require('fs');
let c = fs.readFileSync('src/app/undangan/[slug]/templates/noir-minimal.tsx', 'utf8');

c = c.replace(/'<span className="flex items-center justify-center gap-1"><Ics\.Chk \/> Hadir<\/span>'/g, '<span className="flex items-center justify-center gap-1"><Ics.Chk /> Hadir</span>');
c = c.replace(/'<span className="flex items-center justify-center gap-1"><Ics\.X \/> Tidak<\/span>'/g, '<span className="flex items-center justify-center gap-1"><Ics.X /> Tidak</span>');
c = c.replace(/'<span className="flex items-center justify-center gap-1"><Ics\.Q \/> Mungkin<\/span>'/g, '<span className="flex items-center justify-center gap-1"><Ics.Q /> Mungkin</span>');
c = c.replace(/'<span className="flex items-center justify-center gap-1\.5">Kirim Ucapan <Ics\.Env \/><\/span>'/g, '<span className="flex items-center justify-center gap-1.5">Kirim Ucapan <Ics.Env /></span>');

fs.writeFileSync('src/app/undangan/[slug]/templates/noir-minimal.tsx', c);
console.log("Replacement applied successfully.");
