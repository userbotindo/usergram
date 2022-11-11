import { Api } from "telegram"

import { Context, Plugin } from "../core"
import { parseTarget } from "../utils/telegram"

export default class Restriction extends Plugin {
    async cmd_promote(ctx: Context) {
        if (ctx.chat.className !== "Channel") {
            return await ctx.respond("This command only works in groups")
        }

        const target = await parseTarget(ctx)
        if (!target) {
            return
        }

        try {
            await ctx.client.invoke(
                new Api.channels.EditAdmin({
                    channel: ctx.chat.id,
                    userId: target,
                    adminRights: new Api.ChatAdminRights({
                        changeInfo: true,
                        deleteMessages: true,
                        banUsers: true,
                        inviteUsers: true,
                        pinMessages: true,
                        manageCall: true,
                    }),
                    rank: "Admin",
                })
            )
        } catch (err) {
            if (err instanceof Error) {
                return await ctx.respond(err.message)
            }
            return await ctx.respond("Unknown error " + err)
        }
        await ctx.respond("Successfuly promoted")
    }

    async cmd_demote(ctx: Context) {
        if (ctx.chat.className !== "Channel") {
            return await ctx.respond("This command only works in groups")
        }

        const target = await parseTarget(ctx)
        if (!target) {
            return
        }

        try {
            await ctx.client.invoke(
                new Api.channels.EditAdmin({
                    channel: ctx.chat.id,
                    userId: target,
                    adminRights: new Api.ChatAdminRights({
                        changeInfo: false,
                        postMessages: false,
                        editMessages: false,
                        deleteMessages: false,
                        banUsers: false,
                        inviteUsers: false,
                        pinMessages: false,
                        addAdmins: false,
                        manageCall: false,
                    }),
                    rank: "",
                })
            )
        } catch (err) {
            if (err instanceof Error) {
                return await ctx.respond(err.message)
            }
            return await ctx.respond("Unknown error " + err)
        }
        await ctx.respond("Successfuly demoted")
    }
}
