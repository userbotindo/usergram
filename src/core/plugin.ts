export default abstract class Plugin {
    static toString() {
        return `<plugin "${this.name}">`
    }
}
