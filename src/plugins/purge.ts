import { performance } from "perf_hooks"

import { Context, Plugin } from "../core"

export default class Purge extends Plugin {
    async cmd_del(ctx: Context) {
        if (!ctx.replyTo) {
            return await ctx.respond("Reply to a message to delete it.")
        }
        await ctx.respond("Deleting...")
        await (await ctx.getReply())?.delete()
        await ctx.respond("Done", { deleteAfter: 1000 })
    }

    async cmd_prune(ctx: Context) {
        const replied = ctx.replyTo?.replyToMsgId
        if (!replied) {
            return await ctx.respond("Reply to a message to prune")
        }
        const toDelete = [...Array(ctx.message.id - 1 - replied).keys()].map(
            (x) => x + replied
        ) as number[]
        const timeStart = performance.now()
        await ctx.client.deleteMessages(ctx.chat.id, toDelete, { revoke: true })
        const timeEnd = performance.now()
        await ctx.respond(
            `Deleted ${toDelete.length} messages in ${(timeEnd - timeStart).toFixed(2)}ms`,
            { deleteAfter: 2000 }
        )
    }

    async cmd_purgeme(ctx: Context) {
        if (!ctx.args || isNaN(parseInt(ctx.args[0]))) {
            return await ctx.respond("Specify a number of messages to delete")
        }
        const timeStart = performance.now()
        let deleted = 0
        const toDelete = parseInt(ctx.args[0])
        for await (const message of ctx.client.iterMessages(ctx.chat, {
            fromUser: ctx.bot.self?.id,
        })) {
            await message.delete()
            deleted++
            if (deleted >= toDelete + 1) {
                break
            }
        }
        const timeEnd = performance.now()
        await ctx.respond(`Done purgeme in ${(timeEnd - timeStart).toFixed(2)}ms`, {
            deleteAfter: 2000,
        })
    }
}
