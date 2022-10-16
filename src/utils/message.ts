export const MAX_MESSAGE_LENGTH = 4096

export function truncate(text: string): string {
    return text.length > MAX_MESSAGE_LENGTH ? text.slice(0, MAX_MESSAGE_LENGTH - 3) + "..." : text
}
