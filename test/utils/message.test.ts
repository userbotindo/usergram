import { describe, expect, test } from "@jest/globals"

import { truncate } from "../../src/utils/message"

const MAX_MESSAGE_LENGTH = 4096

describe("Check message utility helper", () => {
    test(`Should truncate message longer than ${MAX_MESSAGE_LENGTH}`, () => {
        const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.".repeat(
            MAX_MESSAGE_LENGTH + 1
        )
        const truncated = truncate(text)
        expect(truncated).toHaveLength(MAX_MESSAGE_LENGTH)
        expect(truncated).toMatch(/\.\.\.$/)
    })

    test(`Should not truncate message shorter than ${MAX_MESSAGE_LENGTH} `, () => {
        const text = "Hi mom"
        const truncated = truncate(text)
        expect(truncated).toHaveLength(text.length)
        expect(truncated).toEqual(text)
    })
})
