import axios from "axios";

console.log("start");

const token =""

axios
  .get("https://dev.teams.microsoft.com/api/appdefinitions", {
    headers: {
      Authorization: `${token}`,
    },
  })
  .then(async (response) => {
    await Promise.all(
      response.data.map(async (teamsApp: { teamsAppId: string }) => {
        console.log(`deleting ${teamsApp.teamsAppId}`);
        await axios.delete(
          `https://dev.teams.microsoft.com/api/appdefinitions/${teamsApp.teamsAppId}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
      })
    );
  })
  .catch((error) => {
    console.log(error);
  });
