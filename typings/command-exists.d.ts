/**
 * @see https://www.npmjs.com/package/command-exists
 */
declare module "command-exists" {
  type CommandCallback = (err: Error, result: boolean) => void

  // promise 返回 command 命令，不存在会被 catch
  function commandExists(command: string): Promise<string>;

  function commandExists(command: string, callback: CommandCallback): void;

  function commandExistsSync(command: string): boolean

  commandExists.sync = commandExistsSync

  export default commandExists;
}
