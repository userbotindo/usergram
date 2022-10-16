import { describe, expect, test } from "@jest/globals"

import { getPrefixedFunc } from "../../src/utils/core"
import Plugin from "../../src/core/plugin"

class TestPlugin extends Plugin {
    async cmd_test() {
        console.log("test")
    }

    async cmd_test2() {
        await this.cmd_test()
    }

    async non_command() {}
}

class EmptyPlugin extends Plugin {}

describe("Get command func prefix", () => {
    test("should return only command function", () => {
        const func = getPrefixedFunc(TestPlugin, "cmd_")
        expect(func).toEqual(["cmd_test", "cmd_test2"])
    })

    test("should return an empty array", () => {
        const func = getPrefixedFunc(EmptyPlugin, "cmd")
        expect(func).toEqual([])
    })
})
