export const ENV_MAP = process.env

export const isDevelopment = ENV_MAP.NODE_ENV === 'development'

export const isProduction = ENV_MAP.NODE_ENV === 'production'
