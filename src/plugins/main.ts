import Plugin from "../core/plugin"
import Context from "../core/context"

export default class Main extends Plugin {
    async cmd_ping(ctx: Context) {
        const start = Date.now()
        await ctx.respond("Pong!")
        await ctx.respond(`Pong! (${Date.now() - start}ms)!`)
    }

    async cmd_info(ctx: Context) {
        await ctx.respond(`**Usergram info**:
**UserGram Version**: ${process.env.npm_package_version}
**Node.js version**: ${process.version}
**GramJS version**: ${ctx.client.__version__}
**Platform**: v${process.platform}
**Memory usage**: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`)
    }
}
