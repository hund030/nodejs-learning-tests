import axios from "axios";


console.log("start");

const token = "your token"

axios.get("https://graph.microsoft.com/v1.0/myorganization/me/ownedObjects/$/Microsoft.Graph.Application?$select=displayName%2cid%2cappId%2cinfo%2ccreatedDateTime%2ckeyCredentials%2cpasswordCredentials%2cdeletedDateTime&$top=40", {
    headers: {
        'Authorization': `Bearer ${token}`
    }
}).then(async (response) => {
    await Promise.all(response.data.value.map(async (aad: { id: string }) => {
        await axios.delete(`https://graph.microsoft.com/v1.0/myorganization/applications/${aad.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }));
    await Promise.all(response.data.value.map(async (aad: { id: string }) => {
        await axios.delete(`https://graph.microsoft.com/v1.0/directory/deletedItems/${aad.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }));
}).catch((error) => {
    console.log(error);
});
