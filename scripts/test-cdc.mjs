// Script de diagnóstico — nueva lógica: país debe aparecer en título O descripción
const res = await fetch('https://wwwnc.cdc.gov/travel/rss/notices.xml')
const xml = await res.text()

function extractTag(block, tag) {
  const cdata = block.match(new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`))
  if (cdata) return cdata[1].trim()
  const plain = block.match(new RegExp(`<${tag}>([^<]*)<\\/${tag}>`))
  return plain ? plain[1].trim() : ''
}

const COUNTRY_KW = {
  mx: ['mexico', 'mexican'],
  cr: ['costa rica'],
  do: ['dominican republic'],
  br: ['brazil', 'brazilian'],
  cl: ['chile', 'chilean'],
}
const REGIONAL_TITLE_KW = {
  mx: ['americas', 'latin america', 'central america', 'north america', 'global'],
  cr: ['americas', 'latin america', 'central america', 'global'],
  do: ['americas', 'latin america', 'caribbean', 'global'],
  br: ['americas', 'latin america', 'south america', 'global'],
  cl: ['americas', 'latin america', 'south america', 'global'],
}

const itemRegex = /<item>([\s\S]*?)<\/item>/g
let match
const results = { mx: [], cr: [], do: [], br: [], cl: [] }

while ((match = itemRegex.exec(xml)) !== null) {
  const block = match[1]
  const title = extractTag(block, 'title').replace(/&lt;[^&]*&gt;/g, '')
  const desc = extractTag(block, 'description')
  if (!title) continue

  const titleL = title.toLowerCase()
  const descL  = desc.toLowerCase()

  for (const code of ['mx', 'cr', 'do', 'br', 'cl']) {
    const inTitle = COUNTRY_KW[code].find(kw => titleL.includes(kw))
    const inDesc  = COUNTRY_KW[code].find(kw => descL.includes(kw))

    if (inTitle) {
      results[code].push({ title, type: 'DIRECTO-TÍTULO', kw: inTitle, desc: desc.slice(0, 130) })
    } else if (inDesc) {
      const titleIsRegional = REGIONAL_TITLE_KW[code].find(kw => titleL.includes(kw))
      results[code].push({ title, type: titleIsRegional ? 'REGIONAL-CONFIRMADO' : 'DIRECTO-DESC', kw: inDesc, desc: desc.slice(0, 130) })
    }
    // else: ignorado
  }
}

const names = { mx: 'México', cr: 'Costa Rica', do: 'R. Dominicana', br: 'Brasil', cl: 'Chile' }
for (const [code, items] of Object.entries(results)) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`${names[code]} (${items.length} alertas con nueva lógica)`)
  console.log('='.repeat(60))
  if (items.length === 0) {
    console.log('  (sin alertas)')
  } else {
    items.forEach(i => {
      console.log(`  [${i.type} - "${i.kw}"] ${i.title}`)
      console.log(`    ${i.desc.slice(0, 120)}`)
      console.log()
    })
  }
}
