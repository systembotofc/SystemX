let handler = async (m, { conn, text, participants}) => {
let users = participants.map(u => u.id).filter(v => v !== conn.user.jid)
if (!m.quoted) return m.reply(`> ✅𝑹𝒆𝒔𝒑𝒐𝒏𝒅𝒆 𝒂 𝒖𝒏 𝒎𝒆𝒏𝒔𝒂𝒋𝒆 𝒄𝒐𝒏 𝒆𝒍 𝒄𝒐𝒎𝒂𝒏𝒅𝒐 .𝒕𝒂𝒈`)
conn.sendMessage(m.chat, { forward: m.quoted.fakeObj, mentions: users } )
}
handler.help = ['tag']
handler.tags = ['group']
handler.command = /^(totag|tag)$/i
handler.admin = true
handler.group = true

export default handler
