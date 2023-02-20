const Discord = require('discord.js');
const config = require("./stuff/config.json");
const client = new Discord.Client();
client.login(config.token);


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === '!ping') {
    msg.reply('Ready to serve!');
  }
});