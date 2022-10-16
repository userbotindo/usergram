import type Plugin from "../core/plugin"

export function getPrefixedFunc(obj: Plugin, prefix: string) {
    const methList = Object.getOwnPropertyNames((obj as any).prototype)
    return methList.filter((key) => key.startsWith(prefix))
}
