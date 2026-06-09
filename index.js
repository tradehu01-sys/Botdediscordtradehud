const { Client, GatewayIntentBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, Events, MessageFlags } = require("discord.js");
const express = require('express');

const TOKEN = process.env.TOKEN;
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

// ID del canal #open-ticket en inglés (cámbialo por el tuyo si es necesario)
const TEST_CHANNEL_ID = "1492385603269038220";

client.once(Events.ClientReady, async () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
  
  try {
    const channel = await client.channels.fetch(TEST_CHANNEL_ID);
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("test_button").setLabel("TEST").setStyle(ButtonStyle.Primary)
    );
    await channel.send({ content: "🔘 Botón de prueba - Haz clic para verificar si el bot responde.", components: [row] });
    console.log("✅ Mensaje de prueba enviado al canal.");
  } catch (error) {
    console.error("❌ Error al enviar mensaje de prueba:", error);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  console.log(`📥 Interacción recibida: tipo=${interaction.type}, customId=${interaction.customId}`);
  
  if (interaction.isButton() && interaction.customId === "test_button") {
    try {
      await interaction.reply({ content: "✅ ¡El bot funciona correctamente! El botón responde.", flags: MessageFlags.Ephemeral });
      console.log("✅ Respuesta enviada al botón.");
    } catch (error) {
      console.error("❌ Error al responder al botón:", error);
    }
  }
});

// Servidor web para keep-alive
const app = express();
app.get('/', (req, res) => res.send('Bot activo'));
app.get('/ping', (req, res) => res.send('pong'));
app.listen(process.env.PORT || 10000, () => {
  console.log(`✅ Servidor web escuchando en puerto ${process.env.PORT || 10000}`);
});

client.login(TOKEN);
