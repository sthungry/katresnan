const fs = require('fs');
let c = fs.readFileSync('src/app/undangan/[slug]/templates/noir-minimal.tsx', 'utf8');

// Replace palettes
c = c.replace(
`const C = {
  bg: '#0a0a0f',
  bgAlt: '#111118',
  card: 'rgba(255,255,255,0.06)',
  accent: '#ffffff',
  accentSoft: 'rgba(255,255,255,0.85)',
  accentDim: 'rgba(255,255,255,0.4)',
  text: '#ffffff',
  muted: 'rgba(255,255,255,0.6)',
  subtle: 'rgba(255,255,255,0.3)',
  border: 'rgba(255,255,255,0.15)',
  borderLight: 'rgba(255,255,255,0.08)',
}`,
`const C = {
  bg: '#131313',
  bgAlt: '#1b1b1b',
  card: '#1f1f1f',
  accent: '#f2ca50',
  accentSoft: '#d4af37',
  accentDim: '#d0c5af',
  text: '#e2e2e2',
  muted: '#d0c5af',
  subtle: '#99907c',
  border: 'rgba(153, 144, 124, 0.15)',
  borderLight: 'transparent',
}`);

// Replace typography
c = c.split(`'Cormorant Garamond',serif`).join(`'Noto Serif',serif`);
c = c.split(`'Lato',sans-serif`).join(`'Work Sans',sans-serif`);
c = c.split('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Lato:wght@300;400;700&display=swap').join('https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Work+Sans:wght@300;400;500;600&display=swap');

fs.writeFileSync('src/app/undangan/[slug]/templates/noir-minimal.tsx', c);
