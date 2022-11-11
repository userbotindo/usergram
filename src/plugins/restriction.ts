import { Api } from "telegram"

import { Context, Plugin } from "../core"
import { parseTarget } from "../utils/telegram"

export default class Restriction extends Plugin {
    async cmd_ban(ctx: Context) {
        if (ctx.chat.className !== "Channel") {
            return await ctx.respond("This command only works in groups")
        }

        const target = await parseTarget(ctx)
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

        const target = await parseTarget(ctx)
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

        const target = await parseTarget(ctx)
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

        const target = await parseTarget(ctx)
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
