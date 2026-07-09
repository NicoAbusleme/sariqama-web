import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12   // 96 bits — recomendado para GCM
const TAG_LENGTH = 16  // 128 bits

function getKey(): Buffer {
  const hex = process.env.ENCRYPTION_KEY
  if (!hex || hex.length !== 64) {
    throw new Error('ENCRYPTION_KEY debe ser una cadena hexadecimal de 64 caracteres (32 bytes)')
  }
  return Buffer.from(hex, 'hex')
}

function looksEncrypted(value: string): boolean {
  const parts = value.split(':')
  if (parts.length !== 3) return false
  try {
    const iv  = Buffer.from(parts[0], 'base64')
    const tag = Buffer.from(parts[1], 'base64')
    return iv.length === IV_LENGTH && tag.length === TAG_LENGTH
  } catch {
    return false
  }
}

// Cifra un string con AES-256-GCM.
// Retorna "base64(iv):base64(authTag):base64(ciphertext)"
export function encrypt(plaintext: string): string {
  const key = getKey()
  const iv  = randomBytes(IV_LENGTH)
  const cipher = createCipheriv(ALGORITHM, key, iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted.toString('base64')}`
}

// Descifra un string producido por encrypt().
// Si el valor no parece cifrado (datos legacy o null) lo devuelve intacto.
export function decrypt(value: string | null | undefined): string | null {
  if (!value) return value ?? null
  if (!looksEncrypted(value)) return value
  try {
    const key = getKey()
    const [ivB64, tagB64, dataB64] = value.split(':')
    const iv        = Buffer.from(ivB64,  'base64')
    const authTag   = Buffer.from(tagB64, 'base64')
    const encrypted = Buffer.from(dataB64, 'base64')
    const decipher  = createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(authTag)
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
    return decrypted.toString('utf8')
  } catch {
    // Datos corruptos o clave incorrecta — devolver intacto
    return value
  }
}

// Cifra un array como JSON serializado almacenado en un solo elemento.
// Compatibilidad hacia atrás: arrays con más de 1 elemento son datos legacy.
export function encryptArray(arr: string[] | null | undefined): string[] | null {
  if (!arr?.length) return arr ?? null
  return [encrypt(JSON.stringify(arr))]
}

// Descifra un array producido por encryptArray().
// Si el array tiene más de 1 elemento se asume dato legacy y se devuelve intacto.
export function decryptArray(arr: string[] | null | undefined): string[] | null {
  if (!arr) return null
  if (!arr.length) return arr
  if (arr.length === 1 && looksEncrypted(arr[0])) {
    try {
      const json = decrypt(arr[0])
      const parsed = JSON.parse(json!)
      if (Array.isArray(parsed)) return parsed
    } catch {}
  }
  return arr // legacy sin cifrado
}

// Helpers tipados para filas de Supabase ─────────────────────────────────────

type RawViajero = {
  condiciones?:            string[] | null
  inmunosupresion_tipo?:   string | null
  vih_carga_viral?:        string | null
  embarazo_fum?:           string | null
  alergia_tipos?:          string[] | null
  alergia_farmacos_cuales?: string | null
  sexo?:                   string | null
  genero?:                 string | null
  [key: string]: unknown
}

export function decryptViajero<T extends RawViajero>(v: T): T {
  return {
    ...v,
    condiciones:             decryptArray(v.condiciones),
    inmunosupresion_tipo:    decrypt(v.inmunosupresion_tipo),
    vih_carga_viral:         decrypt(v.vih_carga_viral),
    embarazo_fum:            decrypt(v.embarazo_fum),
    alergia_tipos:           decryptArray(v.alergia_tipos),
    alergia_farmacos_cuales: decrypt(v.alergia_farmacos_cuales),
    sexo:                    decrypt(v.sexo),
    genero:                  decrypt(v.genero),
  }
}

type RawSintoma = {
  sintomas?: string[] | null
  semaforo?: string | null
  [key: string]: unknown
}

export function decryptSintoma<T extends RawSintoma>(s: T): T {
  return {
    ...s,
    sintomas: decryptArray(s.sintomas),
    semaforo: decrypt(s.semaforo),
  }
}
