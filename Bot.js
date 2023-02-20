const Discord = require('discord.js');
const config = require("./stuff/config.json");
const client = new Discord.Client();
const color_purple = "#644099";


client.login(config.token);


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === '!ping') {
    msg.reply('Ready to serve!');
  }
});

client.on('guildMemberAdd', member => {
    const embed = new Discord.MessageEmbed()
        .setTitle("Welcome, ${member.user.username}")
        .setDescription('Welcome on the test server!')
        .setColor(color_purple)
    member.guild.channels.cache.find(channel => channel.name === 'general').send(embed);
});