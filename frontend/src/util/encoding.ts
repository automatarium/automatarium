export const encodeData = (data: string) => {
  return Buffer.from(data).toString('base64')
}

export const decodeData = (data: string) => {
  return Buffer.from(data, 'base64').toString()
}
