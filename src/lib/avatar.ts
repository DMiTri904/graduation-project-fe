export const AVATAR_UPDATED_AT_KEY = 'avatarUpdatedAt'
const AVATAR_URL_KEY = 'avatarUrl'

export const setAvatarCacheMeta = (avatarUrl?: string) => {
  localStorage.setItem(AVATAR_UPDATED_AT_KEY, Date.now().toString())
  if (avatarUrl) {
    localStorage.setItem(AVATAR_URL_KEY, avatarUrl)
  }
}

export const getStoredAvatarUrl = () => {
  return localStorage.getItem(AVATAR_URL_KEY) || ''
}

export const withAvatarVersion = (avatarUrl?: string) => {
  if (!avatarUrl) return ''

  const version = localStorage.getItem(AVATAR_UPDATED_AT_KEY)
  if (!version) return avatarUrl

  const separator = avatarUrl.includes('?') ? '&' : '?'
  return `${avatarUrl}${separator}v=${version}`
}
