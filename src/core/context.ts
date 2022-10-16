import { Api, TelegramClient } from "telegram"
import { EditMessageParams } from "telegram/client/messages"
import { Entity } from "telegram/define"
import { NewMessageEvent } from "telegram/events"

import type UserGram from "./usergram"
import { truncate } from "../utils/message"

/** Interface for responding messages */
type RespondParams = {
    /** Time to delete the message */
    deleteAfter?: number
    /** Force reply even the context invoker is outgoing */
    reply?: boolean
} & Omit<EditMessageParams, "text" | "message" | "buttons">

export default class Context {
    message: Api.Message
    msg: Api.Message

    response: Api.Message | undefined
    replyTo: Api.MessageReplyHeader | undefined
    outgoing: boolean

    private _chat: Entity | undefined
    private _intputRaw: string | undefined

    constructor(
        public readonly bot: UserGram,
        public readonly client: TelegramClient,
        public readonly event: NewMessageEvent,
        public readonly cmdLength: number
    ) {
        this.message = this.msg = event.message
        this._chat = event.message.chat
        this.replyTo = event.message.replyTo
        this._intputRaw = event.message.message?.slice(cmdLength)
        this.outgoing = this.message.out || false
    }

    /**
     * Get the input command without the command trigger
     */
    get input() {
        return this._intputRaw?.trim()
    }

    /**
     * Get the input parameters in array split by space
     */
    get args() {
        return this.input?.split(" ") || []
    }

    /**
     * Get the chat of the message that triggered the command
     */
    get chat() {
        return this._chat as Api.Channel
    }

    /**
     * This is a wrapper for `Message.getReplyMessage()`.
     * Get the replied message of the invoked command if any
     *
     * @returns The replied message or undefined
     */
    async getReply(): Promise<Api.Message | undefined> {
        await this.message.edit({})
        return await this.message.getReplyMessage()
    }

    /**
     * Respond to message that triggered the command
     * When the `replyTo` is `true`, it will reply to the message that triggered the command
     * When it is outgoing message, it will edit the message that triggered the command
     *
     * @param text The text to send
     * @param params The respond parameters
     * @returns The message sent or edited if any
     */
    async respond(text: string, params?: RespondParams): Promise<Api.Message | undefined> {
        if (this.message.out || !params?.reply) {
            this.response = await this.message.edit({
                text: truncate(text),
                file: params?.file,
                linkPreview: params?.linkPreview,
                formattingEntities: params?.formattingEntities,
                forceDocument: params?.forceDocument,
                parseMode: params?.parseMode,
                schedule: params?.schedule,
            })
        } else {
            this.response = await this.message.reply({
                message: truncate(text),
                file: params?.file,
                linkPreview: params?.linkPreview,
                formattingEntities: params?.formattingEntities,
                forceDocument: params?.forceDocument,
                parseMode: params?.parseMode,
                schedule: params?.schedule,
            })
        }

        if (params?.deleteAfter) {
            await this.deleteAfter(params.deleteAfter)
        }
        return this.response
    }

    /**
     * Delete the outgoing message that triggered the command in X milliseconds
     *
     * @param time Time in Miliseconds
     */
    async deleteAfter(time: number): Promise<void> {
        if (!this.outgoing) {
            return
        }
        setTimeout(async () => {
            await this.message.delete()
        }, time)
    }
}
