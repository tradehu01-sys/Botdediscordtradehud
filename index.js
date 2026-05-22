
const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  PermissionsBitField,
  Collection,
  REST,
  Routes,
  MessageFlags,
} = require("discord.js");
const fs = require('fs');
const path = require('path');

/* ================= CONFIGURACIÓN ================= */
const TOKEN = process.env.TOKEN;
const CLIENT_ID = "1487907790776303788";

// CANALES
const ID_CANAL_TASAS_ES = "1484487858697015296";
const ID_CANAL_TASAS_EN = "1488724030948118658";
const ID_CANAL_LOGS = "ID_DEL_CANAL_DE_LOGS";

const ID_CANAL_TICKET_ES = "1492311657752559616";
const ID_CANAL_TICKET_EN = "1492385603269038220";
const ID_CANAL_REDES_1 = "1486845340052361347";
const ID_CANAL_REDES_2 = "1488753637583884369";

const LINKS = {
  youtube: "https://www.youtube.com/channel/UCJvhSvnlYs8pKYx3lwy4p2g",
  tiktok: "https://www.tiktok.com/@tradehubmmoprg",
  facebook: "https://www.facebook.com/profile.php?id=61582836070089",
  instagram: "https://www.instagram.com/tradehubmmoprg/"
};

const EMOJIS = {
  facebook: "<:facebook32:1492281168870117446>",
  tiktok: "<:png_tiktok_6555637:1492285019526271017>",
  youtube: "<:yt_logo_rgb:1492285045270904983>",
  instagram: "<:instagram:1492285104842735878>"
};

const REDES_IMAGE_URL = "https://cdn.discordapp.com/attachments/1483674322580144259/1491662777566367754/Mono_gamer_en_un_mundo_vibrante.png";
const ID_CATEGORIA_TICKETS = "1427258178583924840";
const ID_ROL_SOPORTE = "1487936239293300801";
const LOGO_URL = "https://cdn.discordapp.com/attachments/1486937604841803796/1488034123414245416/4jsn5a2.png";

const PRICES_FILE_ES = path.join(__dirname, 'prices.json');
const BUTTONS_FILE_ES = path.join(__dirname, 'buttons.json');
const PRICES_FILE_EN = path.join(__dirname, 'prices_en.json');
const BUTTONS_FILE_EN = path.join(__dirname, 'buttons_en.json');

// ========== FUNCIONES ==========
function loadPrices(lang) {
  const file = lang === "en" ? PRICES_FILE_EN : PRICES_FILE_ES;
  try {
    if (fs.existsSync(file)) {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      console.log(`✅ Cargado ${file}`);
      return data;
    }
  } catch (error) { console.error("Error loading prices:", error); }
  return null;
}

function loadButtons(lang) {
  const file = lang === "en" ? BUTTONS_FILE_EN : BUTTONS_FILE_ES;
  try {
    if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {}
  return null;
}

let pricesES = loadPrices("es");
let buttonsES = loadButtons("es");
let pricesEN = loadPrices("en");
let buttonsEN = loadButtons("en");

if (!pricesES) {
  console.log("⚠️ prices.json no encontrado, creando estructura básica...");
  pricesES = {};
  fs.writeFileSync(PRICES_FILE_ES, JSON.stringify({}, null, 2));
}
if (!pricesEN) {
  pricesEN = {};
  fs.writeFileSync(PRICES_FILE_EN, JSON.stringify({}, null, 2));
}
if (!buttonsES) buttonsES = {};
if (!buttonsEN) buttonsEN = {};

function buildData(lang) {
  const prices = lang === "en" ? pricesEN : pricesES;
  const isEN = lang === "en";
  
  const gamesWithServers = ["tbc", "albion", "lineage2", "warmane", "aion", "aion2", "warbone", "mir4", "diablo2", "osrs", "lawl", "epoch", "ascension", "wowRetailUS", "wowRetailEU", "odin", "dofus", "quinfall", "throne", "torchlight", "poe1", "poe2", "flyff", "rubinot", "tibia"];
  
  const result = {};
  
  for (const game of gamesWithServers) {
    if (prices[game] && prices[game].servers) {
      result[game] = {
        title: getGameTitle(game, isEN),
        servers: Object.entries(prices[game].servers).map(([label, d]) => ({
          label, value: `${game}_${label.toLowerCase().replace(/\s/g, '_')}`, c: d.c, v: d.v, qty: d.qty
        }))
      };
    }
  }
  
  result.streaming = { title: isEN ? "📺 STREAMING SERVICES" : "📺 SERVICIOS DE STREAMING", items: prices.streaming || {} };
  result.giftcards = { title: isEN ? "🎁 GIFT CARDS" : "🎁 TARJETAS", items: prices.giftcards || {} };
  result.p2p = { title: isEN ? "💳 P2P (Zinli / PayPal / Bolívares)" : "💳 P2P (Zinli / PayPal / Bolívares)", categories: prices.p2p || {} };
  result.boosting = { title: isEN ? "🚀 TRADEHUB | BOOSTING SERVICE" : "🚀 TRADEHUB | SERVICIO BOOSTING", games: prices.boosting?.games ? Object.keys(prices.boosting.games) : [] };
  result.wow_gt = { title: isEN ? "🕒 WoW Game Time" : "🕒 WoW Tiempo Juego", price: prices.wow_gt?.price || "28$" };
  
  return result;
}

function getGameTitle(game, isEN) {
  const titles = {
    tbc: isEN ? "🛡️ TradeHub | 20th Anniversary TBC" : "🛡️ TradeHub | 20 Aniversario TBC",
    albion: "🛡️ TradeHub | Albion Online",
    lineage2: "🛡️ TradeHub | Lineage 2 Reborn",
    warmane: "⚔️ Warmane",
    aion: "🌟 Aion",
    aion2: "🌟 Aion 2 (TW)",
    warbone: "⚔️ Warbone Above Ashes",
    mir4: "🎮 Mir4",
    diablo2: "👹 Diablo 2 Resurrected",
    osrs: "🎮 Old School RuneScape",
    lawl: "🐺 Lawl",
    epoch: "🌍 Wow Project Epoch",
    ascension: "⚡ Ascensión",
    wowRetailUS: "🇺🇸 WoW Retail US",
    wowRetailEU: "🇪🇺 WoW Retail EU",
    odin: "⚡ ODIN: Valhalla Rising",
    dofus: "🐉 Dofus Kamas",
    quinfall: "🏰 The Quinfall",
    throne: "👑 Throne and Liberty",
    torchlight: "🔦 Torchlight Infinite",
    poe1: "🌀 Path of Exile 1",
    poe2: "🌀 Path of Exile 2",
    flyff: "🪽 Flyff Universe",
    rubinot: "💰 Rubinot",
    tibia: "⚔️ Tibia"
  };
  return titles[game] || game;
}

let dataES = buildData("es");
let dataEN = buildData("en");

function isButtonActive(lang, game, server, type) {
  const btns = lang === "en" ? buttonsEN : buttonsES;
  if (game === "streaming") return btns.streaming?.buy !== false;
  if (game === "wow_gt") return btns.wow_gt?.buy !== false;
  if (game === "boosting") return btns.boosting?.active !== false;
  if (game === "giftcards") return btns.giftcards?.buy !== false;
  if (game === "p2p") return btns.p2p?.buy !== false;
  
  const gameButtons = btns[game];
  if (!gameButtons) return true;
  const serverButtons = gameButtons[server];
  if (!serverButtons) return true;
  if (type === "buy") return serverButtons.buy !== false;
  if (type === "sell") return serverButtons.sell !== false;
  return true;
}

function getButtonStatus(lang, game, server) {
  const btns = lang === "en" ? buttonsEN : buttonsES;
  const isEN = lang === "en";
  if (game === "streaming") return btns.streaming?.buy === false ? (isEN ? "❌ NOT AVAILABLE" : "❌ NO DISPONIBLE") : (isEN ? "✅ AVAILABLE" : "✅ DISPONIBLE");
  if (game === "wow_gt") return btns.wow_gt?.buy === false ? (isEN ? "❌ NOT AVAILABLE" : "❌ NO DISPONIBLE") : (isEN ? "✅ AVAILABLE" : "✅ DISPONIBLE");
  if (game === "boosting") return btns.boosting?.active === false ? (isEN ? "❌ SERVICE UNAVAILABLE" : "❌ SERVICIO NO DISPONIBLE") : (isEN ? "✅ SERVICE AVAILABLE" : "✅ SERVICIO DISPONIBLE");
  if (game === "giftcards") return btns.giftcards?.buy === false ? (isEN ? "❌ NOT AVAILABLE" : "❌ NO DISPONIBLE") : (isEN ? "✅ AVAILABLE" : "✅ DISPONIBLE");
  if (game === "p2p") return btns.p2p?.buy === false ? (isEN ? "❌ NOT AVAILABLE" : "❌ NO DISPONIBLE") : (isEN ? "✅ AVAILABLE" : "✅ DISPONIBLE");
  
  const gameButtons = btns[game];
  if (!gameButtons) return isEN ? "✅ BOTH AVAILABLE" : "✅ AMBOS DISPONIBLES";
  const serverButtons = gameButtons[server];
  if (!serverButtons) return isEN ? "✅ BOTH AVAILABLE" : "✅ AMBOS DISPONIBLES";
  let status = [];
  if (serverButtons.buy === false) status.push(isEN ? "❌ WE SELL UNAVAILABLE" : "❌ VENDEMOS NO DISPONIBLE");
  if (serverButtons.sell === false) status.push(isEN ? "❌ WE BUY UNAVAILABLE" : "❌ COMPRAMOS NO DISPONIBLE");
  return status.length > 0 ? status.join(" | ") : (isEN ? "✅ WE SELL & WE BUY AVAILABLE" : "✅ VENDEMOS & COMPRAMOS DISPONIBLES");
}

function reloadData(lang) {
  if (lang === "en") {
    const newPrices = loadPrices("en");
    if (newPrices) { pricesEN = newPrices; dataEN = buildData("en"); }
    return newPrices;
  } else {
    const newPrices = loadPrices("es");
    if (newPrices) { pricesES = newPrices; dataES = buildData("es"); }
    return newPrices;
  }
}

const METODOS_RESUMIDOS_ES = `\n━━━━━━━━━━━━━━━━━━\n**💳 MÉTODOS DE PAGO**\n\n**Criptomonedas & Stablecoins**\n• Binance PAY | Red TRC20 (USDT) | Red BEP20 (USDT/BNB)\n\n**Billeteras Digitales (USD)**\n• PayPal | Zinli\n━━━━━━━━━━━━━━━━━━`;
const METODOS_RESUMIDOS_EN = `\n━━━━━━━━━━━━━━━━━━\n**💳 PAYMENT METHODS**\n\n**Cryptocurrencies & Stablecoins**\n• Binance PAY | TRC20 (USDT) | BEP20 (USDT/BNB)\n\n**Digital Wallets (USD)**\n• PayPal | Zinli\n━━━━━━━━━━━━━━━━━━`;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
const userTimeouts = new Collection();
const menuMessages = new Collection();
const categoryTimeouts = new Collection();
const ticketTimeouts = new Collection();

let originalTicketMessageES = null;
let originalTicketMessageEN = null;

async function sendTempMessage(interaction, content, seconds = 5) {
  try {
    let message;
    if (!interaction.replied && !interaction.deferred) {
      message = await interaction.reply({ content, flags: MessageFlags.Ephemeral, fetchReply: true });
    } else {
      message = await interaction.followUp({ content, flags: MessageFlags.Ephemeral, fetchReply: true });
    }
    setTimeout(() => message.delete().catch(() => {}), seconds * 1000);
    return message;
  } catch (error) {
    console.error("Error en sendTempMessage:", error);
    return null;
  }
}

// ========== FUNCIONES DE REINICIO ==========

// Reinicio para menú de precios
function scheduleReset(interaction, messageId, lang) {
  if (userTimeouts.has(interaction.user.id)) clearTimeout(userTimeouts.get(interaction.user.id));
  const timeout = setTimeout(async () => {
    try {
      const channel = await client.channels.fetch(interaction.channelId);
      const msg = await channel.messages.fetch(messageId).catch(() => null);
      if (msg && msg.editable) {
        await msg.edit({ 
          embeds: [getMainEmbed(lang)], 
          components: [getMainMenu(lang)] 
        });
      }
      userTimeouts.delete(interaction.user.id);
    } catch (e) {
      console.error("Error en scheduleReset:", e);
    }
  }, 20000);
  userTimeouts.set(interaction.user.id, timeout);
}

function scheduleCategoryReset(interaction, messageId, lang) {
  if (categoryTimeouts.has(interaction.user.id)) clearTimeout(categoryTimeouts.get(interaction.user.id));
  const timeout = setTimeout(async () => {
    try {
      const channel = await client.channels.fetch(interaction.channelId);
      const msg = await channel.messages.fetch(messageId).catch(() => null);
      if (msg && msg.editable) {
        await msg.edit({ 
          embeds: [getMainEmbed(lang)], 
          components: [getMainMenu(lang)] 
        });
      }
      categoryTimeouts.delete(interaction.user.id);
    } catch (e) {
      console.error("Error en scheduleCategoryReset:", e);
    }
  }, 20000);
  categoryTimeouts.set(interaction.user.id, timeout);
}

// Reinicio para menú de tickets (vuelve al botón de abrir ticket)
function scheduleTicketReset(interaction, messageId, lang) {
  if (ticketTimeouts.has(interaction.user.id)) clearTimeout(ticketTimeouts.get(interaction.user.id));
  const timeout = setTimeout(async () => {
    try {
      const channel = await client.channels.fetch(interaction.channelId);
      const msg = await channel.messages.fetch(messageId).catch(() => null);
      if (msg && msg.editable) {
        await msg.edit({ 
          embeds: [getTicketEmbed(lang)], 
          components: [getTicketButton(lang)] 
        });
      }
      ticketTimeouts.delete(interaction.user.id);
    } catch (e) {
      console.error("Error en scheduleTicketReset:", e);
    }
  }, 20000);
  ticketTimeouts.set(interaction.user.id, timeout);
}

function cancelCategoryReset(userId) { if (categoryTimeouts.has(userId)) { clearTimeout(categoryTimeouts.get(userId)); categoryTimeouts.delete(userId); } }
function cancelReset(userId) { if (userTimeouts.has(userId)) { clearTimeout(userTimeouts.get(userId)); userTimeouts.delete(userId); } }
function cancelTicketReset(userId) { if (ticketTimeouts.has(userId)) { clearTimeout(ticketTimeouts.get(userId)); ticketTimeouts.delete(userId); } }

function getMainEmbed(lang) {
  const isEN = lang === "en";
  return new EmbedBuilder()
    .setTitle(isEN ? "🛡️ WELCOME TO TRADEHUB MMORPG" : "🛡️ BIENVENIDO A TRADEHUB MMORPG")
    .setDescription(isEN ? `Hello! Thank you for trusting us with your transactions.\n\n📍 **How does it work?**\n1️⃣ Select a category from the menu below\n2️⃣ Check the updated rates\n3️⃣ Click the corresponding button to fill out the form and a ticket will open automatically\n\n24/7 immediate attention! ⚡\n${METODOS_RESUMIDOS_EN}` : `¡Hola! Gracias por confiar en nosotros para tus transacciones.\n\n📍 **¿Cómo funciona?**\n1️⃣ Selecciona una categoría en el menú de abajo\n2️⃣ Consulta las tasas actualizadas\n3️⃣ Haz clic en el botón correspondiente para completar el formulario y se abrirá automáticamente un ticket\n\n¡Atención inmediata 24/7! ⚡\n${METODOS_RESUMIDOS_ES}`)
    .setColor(0x000000).setImage(LOGO_URL);
}

function getMainMenu(lang) {
  const isEN = lang === "en";
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(`main_menu_${lang}`)
      .setPlaceholder(isEN ? "--- SELECT A CATEGORY ---" : "--- SELECCIONA UNA CATEGORÍA ---")
      .addOptions([
        { label: isEN ? "🛒 MARKETPLACE" : "🛒 MARKETPLACE", value: "marketplace", emoji: "🛒" },
        { label: isEN ? "🚀 BOOSTING" : "🚀 BOOSTING", value: "boosting", emoji: "🚀" },
        { label: isEN ? "🎁 GIFT CARDS" : "🎁 GIFT CARDS", value: "giftcards", emoji: "🎁" },
        { label: isEN ? "💳 P2P" : "💳 P2P", value: "p2p", emoji: "💳" },
        { label: isEN ? "📺 STREAMING" : "📺 STREAMING", value: "streaming", emoji: "📺" },
        { label: isEN ? "🕒 WOW GAME TIME" : "🕒 WOW GAME TIME", value: "wow_gt", emoji: "🕒" }
      ]),
  );
}

function getMarketplaceMenu(lang) {
  const isEN = lang === "en";
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(`marketplace_menu_${lang}`)
      .setPlaceholder(isEN ? "--- SELECT A GAME ---" : "--- SELECCIONA UN JUEGO ---")
      .addOptions([
        { label: isEN ? "20th Anniversary TBC" : "20 Aniversario TBC", value: "tbc", emoji: "❄️" },
        { label: "Albion Online", value: "albion", emoji: "⚔️" },
        { label: "Lineage 2 Reborn", value: "lineage2", emoji: "🏆" },
        { label: "Warmane", value: "warmane", emoji: "⚔️" },
        { label: "Aion", value: "aion", emoji: "🌟" },
        { label: "Aion 2 (TW)", value: "aion2", emoji: "🌟" },
        { label: "Warbone Above Ashes", value: "warbone", emoji: "⚔️" },
        { label: "Mir4", value: "mir4", emoji: "🎮" },
        { label: "Diablo 2 / OSRS / Lawl", value: "rpg_group", emoji: "🎮" },
        { label: "Epoch / Ascensión", value: "wow_group", emoji: "🌍" },
        { label: "WoW Retail US/EU", value: "wow_retail_group", emoji: "🇺🇸" },
        { label: "ODIN / Dofus / Quinfall", value: "mmo_group1", emoji: "⚡" },
        { label: "Throne / Torchlight / PoE", value: "mmo_group2", emoji: "👑" },
        { label: "Flyff / Rubinot / Tibia", value: "mmo_group3", emoji: "🪽" }
      ]),
  );
}

function getStreamingServicesMenu(lang) {
  const isEN = lang === "en";
  const data = lang === "en" ? dataEN : dataES;
  const services = Object.keys(data.streaming.items || {});
  if (services.length === 0) return new ActionRowBuilder();
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(`streaming_services_menu_${lang}`)
      .setPlaceholder(isEN ? "--- SELECT A SERVICE ---" : "--- SELECCIONA UN SERVICIO ---")
      .addOptions(services.map(service => ({ label: service, value: `streaming_${service.toLowerCase().replace(/[^a-z0-9]/g, '_')}`, emoji: "📺" })))
  );
}

function getGiftCardsMenu(lang) {
  const isEN = lang === "en";
  const data = lang === "en" ? dataEN : dataES;
  const cards = Object.keys(data.giftcards.items || {});
  if (cards.length === 0) return new ActionRowBuilder();
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(`giftcards_menu_${lang}`)
      .setPlaceholder(isEN ? "--- SELECT A GIFT CARD ---" : "--- SELECCIONA UNA TARJETA ---")
      .addOptions(cards.map(card => ({ label: card.length > 100 ? card.substring(0, 97) + "..." : card, value: `giftcard_${card.substring(0, 50).replace(/[^a-zA-Z0-9]/g, '_')}`, emoji: "🎁" })))
  );
}

function getP2PCategoriesMenu(lang) {
  const isEN = lang === "en";
  const data = lang === "en" ? dataEN : dataES;
  const categories = Object.keys(data.p2p.categories || {});
  if (categories.length === 0) return new ActionRowBuilder();
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(`p2p_categories_menu_${lang}`)
      .setPlaceholder(isEN ? "--- SELECT A METHOD ---" : "--- SELECCIONA UN MÉTODO ---")
      .addOptions(categories.map(cat => {
        let label = cat;
        if (cat === "ZINLI") label = "Zinli";
        if (cat === "PAYPAL") label = "PayPal";
        if (cat === "BOLIVARES_TO_USDT") label = "Bolívares → USDT";
        if (cat === "USDT_TO_BOLIVARES") label = "USDT → Bolívares";
        return { label, value: `p2p_${cat.toLowerCase()}`, emoji: "💳" };
      }))
  );
}

function getSubMenu(options, customId, placeholder, lang) {
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(customId)
      .setPlaceholder(placeholder)
      .addOptions(options.map(opt => ({ label: opt.label, value: opt.value, emoji: opt.emoji })))
  );
}

async function showStreamingService(interaction, lang, serviceName) {
  const isEN = lang === "en";
  const data = lang === "en" ? dataEN : dataES;
  const service = data.streaming.items?.[serviceName];
  if (!service) return;
  
  const planList = Object.entries(service).map(([plan, price]) => `🎬 **${plan}:** ${price}`).join("\n");
  const embed = new EmbedBuilder()
    .setTitle(`📺 ${serviceName}`)
    .setDescription(`${planList}\n\n${isEN ? "Click WE SELL to purchase" : "Haz clic en VENDEMOS para comprar"}\n${isEN ? METODOS_RESUMIDOS_EN : METODOS_RESUMIDOS_ES}`)
    .setColor(0x5865F2);
  
  await interaction.update({ 
    embeds: [embed], 
    components: [new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`buy_streaming_${serviceName}_${lang}`).setLabel(isEN ? "🟢 WE SELL" : "🟢 VENDEMOS").setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId(`back_streaming_${lang}`).setLabel(isEN ? "⬅️ BACK" : "⬅️ VOLVER").setStyle(ButtonStyle.Secondary)
    )] 
  });
}

async function showGiftCard(interaction, lang, cardName) {
  const isEN = lang === "en";
  const data = lang === "en" ? dataEN : dataES;
  const card = data.giftcards.items?.[cardName];
  if (!card) return;
  
  const amountList = Object.entries(card).map(([amount, price]) => `💵 **${amount}:** ${price}`).join("\n");
  const embed = new EmbedBuilder()
    .setTitle(`🎁 ${cardName}`)
    .setDescription(`${amountList}\n\n${isEN ? "Click WE SELL to purchase" : "Haz clic en VENDEMOS para comprar"}\n${isEN ? METODOS_RESUMIDOS_EN : METODOS_RESUMIDOS_ES}`)
    .setColor(0x5865F2);
  
  await interaction.update({ 
    embeds: [embed], 
    components: [new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`buy_giftcard_${cardName}_${lang}`).setLabel(isEN ? "🟢 WE SELL" : "🟢 VENDEMOS").setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId(`back_giftcards_${lang}`).setLabel(isEN ? "⬅️ BACK" : "⬅️ VOLVER").setStyle(ButtonStyle.Secondary)
    )] 
  });
}

async function showP2PCategory(interaction, lang, categoryName) {
  const isEN = lang === "en";
  const data = lang === "en" ? dataEN : dataES;
  
  let categoryKey = categoryName;
  let displayName = categoryName;
  
  if (categoryName === "Zinli") {
    categoryKey = "ZINLI";
    displayName = "Zinli";
  } else if (categoryName === "PayPal") {
    categoryKey = "PAYPAL";
    displayName = "PayPal";
  } else if (categoryName === "Bolívares → USDT") {
    categoryKey = "BOLIVARES_TO_USDT";
    displayName = "Bolívares → USDT";
  } else if (categoryName === "USDT → Bolívares") {
    categoryKey = "USDT_TO_BOLIVARES";
    displayName = "USDT → Bolívares";
  }
  
  const category = data.p2p.categories?.[categoryKey];
  if (!category) return;
  
  const itemsList = Object.entries(category).map(([item, price]) => `💵 **${item}:** ${price}`).join("\n");
  const embed = new EmbedBuilder()
    .setTitle(`💳 ${displayName}`)
    .setDescription(`${itemsList}\n\n${isEN ? "Click WE SELL to purchase" : "Haz clic en VENDEMOS para comprar"}\n${isEN ? METODOS_RESUMIDOS_EN : METODOS_RESUMIDOS_ES}`)
    .setColor(0x5865F2);
  
  let buyCustomId;
  if (categoryName === "Zinli") {
    buyCustomId = `buy_zinli_${lang}`;
  } else if (categoryName === "PayPal") {
    buyCustomId = `buy_paypal_${lang}`;
  } else if (categoryName === "Bolívares → USDT") {
    buyCustomId = `buy_bolivares_to_usdt_${lang}`;
  } else if (categoryName === "USDT → Bolívares") {
    buyCustomId = `buy_usdt_to_bolivares_${lang}`;
  } else {
    buyCustomId = `buy_p2p_${categoryKey.toLowerCase()}_${lang}`;
  }
  
  await interaction.update({ 
    embeds: [embed], 
    components: [new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(buyCustomId).setLabel(isEN ? "🟢 WE SELL" : "🟢 VENDEMOS").setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId(`back_p2p_${lang}`).setLabel(isEN ? "⬅️ BACK" : "⬅️ VOLVER").setStyle(ButtonStyle.Secondary)
    )] 
  });
}

// ========== FORMULARIOS ==========

// 1. Formulario para ORO (Marketplace)
async function showGoldForm(interaction, lang, gameName, serverName, tipo) {
  const isEN = lang === "en";
  const modal = new ModalBuilder()
    .setCustomId(`gold_form_${lang}`)
    .setTitle(isEN ? "💰 GOLD TRANSACTION" : "💰 TRANSACCIÓN DE ORO");
  
  modal.addComponents(
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("juego_servidor")
        .setLabel(isEN ? "🎮 Game & Server" : "🎮 Juego y Servidor")
        .setValue(`${gameName || ""} - ${serverName || ""}`)
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("cantidad")
        .setLabel(isEN ? "💰 Quantity" : "💰 Cantidad")
        .setPlaceholder(isEN ? "Ex: 500g, 10M" : "Ej: 500g, 10M")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("faccion_personaje")
        .setLabel(isEN ? "🏳️ Faction & Character" : "🏳️ Facción y Personaje")
        .setPlaceholder(isEN ? "Ex: Alliance - MyCharacter" : "Ej: Alianza - MiPersonaje")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("pago")
        .setLabel(isEN ? "💳 Payment Method" : "💳 Método de Pago")
        .setPlaceholder("Binance, PayPal, Zinli")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("descripcion")
        .setLabel(isEN ? "📝 Description" : "📝 Descripción")
        .setPlaceholder(isEN ? "Additional details" : "Detalles adicionales")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false)
    )
  );
  await interaction.showModal(modal);
}

// 2. Formulario para STREAMING
async function showStreamingPurchaseForm(interaction, lang, serviceName) {
  const isEN = lang === "en";
  const modal = new ModalBuilder()
    .setCustomId(`streaming_form_${lang}`)
    .setTitle(isEN ? `📺 ${serviceName}` : `📺 ${serviceName}`);
  
  modal.addComponents(
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("nombre")
        .setLabel(isEN ? "👤 Full Name" : "👤 Nombre de la persona")
        .setPlaceholder(isEN ? "Ex: Juan Perez" : "Ej: Juan Pérez")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("tipo_cuenta")
        .setLabel(isEN ? "📋 Account Type" : "📋 Tipo de cuenta")
        .setPlaceholder(isEN ? "Ex: 1 PROFILE / FULL ACCOUNT" : "Ej: 1 PERFIL / CUENTA COMPLETA")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("plan")
        .setLabel(isEN ? "📅 Plan (Monthly/Yearly)" : "📅 Plan (Mensual/Anual)")
        .setPlaceholder(isEN ? "Ex: 1 MONTH / 1 YEAR" : "Ej: 1 MES / 1 AÑO")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("descripcion")
        .setLabel(isEN ? "📝 Description" : "📝 Descripción")
        .setPlaceholder(isEN ? "Additional details" : "Detalles adicionales")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false)
    )
  );
  await interaction.showModal(modal);
}

// 3. Formulario para GIFT CARDS
async function showGiftCardPurchaseForm(interaction, lang, cardName) {
  const isEN = lang === "en";
  const modal = new ModalBuilder()
    .setCustomId(`giftcard_form_${lang}`)
    .setTitle(isEN ? `🎁 ${cardName}` : `🎁 ${cardName}`);
  
  modal.addComponents(
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("nombre")
        .setLabel(isEN ? "👤 Full Name" : "👤 Nombre de la persona")
        .setPlaceholder(isEN ? "Ex: Juan Perez" : "Ej: Juan Pérez")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("nombre_giftcard")
        .setLabel(isEN ? "🎁 Gift Card Name" : "🎁 Nombre de la Gift Card")
        .setValue(cardName)
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("monto")
        .setLabel(isEN ? "💰 Amount in USD" : "💰 Cantidad en USD")
        .setPlaceholder(isEN ? "Ex: 10$, 20$, 50$" : "Ej: 10$, 20$, 50$")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("descripcion")
        .setLabel(isEN ? "📝 Description" : "📝 Descripción")
        .setPlaceholder(isEN ? "Additional details" : "Detalles adicionales")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false)
    )
  );
  await interaction.showModal(modal);
}

// 4. Formulario para ZINLI
async function showZinliForm(interaction, lang) {
  const isEN = lang === "en";
  const modal = new ModalBuilder()
    .setCustomId(`zinli_form_${lang}`)
    .setTitle(isEN ? "💳 ZINLI TRANSACTION" : "💳 TRANSACCIÓN ZINLI");
  
  modal.addComponents(
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("nombre")
        .setLabel(isEN ? "👤 Full Name" : "👤 Nombre de la persona")
        .setPlaceholder(isEN ? "Ex: Juan Perez" : "Ej: Juan Pérez")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("monto")
        .setLabel(isEN ? "💰 Amount in USD" : "💰 Cantidad a cambiar en USD")
        .setPlaceholder(isEN ? "Ex: 10$" : "Ej: 10$")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("descripcion")
        .setLabel(isEN ? "📝 Description" : "📝 Descripción")
        .setPlaceholder(isEN ? "Additional details" : "Detalles adicionales")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false)
    )
  );
  await interaction.showModal(modal);
}

// 5. Formulario para PAYPAL
async function showPayPalForm(interaction, lang) {
  const isEN = lang === "en";
  const modal = new ModalBuilder()
    .setCustomId(`paypal_form_${lang}`)
    .setTitle(isEN ? "💳 PAYPAL TRANSACTION" : "💳 TRANSACCIÓN PAYPAL");
  
  modal.addComponents(
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("nombre")
        .setLabel(isEN ? "👤 Full Name" : "👤 Nombre de la persona")
        .setPlaceholder(isEN ? "Ex: Juan Perez" : "Ej: Juan Pérez")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("monto")
        .setLabel(isEN ? "💰 Amount in USD" : "💰 Cantidad a cambiar en USD")
        .setPlaceholder(isEN ? "Ex: 10$" : "Ej: 10$")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("descripcion")
        .setLabel(isEN ? "📝 Description" : "📝 Descripción")
        .setPlaceholder(isEN ? "Additional details" : "Detalles adicionales")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false)
    )
  );
  await interaction.showModal(modal);
}

// 6. Formulario para BOLÍVARES → USDT
async function showBolivaresToUSDTForm(interaction, lang) {
  const isEN = lang === "en";
  const modal = new ModalBuilder()
    .setCustomId(`bolivares_to_usdt_form_${lang}`)
    .setTitle(isEN ? "🇻🇪 BOLÍVARES → USDT" : "🇻🇪 BOLÍVARES → USDT");
  
  modal.addComponents(
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("nombre")
        .setLabel(isEN ? "👤 Full Name" : "👤 Nombre de la persona")
        .setPlaceholder(isEN ? "Ex: Juan Perez" : "Ej: Juan Pérez")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("monto_bs")
        .setLabel(isEN ? "💰 Amount in Bolívares (BS)" : "💰 Cantidad a cambiar en Bolívares (BS)")
        .setPlaceholder(isEN ? "Ex: 1000 BS" : "Ej: 1000 BS")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("descripcion")
        .setLabel(isEN ? "📝 Description / Send to" : "📝 Descripción / Enviar a")
        .setPlaceholder(isEN ? "Ex: USDT wallet address" : "Ej: Dirección de billetera USDT")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false)
    )
  );
  await interaction.showModal(modal);
}

// 7. Formulario para USDT → BOLÍVARES
async function showUSDTToBolivaresForm(interaction, lang) {
  const isEN = lang === "en";
  const modal = new ModalBuilder()
    .setCustomId(`usdt_to_bolivares_form_${lang}`)
    .setTitle(isEN ? "🇻🇪 USDT → BOLÍVARES" : "🇻🇪 USDT → BOLÍVARES");
  
  modal.addComponents(
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("nombre")
        .setLabel(isEN ? "👤 Full Name" : "👤 Nombre de la persona")
        .setPlaceholder(isEN ? "Ex: Juan Perez" : "Ej: Juan Pérez")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("monto_usdt")
        .setLabel(isEN ? "💰 Amount in USDT" : "💰 Cantidad a cambiar en USDT")
        .setPlaceholder(isEN ? "Ex: 100 USDT" : "Ej: 100 USDT")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("descripcion")
        .setLabel(isEN ? "📝 Description / Send to" : "📝 Descripción / Enviar a")
        .setPlaceholder(isEN ? "Ex: BS bank account" : "Ej: Cuenta bancaria BS")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false)
    )
  );
  await interaction.showModal(modal);
}

// 8. Formulario para WOW GAME TIME
async function showWowGTForm(interaction, lang) {
  const isEN = lang === "en";
  const modal = new ModalBuilder()
    .setCustomId(`wowgt_form_${lang}`)
    .setTitle(isEN ? "🕒 WOW GAME TIME" : "🕒 TIEMPO DE JUEGO WOW");
  
  modal.addComponents(
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("nombre")
        .setLabel(isEN ? "👤 Full Name" : "👤 Nombre de la persona")
        .setPlaceholder(isEN ? "Ex: Juan Perez" : "Ej: Juan Pérez")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("monto")
        .setLabel(isEN ? "💰 Amount" : "💰 Monto")
        .setPlaceholder("28$")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("descripcion")
        .setLabel(isEN ? "📝 Description" : "📝 Descripción")
        .setPlaceholder(isEN ? "Additional details" : "Detalles adicionales")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false)
    )
  );
  await interaction.showModal(modal);
}

// 9. Formulario para OTRO
async function showOtherForm(interaction, lang) {
  const isEN = lang === "en";
  const modal = new ModalBuilder()
    .setCustomId(`other_form_${lang}`)
    .setTitle(isEN ? "❓ OTHER REQUEST" : "❓ OTRA SOLICITUD");
  
  modal.addComponents(
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("consulta")
        .setLabel(isEN ? "📝 Request" : "📝 Solicitud")
        .setPlaceholder(isEN ? "Describe your request" : "Describe tu solicitud")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("contacto")
        .setLabel(isEN ? "📞 Contact" : "📞 Contacto")
        .setPlaceholder(isEN ? "Your Discord" : "Tu Discord")
        .setStyle(TextInputStyle.Short)
        .setRequired(false)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("descripcion")
        .setLabel(isEN ? "📝 Description" : "📝 Descripción")
        .setPlaceholder(isEN ? "More details" : "Más detalles")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false)
    )
  );
  await interaction.showModal(modal);
}

// 10. Formulario para LEVELING (Boosting)
async function showLevelingForm(interaction, lang) {
  const isEN = lang === "en";
  const modal = new ModalBuilder()
    .setCustomId(`leveling_form_${lang}`)
    .setTitle(isEN ? "📈 LEVELING SERVICE" : "📈 SERVICIO DE LEVELING");
  
  modal.addComponents(
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("juego_servidor")
        .setLabel(isEN ? "🎮 Game & Server" : "🎮 Juego y Servidor")
        .setPlaceholder(isEN ? "Ex: WoW TBC - Nightslayer" : "Ej: WoW TBC - Nightslayer")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("clase_faccion")
        .setLabel(isEN ? "🏳️ Class/Faction" : "🏳️ Clase/Facción")
        .setPlaceholder(isEN ? "Ex: Warrior / Alliance" : "Ej: Guerrero / Alianza")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("niveles")
        .setLabel(isEN ? "📊 Current → Desired Level" : "📊 Nivel actual → Deseado")
        .setPlaceholder(isEN ? "Ex: 1 → 60" : "Ej: 1 → 60")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("personaje_pago")
        .setLabel(isEN ? "👤 Character & Payment" : "👤 Personaje y Pago")
        .setPlaceholder(isEN ? "Ex: MyCharacter - Binance" : "Ej: MiPersonaje - Binance")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("descripcion")
        .setLabel(isEN ? "📝 Description" : "📝 Descripción")
        .setPlaceholder(isEN ? "Special requests, notes" : "Requisitos especiales")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false)
    )
  );
  await interaction.showModal(modal);
}

// 11. Formulario para PROFESSIONS (Boosting)
async function showProfessionsForm(interaction, lang) {
  const isEN = lang === "en";
  const modal = new ModalBuilder()
    .setCustomId(`professions_form_${lang}`)
    .setTitle(isEN ? "⚙️ PROFESSIONS SERVICE" : "⚙️ SERVICIO DE PROFESIONES");
  
  modal.addComponents(
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("juego_servidor")
        .setLabel(isEN ? "🎮 Game & Server" : "🎮 Juego y Servidor")
        .setPlaceholder(isEN ? "Ex: WoW TBC - Nightslayer" : "Ej: WoW TBC - Nightslayer")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("profesiones")
        .setLabel(isEN ? "⚙️ Profession(s)" : "⚙️ Profesión(es)")
        .setPlaceholder(isEN ? "Ex: Mining, Herbalism" : "Ej: Minería, Herboristería")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("niveles")
        .setLabel(isEN ? "📊 Current → Desired Level" : "📊 Nivel actual → Deseado")
        .setPlaceholder(isEN ? "Ex: 1 → 300" : "Ej: 1 → 300")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("personaje_pago")
        .setLabel(isEN ? "👤 Character & Payment" : "👤 Personaje y Pago")
        .setPlaceholder(isEN ? "Ex: MyCharacter - Binance" : "Ej: MiPersonaje - Binance")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId("descripcion")
        .setLabel(isEN ? "📝 Description" : "📝 Descripción")
        .setPlaceholder(isEN ? "Special requests, notes" : "Requisitos especiales")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false)
    )
  );
  await interaction.showModal(modal);
}

// ========== TICKET FUNCTIONS ==========
function getTicketEmbed(lang) {
  const isEN = lang === "en";
  return new EmbedBuilder()
    .setTitle(isEN ? "🎫 CREATE TICKET" : "🎫 CREAR TICKET")
    .setDescription(isEN ? `Need help with a transaction or have a question?\n\n**Click the button below to open a support ticket.**` : `¿Necesitas ayuda con alguna transacción o tienes una consulta?\n\n**Haz clic en el botón de abajo para abrir un ticket de soporte.**`)
    .setColor(0x5865F2)
    .setTimestamp()
    .setFooter({ text: "TradeHub MMORPG", iconURL: LOGO_URL });
}

function getTicketButton(lang) {
  const isEN = lang === "en";
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`open_ticket_${lang}`)
      .setLabel(isEN ? "🎫 OPEN TICKET" : "🎫 ABRIR TICKET")
      .setStyle(ButtonStyle.Primary)
      .setEmoji("🎫")
  );
}

function getTicketMainMenu(lang) {
  const isEN = lang === "en";
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(`ticket_main_menu_${lang}`)
      .setPlaceholder(isEN ? "--- SELECT A CATEGORY ---" : "--- SELECCIONA UNA CATEGORÍA ---")
      .addOptions([
        { label: isEN ? "🛒 MARKETPLACE" : "🛒 MARKETPLACE", value: "ticket_marketplace", emoji: "🛒" },
        { label: isEN ? "🚀 BOOSTING" : "🚀 BOOSTING", value: "ticket_boosting", emoji: "🚀" },
        { label: isEN ? "🎁 GIFT CARDS" : "🎁 GIFT CARDS", value: "ticket_giftcards", emoji: "🎁" },
        { label: isEN ? "💳 P2P" : "💳 P2P", value: "ticket_p2p", emoji: "💳" },
        { label: isEN ? "📺 STREAMING" : "📺 STREAMING", value: "ticket_streaming", emoji: "📺" },
        { label: isEN ? "🕒 WOW GAME TIME" : "🕒 WOW GAME TIME", value: "ticket_wow_gt", emoji: "🕒" },
        { label: isEN ? "❓ OTHER" : "❓ OTRO", value: "ticket_other", emoji: "❓" }
      ])
  );
}

async function hasOpenTicket(guild, username) {
  if (!guild || !guild.channels) return null;
  return guild.channels.cache.find(channel => channel.name === `ticket-${username}` && channel.parentId === ID_CATEGORIA_TICKETS);
}

async function deleteMenuMessage(userId) {
  const menuMsg = menuMessages.get(userId);
  if (menuMsg) {
    try { await menuMsg.delete().catch(() => {}); } catch (e) {}
    menuMessages.delete(userId);
  }
}

// ========== REDES SOCIALES ==========
function getRedesEmbed(lang) {
  const isEN = lang === "en";
  return new EmbedBuilder()
    .setImage(REDES_IMAGE_URL)
    .setTitle(isEN ? `${EMOJIS.youtube} FOLLOW US ON SOCIAL MEDIA` : `${EMOJIS.youtube} SÍGUENOS EN REDES SOCIALES`)
    .setDescription(isEN ? `Follow **TradeHub MMORPG** on all our social networks:\n\n${EMOJIS.tiktok} **TikTok**\n${EMOJIS.facebook} **Facebook**\n${EMOJIS.youtube} **YouTube**\n${EMOJIS.instagram} **Instagram**` : `Sigue a **TradeHub MMORPG** en todas nuestras redes:\n\n${EMOJIS.tiktok} **TikTok**\n${EMOJIS.facebook} **Facebook**\n${EMOJIS.youtube} **YouTube**\n${EMOJIS.instagram} **Instagram**`)
    .setColor(0x5865F2).setTimestamp().setFooter({ text: "TradeHub MMORPG", iconURL: LOGO_URL });
}

function getRedesButtons(lang) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setLabel("TikTok").setStyle(ButtonStyle.Link).setURL(LINKS.tiktok).setEmoji(EMOJIS.tiktok),
    new ButtonBuilder().setLabel("Facebook").setStyle(ButtonStyle.Link).setURL(LINKS.facebook).setEmoji(EMOJIS.facebook),
    new ButtonBuilder().setLabel("YouTube").setStyle(ButtonStyle.Link).setURL(LINKS.youtube).setEmoji(EMOJIS.youtube),
    new ButtonBuilder().setLabel("Instagram").setStyle(ButtonStyle.Link).setURL(LINKS.instagram).setEmoji(EMOJIS.instagram)
  );
}

async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(TOKEN);
  try {
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: [
      { name: "menu_es", description: "Envía el menú de precios en español" },
      { name: "menu_en", description: "Send price menu in English" },
      { name: "ticket_es", description: "Envía el mensaje de ticket al canal español" },
      { name: "ticket_en", description: "Send ticket message to English channel" },
      { name: "redes", description: "Envía el mensaje de redes sociales" },
      { name: "reload_es", description: "Recarga precios y botones (Español)" },
      { name: "reload_en", description: "Reload prices and buttons (English)" }
    ] });
    console.log("✅ Comandos registrados");
  } catch (error) { console.error("Error al registrar comandos:", error); }
}

client.once(Events.ClientReady, async () => {
  console.log(`🚀 Bot conectado como ${client.user.tag}`);
  await registerCommands();
  console.log("✅ Bot listo");
  console.log("📌 Comandos: /menu_es | /menu_en | /ticket_es | /ticket_en | /redes");
});

client.on(Events.InteractionCreate, async (interaction) => {
  let lang = "es";
  if (interaction.customId && interaction.customId.endsWith("_en")) lang = "en";
  else if (interaction.channelId === ID_CANAL_TICKET_EN) lang = "en";
  else if (interaction.channelId === ID_CANAL_TASAS_EN) lang = "en";
  const isEN = lang === "en";

  // ========== COMANDOS SLASH ==========
  if (interaction.isCommand()) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      await interaction.reply({ content: isEN ? "❌ No permission" : "❌ Sin permisos", flags: MessageFlags.Ephemeral });
      return;
    }
    const channel = await client.channels.fetch(interaction.channelId);
    if (interaction.commandName === "menu_es") {
      await channel.send({ embeds: [getMainEmbed("es")], components: [getMainMenu("es")] });
      await interaction.reply({ content: "✅ Menú enviado", flags: MessageFlags.Ephemeral });
    }
    if (interaction.commandName === "menu_en") {
      await channel.send({ embeds: [getMainEmbed("en")], components: [getMainMenu("en")] });
      await interaction.reply({ content: "✅ Menu sent", flags: MessageFlags.Ephemeral });
    }
    if (interaction.commandName === "ticket_es") {
      const ticketChannel = await client.channels.fetch(ID_CANAL_TICKET_ES);
      const msg = await ticketChannel.send({ embeds: [getTicketEmbed("es")], components: [getTicketButton("es")] });
      originalTicketMessageES = msg;
      await interaction.reply({ content: "✅ Ticket enviado", flags: MessageFlags.Ephemeral });
    }
    if (interaction.commandName === "ticket_en") {
      const ticketChannel = await client.channels.fetch(ID_CANAL_TICKET_EN);
      const msg = await ticketChannel.send({ embeds: [getTicketEmbed("en")], components: [getTicketButton("en")] });
      originalTicketMessageEN = msg;
      await interaction.reply({ content: "✅ Ticket sent", flags: MessageFlags.Ephemeral });
    }
    if (interaction.commandName === "redes") {
      const ch1 = await client.channels.fetch(ID_CANAL_REDES_1);
      const ch2 = await client.channels.fetch(ID_CANAL_REDES_2);
      if (ch1) await ch1.send({ embeds: [getRedesEmbed("es")], components: [getRedesButtons("es")] });
      if (ch2) await ch2.send({ embeds: [getRedesEmbed("en")], components: [getRedesButtons("en")] });
      await interaction.reply({ content: "✅ Redes enviadas", flags: MessageFlags.Ephemeral });
    }
    if (interaction.commandName === "reload_es") {
      if (reloadData("es")) await interaction.reply({ content: "✅ Recargado", flags: MessageFlags.Ephemeral });
      else await interaction.reply({ content: "❌ Error", flags: MessageFlags.Ephemeral });
    }
    if (interaction.commandName === "reload_en") {
      if (reloadData("en")) await interaction.reply({ content: "✅ Reloaded", flags: MessageFlags.Ephemeral });
      else await interaction.reply({ content: "❌ Error", flags: MessageFlags.Ephemeral });
    }
    return;
  }

  // ========== ABRIR TICKET (BOTÓN) - MISMO MENSAJE, CON REINICIO ==========
  if (interaction.isButton() && interaction.customId === `open_ticket_${lang}`) {
    const existingTicket = await hasOpenTicket(interaction.guild, interaction.user.username);
    if (existingTicket) {
      await interaction.reply({ content: isEN ? `❌ You have a ticket: ${existingTicket}` : `❌ Ya tienes un ticket: ${existingTicket}`, flags: MessageFlags.Ephemeral });
      return;
    }
    // EDITAR el mensaje original (no crear uno nuevo)
    await interaction.update({ embeds: [getTicketEmbed(lang)], components: [getTicketMainMenu(lang)] });
    scheduleTicketReset(interaction, interaction.message.id, lang);
    return;
  }

  // ========== MENÚ PRINCIPAL DE PRECIOS (GRANDE) - CON REINICIO ==========
  if (interaction.isStringSelectMenu() && interaction.customId === `main_menu_${lang}`) {
    const key = interaction.values[0];
    const btns = lang === "en" ? buttonsEN : buttonsES;
    cancelCategoryReset(interaction.user.id);

    if (key === "marketplace") {
      await interaction.update({ 
        embeds: [new EmbedBuilder().setTitle(isEN ? "🛒 MARKETPLACE" : "🛒 MARKETPLACE").setDescription(isEN ? "Select a game to see its rates." : "Selecciona un juego para ver sus tasas.").setColor(0x000000)], 
        components: [getMarketplaceMenu(lang), new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(`back_${lang}`).setLabel(isEN ? "⬅️ BACK" : "⬅️ VOLVER").setStyle(ButtonStyle.Secondary))] 
      });
      scheduleCategoryReset(interaction, interaction.message.id, lang);
      return;
    }

    if (key === "boosting") {
      if (btns.boosting?.active === false) {
        await interaction.reply({ content: isEN ? "❌ Boosting service is currently unavailable" : "❌ Servicio de boosting no disponible", flags: MessageFlags.Ephemeral });
        return;
      }
      const boostMenu = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId(`boost_type_menu_${lang}`)
          .setPlaceholder(isEN ? "--- SELECT BOOST TYPE ---" : "--- SELECCIONA TIPO DE BOOST ---")
          .addOptions([
            { label: isEN ? "📈 LEVELING" : "📈 LEVELING", value: "leveling", emoji: "📈" },
            { label: isEN ? "⚙️ PROFESSIONS" : "⚙️ PROFESIONES", value: "professions", emoji: "⚙️" }
          ])
      );
      const embed = new EmbedBuilder()
        .setTitle(isEN ? "🚀 BOOSTING SERVICE" : "🚀 SERVICIO DE BOOSTING")
        .setDescription(isEN ? "Select the type of boost you need:" : "Selecciona el tipo de boost que necesitas:")
        .setColor(0x00ff00);
      await interaction.update({ embeds: [embed], components: [boostMenu, new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(`back_${lang}`).setLabel(isEN ? "⬅️ BACK" : "⬅️ VOLVER").setStyle(ButtonStyle.Secondary))] });
      scheduleReset(interaction, interaction.message.id, lang);
      return;
    }

    if (key === "giftcards") {
      await interaction.update({ 
        embeds: [new EmbedBuilder().setTitle(isEN ? "🎁 GIFT CARDS" : "🎁 TARJETAS").setDescription(isEN ? "Select a gift card:" : "Selecciona una tarjeta:").setColor(0x000000)], 
        components: [getGiftCardsMenu(lang), new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(`back_${lang}`).setLabel(isEN ? "⬅️ BACK" : "⬅️ VOLVER").setStyle(ButtonStyle.Secondary))] 
      });
      scheduleCategoryReset(interaction, interaction.message.id, lang);
      return;
    }

    if (key === "p2p") {
      await interaction.update({ 
        embeds: [new EmbedBuilder().setTitle(isEN ? "💳 P2P EXCHANGE" : "💳 CAMBIO P2P").setDescription(isEN ? "Select a method:" : "Selecciona un método:").setColor(0x000000)], 
        components: [getP2PCategoriesMenu(lang), new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(`back_${lang}`).setLabel(isEN ? "⬅️ BACK" : "⬅️ VOLVER").setStyle(ButtonStyle.Secondary))] 
      });
      scheduleCategoryReset(interaction, interaction.message.id, lang);
      return;
    }

    if (key === "streaming") {
      await interaction.update({ 
        embeds: [new EmbedBuilder().setTitle(isEN ? "📺 STREAMING SERVICES" : "📺 SERVICIOS DE STREAMING").setDescription(isEN ? "Select a service:" : "Selecciona un servicio:").setColor(0x000000)], 
        components: [getStreamingServicesMenu(lang), new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(`back_${lang}`).setLabel(isEN ? "⬅️ BACK" : "⬅️ VOLVER").setStyle(ButtonStyle.Secondary))] 
      });
      scheduleCategoryReset(interaction, interaction.message.id, lang);
      return;
    }

    if (key === "wow_gt") {
      const data = lang === "en" ? dataEN : dataES;
      const embed = new EmbedBuilder().setTitle(isEN ? "🕒 GAME TIME" : "🕒 TIEMPO JUEGO").setDescription(`**${isEN ? "Price" : "Precio"}:** ${data.wow_gt.price}\n${isEN ? METODOS_RESUMIDOS_EN : METODOS_RESUMIDOS_ES}`).setColor(0x000000);
      await interaction.update({ 
        embeds: [embed], 
        components: [new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId(`buy_wowgt_${lang}`).setLabel(isEN ? "🟢 WE SELL" : "🟢 VENDEMOS").setStyle(ButtonStyle.Success).setDisabled(btns.wow_gt?.buy === false),
          new ButtonBuilder().setCustomId(`back_${lang}`).setLabel(isEN ? "⬅️ BACK" : "⬅️ VOLVER").setStyle(ButtonStyle.Secondary)
        )] 
      });
      scheduleReset(interaction, interaction.message.id, lang);
      return;
    }
  }

  // ========== MENÚ PRINCIPAL DE TICKETS - CON REINICIO ==========
  if (interaction.isStringSelectMenu() && interaction.customId === `ticket_main_menu_${lang}`) {
    const key = interaction.values[0];
    const btns = lang === "en" ? buttonsEN : buttonsES;
    
    // Cancelar el timeout de ticket
    if (ticketTimeouts.has(interaction.user.id)) {
      clearTimeout(ticketTimeouts.get(interaction.user.id));
      ticketTimeouts.delete(interaction.user.id);
    }

    if (key === "ticket_marketplace") {
      await interaction.update({ 
        embeds: [new EmbedBuilder().setTitle(isEN ? "🛒 MARKETPLACE" : "🛒 MARKETPLACE").setDescription(isEN ? "Select a game to continue:" : "Selecciona un juego para continuar:").setColor(0x5865F2)], 
        components: [getMarketplaceMenu(lang), new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(`back_ticket_${lang}`).setLabel(isEN ? "⬅️ BACK" : "⬅️ VOLVER").setStyle(ButtonStyle.Secondary))] 
      });
      scheduleTicketReset(interaction, interaction.message.id, lang);
      return;
    }

    if (key === "ticket_boosting") {
      if (btns.boosting?.active === false) {
        await interaction.reply({ content: isEN ? "❌ Boosting service is currently unavailable" : "❌ Servicio de boosting no disponible", flags: MessageFlags.Ephemeral });
        return;
      }
      const boostMenu = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId(`ticket_boost_type_menu_${lang}`)
          .setPlaceholder(isEN ? "--- SELECT BOOST TYPE ---" : "--- SELECCIONA TIPO DE BOOST ---")
          .addOptions([
            { label: isEN ? "📈 LEVELING" : "📈 LEVELING", value: "leveling", emoji: "📈" },
            { label: isEN ? "⚙️ PROFESSIONS" : "⚙️ PROFESIONES", value: "professions", emoji: "⚙️" }
          ])
      );
      const embed = new EmbedBuilder()
        .setTitle(isEN ? "🚀 BOOSTING SERVICE" : "🚀 SERVICIO DE BOOSTING")
        .setDescription(isEN ? "Select the type of boost you need:" : "Selecciona el tipo de boost que necesitas:")
        .setColor(0x00ff00);
      await interaction.update({ embeds: [embed], components: [boostMenu, new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(`back_ticket_${lang}`).setLabel(isEN ? "⬅️ BACK" : "⬅️ VOLVER").setStyle(ButtonStyle.Secondary))] });
      scheduleTicketReset(interaction, interaction.message.id, lang);
      return;
    }

    if (key === "ticket_giftcards") {
      await interaction.update({ 
        embeds: [new EmbedBuilder().setTitle(isEN ? "🎁 GIFT CARDS" : "🎁 TARJETAS").setDescription(isEN ? "Select a gift card:" : "Selecciona una tarjeta:").setColor(0x5865F2)], 
        components: [getGiftCardsMenu(lang), new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(`back_ticket_${lang}`).setLabel(isEN ? "⬅️ BACK" : "⬅️ VOLVER").setStyle(ButtonStyle.Secondary))] 
      });
      scheduleTicketReset(interaction, interaction.message.id, lang);
      return;
    }

    if (key === "ticket_p2p") {
      await interaction.update({ 
        embeds: [new EmbedBuilder().setTitle(isEN ? "💳 P2P EXCHANGE" : "💳 CAMBIO P2P").setDescription(isEN ? "Select a method:" : "Selecciona un método:").setColor(0x5865F2)], 
        components: [getP2PCategoriesMenu(lang), new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(`back_ticket_${lang}`).setLabel(isEN ? "⬅️ BACK" : "⬅️ VOLVER").setStyle(ButtonStyle.Secondary))] 
      });
      scheduleTicketReset(interaction, interaction.message.id, lang);
      return;
    }

    if (key === "ticket_streaming") {
      await interaction.update({ 
        embeds: [new EmbedBuilder().setTitle(isEN ? "📺 STREAMING SERVICES" : "📺 SERVICIOS DE STREAMING").setDescription(isEN ? "Select a service:" : "Selecciona un servicio:").setColor(0x5865F2)], 
        components: [getStreamingServicesMenu(lang), new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(`back_ticket_${lang}`).setLabel(isEN ? "⬅️ BACK" : "⬅️ VOLVER").setStyle(ButtonStyle.Secondary))] 
      });
      scheduleTicketReset(interaction, interaction.message.id, lang);
      return;
    }

    if (key === "ticket_wow_gt") {
      const data = lang === "en" ? dataEN : dataES;
      const embed = new EmbedBuilder().setTitle(isEN ? "🕒 GAME TIME" : "🕒 TIEMPO JUEGO").setDescription(`**${isEN ? "Price" : "Precio"}:** ${data.wow_gt.price}\n${isEN ? METODOS_RESUMIDOS_EN : METODOS_RESUMIDOS_ES}`).setColor(0x5865F2);
      await interaction.update({ 
        embeds: [embed], 
        components: [new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId(`buy_wowgt_${lang}`).setLabel(isEN ? "🟢 WE SELL" : "🟢 VENDEMOS").setStyle(ButtonStyle.Success).setDisabled(btns.wow_gt?.buy === false),
          new ButtonBuilder().setCustomId(`back_ticket_${lang}`).setLabel(isEN ? "⬅️ BACK" : "⬅️ VOLVER").setStyle(ButtonStyle.Secondary)
        )] 
      });
      scheduleTicketReset(interaction, interaction.message.id, lang);
      return;
    }

    if (key === "ticket_other") {
      await showOtherForm(interaction, lang);
      return;
    }
  }

  // ========== MARKETPLACE MENU (SELECCIÓN DE JUEGOS) ==========
  if (interaction.isStringSelectMenu() && interaction.customId === `marketplace_menu_${lang}`) {
    const key = interaction.values[0];
    const data = lang === "en" ? dataEN : dataES;
    cancelCategoryReset(interaction.user.id);
    const isTicket = interaction.message.embeds[0]?.color === 0x5865F2;
    const backButtonId = isTicket ? `back_ticket_${lang}` : `back_marketplace_${lang}`;
    const embedColor = isTicket ? 0x5865F2 : 0x000000;

    if (key === "rpg_group") {
      const sub = getSubMenu([
        { label: "Diablo 2", value: "diablo2", emoji: "👹" },
        { label: "OSRS", value: "osrs", emoji: "🎮" },
        { label: "Lawl", value: "lawl", emoji: "🐺" }
      ], `sub_${lang}`, isEN ? "--- SELECT GAME ---" : "--- SELECCIONA JUEGO ---", lang);
      await interaction.update({ embeds: [new EmbedBuilder().setTitle(isEN ? "🎮 RPG GAMES" : "🎮 JUEGOS RPG").setColor(embedColor)], components: [sub, new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(backButtonId).setLabel(isEN ? "⬅️ BACK" : "⬅️ VOLVER").setStyle(ButtonStyle.Secondary))] });
      if (!isTicket) scheduleCategoryReset(interaction, interaction.message.id, lang);
      return;
    }
    if (key === "wow_group") {
      const sub = getSubMenu([
        { label: "Project Epoch", value: "epoch", emoji: "🌍" },
        { label: "Ascensión", value: "ascension", emoji: "⚡" }
      ], `sub_${lang}`, isEN ? "--- SELECT GAME ---" : "--- SELECCIONA JUEGO ---", lang);
      await interaction.update({ embeds: [new EmbedBuilder().setTitle(isEN ? "🌍 WOW PROJECTS" : "🌍 PROYECTOS WOW").setColor(embedColor)], components: [sub, new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(backButtonId).setLabel(isEN ? "⬅️ BACK" : "⬅️ VOLVER").setStyle(ButtonStyle.Secondary))] });
      if (!isTicket) scheduleCategoryReset(interaction, interaction.message.id, lang);
      return;
    }
    if (key === "wow_retail_group") {
      const sub = getSubMenu([
        { label: "WoW Retail US", value: "wowRetailUS", emoji: "🇺🇸" },
        { label: "WoW Retail EU", value: "wowRetailEU", emoji: "🇪🇺" }
      ], `sub_${lang}`, isEN ? "--- SELECT REGION ---" : "--- SELECCIONA REGIÓN ---", lang);
      await interaction.update({ embeds: [new EmbedBuilder().setTitle("🇺🇸 WOW RETAIL").setColor(embedColor)], components: [sub, new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(backButtonId).setLabel(isEN ? "⬅️ BACK" : "⬅️ VOLVER").setStyle(ButtonStyle.Secondary))] });
      if (!isTicket) scheduleCategoryReset(interaction, interaction.message.id, lang);
      return;
    }
    if (key === "mmo_group1") {
      const sub = getSubMenu([
        { label: "ODIN", value: "odin", emoji: "⚡" },
        { label: "Dofus", value: "dofus", emoji: "🐉" },
        { label: "Quinfall", value: "quinfall", emoji: "🏰" }
      ], `sub_${lang}`, isEN ? "--- SELECT GAME ---" : "--- SELECCIONA JUEGO ---", lang);
      await interaction.update({ embeds: [new EmbedBuilder().setTitle(isEN ? "⚡ MMORPG GAMES" : "⚡ JUEGOS MMORPG").setColor(embedColor)], components: [sub, new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(backButtonId).setLabel(isEN ? "⬅️ BACK" : "⬅️ VOLVER").setStyle(ButtonStyle.Secondary))] });
      if (!isTicket) scheduleCategoryReset(interaction, interaction.message.id, lang);
      return;
    }
    if (key === "mmo_group2") {
      const sub = getSubMenu([
        { label: "Throne", value: "throne", emoji: "👑" },
        { label: "Torchlight", value: "torchlight", emoji: "🔦" },
        { label: "PoE 1", value: "poe1", emoji: "🌀" },
        { label: "PoE 2", value: "poe2", emoji: "🌀" }
      ], `sub_${lang}`, isEN ? "--- SELECT GAME ---" : "--- SELECCIONA JUEGO ---", lang);
      await interaction.update({ embeds: [new EmbedBuilder().setTitle(isEN ? "👑 ACTION RPG" : "👑 ACTION RPG").setColor(embedColor)], components: [sub, new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(backButtonId).setLabel(isEN ? "⬅️ BACK" : "⬅️ VOLVER").setStyle(ButtonStyle.Secondary))] });
      if (!isTicket) scheduleCategoryReset(interaction, interaction.message.id, lang);
      return;
    }
    if (key === "mmo_group3") {
      const sub = getSubMenu([
        { label: "Flyff", value: "flyff", emoji: "🪽" },
        { label: "Rubinot", value: "rubinot", emoji: "💰" },
        { label: "Tibia", value: "tibia", emoji: "⚔️" }
      ], `sub_${lang}`, isEN ? "--- SELECT GAME ---" : "--- SELECCIONA JUEGO ---", lang);
      await interaction.update({ embeds: [new EmbedBuilder().setTitle(isEN ? "🪽 OTHER MMOS" : "🪽 OTROS MMOS").setColor(embedColor)], components: [sub, new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(backButtonId).setLabel(isEN ? "⬅️ BACK" : "⬅️ VOLVER").setStyle(ButtonStyle.Secondary))] });
      if (!isTicket) scheduleCategoryReset(interaction, interaction.message.id, lang);
      return;
    }

    const game = data[key];
    if (game && game.servers) {
      const serverMenu = new ActionRowBuilder().addComponents(new StringSelectMenuBuilder().setCustomId(`select_${key}_${lang}`).setPlaceholder(isEN ? "--- SELECT SERVER ---" : "--- SELECCIONA SERVIDOR ---").addOptions(game.servers.map(s => ({ label: s.label, value: s.value }))));
      await interaction.update({ embeds: [new EmbedBuilder().setTitle(game.title).setDescription(isEN ? "Select your server." : "Selecciona tu servidor.").setColor(embedColor)], components: [serverMenu, new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(backButtonId).setLabel(isEN ? "⬅️ BACK" : "⬅️ VOLVER").setStyle(ButtonStyle.Secondary))] });
      if (!isTicket) scheduleReset(interaction, interaction.message.id, lang);
      return;
    }
  }

  // ========== STREAMING SERVICES MENU ==========
  if (interaction.isStringSelectMenu() && interaction.customId === `streaming_services_menu_${lang}`) {
    const value = interaction.values[0];
    const serviceName = value.replace("streaming_", "").replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const data = lang === "en" ? dataEN : dataES;
    const originalName = Object.keys(data.streaming.items || {}).find(
      key => key.toLowerCase().replace(/[^a-z0-9]/g, '_') === value.replace("streaming_", "")
    );
    await showStreamingService(interaction, lang, originalName || serviceName);
    return;
  }

  // ========== GIFT CARDS MENU ==========
  if (interaction.isStringSelectMenu() && interaction.customId === `giftcards_menu_${lang}`) {
    const value = interaction.values[0];
    const cardName = value.replace("giftcard_", "").replace(/_/g, ' ');
    const data = lang === "en" ? dataEN : dataES;
    const originalName = Object.keys(data.giftcards.items || {}).find(
      key => key.substring(0, 50).replace(/[^a-zA-Z0-9]/g, '_') === value.replace("giftcard_", "")
    );
    await showGiftCard(interaction, lang, originalName || cardName);
    return;
  }

  // ========== P2P CATEGORIES MENU ==========
  if (interaction.isStringSelectMenu() && interaction.customId === `p2p_categories_menu_${lang}`) {
    const value = interaction.values[0];
    let categoryKey = value.replace("p2p_", "");
    let displayName = "";
    if (categoryKey === "zinli") displayName = "Zinli";
    else if (categoryKey === "paypal") displayName = "PayPal";
    else if (categoryKey === "bolivares_to_usdt") displayName = "Bolívares → USDT";
    else if (categoryKey === "usdt_to_bolivares") displayName = "USDT → Bolívares";
    else displayName = categoryKey;
    await showP2PCategory(interaction, lang, displayName);
    return;
  }

  // ========== TICKET BOOST TYPE MENU ==========
  if (interaction.isStringSelectMenu() && interaction.customId === `ticket_boost_type_menu_${lang}`) {
    const boostType = interaction.values[0];
    if (boostType === "leveling") await showLevelingForm(interaction, lang);
    else if (boostType === "professions") await showProfessionsForm(interaction, lang);
    return;
  }

  // ========== SUB-MENÚS ==========
  if (interaction.isStringSelectMenu() && interaction.customId === `sub_${lang}`) {
    const selectedValue = interaction.values[0];
    const data = lang === "en" ? dataEN : dataES;
    const game = data[selectedValue];
    const isTicket = interaction.message.embeds[0]?.color === 0x5865F2;
    const backButtonId = isTicket ? `back_ticket_${lang}` : `back_marketplace_${lang}`;
    const embedColor = isTicket ? 0x5865F2 : 0x000000;
    
    if (game && game.servers) {
      const serverMenu = new ActionRowBuilder().addComponents(new StringSelectMenuBuilder().setCustomId(`select_${selectedValue}_${lang}`).setPlaceholder(isEN ? "--- SELECT SERVER ---" : "--- SELECCIONA SERVIDOR ---").addOptions(game.servers.map(s => ({ label: s.label, value: s.value }))));
      await interaction.update({ embeds: [new EmbedBuilder().setTitle(game.title).setDescription(isEN ? "Select your server." : "Selecciona tu servidor.").setColor(embedColor)], components: [serverMenu, new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(backButtonId).setLabel(isEN ? "⬅️ BACK" : "⬅️ VOLVER").setStyle(ButtonStyle.Secondary))] });
      if (!isTicket) scheduleReset(interaction, interaction.message.id, lang);
      return;
    }
  }

  // ========== SELECCIÓN DE SERVIDOR (ORO) ==========
  if (interaction.isStringSelectMenu() && interaction.customId.startsWith(`select_`)) {
    const parts = interaction.customId.split("_");
    const gameKey = parts[1];
    const data = lang === "en" ? dataEN : dataES;
    const server = data[gameKey]?.servers.find(s => s.value === interaction.values[0]);
    if (!server) return;
    const statusMsg = getButtonStatus(lang, gameKey, server.label);
    const isTicket = interaction.message.embeds[0]?.color === 0x5865F2;
    const embedColor = isTicket ? 0x5865F2 : 0x000000;
    const embed = new EmbedBuilder().setTitle(`🛡️ ${data[gameKey].title}`).setDescription(`🔥 **${server.label}**\n\n💵 ${isEN ? "WE SELL" : "VENDEMOS"}: ${server.c}\n💵 ${isEN ? "WE BUY" : "COMPRAMOS"}: ${server.v}\n\n**${statusMsg}**\n\n${isEN ? "Select an option to continue" : "Selecciona una opción para continuar"}\n${isEN ? METODOS_RESUMIDOS_EN : METODOS_RESUMIDOS_ES}`).setColor(embedColor);
    const buyActive = isButtonActive(lang, gameKey, server.label, "buy");
    const sellActive = isButtonActive(lang, gameKey, server.label, "sell");
    const backButtonId = isTicket ? `back_ticket_${lang}` : `back_marketplace_${lang}`;
    const buttonBuyId = isTicket ? `ticket_buy_${gameKey}_${server.label}_${lang}` : `buy_${gameKey}_${server.label}_${lang}`;
    const buttonSellId = isTicket ? `ticket_sell_${gameKey}_${server.label}_${lang}` : `sell_${gameKey}_${server.label}_${lang}`;
    
    await interaction.update({ embeds: [embed], components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(buttonBuyId).setLabel(buyActive ? (isEN ? "🟢 WE SELL" : "🟢 VENDEMOS") : (isEN ? "🔴 UNAVAILABLE" : "🔴 NO DISPONIBLE")).setStyle(buyActive ? ButtonStyle.Success : ButtonStyle.Secondary).setDisabled(!buyActive), new ButtonBuilder().setCustomId(buttonSellId).setLabel(sellActive ? (isEN ? "🔴 WE BUY" : "🔴 COMPRAMOS") : (isEN ? "⚫ UNAVAILABLE" : "⚫ NO DISPONIBLE")).setStyle(sellActive ? ButtonStyle.Danger : ButtonStyle.Secondary).setDisabled(!sellActive), new ButtonBuilder().setCustomId(backButtonId).setLabel(isEN ? "⬅️ BACK" : "⬅️ VOLVER").setStyle(ButtonStyle.Secondary))] });
    if (!isTicket) scheduleReset(interaction, interaction.message.id, lang);
    return;
  }

  // ========== BOTONES STREAMING ==========
  if (interaction.isButton() && interaction.customId.startsWith("buy_streaming_")) {
    const parts = interaction.customId.split("_");
    const serviceName = parts.slice(2).join("_").replace(`_${lang}`, "").replace(/_/g, ' ');
    const btns = lang === "en" ? buttonsEN : buttonsES;
    if (btns.streaming?.buy === false) {
      await interaction.reply({ content: isEN ? "❌ Service not available" : "❌ Servicio no disponible", flags: MessageFlags.Ephemeral });
      return;
    }
    cancelReset(interaction.user.id);
    await showStreamingPurchaseForm(interaction, lang, serviceName);
    return;
  }

  // ========== BOTONES GIFT CARDS ==========
  if (interaction.isButton() && interaction.customId.startsWith("buy_giftcard_")) {
    const parts = interaction.customId.split("_");
    const cardName = parts.slice(2).join("_").replace(`_${lang}`, "").replace(/_/g, ' ');
    const btns = lang === "en" ? buttonsEN : buttonsES;
    if (btns.giftcards?.buy === false) {
      await interaction.reply({ content: isEN ? "❌ Service not available" : "❌ Servicio no disponible", flags: MessageFlags.Ephemeral });
      return;
    }
    cancelReset(interaction.user.id);
    await showGiftCardPurchaseForm(interaction, lang, cardName);
    return;
  }

  // ========== BOTONES ZINLI ==========
  if (interaction.isButton() && interaction.customId === `buy_zinli_${lang}`) {
    await showZinliForm(interaction, lang);
    return;
  }

  // ========== BOTONES PAYPAL ==========
  if (interaction.isButton() && interaction.customId === `buy_paypal_${lang}`) {
    await showPayPalForm(interaction, lang);
    return;
  }

  // ========== BOTONES BOLÍVARES → USDT ==========
  if (interaction.isButton() && interaction.customId === `buy_bolivares_to_usdt_${lang}`) {
    await showBolivaresToUSDTForm(interaction, lang);
    return;
  }

  // ========== BOTONES USDT → BOLÍVARES ==========
  if (interaction.isButton() && interaction.customId === `buy_usdt_to_bolivares_${lang}`) {
    await showUSDTToBolivaresForm(interaction, lang);
    return;
  }

  // ========== BOTÓN WOW GT ==========
  if (interaction.isButton() && interaction.customId === `buy_wowgt_${lang}`) {
    const btns = lang === "en" ? buttonsEN : buttonsES;
    if (btns.wow_gt?.buy === false) {
      await interaction.reply({ content: isEN ? "❌ Service not available" : "❌ Servicio no disponible", flags: MessageFlags.Ephemeral });
      return;
    }
    cancelReset(interaction.user.id);
    await showWowGTForm(interaction, lang);
    return;
  }

  // ========== BOTONES COMPRA/VENTA (ORO/MARKETPLACE) ==========
  if (interaction.isButton() && (interaction.customId.startsWith("buy_") || interaction.customId.startsWith("sell_") || interaction.customId.startsWith("ticket_buy_") || interaction.customId.startsWith("ticket_sell_"))) {
    // Verificar que NO sea un botón de streaming, giftcard, zinli, paypal o bolivares
    if (!interaction.customId.includes("streaming") && !interaction.customId.includes("giftcard") && !interaction.customId.includes("zinli") && !interaction.customId.includes("paypal") && !interaction.customId.includes("bolivares") && !interaction.customId.includes("usdt") && !interaction.customId.includes("wowgt")) {
      const parts = interaction.customId.split("_");
      const isTicketButton = parts[0] === "ticket";
      const tipo = isTicketButton ? (parts[1] === "buy" ? "BUY" : "SELL") : (parts[0] === "buy" ? "BUY" : "SELL");
      const game = isTicketButton ? parts[2] : parts[1];
      const server = isTicketButton ? parts.slice(3).join("_").replace(`_${lang}`, "") : parts.slice(2).join("_").replace(`_${lang}`, "");
      if (!isButtonActive(lang, game, server, tipo.toLowerCase())) {
        await interaction.reply({ content: isEN ? "❌ Service not available" : "❌ Servicio no disponible", flags: MessageFlags.Ephemeral });
        return;
      }
      cancelReset(interaction.user.id);
      const data = lang === "en" ? dataEN : dataES;
      const gameData = data[game];
      const gameTitle = gameData?.title || game;
      await showGoldForm(interaction, lang, gameTitle, server, tipo);
      return;
    }
  }

  // ========== BOOST TYPE MENU ==========
  if (interaction.isStringSelectMenu() && interaction.customId === `boost_type_menu_${lang}`) {
    const boostType = interaction.values[0];
    if (boostType === "leveling") await showLevelingForm(interaction, lang);
    else if (boostType === "professions") await showProfessionsForm(interaction, lang);
    return;
  }

  // ========== BOTONES VOLVER ==========
  if (interaction.isButton() && interaction.customId === `back_marketplace_${lang}`) {
    cancelReset(interaction.user.id);
    cancelCategoryReset(interaction.user.id);
    await interaction.update({ 
      embeds: [new EmbedBuilder().setTitle(isEN ? "🛒 MARKETPLACE" : "🛒 MARKETPLACE").setDescription(isEN ? "Select a game to see its rates." : "Selecciona un juego para ver sus tasas.").setColor(0x000000)], 
      components: [getMarketplaceMenu(lang), new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(`back_${lang}`).setLabel(isEN ? "⬅️ BACK" : "⬅️ VOLVER").setStyle(ButtonStyle.Secondary))] 
    });
    return;
  }

  if (interaction.isButton() && interaction.customId === `back_ticket_${lang}`) {
    cancelReset(interaction.user.id);
    cancelCategoryReset(interaction.user.id);
    cancelTicketReset(interaction.user.id);
    await interaction.update({ embeds: [getTicketEmbed(lang)], components: [getTicketButton(lang)] });
    // Programar nuevo reinicio después de volver al botón
    scheduleTicketReset(interaction, interaction.message.id, lang);
    return;
  }

  if (interaction.isButton() && interaction.customId === `back_${lang}`) {
    cancelReset(interaction.user.id);
    cancelCategoryReset(interaction.user.id);
    await interaction.update({ embeds: [getMainEmbed(lang)], components: [getMainMenu(lang)] });
    return;
  }

  if (interaction.isButton() && interaction.customId === `back_streaming_${lang}`) {
    cancelReset(interaction.user.id);
    cancelCategoryReset(interaction.user.id);
    const isTicket = interaction.message.embeds[0]?.color === 0x5865F2;
    const embedColor = isTicket ? 0x5865F2 : 0x000000;
    const backButtonId = isTicket ? `back_ticket_${lang}` : `back_${lang}`;
    await interaction.update({ 
      embeds: [new EmbedBuilder().setTitle(isEN ? "📺 STREAMING SERVICES" : "📺 SERVICIOS DE STREAMING").setDescription(isEN ? "Select a service:" : "Selecciona un servicio:").setColor(embedColor)], 
      components: [getStreamingServicesMenu(lang), new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(backButtonId).setLabel(isEN ? "⬅️ BACK" : "⬅️ VOLVER").setStyle(ButtonStyle.Secondary))] 
    });
    return;
  }

  if (interaction.isButton() && interaction.customId === `back_giftcards_${lang}`) {
    cancelReset(interaction.user.id);
    cancelCategoryReset(interaction.user.id);
    const isTicket = interaction.message.embeds[0]?.color === 0x5865F2;
    const embedColor = isTicket ? 0x5865F2 : 0x000000;
    const backButtonId = isTicket ? `back_ticket_${lang}` : `back_${lang}`;
    await interaction.update({ 
      embeds: [new EmbedBuilder().setTitle(isEN ? "🎁 GIFT CARDS" : "🎁 TARJETAS").setDescription(isEN ? "Select a gift card:" : "Selecciona una tarjeta:").setColor(embedColor)], 
      components: [getGiftCardsMenu(lang), new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(backButtonId).setLabel(isEN ? "⬅️ BACK" : "⬅️ VOLVER").setStyle(ButtonStyle.Secondary))] 
    });
    return;
  }

  if (interaction.isButton() && interaction.customId === `back_p2p_${lang}`) {
    cancelReset(interaction.user.id);
    cancelCategoryReset(interaction.user.id);
    const isTicket = interaction.message.embeds[0]?.color === 0x5865F2;
    const embedColor = isTicket ? 0x5865F2 : 0x000000;
    const backButtonId = isTicket ? `back_ticket_${lang}` : `back_${lang}`;
    await interaction.update({ 
      embeds: [new EmbedBuilder().setTitle(isEN ? "💳 P2P EXCHANGE" : "💳 CAMBIO P2P").setDescription(isEN ? "Select a method:" : "Selecciona un método:").setColor(embedColor)], 
      components: [getP2PCategoriesMenu(lang), new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(backButtonId).setLabel(isEN ? "⬅️ BACK" : "⬅️ VOLVER").setStyle(ButtonStyle.Secondary))] 
    });
    return;
  }

  // ========== CERRAR TICKET ==========
  if (interaction.isButton() && interaction.customId === "close_ticket") {
    await interaction.reply({ content: isEN ? "🔒 Closing..." : "🔒 Cerrando...", flags: MessageFlags.Ephemeral });
    setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
    return;
  }

  // ========== MODALES ==========
  
  // Modal Oro (Gold)
  if (interaction.type === 5 && interaction.customId && interaction.customId === `gold_form_${lang}`) {
    try {
      await deleteMenuMessage(interaction.user.id);
      const existingTicket = await hasOpenTicket(interaction.guild, interaction.user.username);
      if (existingTicket) {
        await interaction.reply({ content: isEN ? `❌ You have a ticket: ${existingTicket}` : `❌ Ya tienes un ticket: ${existingTicket}`, flags: MessageFlags.Ephemeral });
        return;
      }
      
      const juegoServidor = interaction.fields.getTextInputValue("juego_servidor");
      const cantidad = interaction.fields.getTextInputValue("cantidad");
      const faccionPersonaje = interaction.fields.getTextInputValue("faccion_personaje");
      const pago = interaction.fields.getTextInputValue("pago");
      const descripcion = interaction.fields.getTextInputValue("descripcion") || (isEN ? "None" : "Ninguna");
      
      const description = isEN 
        ? `**Client:** <@${interaction.user.id}>\n**Service:** Gold\n**Game & Server:** ${juegoServidor}\n**Quantity:** ${cantidad}\n**Faction & Character:** ${faccionPersonaje}\n**Payment:** ${pago}\n**Description:** ${descripcion}`
        : `**Cliente:** <@${interaction.user.id}>\n**Servicio:** Oro\n**Juego y Servidor:** ${juegoServidor}\n**Cantidad:** ${cantidad}\n**Facción y Personaje:** ${faccionPersonaje}\n**Pago:** ${pago}\n**Descripción:** ${descripcion}`;
      
      const category = await interaction.guild.channels.fetch(ID_CATEGORIA_TICKETS);
      const safeUsername = interaction.user.username.replace(/[^a-zA-Z0-9]/g, "-").substring(0, 20);
      const ticketName = `ticket-${safeUsername}`;
      
      const ticketChannel = await interaction.guild.channels.create({
        name: ticketName,
        type: 0,
        parent: category,
        permissionOverwrites: [
          { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
          { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] },
          { id: ID_ROL_SOPORTE, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] }
        ]
      });
      
      const embed = new EmbedBuilder().setTitle("💰 GOLD").setDescription(description).setColor(0x5865F2);
      const closeButton = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("close_ticket").setLabel(isEN ? "🔒 CLOSE" : "🔒 CERRAR").setStyle(ButtonStyle.Danger));
      await ticketChannel.send({ content: `<@${interaction.user.id}> <@&${ID_ROL_SOPORTE}>`, embeds: [embed], components: [closeButton] });
      await sendTempMessage(interaction, isEN ? `✅ Ticket created: ${ticketChannel}` : `✅ Ticket creado: ${ticketChannel}`, 10);
    } catch (error) {
      console.error("Error en gold form:", error);
      await sendTempMessage(interaction, isEN ? "❌ Error creating ticket" : "❌ Error al crear ticket", 10);
    }
    return;
  }

  // Modal Streaming
  if (interaction.type === 5 && interaction.customId && interaction.customId.startsWith("streaming_form_")) {
    try {
      await deleteMenuMessage(interaction.user.id);
      const langCode = interaction.customId.split("_")[2];
      const isENlocal = langCode === "en";
      
      const existingTicket = await hasOpenTicket(interaction.guild, interaction.user.username);
      if (existingTicket) {
        await interaction.reply({ content: isENlocal ? `❌ You have a ticket: ${existingTicket}` : `❌ Ya tienes un ticket: ${existingTicket}`, flags: MessageFlags.Ephemeral });
        return;
      }
      
      const nombre = interaction.fields.getTextInputValue("nombre");
      const tipoCuenta = interaction.fields.getTextInputValue("tipo_cuenta");
      const plan = interaction.fields.getTextInputValue("plan");
      const descripcion = interaction.fields.getTextInputValue("descripcion") || (isENlocal ? "None" : "Ninguna");
      
      const description = isENlocal 
        ? `**Client:** <@${interaction.user.id}>\n**Service:** Streaming\n**Full Name:** ${nombre}\n**Account Type:** ${tipoCuenta}\n**Plan:** ${plan}\n**Description:** ${descripcion}`
        : `**Cliente:** <@${interaction.user.id}>\n**Servicio:** Streaming\n**Nombre:** ${nombre}\n**Tipo de cuenta:** ${tipoCuenta}\n**Plan:** ${plan}\n**Descripción:** ${descripcion}`;
      
      const category = await interaction.guild.channels.fetch(ID_CATEGORIA_TICKETS);
      const safeUsername = interaction.user.username.replace(/[^a-zA-Z0-9]/g, "-").substring(0, 20);
      const ticketName = `ticket-${safeUsername}`;
      
      const ticketChannel = await interaction.guild.channels.create({
        name: ticketName,
        type: 0,
        parent: category,
        permissionOverwrites: [
          { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
          { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] },
          { id: ID_ROL_SOPORTE, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] }
        ]
      });
      
      const embed = new EmbedBuilder().setTitle("📺 STREAMING").setDescription(description).setColor(0x5865F2);
      const closeButton = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("close_ticket").setLabel(isENlocal ? "🔒 CLOSE" : "🔒 CERRAR").setStyle(ButtonStyle.Danger));
      await ticketChannel.send({ content: `<@${interaction.user.id}> <@&${ID_ROL_SOPORTE}>`, embeds: [embed], components: [closeButton] });
      await sendTempMessage(interaction, isENlocal ? `✅ Ticket created: ${ticketChannel}` : `✅ Ticket creado: ${ticketChannel}`, 10);
    } catch (error) {
      console.error("Error en streaming form:", error);
      await sendTempMessage(interaction, isEN ? "❌ Error creating ticket" : "❌ Error al crear ticket", 10);
    }
    return;
  }

  // Modal Gift Card
  if (interaction.type === 5 && interaction.customId && interaction.customId.startsWith("giftcard_form_")) {
    try {
      await deleteMenuMessage(interaction.user.id);
      const langCode = interaction.customId.split("_")[2];
      const isENlocal = langCode === "en";
      
      const existingTicket = await hasOpenTicket(interaction.guild, interaction.user.username);
      if (existingTicket) {
        await interaction.reply({ content: isENlocal ? `❌ You have a ticket: ${existingTicket}` : `❌ Ya tienes un ticket: ${existingTicket}`, flags: MessageFlags.Ephemeral });
        return;
      }
      
      const nombre = interaction.fields.getTextInputValue("nombre");
      const nombreGiftcard = interaction.fields.getTextInputValue("nombre_giftcard");
      const monto = interaction.fields.getTextInputValue("monto");
      const descripcion = interaction.fields.getTextInputValue("descripcion") || (isENlocal ? "None" : "Ninguna");
      
      const description = isENlocal 
        ? `**Client:** <@${interaction.user.id}>\n**Service:** Gift Card\n**Full Name:** ${nombre}\n**Gift Card:** ${nombreGiftcard}\n**Amount:** ${monto}\n**Description:** ${descripcion}`
        : `**Cliente:** <@${interaction.user.id}>\n**Servicio:** Gift Card\n**Nombre:** ${nombre}\n**Gift Card:** ${nombreGiftcard}\n**Monto:** ${monto}\n**Descripción:** ${descripcion}`;
      
      const category = await interaction.guild.channels.fetch(ID_CATEGORIA_TICKETS);
      const safeUsername = interaction.user.username.replace(/[^a-zA-Z0-9]/g, "-").substring(0, 20);
      const ticketName = `ticket-${safeUsername}`;
      
      const ticketChannel = await interaction.guild.channels.create({
        name: ticketName,
        type: 0,
        parent: category,
        permissionOverwrites: [
          { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
          { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] },
          { id: ID_ROL_SOPORTE, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] }
        ]
      });
      
      const embed = new EmbedBuilder().setTitle("🎁 GIFT CARD").setDescription(description).setColor(0x5865F2);
      const closeButton = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("close_ticket").setLabel(isENlocal ? "🔒 CLOSE" : "🔒 CERRAR").setStyle(ButtonStyle.Danger));
      await ticketChannel.send({ content: `<@${interaction.user.id}> <@&${ID_ROL_SOPORTE}>`, embeds: [embed], components: [closeButton] });
      await sendTempMessage(interaction, isENlocal ? `✅ Ticket created: ${ticketChannel}` : `✅ Ticket creado: ${ticketChannel}`, 10);
    } catch (error) {
      console.error("Error en giftcard form:", error);
      await sendTempMessage(interaction, isEN ? "❌ Error creating ticket" : "❌ Error al crear ticket", 10);
    }
    return;
  }

  // Modal Zinli
  if (interaction.type === 5 && interaction.customId && interaction.customId.startsWith("zinli_form_")) {
    try {
      await deleteMenuMessage(interaction.user.id);
      const langCode = interaction.customId.split("_")[2];
      const isENlocal = langCode === "en";
      
      const existingTicket = await hasOpenTicket(interaction.guild, interaction.user.username);
      if (existingTicket) {
        await interaction.reply({ content: isENlocal ? `❌ You have a ticket: ${existingTicket}` : `❌ Ya tienes un ticket: ${existingTicket}`, flags: MessageFlags.Ephemeral });
        return;
      }
      
      const nombre = interaction.fields.getTextInputValue("nombre");
      const monto = interaction.fields.getTextInputValue("monto");
      const descripcion = interaction.fields.getTextInputValue("descripcion") || (isENlocal ? "None" : "Ninguna");
      
      const description = isENlocal 
        ? `**Client:** <@${interaction.user.id}>\n**Service:** Zinli\n**Full Name:** ${nombre}\n**Amount:** ${monto}\n**Description:** ${descripcion}`
        : `**Cliente:** <@${interaction.user.id}>\n**Servicio:** Zinli\n**Nombre:** ${nombre}\n**Monto:** ${monto}\n**Descripción:** ${descripcion}`;
      
      const category = await interaction.guild.channels.fetch(ID_CATEGORIA_TICKETS);
      const safeUsername = interaction.user.username.replace(/[^a-zA-Z0-9]/g, "-").substring(0, 20);
      const ticketName = `ticket-${safeUsername}`;
      
      const ticketChannel = await interaction.guild.channels.create({
        name: ticketName,
        type: 0,
        parent: category,
        permissionOverwrites: [
          { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
          { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] },
          { id: ID_ROL_SOPORTE, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] }
        ]
      });
      
      const embed = new EmbedBuilder().setTitle("💳 ZINLI").setDescription(description).setColor(0x5865F2);
      const closeButton = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("close_ticket").setLabel(isENlocal ? "🔒 CLOSE" : "🔒 CERRAR").setStyle(ButtonStyle.Danger));
      await ticketChannel.send({ content: `<@${interaction.user.id}> <@&${ID_ROL_SOPORTE}>`, embeds: [embed], components: [closeButton] });
      await sendTempMessage(interaction, isENlocal ? `✅ Ticket created: ${ticketChannel}` : `✅ Ticket creado: ${ticketChannel}`, 10);
    } catch (error) {
      console.error("Error en zinli form:", error);
      await sendTempMessage(interaction, isEN ? "❌ Error creating ticket" : "❌ Error al crear ticket", 10);
    }
    return;
  }

  // Modal PayPal
  if (interaction.type === 5 && interaction.customId && interaction.customId.startsWith("paypal_form_")) {
    try {
      await deleteMenuMessage(interaction.user.id);
      const langCode = interaction.customId.split("_")[2];
      const isENlocal = langCode === "en";
      
      const existingTicket = await hasOpenTicket(interaction.guild, interaction.user.username);
      if (existingTicket) {
        await interaction.reply({ content: isENlocal ? `❌ You have a ticket: ${existingTicket}` : `❌ Ya tienes un ticket: ${existingTicket}`, flags: MessageFlags.Ephemeral });
        return;
      }
      
      const nombre = interaction.fields.getTextInputValue("nombre");
      const monto = interaction.fields.getTextInputValue("monto");
      const descripcion = interaction.fields.getTextInputValue("descripcion") || (isENlocal ? "None" : "Ninguna");
      
      const description = isENlocal 
        ? `**Client:** <@${interaction.user.id}>\n**Service:** PayPal\n**Full Name:** ${nombre}\n**Amount:** ${monto}\n**Description:** ${descripcion}`
        : `**Cliente:** <@${interaction.user.id}>\n**Servicio:** PayPal\n**Nombre:** ${nombre}\n**Monto:** ${monto}\n**Descripción:** ${descripcion}`;
      
      const category = await interaction.guild.channels.fetch(ID_CATEGORIA_TICKETS);
      const safeUsername = interaction.user.username.replace(/[^a-zA-Z0-9]/g, "-").substring(0, 20);
      const ticketName = `ticket-${safeUsername}`;
      
      const ticketChannel = await interaction.guild.channels.create({
        name: ticketName,
        type: 0,
        parent: category,
        permissionOverwrites: [
          { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
          { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] },
          { id: ID_ROL_SOPORTE, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] }
        ]
      });
      
      const embed = new EmbedBuilder().setTitle("💳 PAYPAL").setDescription(description).setColor(0x5865F2);
      const closeButton = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("close_ticket").setLabel(isENlocal ? "🔒 CLOSE" : "🔒 CERRAR").setStyle(ButtonStyle.Danger));
      await ticketChannel.send({ content: `<@${interaction.user.id}> <@&${ID_ROL_SOPORTE}>`, embeds: [embed], components: [closeButton] });
      await sendTempMessage(interaction, isENlocal ? `✅ Ticket created: ${ticketChannel}` : `✅ Ticket creado: ${ticketChannel}`, 10);
    } catch (error) {
      console.error("Error en paypal form:", error);
      await sendTempMessage(interaction, isEN ? "❌ Error creating ticket" : "❌ Error al crear ticket", 10);
    }
    return;
  }

  // Modal Bolívares → USDT
  if (interaction.type === 5 && interaction.customId && interaction.customId.startsWith("bolivares_to_usdt_form_")) {
    try {
      await deleteMenuMessage(interaction.user.id);
      const parts = interaction.customId.split("_");
      const langCode = parts[3];
      const isENlocal = langCode === "en";
      
      const existingTicket = await hasOpenTicket(interaction.guild, interaction.user.username);
      if (existingTicket) {
        await interaction.reply({ content: isENlocal ? `❌ You have a ticket: ${existingTicket}` : `❌ Ya tienes un ticket: ${existingTicket}`, flags: MessageFlags.Ephemeral });
        return;
      }
      
      const nombre = interaction.fields.getTextInputValue("nombre");
      const montoBS = interaction.fields.getTextInputValue("monto_bs");
      const descripcion = interaction.fields.getTextInputValue("descripcion") || (isENlocal ? "None" : "Ninguna");
      
      const description = isENlocal 
        ? `**Client:** <@${interaction.user.id}>\n**Service:** Bolívares → USDT\n**Full Name:** ${nombre}\n**Amount in Bolívares:** ${montoBS} BS\n**Description / Send to:** ${descripcion}`
        : `**Cliente:** <@${interaction.user.id}>\n**Servicio:** Bolívares → USDT\n**Nombre:** ${nombre}\n**Cantidad en Bolívares:** ${montoBS} BS\n**Descripción / Enviar a:** ${descripcion}`;
      
      const category = await interaction.guild.channels.fetch(ID_CATEGORIA_TICKETS);
      const safeUsername = interaction.user.username.replace(/[^a-zA-Z0-9]/g, "-").substring(0, 20);
      const ticketName = `ticket-${safeUsername}`;
      
      const ticketChannel = await interaction.guild.channels.create({
        name: ticketName,
        type: 0,
        parent: category,
        permissionOverwrites: [
          { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
          { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] },
          { id: ID_ROL_SOPORTE, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] }
        ]
      });
      
      const embed = new EmbedBuilder().setTitle("🇻🇪 BOLÍVARES → USDT").setDescription(description).setColor(0x5865F2);
      const closeButton = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("close_ticket").setLabel(isENlocal ? "🔒 CLOSE" : "🔒 CERRAR").setStyle(ButtonStyle.Danger));
      await ticketChannel.send({ content: `<@${interaction.user.id}> <@&${ID_ROL_SOPORTE}>`, embeds: [embed], components: [closeButton] });
      await sendTempMessage(interaction, isENlocal ? `✅ Ticket created: ${ticketChannel}` : `✅ Ticket creado: ${ticketChannel}`, 10);
    } catch (error) {
      console.error("Error en bolivares to usdt form:", error);
      await sendTempMessage(interaction, isEN ? "❌ Error creating ticket" : "❌ Error al crear ticket", 10);
    }
    return;
  }

  // Modal USDT → Bolívares
  if (interaction.type === 5 && interaction.customId && interaction.customId.startsWith("usdt_to_bolivares_form_")) {
    try {
      await deleteMenuMessage(interaction.user.id);
      const parts = interaction.customId.split("_");
      const langCode = parts[4];
      const isENlocal = langCode === "en";
      
      const existingTicket = await hasOpenTicket(interaction.guild, interaction.user.username);
      if (existingTicket) {
        await interaction.reply({ content: isENlocal ? `❌ You have a ticket: ${existingTicket}` : `❌ Ya tienes un ticket: ${existingTicket}`, flags: MessageFlags.Ephemeral });
        return;
      }
      
      const nombre = interaction.fields.getTextInputValue("nombre");
      const montoUSDT = interaction.fields.getTextInputValue("monto_usdt");
      const descripcion = interaction.fields.getTextInputValue("descripcion") || (isENlocal ? "None" : "Ninguna");
      
      const description = isENlocal 
        ? `**Client:** <@${interaction.user.id}>\n**Service:** USDT → Bolívares\n**Full Name:** ${nombre}\n**Amount in USDT:** ${montoUSDT} USDT\n**Description / Send to:** ${descripcion}`
        : `**Cliente:** <@${interaction.user.id}>\n**Servicio:** USDT → Bolívares\n**Nombre:** ${nombre}\n**Cantidad en USDT:** ${montoUSDT} USDT\n**Descripción / Enviar a:** ${descripcion}`;
      
      const category = await interaction.guild.channels.fetch(ID_CATEGORIA_TICKETS);
      const safeUsername = interaction.user.username.replace(/[^a-zA-Z0-9]/g, "-").substring(0, 20);
      const ticketName = `ticket-${safeUsername}`;
      
      const ticketChannel = await interaction.guild.channels.create({
        name: ticketName,
        type: 0,
        parent: category,
        permissionOverwrites: [
          { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
          { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] },
          { id: ID_ROL_SOPORTE, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] }
        ]
      });
      
      const embed = new EmbedBuilder().setTitle("🇻🇪 USDT → BOLÍVARES").setDescription(description).setColor(0x5865F2);
      const closeButton = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("close_ticket").setLabel(isENlocal ? "🔒 CLOSE" : "🔒 CERRAR").setStyle(ButtonStyle.Danger));
      await ticketChannel.send({ content: `<@${interaction.user.id}> <@&${ID_ROL_SOPORTE}>`, embeds: [embed], components: [closeButton] });
      await sendTempMessage(interaction, isENlocal ? `✅ Ticket created: ${ticketChannel}` : `✅ Ticket creado: ${ticketChannel}`, 10);
    } catch (error) {
      console.error("Error en usdt to bolivares form:", error);
      await sendTempMessage(interaction, isEN ? "❌ Error creating ticket" : "❌ Error al crear ticket", 10);
    }
    return;
  }

  // Modal Wow Game Time
  if (interaction.type === 5 && interaction.customId && interaction.customId === `wowgt_form_${lang}`) {
    try {
      await deleteMenuMessage(interaction.user.id);
      const existingTicket = await hasOpenTicket(interaction.guild, interaction.user.username);
      if (existingTicket) {
        await interaction.reply({ content: isEN ? `❌ You have a ticket: ${existingTicket}` : `❌ Ya tienes un ticket: ${existingTicket}`, flags: MessageFlags.Ephemeral });
        return;
      }
      
      const nombre = interaction.fields.getTextInputValue("nombre");
      const monto = interaction.fields.getTextInputValue("monto");
      const descripcion = interaction.fields.getTextInputValue("descripcion") || (isEN ? "None" : "Ninguna");
      
      const description = isEN 
        ? `**Client:** <@${interaction.user.id}>\n**Service:** WoW Game Time\n**Full Name:** ${nombre}\n**Amount:** ${monto}\n**Description:** ${descripcion}`
        : `**Cliente:** <@${interaction.user.id}>\n**Servicio:** WoW Tiempo de Juego\n**Nombre:** ${nombre}\n**Monto:** ${monto}\n**Descripción:** ${descripcion}`;
      
      const category = await interaction.guild.channels.fetch(ID_CATEGORIA_TICKETS);
      const safeUsername = interaction.user.username.replace(/[^a-zA-Z0-9]/g, "-").substring(0, 20);
      const ticketName = `ticket-${safeUsername}`;
      
      const ticketChannel = await interaction.guild.channels.create({
        name: ticketName,
        type: 0,
        parent: category,
        permissionOverwrites: [
          { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
          { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] },
          { id: ID_ROL_SOPORTE, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] }
        ]
      });
      
      const embed = new EmbedBuilder().setTitle("🕒 WOW GAME TIME").setDescription(description).setColor(0x5865F2);
      const closeButton = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("close_ticket").setLabel(isEN ? "🔒 CLOSE" : "🔒 CERRAR").setStyle(ButtonStyle.Danger));
      await ticketChannel.send({ content: `<@${interaction.user.id}> <@&${ID_ROL_SOPORTE}>`, embeds: [embed], components: [closeButton] });
      await sendTempMessage(interaction, isEN ? `✅ Ticket created: ${ticketChannel}` : `✅ Ticket creado: ${ticketChannel}`, 10);
    } catch (error) {
      console.error("Error en wowgt form:", error);
      await sendTempMessage(interaction, isEN ? "❌ Error creating ticket" : "❌ Error al crear ticket", 10);
    }
    return;
  }

  // Modal Other
  if (interaction.type === 5 && interaction.customId && interaction.customId === `other_form_${lang}`) {
    try {
      await deleteMenuMessage(interaction.user.id);
      const existingTicket = await hasOpenTicket(interaction.guild, interaction.user.username);
      if (existingTicket) {
        await interaction.reply({ content: isEN ? `❌ You have a ticket: ${existingTicket}` : `❌ Ya tienes un ticket: ${existingTicket}`, flags: MessageFlags.Ephemeral });
        return;
      }
      
      const consulta = interaction.fields.getTextInputValue("consulta");
      const contacto = interaction.fields.getTextInputValue("contacto") || (isEN ? "Not specified" : "No especificado");
      const descripcion = interaction.fields.getTextInputValue("descripcion") || (isEN ? "None" : "Ninguna");
      
      const description = isEN 
        ? `**Client:** <@${interaction.user.id}>\n**Service:** Other\n**Request:** ${consulta}\n**Contact:** ${contacto}\n**Description:** ${descripcion}`
        : `**Cliente:** <@${interaction.user.id}>\n**Servicio:** Otro\n**Consulta:** ${consulta}\n**Contacto:** ${contacto}\n**Descripción:** ${descripcion}`;
      
      const category = await interaction.guild.channels.fetch(ID_CATEGORIA_TICKETS);
      const safeUsername = interaction.user.username.replace(/[^a-zA-Z0-9]/g, "-").substring(0, 20);
      const ticketName = `ticket-${safeUsername}`;
      
      const ticketChannel = await interaction.guild.channels.create({
        name: ticketName,
        type: 0,
        parent: category,
        permissionOverwrites: [
          { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
          { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] },
          { id: ID_ROL_SOPORTE, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] }
        ]
      });
      
      const embed = new EmbedBuilder().setTitle("❓ OTHER").setDescription(description).setColor(0x5865F2);
      const closeButton = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("close_ticket").setLabel(isEN ? "🔒 CLOSE" : "🔒 CERRAR").setStyle(ButtonStyle.Danger));
      await ticketChannel.send({ content: `<@${interaction.user.id}> <@&${ID_ROL_SOPORTE}>`, embeds: [embed], components: [closeButton] });
      await sendTempMessage(interaction, isEN ? `✅ Ticket created: ${ticketChannel}` : `✅ Ticket creado: ${ticketChannel}`, 10);
    } catch (error) {
      console.error("Error en other form:", error);
      await sendTempMessage(interaction, isEN ? "❌ Error creating ticket" : "❌ Error al crear ticket", 10);
    }
    return;
  }

  // Modal Leveling (Boosting)
  if (interaction.type === 5 && interaction.customId && interaction.customId === `leveling_form_${lang}`) {
    try {
      await deleteMenuMessage(interaction.user.id);
      const existingTicket = await hasOpenTicket(interaction.guild, interaction.user.username);
      if (existingTicket) {
        await interaction.reply({ content: isEN ? `❌ You have a ticket: ${existingTicket}` : `❌ Ya tienes un ticket: ${existingTicket}`, flags: MessageFlags.Ephemeral });
        return;
      }
      
      const juegoServidor = interaction.fields.getTextInputValue("juego_servidor");
      const claseFaccion = interaction.fields.getTextInputValue("clase_faccion");
      const niveles = interaction.fields.getTextInputValue("niveles");
      const personajePago = interaction.fields.getTextInputValue("personaje_pago");
      const descripcion = interaction.fields.getTextInputValue("descripcion") || (isEN ? "None" : "Ninguna");
      
      const description = isEN 
        ? `**Client:** <@${interaction.user.id}>\n**Service:** Leveling\n**Game & Server:** ${juegoServidor}\n**Class/Faction:** ${claseFaccion}\n**Levels:** ${niveles}\n**Character & Payment:** ${personajePago}\n**Description:** ${descripcion}`
        : `**Cliente:** <@${interaction.user.id}>\n**Servicio:** Leveling\n**Juego y Servidor:** ${juegoServidor}\n**Clase/Facción:** ${claseFaccion}\n**Niveles:** ${niveles}\n**Personaje y Pago:** ${personajePago}\n**Descripción:** ${descripcion}`;
      
      const category = await interaction.guild.channels.fetch(ID_CATEGORIA_TICKETS);
      const safeUsername = interaction.user.username.replace(/[^a-zA-Z0-9]/g, "-").substring(0, 20);
      const ticketName = `ticket-${safeUsername}`;
      
      const ticketChannel = await interaction.guild.channels.create({
        name: ticketName,
        type: 0,
        parent: category,
        permissionOverwrites: [
          { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
          { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] },
          { id: ID_ROL_SOPORTE, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] }
        ]
      });
      
      const embed = new EmbedBuilder().setTitle("📈 LEVELING").setDescription(description).setColor(0x5865F2);
      const closeButton = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("close_ticket").setLabel(isEN ? "🔒 CLOSE" : "🔒 CERRAR").setStyle(ButtonStyle.Danger));
      await ticketChannel.send({ content: `<@${interaction.user.id}> <@&${ID_ROL_SOPORTE}>`, embeds: [embed], components: [closeButton] });
      await sendTempMessage(interaction, isEN ? `✅ Ticket created: ${ticketChannel}` : `✅ Ticket creado: ${ticketChannel}`, 10);
    } catch (error) {
      console.error("Error en leveling form:", error);
      await sendTempMessage(interaction, isEN ? "❌ Error creating ticket" : "❌ Error al crear ticket", 10);
    }
    return;
  }

  // Modal Professions (Boosting)
  if (interaction.type === 5 && interaction.customId && interaction.customId === `professions_form_${lang}`) {
    try {
      await deleteMenuMessage(interaction.user.id);
      const existingTicket = await hasOpenTicket(interaction.guild, interaction.user.username);
      if (existingTicket) {
        await interaction.reply({ content: isEN ? `❌ You have a ticket: ${existingTicket}` : `❌ Ya tienes un ticket: ${existingTicket}`, flags: MessageFlags.Ephemeral });
        return;
      }
      
      const juegoServidor = interaction.fields.getTextInputValue("juego_servidor");
      const profesiones = interaction.fields.getTextInputValue("profesiones");
      const niveles = interaction.fields.getTextInputValue("niveles");
      const personajePago = interaction.fields.getTextInputValue("personaje_pago");
      const descripcion = interaction.fields.getTextInputValue("descripcion") || (isEN ? "None" : "Ninguna");
      
      const description = isEN 
        ? `**Client:** <@${interaction.user.id}>\n**Service:** Professions\n**Game & Server:** ${juegoServidor}\n**Professions:** ${profesiones}\n**Levels:** ${niveles}\n**Character & Payment:** ${personajePago}\n**Description:** ${descripcion}`
        : `**Cliente:** <@${interaction.user.id}>\n**Servicio:** Profesiones\n**Juego y Servidor:** ${juegoServidor}\n**Profesiones:** ${profesiones}\n**Niveles:** ${niveles}\n**Personaje y Pago:** ${personajePago}\n**Descripción:** ${descripcion}`;
      
      const category = await interaction.guild.channels.fetch(ID_CATEGORIA_TICKETS);
      const safeUsername = interaction.user.username.replace(/[^a-zA-Z0-9]/g, "-").substring(0, 20);
      const ticketName = `ticket-${safeUsername}`;
      
      const ticketChannel = await interaction.guild.channels.create({
        name: ticketName,
        type: 0,
        parent: category,
        permissionOverwrites: [
          { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
          { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] },
          { id: ID_ROL_SOPORTE, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] }
        ]
      });
      
      const embed = new EmbedBuilder().setTitle("⚙️ PROFESSIONS").setDescription(description).setColor(0x5865F2);
      const closeButton = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("close_ticket").setLabel(isEN ? "🔒 CLOSE" : "🔒 CERRAR").setStyle(ButtonStyle.Danger));
      await ticketChannel.send({ content: `<@${interaction.user.id}> <@&${ID_ROL_SOPORTE}>`, embeds: [embed], components: [closeButton] });
      await sendTempMessage(interaction, isEN ? `✅ Ticket created: ${ticketChannel}` : `✅ Ticket creado: ${ticketChannel}`, 10);
    } catch (error) {
      console.error("Error en professions form:", error);
      await sendTempMessage(interaction, isEN ? "❌ Error creating ticket" : "❌ Error al crear ticket", 10);
    }
    return;
  }
});

client.login(TOKEN);
