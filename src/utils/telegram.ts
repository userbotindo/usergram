import { Context } from "../core"

/**
 * Parse the target from the context
 * This will prioritize from reply message > mention > userId
 *
 * @param ctx Context of the event
 * @returns Target (user) of the message
 */
export async function parseTarget(ctx: Context): Promise<bigInt.BigInteger | string | undefined> {
    let target: bigInt.BigInteger | undefined
    if (ctx.replyTo) {
        target = (await ctx.getReply())?.senderId
    } else if (ctx.input) {
        // mention
        if (ctx.input.startsWith("@")) {
            return ctx.args[0].substring(1)
        }
        // userId
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
