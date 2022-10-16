const { TelegramClient } = require("telegram")
const { StringSession } = require("telegram/sessions")
const input = require("input")


(async () => {
    const stringSession = new StringSession("")
    const apiId = await input.text("Enter your API ID: ")
    const apiHash = await input.text("Enter your API hash: ")
    const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
    })
    await client.start({
        phoneNumber: async () => await input.text("Please enter your number: "),
        password: async () => await input.password("Please enter your password: "),
        phoneCode: async () => await input.text("Please enter the code you received: "),
        onError: (err) => console.log(err),
    })
    console.log(
        "You should now be connected and the string session is sent to your saved messages. Please check it!"
    )
    await client.sendMessage("me", { message: client.session.save() })
    console.log("Press CTRL+C to stop the script.")
})()
