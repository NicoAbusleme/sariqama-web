import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

// 5 intentos por IP en ventana deslizante de 15 minutos
export const loginRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  analytics: false,
  prefix: 'sariqama:login',
})

// 5 registros por IP en ventana fija de 1 hora — evita creación masiva de cuentas
export const registroRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(5, '1 h'),
  analytics: false,
  prefix: 'sariqama:registro',
})
