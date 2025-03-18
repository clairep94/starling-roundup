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

  describe('initialization', () => {
    test('should start with a null balance', () => {
      expect(store.balance).toBeNull();
    });

    test('should start with isLoadingBalance set to false', () => {
      expect(store.isLoadingBalance).toBeFalsy();
    });
  });

  describe('fetchBalance', () => {
    const setupValidAuthentication = () => {
      accountsStore.accounts = [generateMockAccount()];
      userIdentityStore.token = generateMockToken();
    };

    test('should not fetch balance if account or token is missing', async () => {
      await store.fetchBalance();

      expect(notificationsStore.addError).toHaveBeenCalledWith(
        'Cannot fetch balance without an account or token'
      );
      expect($fetch).not.toHaveBeenCalled();
    });

    test('should set isLoadingBalance to true when fetching starts', () => {
      setupValidAuthentication();
      store.fetchBalance();
      expect(store.isLoadingBalance).toBeTruthy();
    });

    test('should call the correct endpoint with headers', () => {
      setupValidAuthentication();
      const { accountUid } = accountsStore.accounts[0];
      const token = userIdentityStore.token;

      store.fetchBalance();

      expect($fetch).toHaveBeenCalledWith(
        `/api/starling/accounts/${accountUid}/balance`,
        {
          method: 'GET',
          headers: { 'session-token': token }
        }
      );
    });

    test('should update balance with fetched data', async () => {
      setupValidAuthentication();
      const mockBalance = generateMockBalance();
      $fetch.mockResolvedValue({ data: mockBalance });

      await store.fetchBalance();

      expect(store.balance).toEqual(mockBalance);
      expect(notificationsStore.addError).not.toHaveBeenCalled();
    });

    test('should add an error notification when request fails', async () => {
      setupValidAuthentication();
      const { accountUid } = accountsStore.accounts[0];
      const token = userIdentityStore.token;

      const error = generateOfetchError('GET', `/api/starling/accounts/${accountUid}/balance`, 403, 'Forbidden');
      $fetch.mockRejectedValue(error);

      await store.fetchBalance();

      expect(notificationsStore.addError).toHaveBeenCalledWith(error);
    });
  });
});
