import Discord, { GatewayIntentBits } from "discord.js"
import request from "request";
import config from './stuff/config.json' assert { type: 'json' };
import fetch from "node-fetch";
const color_purple = "#644099";
const error_color = "#8B0000";
const client = new Discord.Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]});
//const client = new Discord.Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (msg) => {
  console.log(`Message received: ${msg.content}`)
  if (msg.content === "!ping") {
    msg.reply("Ready to serve!");
  }
});

client.on("guildMemberAdd", (member) => {
  const embed = new Discord.MessageEmbed()
    .setTitle(`Welcome, ${member.user.username}`)
    .setDescription("Welcome on the test server!")
    .setColor(color_purple);
  member.guild.channels.cache
    .find((channel) => channel.name === "general")
    .send(embed);
});

client.on("message", async (message) => {
  if (message.content.startsWith("!stock")) {
    const symbol = message.content.split(" ")[1]; // to get the second element, which displays the symbol :)
    if (!symbol) {
      await message.channel.send(
        "Provide a proper sybmol, if you don't know what you are looking for 0_0"
      );
      return;
    }
    try {
      const data = await getStockDataFromAlphavantage(symbol);
      const embed = new Discord.MessageEmbed()
        .setColor(color_purple)
        .setTitle(`Stock price for ${data.symbol}`)
        .addFields(
          { name: "Price", value: `$${data.price}`, inline: true },
          {
            name: "Change",
            value: `$${data.change} (${data.percentChange})`,
            inline: true,
          },
          { name: "Last updated", value: data.lastUpdated }
        )
        .setTimestamp();
      await message.channel.send(embed);
    } catch (error) {
      const embed = new Discord.MessageEmbed()
        .setTitle("Error!")
        .setDescription(error.message)
        .setColor(error_color);
      message.channel.send(embed);
    }
  }
});

client.on("message", (msg) => {
  if (msg.author.bot) return;

  if (msg.content === "$inspire") {
    getQuote().then((quote) => msg.channel.send(quote));
  }
});

const getQuote = ()=> {
  return fetch("https://zenquotes.io/api/random")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data[0]["q"] + " -" + data[0]["a"];
    });
}

const getStockDataFromAlphavantage = (symbol)=> {
  const apiKey = config.alphavantage_api_key;
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
  return new Promise((resolve, reject) => {
    request(url, { json: true }, (error, response, body) => {
      if (error) {
        reject(error);
      } else if (body["Error Message"]) {
        reject(new Error("Invalid symbol"));
      } else {
        const data = body["Global Quote"];
        resolve({
          symbol: data["01. symbol"],
          price: data["05. price"],
          change: data["09. change"],
          percentChange: data["10. change percent"],
          lastUpdated: data["07. latest trading day"],
        });
      }
    });
  });
}


try{
  await client.login(config.token);
}catch(error){
  console.error("Error logging in: ", error.message)
}