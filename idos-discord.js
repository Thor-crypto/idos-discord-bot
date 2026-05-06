const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes
} = require("discord.js");

const TOKEN = "TVŮJ_BOT_TOKEN";
const CLIENT_ID = "TVÉ_CLIENT_ID";

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("ready", async () => {
  console.log(`Přihlášen jako ${client.user.tag}`);

  const commands = [
    new SlashCommandBuilder()
      .setName("spoj")
      .setDescription("Vyhledá spojení")
      .addStringOption(option =>
        option
          .setName("odkud")
          .setDescription("Odkud")
          .setRequired(true)
      )
      .addStringOption(option =>
        option
          .setName("kam")
          .setDescription("Kam")
          .setRequired(true)
      )
      .toJSON()
  ];

  const rest = new REST({ version: "10" }).setToken(TOKEN);

  await rest.put(
    Routes.applicationCommands(CLIENT_ID),
    { body: commands }
  );

  console.log("Slash command registrován");
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "spoj") {
    const odkud = interaction.options.getString("odkud");
    const kam = interaction.options.getString("kam");

    await interaction.deferReply();

    try {
      const res = await fetch(
        `https://super-brook-6e3b.florian-thor007.workers.dev/?odkud=${encodeURIComponent(odkud)}&kam=${encodeURIComponent(kam)}`
      );

      const text = await res.text();

      await interaction.editReply(text);
    } catch (err) {
      console.error(err);
      await interaction.editReply("Chyba při hledání spojení.");
    }
  }
});

client.login(TOKEN);
