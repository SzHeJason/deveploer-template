import yargs from 'yargs'
import { SetRequired } from 'type-fest'

export { }

declare global {
  export type ICommandModule<U> = SetRequired<yargs.CommandModule<unknown, U>, 'command' | 'describe'> & {
    builder: {
      [K in keyof U]: yargs.Options
    }
  }
}
