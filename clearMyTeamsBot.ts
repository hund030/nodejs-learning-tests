import axios from "axios";

console.log("start");

const token = "";

axios.get("https://dev.teams.microsoft.com/amer/api/botframework", {
    headers: {
        'Authorization': `${token}`
    }
}).then(async (response) => {
    await Promise.all(response.data.map(async (bot: { botId: string }) => {
        console.log(`deleting ${bot.botId}`);
        await axios.delete(`https://dev.teams.microsoft.com/amer/api/botframework/${bot.botId}`, {
            headers: {
                'Authorization': `${token}`
            }
        });
    }));
}).catch((error) => {
    console.log(error.message);
});
