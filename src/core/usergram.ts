import { Api, Logger, TelegramClient } from "telegram"
import { StringSession } from "telegram/sessions"
import { NewMessage, NewMessageEvent } from "telegram/events"
import { LogLevel } from "telegram/extensions/Logger"

import Plugin from "./plugin"
import { CommandDispatcher } from "./commandDispatcher"

export default class UserGram {
    private readonly client: TelegramClient
    private _self: Api.User | undefined
    private commandDispatcher: CommandDispatcher
    public log: Logger = new Logger(LogLevel.INFO)

    constructor(apiId: number, apiHash: string, session: string) {
        this.log.info("Initializing Usergram client...")
        this.commandDispatcher = new CommandDispatcher(this)
        this.client = new TelegramClient(new StringSession(session), apiId, apiHash, {
            connectionRetries: 5,
            baseLogger: this.log,
        })
    }

    /**
     * Gets the current logged in user
     */
    get self() {
        return this._self
    }

    private eventHandler(event: NewMessageEvent) {
        this.log.debug("New message event: " + event.message.message)
        if (event.message.out) {
            this.commandDispatcher.handler(this, this.client, event)
        }
    }

    public async loadPlugins(plugins: { [key: string]: Plugin }) {
        this.log.info("Loading plugins...")
        for (const pluginName in plugins) {
            const plugin = plugins[pluginName]
            if (!(Object.getPrototypeOf(plugin).name == "Plugin")) continue
            this.log.info("Loading plugin: " + pluginName)
            this.commandDispatcher.registerHandlers(plugin)
        }
        this.client.addEventHandler(this.eventHandler.bind(this), new NewMessage())
    }

    private registerSignals() {
        process.on("SIGINT", this.exitHandler.bind(this))
        process.on("SIGTERM", this.exitHandler.bind(this))
        process.on("SIGABRT", this.exitHandler.bind(this))
        process.on("SIGQUIT", this.exitHandler.bind(this))
    }

    private exitHandler() {
        this.log.info("Exiting...")
        this.client.disconnect()
        process.exit(0)
    }

    public async start() {
        this.registerSignals()
        await this.client.start({
            botAuthToken: "",
        })
        this._self = (await this.client.getMe()) as Api.User
        this.log.info("Client started!")
    }
}
