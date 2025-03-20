import { describe, beforeEach, test, expect, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBalanceStore } from './balance'
import { useNotificationsStore } from './notifications'
import { useUserIdentityStore } from './userIdentity'
import { useAccountsStore } from './accounts'
import { generateMockAccount } from '../types/account.type'
import { generateMockBalance } from '../types/balance.type'
import { createTestingPinia } from '@pinia/testing'
import { generateMockToken } from '../types/auth.type'
import { generateOfetchError } from '../types/responseError.type'

vi.stubGlobal("$fetch", vi.fn());

describe('Balance Store', () => {
  let store: ReturnType<typeof useBalanceStore>
  let notificationsStore: ReturnType<typeof useNotificationsStore> 
  let userIdentityStore: ReturnType<typeof useUserIdentityStore>
  let accountsStore: ReturnType<typeof useAccountsStore>

  beforeEach(() => {
    setActivePinia(createTestingPinia({ stubActions: false }));
    vi.resetAllMocks();

    store = useBalanceStore();
    notificationsStore = useNotificationsStore();
    userIdentityStore = useUserIdentityStore();
    accountsStore = useAccountsStore();
  });

  const setupValidAuthentication = () => {
    accountsStore.accounts = [generateMockAccount()];
    userIdentityStore.token = generateMockToken();
  };

  const performFetchBalance = async () => {
    await store.fetchBalance()
  }

  describe('initialization', () => {
    test('should start with a null balance', () => {
      expect(store.balance).toBeNull();
    });

    test('should start with isLoadingBalance set to false', () => {
      expect(store.isLoadingBalance).toBeFalsy();
    });
  });

  describe('fetchBalance', () => {
    describe('and when select account or token are missing', async () => {
      beforeEach(async () => {
        await performFetchBalance()
      })
      test('should not fetch', () => {
        expect($fetch).not.toHaveBeenCalled();
      })
      test('should add an error notification', () => {
        expect(notificationsStore.addError).toHaveBeenCalledWith(
          'Cannot fetch balance without an account or token'
        );
      })
    })

    describe('and while the request is in progress', () => {
      beforeEach(() => {
        setupValidAuthentication()
      })
      test('should set isLoadingBalance to true when fetching starts', () => {
        performFetchBalance()
        expect(store.isLoadingBalance).toBeTruthy();
      });
  
      test('should call the correct endpoint with headers', () => {
        const { accountUid } = accountsStore.accounts[0];
        const token = userIdentityStore.token;
  
        performFetchBalance()
  
        expect($fetch).toHaveBeenCalledWith(
          `/api/starling/accounts/${accountUid}/balance`,
          {
            method: 'GET',
            headers: { 'session-token': token }
          }
        );
      });
    })

    describe('and when the request is successful', async() => {
      const mockBalance = generateMockBalance();
      beforeEach( async () => {
        setupValidAuthentication();
        $fetch.mockResolvedValue({ data: mockBalance });
        await performFetchBalance()
      })
      test('should update the balance', () => {
        expect(store.balance).toEqual(mockBalance);
      })
      test('should not add an error notification', () => {
        expect(notificationsStore.addError).not.toHaveBeenCalled();
      })
    })
    describe('and when the test fails', async () => {
      let accountUid, defaultCategory, error
      beforeEach(async () => {        
        setupValidAuthentication()
        accountUid  = accountsStore.selectedAccount?.accountUid;
        defaultCategory = accountsStore.selectedAccount?.defaultCategory
        error = generateOfetchError('GET', `/api/starling/accounts/${accountUid}/balance`, 403, 'Forbidden');
        $fetch.mockRejectedValue(error)
        await performFetchBalance()
      })
      test('should add an error notification', () => {
        expect(notificationsStore.addError).toHaveBeenCalledWith(error)
      })
      test('should not update the balance', () => {
        expect(store.balance).toBe(null)
      })
      test('should set the loading ref to false', () => {
        expect(store.isLoadingBalance).toBe(false)
      })
    })
  });
});
