import { Logger, TelegramClient } from "telegram"
import { StringSession } from "telegram/sessions"
import { NewMessage, NewMessageEvent } from "telegram/events"
import { LogLevel } from "telegram/extensions/Logger"

import Plugin from "./plugin"
import { CommandDispatcher } from "./commandDispatcher"

export default class UserGram {
    private readonly client: TelegramClient
    private commandDispatcher = new CommandDispatcher()
    public log: Logger = new Logger(LogLevel.INFO)

    constructor(apiId: number, apiHash: string, session: string) {
        this.client = new TelegramClient(new StringSession(session), apiId, apiHash, {
            connectionRetries: 5,
            baseLogger: this.log,
        })
    }

    private handler(event: NewMessageEvent) {
        this.commandDispatcher.handler(this, this.client, event)
    }

    public async loadPlugins(plugins: Plugin[]) {
        this.log.info("Loading plugins...")
        for (const plugin of plugins) {
            this.log.info("Loading plugin: " + plugin)
            this.commandDispatcher.registerHandlers(plugin)
        }
        this.client.addEventHandler(this.handler.bind(this), new NewMessage())
    }

    public async start() {
        await this.client.start({
            botAuthToken: "",
        })
        this.log.info("Client started!")
    }
}
