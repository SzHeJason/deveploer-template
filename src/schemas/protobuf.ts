import { Type, Static } from '@sinclair/typebox'

export const bodySchema = Type.Object({
  address: Type.String(),
  file: Type.String(),
  action: Type.String(),
  packageName: Type.String(),
  serviceName: Type.String(),
  payload: Type.Dict(Type.Unknown()),
})

export type BodySchme = Static<typeof bodySchema>
