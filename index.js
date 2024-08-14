console.log('✯ Iniciando ✯')

import { dirname, join } from 'path'
import { createRequire } from 'module';
import { fileURLToPath } from 'url'
import { setupMaster, fork } from 'cluster'
import { watchFile, unwatchFile } from 'fs'
import cfonts from 'cfonts';
import { createInterface } from 'readline'
import yargs from 'yargs'
import express from 'express'
import chalk from 'chalk'
import path from 'path'
import os from 'os'
import { promises as fsPromises } from 'fs'
import pkg from '@whiskeysockets/baileys'  // Importación por defecto de CommonJS
const { WAConnection } = pkg  // Extracción de WAConnection desde el paquete

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(__dirname)
const { say } = cfonts
const rl = createInterface(process.stdin, process.stdout)

const app = express()
const port = process.env.PORT || 8080;

say('Sumi\nSakurasawa', {
  font: 'chrome',
  align: 'center',
  gradient: ['red', 'magenta']
})

var isRunning = false

async function start() {
  if (isRunning) return;
  isRunning = true;

  const args = [join(__dirname, 'index.js'), ...process.argv.slice(2)];
  say([process.argv[0], ...args].join(' '), {
    font: 'console',
    align: 'center',
    gradient: ['red', 'magenta']
  });

  setupMaster({
    exec: args[0],
    args: args.slice(1),
  });

  let p = fork();
  p.on('message', data => {
    console.log('[RECEIVED]', data);
    switch (data) {
      case 'reset':
        p.process.kill();
        isRunning = false;
        start();
        break;
      case 'uptime':
        p.send(process.uptime());
        break;
    }
  });

  p.on('exit', (_, code) => {
    isRunning = false;
    console.error('Ocurrió un error inesperado:', code)
    start();

    if (code === 0) return;
    watchFile(args[0], () => {
      unwatchFile(args[0]);
      start();
    });
  });

  let opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
  if (!opts['test'])
    if (!rl.listenerCount()) rl.on('line', line => {
      p.emit('message', line.trim());
    });
}

// Inicialización del bot y conexión
async function initializeBot() {
  const conn = new WAConnection()

  conn.on('open', () => {
    console.log('Conectado a WhatsApp')
  })

  conn.on('chat-update', async (chatUpdate) => {
    if (!chatUpdate.hasNewMessage) return
    const message = chatUpdate.messages.all()[0]
    if (!message.message) return

    // Aquí se maneja el comando de botones
    if (message.message.conversation === '!menu') {
      const buttons = [
        {
          buttonId: 'id1',
          buttonText: { displayText: 'Opción 1' },
          type: 1
        },
        {
          buttonId: 'id2',
          buttonText: { displayText: 'Opción 2' },
          type: 1
        }
      ]

      const buttonMessage = {
        contentText: 'Elige una opción:',
        footerText: 'Menú de Opciones',
        buttons: buttons,
        headerType: 1
      }

      await conn.sendMessage(message.key.remoteJid, buttonMessage, 'buttonsMessage')
    } else if (message.message.buttonsResponseMessage) {
      const response = message.message.buttonsResponseMessage.selectedButtonId
      if (response === 'id1') {
        await conn.sendMessage(message.key.remoteJid, { text: 'Elegiste Opción 1' })
      } else if (response === 'id2') {
        await conn.sendMessage(message.key.remoteJid, { text: 'Elegiste Opción 2' })
      }
    }
  })

  await conn.connect()
}

start().then(() => {
  initializeBot().catch(console.error)
})

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`)
})
