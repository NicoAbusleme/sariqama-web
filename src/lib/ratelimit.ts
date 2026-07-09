import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// 5 intentos por IP en ventana deslizante de 15 minutos
export const loginRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  analytics: false,
  prefix: 'sariqama:login',
})
