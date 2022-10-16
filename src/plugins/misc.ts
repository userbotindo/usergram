import Plugin from "../core/plugin"
import Context from "../core/context"

interface ResponseData {
    ok: boolean
    data: {
        key: string
        length: number
        date: string
    }
}

export default class Misc extends Plugin {
    private async pasteContent(content: string) {
        const res = await fetch("https://stashbin.xyz/api/document", {
            method: "POST",
            body: JSON.stringify({ content }),
        })
        return (await res.json()) as ResponseData
    }

    async cmd_paste(ctx: Context) {
        await ctx.respond("Pasting...")
        let content: string | undefined
        if (ctx.replyTo) {
            const rep = await ctx.getReply()
            if (rep && rep.document) {
                const buffer = await ctx.client.downloadMedia(rep)
                content = buffer?.toString()
            }
        } else {
            content = ctx.input
        }
        if (!content) {
            await ctx.respond("No content to paste")
            await ctx.deleteAfter(5000)
            return
        }

        const res = await this.pasteContent(content)
        await ctx.respond(`https://stashbin.xyz/${res.data.key}`)
    }
}
