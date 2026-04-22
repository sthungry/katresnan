const fs = require('fs');
let lines = fs.readFileSync('src/app/undangan/[slug]/templates/noir-minimal.tsx', 'utf8').split('\n');

// Find the start line for SectionQuote's last <p>
let startIdx = lines.findIndex(l => l.includes("<p style={{ fontFamily: \"'Work Sans',sans-serif\", fontSize: '0.82rem', color: C.muted, lineHeight: 1.9, maxWidth: 420, margin: '0 auto' }}>"));

// Find the end line for SectionMempelai's declaration of Card's wanita
let endIdx = lines.findIndex((l, i) => i > startIdx && l.includes("<Card type='wanita' />"));

console.log("Start idx:", startIdx, "End idx:", endIdx);

if (startIdx !== -1 && endIdx !== -1) {
  const replacement = `            <p style={{ fontFamily: "'Work Sans',sans-serif", fontSize: '0.82rem', color: C.muted, lineHeight: 1.9, maxWidth: 420, margin: '0 auto' }}>
              {preset.sub}
            </p>
          </>
        )}
      </div>
    </section>
  )
}

// ── Section: Mempelai ────────────────────────────────────────────────
function SectionMempelai({ w }: { w: WeddingData }) {
  const Card = ({ type }: { type: 'pria' | 'wanita' }) => {
    const p = type === 'pria'
    const foto = p ? (w.pria_foto_url || w.foto_urls?.[1]) : (w.wanita_foto_url || w.foto_urls?.[2])
    const nama = p ? (w.pria_nama_lengkap || w.pria_nama_panggilan) : (w.wanita_nama_lengkap || w.wanita_nama_panggilan)
    const gelar = p ? w.pria_gelar : w.wanita_gelar
    const ayah = parentLabel(p ? w.pria_nama_ayah : w.wanita_nama_ayah, p ? w.pria_status_ayah : w.wanita_status_ayah)
    const ibu = parentLabel(p ? w.pria_nama_ibu : w.wanita_nama_ibu, p ? w.pria_status_ibu : w.wanita_status_ibu)
    return (
      <div className='text-center'>
        <p style={{ fontFamily: "'Noto Serif',serif", fontSize: '0.55rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: C.accentDim, marginBottom: 12 }}>{p ? 'The Groom' : 'The Bride'}</p>
        <div className='relative mx-auto mb-5' style={{ width: 130, height: 160 }}>
          <div style={{ position: 'absolute', inset: '-4px', border: \`1px solid \${C.border}\`, borderRadius: '4px' }} />
          <div className='w-full h-full rounded-sm overflow-hidden' style={{ border: \`1px solid \${C.accent}\`, boxShadow: \`0 8px 32px rgba(0,0,0,0.4)\` }}>
            {foto ? <img src={foto} alt={nama || ''} className='w-full h-full object-cover' style={{ objectPosition: 'center top' }} />
              : <div className='w-full h-full flex items-center justify-center text-4xl' style={{ background: C.card }}><Ics.User /></div>}
          </div>
        </div>
        <h3 style={{ fontFamily: "'Noto Serif',serif", fontStyle: 'italic', fontSize: '1.25rem', color: C.accent, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>
          {nama}{gelar ? \` \${gelar}\` : ''}
        </h3>
        {(ayah || ibu) && <p className='text-xs leading-loose mt-1' style={{ fontFamily: "'Work Sans',sans-serif", color: C.muted }}>
          {p ? 'Putra' : 'Putri'} dari<br />
          <span style={{ color: C.accentSoft, fontWeight: 600 }}>{ayah}</span>
          {ibu && <><br />&amp; <span style={{ color: C.accentSoft, fontWeight: 600 }}>{ibu}</span></>}
        </p>}
      </div>
    )
  }
  return (
    <section id='mempelai' className='relative overflow-hidden' style={{ background: 'transparent' }}>
      <BgLayer bg={resolveBg(w.bg_sections?.mempelai)} />
      <div className='relative z-10 px-5 py-20 text-center' style={{ maxWidth: 560, margin: '0 auto' }}>
        <SectionHeader label='Mempelai' title={<>Yang Akan <em>Dipersatukan</em></>} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '28px 16px', alignItems: 'start' }}>
          <Card type='pria' />
          <div className='flex flex-col items-center' style={{ paddingTop: 32 }}>
            <div style={{ width: 1, height: 32, background: \`linear-gradient(to bottom,transparent,\${C.accent})\` }} />
            <span style={{ fontFamily: "'Noto Serif',serif", fontStyle: 'italic', fontSize: '1.7rem', color: C.accent, padding: '4px 0' }}>&amp;</span>
            <div style={{ width: 1, height: 32, background: \`linear-gradient(to top,transparent,\${C.accent})\` }} />
          </div>
          <Card type='wanita' />`.split('\n');

  lines.splice(startIdx, endIdx - startIdx + 1, ...replacement);
  fs.writeFileSync('src/app/undangan/[slug]/templates/noir-minimal.tsx', lines.join('\n'));
  console.log("Fixed.");
}
