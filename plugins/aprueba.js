import { MessageType, Mimetype } from '@adiwajshing/baileys'
import fetch from 'node-fetch'
import { promises as fs } from 'fs'
import path from 'path'

const handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    // Definir el texto del mensaje
    const text = '¡Hola! Aquí tienes algunas opciones para interactuar con el bot:'
    
    // Crear los botones interactivos
    const buttons = [
      { buttonId: '.option1', buttonText: { displayText: 'Opción 1' }, type: 1 },
      { buttonId: '.option2', buttonText: { displayText: 'Opción 2' }, type: 1 },
      { buttonId: '.option3', buttonText: { displayText: 'Opción 3' }, type: 1 }
    ]
    
    const buttonMessage = {
      text,
      footer: 'Selecciona una opción:',
      buttons,
      headerType: 1
    }
    
    // Enviar el mensaje con botones
    await conn.sendMessage(m.chat, buttonMessage, MessageType.buttonsMessage)
    
  } catch (e) {
    m.reply('Ocurrió un error')
    console.error(e)
  }
}

handler.help = ['aprueba']
handler.tags = ['main']
handler.command = /^(aprueba|approve)$/i

export default handler
