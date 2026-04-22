const fs = require('fs');
let c = fs.readFileSync('src/app/undangan/[slug]/templates/noir-minimal.tsx', 'utf8');

c = c.replace(/rounded-xl/g, 'rounded-sm');
c = c.replace(/rounded-lg/g, 'rounded-sm');
c = c.replace(/rounded-2xl/g, 'rounded-sm');

fs.writeFileSync('src/app/undangan/[slug]/templates/noir-minimal.tsx', c);
