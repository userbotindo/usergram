const { TelegramClient } = require("telegram")
const { StringSession } = require("telegram/sessions")
const input = require("input");


(async () => {
    const stringSession = new StringSession("")
    let apiId = await input.text("Enter your API ID: ")
    try {
        apiId = parseInt(apiId)
    } catch (_) {
        console.log("Invalid API ID. Must be an integer.")
        process.exit(1)
    }
    const apiHash = await input.text("Enter your API hash: ")
    const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
        deviceModel: "UserGram",
    })
    await client.start({
        phoneNumber: async () => await input.text("Please enter your number: "),
        password: async () => await input.password("Please enter your password: "),
        phoneCode: async () => await input.text("Please enter the code you received: "),
        onError: (err) => console.log(err),
    })
    await client.sendMessage("me", { message: client.session.save() })
    console.log(
        "You should now be connected and the string session is sent to your saved messages. Please check it!"
    )
    console.log("Press CTRL+C to stop the script.")
})()
