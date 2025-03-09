import { faker } from '@faker-js/faker'

export type UserIdentity = {
  title: string,
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  email: string,
  phone: string,
}

export function generateMockUserIdentity(): UserIdentity {
  return {
    title: faker.person.prefix(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    dateOfBirth: faker.date.birthdate().toUTCString(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
  }
}