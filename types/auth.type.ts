import { faker } from '@faker-js/faker'
export type Token = string

export function generateMockToken(): Token {
  return faker.string.uuid()
}