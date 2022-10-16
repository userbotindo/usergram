import { Api, TelegramClient } from "telegram"
import { NewMessageEvent } from "telegram/events"
import { Entity } from "telegram/define"

import type UserGram from "./usergram"

export default class Context {
    message: Api.Message
    msg: Api.Message

    chat: Entity | undefined
    replyTo: Api.MessageReplyHeader | undefined

    private _intputRaw: string | undefined

    constructor(
        public readonly bot: UserGram,
        public readonly client: TelegramClient,
        public readonly event: NewMessageEvent,
        public readonly cmdLength: number
    ) {
        this.message = this.msg = event.message
        this.chat = event.message.chat
        this.replyTo = event.message.replyTo
        this._intputRaw = event.message.message?.slice(cmdLength)
    }

    get input() {
        return this._intputRaw?.trim()
    }

    async respond(text: string): Promise<Api.Message | undefined> {
        if (this.message.out) {
            return await this.message.edit({ text })
        } else {
            return await this.message.reply({ message: text })
        }
    }
}
