import * as dotenv from "dotenv"

import UserGram from "./core/usergram"
import * as Plugins from "./plugins"

dotenv.config()

const API_ID = process.env.API_ID
const API_HASH = process.env.API_HASH
const SESSION = process.env.SESSION

if (!API_ID || !API_HASH || !SESSION) {
    throw new Error("Missing environment variables")
}

;(async () => {
    const userGram = new UserGram(parseInt(API_ID), API_HASH, SESSION)
    await userGram.loadPlugins(Plugins)
    await userGram.start()
})()
