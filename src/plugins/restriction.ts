import { Api } from "telegram"

import Context from "../core/context"
import Plugin from "../core/plugin"

export default class Restriction extends Plugin {
    async parseTarget(ctx: Context): Promise<bigInt.BigInteger | undefined> {
        let target: bigInt.BigInteger | undefined
        if (ctx.replyTo) {
            target = (await ctx.getReply())?.senderId
        } else if (ctx.input) {
            try {
                target = BigInt(ctx.input) as unknown as bigInt.BigInteger
            } catch (_) {
                await ctx.respond("Invalid user ID")
                return
            }
        }

        if (!target) {
            await ctx.respond("No user specified")
            return
        }
        return target
    }

    async cmd_ban(ctx: Context) {
        if (ctx.chat.className !== "Channel") {
            return await ctx.respond("This command only works in groups")
        }

        const target = await this.parseTarget(ctx)
        if (!target) {
            return
        }

        try {
            await ctx.client.invoke(
                new Api.channels.EditBanned({
                    channel: ctx.chat.id,
                    participant: target,
                    bannedRights: new Api.ChatBannedRights({
                        untilDate: 0,
                        viewMessages: true,
                    }),
                })
            )
        } catch (err) {
            if (err instanceof Error) {
                return await ctx.respond(err.message)
            }
            return await ctx.respond("Unknown error " + err)
        }
        await ctx.respond("Successfuly banned", { deleteAfter: 5000 })
    }

    async cmd_unban(ctx: Context) {
        if (ctx.chat.className !== "Channel") {
            return await ctx.respond("This command only works in groups")
        }

        const target = await this.parseTarget(ctx)
        if (!target) {
            return
        }

        try {
            await ctx.client.invoke(
                new Api.channels.EditBanned({
                    channel: ctx.chat.id,
                    participant: target,
                    bannedRights: new Api.ChatBannedRights({
                        untilDate: 0,
                        viewMessages: false,
                    }),
                })
            )
        } catch (err) {
            if (err instanceof Error) {
                return await ctx.respond(err.message)
            }
            return await ctx.respond("Unknown error " + err)
        }
        await ctx.respond("Successfuly unbanned", { deleteAfter: 5000 })
    }

    async cmd_mute(ctx: Context) {
        if (ctx.chat.className !== "Channel") {
            return await ctx.respond("This command only works in groups")
        }

        const target = await this.parseTarget(ctx)
        if (!target) {
            return
        }

        try {
            await ctx.client.invoke(
                new Api.channels.EditBanned({
                    channel: ctx.chat.id,
                    participant: target,
                    bannedRights: new Api.ChatBannedRights({
                        untilDate: 0,
                        sendMessages: true,
                    }),
                })
            )
        } catch (err) {
            if (err instanceof Error) {
                return await ctx.respond(err.message)
            }
            return await ctx.respond("Unknown error " + err)
        }
        await ctx.respond("Successfuly muted", { deleteAfter: 5000 })
    }

    async cmd_unmute(ctx: Context) {
        if (ctx.chat.className !== "Channel") {
            return await ctx.respond("This command only works in groups")
        }

        const target = await this.parseTarget(ctx)
        if (!target) {
            return
        }

        try {
            await ctx.client.invoke(
                new Api.channels.EditBanned({
                    channel: ctx.chat.id,
                    participant: target,
                    bannedRights: new Api.ChatBannedRights({
                        untilDate: 0,
                        sendMessages: false,
                    }),
                })
            )
        } catch (err) {
            if (err instanceof Error) {
                return await ctx.respond(err.message)
            }
            return await ctx.respond("Unknown error " + err)
        }
        await ctx.respond("Successfuly unmuted", { deleteAfter: 5000 })
    }
}
