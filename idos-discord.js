const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');

const TOKEN = 'SEM_TOKEN';
const CLIENT_ID = 'SEM_CLIENT_ID';

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const commands = [
  new SlashCommandBuilder()
    .setName('spoj')
    .setDescription('Najde spojení')
    .addStringOption(option =>
      option.setName('odkud')
        .setDescription('Např. Brno')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('kam')
        .setDescription('Např. Praha')
        .setRequired(true))
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('Registruji slash command...');

    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );

    console.log('Slash command registrován');
  } catch (error) {
    console.error(error);
  }
})();

client.on('ready', () => {
  console.log(`Přihlášen jako ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'spoj') {
    const odkud = interaction.options.getString('odkud');
    const kam = interaction.options.getString('kam');

    const url =
      `https://super-brook-6e3b.florian-thor007.workers.dev/?odkud=${encodeURIComponent(odkud)}&kam=${encodeURIComponent(kam)}`;

    const res = await fetch(url);
    const text = await res.text();

    await interaction.reply('```' + text + '```');
  }
});

client.login(TOKEN);
