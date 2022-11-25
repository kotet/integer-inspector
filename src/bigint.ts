export function tryParse(s: string): bigint | null {
  try {
    return BigInt(s)
  } catch (e) {
    return null
  }
}
