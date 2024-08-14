import { MessageType } from '@adiwajshing/baileys'

// Comando para enviar el menú con botones
const handler = async (m, { conn }) => {
  try {
    // Configuración de los botones
    const listSections = [
      {
        title: 'Opciones de Menú',
        rows: [
          { title: '📚 MENÚ COMPLETO', description: 'Muestra todos los comandos disponibles.', id: 'allmenu' },
          { title: '🤖 SUD BOT', description: 'Conviértete en SudBot.', id: 'serbot' },
          { title: '🎮 JUEGOS', description: 'Opciones de juegos disponibles.', id: 'game' },
          { title: '🛠️ HERRAMIENTAS', description: 'Herramientas disponibles para el uso.', id: 'tools' },
        ]
      }
    ]

    // Enviar el mensaje con botones
    await conn.sendList(
      m.chat,
      'Elige una opción del menú:',
      'Texto del Mensaje',
      'Descripción del Mensaje',
      listSections,
      m
    )
  } catch (e) {
    console.error('Error al enviar el mensaje con botones:', e)
    m.reply('Ocurrió un error al enviar el mensaje.')
  }
}

// Manejo de las respuestas a los botones
const handleButtonResponses = async (m, { conn }) => {
  try {
    if (m.message && m.message.buttonsResponseMessage) {
      const buttonId = m.message.buttonsResponseMessage.selectedButtonId

      switch (buttonId) {
        case 'allmenu':
          await conn.sendMessage(m.chat, 'Has seleccionado el Menú Completo', MessageType.text)
          break
        case 'serbot':
          await conn.sendMessage(m.chat, 'Has seleccionado SudBot', MessageType.text)
          break
        case 'game':
          await conn.sendMessage(m.chat, 'Has seleccionado Juegos', MessageType.text)
          break
        case 'tools':
          await conn.sendMessage(m.chat, 'Has seleccionado Herramientas', MessageType.text)
          break
        default:
          await conn.sendMessage(m.chat, 'Opción no reconocida', MessageType.text)
      }
    }
  } catch (e) {
    console.error('Error al manejar la respuesta del botón:', e)
  }
}

// Comando para invocar el menú
handler.help = ['menu']
handler.tags = ['main']
handler.command = /^(menu7)$/i

// Exportar el handler
export default async (m, { conn }) => {
  if (m.message && m.message.conversation === '!menu7') {
    await handler(m, { conn })
  }
  await handleButtonResponses(m, { conn })
}
