import _ from 'lodash'

export default class State<T extends Record<string, any>> {
  private payload: T

  constructor(payload: T) {
    this.payload = payload
  }

  get<K extends keyof T>(key: K) {
    return this.payload[key]
  }

  remove<K extends keyof T>(key: K) {
    delete this.payload[key]
  }

  set<K extends keyof T>(key: K, value: T[K]) {
    this.payload[key] = value

    return this
  }

  pathSet(path: string, value: any) {
    _.set(this.payload, path, value)
    return this
  }

  has(key: keyof T) {
    return Boolean(this.payload[key])
  }

  getAll() {
    return this.payload
  }

  pick<K extends keyof T>(keys: K[]) {
    return _.pick(this.payload, keys)
  }

  omit<K extends keyof T>(keys: K[]) {
    return _.omit(this.payload, keys)
  }
}
