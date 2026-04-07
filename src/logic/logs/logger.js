import pino from 'pino'

export const logger = pino(
  pino.destination({
    dest: './src/logic/logs/logs.log',
    mkdir: true,
    sync: false
  })
)