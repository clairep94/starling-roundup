export type userAccount = {
  accountUid: string,
  accountType: string,
  defaultCategory: string, 
  currency: string,
  createdAt: string,
  name: string,
}

export type userAccountList = userAccount[]