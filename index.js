const { Plugin } = require("powercord/entities");
const { inject, uninject } = require('powercord/injector');
const { getModule } = require('powercord/webpack');

module.exports = class StinkyMedia extends Plugin {
    async startPlugin() {
        const Message = await getModule(m => m.default?.displayName === "Message");
        inject('stinky-media', Message, 'default', (args, res) => {
            var message = [...args][0].childrenAccessories.props.message;

            message.attachments.forEach((el) => {
                if (el.content_type.startsWith("image") && el.proxy_url.startsWith("https://media.discordapp.net")) {
                    el.proxy_url = "https://cdn.discordapp.com" + el.proxy_url.slice("https://media.discordapp.net".length);
                }
            });

            message.embeds.forEach((el) => {
                if (el.image && el.image.proxyURL.startsWith("https://media.discordapp.net")) {
                    el.image.proxyURL = "https://cdn.discordapp.com" + el.image.proxyURL.slice("https://media.discordapp.net".length);
                }
            });

            return res;
        });
    }

    pluginWillUnload() {
        uninject('stinky-media');
    }
}