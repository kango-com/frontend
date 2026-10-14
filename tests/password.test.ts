import { describe, expect, it } from 'vitest'
import { isEmail, passwordStrength, safeRedirect } from '../app/utils/password'

describe('пароль и вход', () => {
  it('надёжность', () => {
    expect(passwordStrength('')).toBe('empty')
    expect(passwordStrength('abc12')).toBe('short')
    expect(passwordStrength('abcdefgh')).toBe('weak')
    expect(passwordStrength('Passw0rd!')).toBe('strong')
    expect(passwordStrength('longpassword1')).toBe('strong')
  })
  it('безопасный редирект', () => {
    expect(safeRedirect('/ad/a1')).toBe('/ad/a1')
    expect(safeRedirect('//evil.com')).toBe('/profile')
    expect(safeRedirect('https://evil.com')).toBe('/profile')
    expect(safeRedirect(undefined, '/')).toBe('/')
  })
  it('e-mail', () => {
    expect(isEmail('demo@kango.com')).toBe(true)
    expect(isEmail('demo@')).toBe(false)
  })
})
