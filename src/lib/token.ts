export interface TokenUserInfo {
  fullName?: string
  email?: string
  studentId?: string
  avatarUrl?: string
}

const parseJwtPayload = (token: string): Record<string, any> | null => {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null

    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      '='
    )
    const json = atob(padded)

    return JSON.parse(json)
  } catch {
    return null
  }
}

const claim = (
  payload: Record<string, any>,
  keys: string[]
): string | undefined => {
  for (const key of keys) {
    const value = payload[key]
    if (typeof value === 'string' && value.trim()) return value
  }
  return undefined
}

export const getCurrentUserFromToken = (): TokenUserInfo => {
  const token = localStorage.getItem('accessToken')
  if (!token) return {}

  const payload = parseJwtPayload(token)
  if (!payload) return {}

  return {
    fullName: claim(payload, [
      'fullName',
      'name',
      'unique_name',
      'given_name',
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
    ]),
    email: claim(payload, [
      'email',
      'upn',
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
    ]),
    studentId: claim(payload, ['studentId', 'mssv', 'student_code', 'sub']),
    avatarUrl: claim(payload, ['avatarUrl', 'avatar', 'picture'])
  }
}
