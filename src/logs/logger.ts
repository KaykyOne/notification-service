import pino from 'pino'

export const logger = pino(
  pino.destination({
    dest: './src/logs/logs.log',
    mkdir: true,
    sync: false
  })
)