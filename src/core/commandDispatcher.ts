import { TelegramClient } from "telegram"
import { NewMessageEvent } from "telegram/events"

import type Plugin from "./plugin"
import { getPrefixedFunc } from "../utils/core"
import Context from "./context"
import UserGram from "./usergram"

type CommandFunc = (ctx: Context) => void | Promise<void>

class Command {
    constructor(
        public readonly name: string,
        public readonly plugin: Plugin,
        public readonly func: CommandFunc
    ) {}

    async call(callback: CommandFunc, ctx: Context) {
        try {
            await callback(ctx)
        } catch (err) {
            ctx.bot.log.error(err as string)
        }
    }
}

export class CommandDispatcher {
    private readonly funcPrefix = "cmd_"
    private readonly commandPrefix = "."
    private func: Map<string, Command> = new Map()

    constructor(private _bot: UserGram) {}

    registerHandler(plug: Plugin, name: string, func: CommandFunc) {
        if (name in this.func) {
            throw new Error("Command already exists")
        }
        this._bot.log.debug(`Registering command: ${name}`)
        this.func.set(name, new Command(name, (plug as any).prototype, func))
    }

    registerHandlers(plug: Plugin) {
        const methList = getPrefixedFunc(plug, this.funcPrefix)
        for (const key in methList) {
            if (
                plug.hasOwnProperty.call(methList, key) &&
                methList[key].startsWith(this.funcPrefix)
            ) {
                const name = methList[key].slice(this.funcPrefix.length)
                this.registerHandler(
                    plug,
                    name,
                    Object.getOwnPropertyDescriptor((plug as any).prototype, methList[key])?.value
                )
            }
        }
    }

    unRegisterHandler(_name: string) {
        // TODO: Implement handler unregistration
    }

    handler(bot: UserGram, client: TelegramClient, event: NewMessageEvent) {
        const { message } = event
        if (message.message && message.message.startsWith(this.commandPrefix)) {
            const parts = message.message.split(" ")
            const cmd = parts[0].slice(1)
            const cmdHandler = this.func.get(cmd)
            if (cmdHandler) {
                const ctx = new Context(bot, client, event, parts[0].length)
                try {
                    cmdHandler.call(cmdHandler.func.bind(cmdHandler.plugin), ctx)
                } catch (e) {
                    bot.log.error(`Error while executing command ${cmd}: ${e}`)
                }
            }
        }
    }
}
