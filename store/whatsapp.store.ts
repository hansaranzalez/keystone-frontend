// store/whatsapp.store.ts
import { defineStore } from "pinia";
import { useI18n } from "vue-i18n";
import { 
  fetchWhatsAppAccounts, 
  fetchWhatsAppAccount,
  createWhatsAppAccount,
  updateWhatsAppAccount,
  verifyWhatsAppConnection,
  activateWhatsAppAccount,
  deactivateWhatsAppAccount,
  deleteWhatsAppAccount,
  type WhatsAppAccount,
  type WhatsAppAccountFormData,
  WhatsAppConnectionStatus
} from "~/services/whatsapp.service";

interface WhatsAppState {
  accounts: WhatsAppAccount[];
  selectedAccountId: string | null;
  activeAccount: WhatsAppAccount | null;
  loading: boolean;
  error: string | null;
}

export const useWhatsAppStore = defineStore("whatsapp", {
  state: (): WhatsAppState => ({
    accounts: [],
    selectedAccountId: null,
    activeAccount: null,
    loading: false,
    error: null
  }),

  getters: {
    // Get active WhatsApp accounts (those with status CONNECTED)
    activeAccounts(state): WhatsAppAccount[] {
      console.log('Checking for active accounts among:', state.accounts);
      console.log('WhatsAppConnectionStatus.CONNECTED =', WhatsAppConnectionStatus.CONNECTED);
      
      const filtered = state.accounts.filter(account => {
        console.log(`Account ${account.id} status: ${account.status}, isActive: ${account.isActive}`);
        return account.status === WhatsAppConnectionStatus.CONNECTED && account.isActive;
      });
      
      console.log('Active accounts:', filtered);
      return filtered;
    },

    // Get pending WhatsApp accounts
    pendingAccounts(state): WhatsAppAccount[] {
      console.log('Checking for pending accounts, PENDING =', WhatsAppConnectionStatus.PENDING);
      const filtered = state.accounts.filter(account => {
        console.log(`Account ${account.id} status: ${account.status}, isActive: ${account.isActive}`);
        return account.status === WhatsAppConnectionStatus.PENDING && account.isActive;
      });
      
      console.log('Pending accounts:', filtered);
      return filtered;
    },

    // Get account with error status
    errorAccounts(state): WhatsAppAccount[] {
      console.log('Checking for error accounts, ERROR =', WhatsAppConnectionStatus.ERROR);
      const filtered = state.accounts.filter(account => {
        console.log(`Account ${account.id} status: ${account.status}, isActive: ${account.isActive}`);
        return account.status === WhatsAppConnectionStatus.ERROR && account.isActive;
      });
      
      console.log('Error accounts:', filtered);
      return filtered;
    },

    // Get disconnected accounts
    disconnectedAccounts(state): WhatsAppAccount[] {
      console.log('Checking for disconnected accounts, DISCONNECTED =', WhatsAppConnectionStatus.DISCONNECTED);
      const filtered = state.accounts.filter(account => {
        console.log(`Account ${account.id} status: ${account.status}, isActive: ${account.isActive}`);
        return account.status === WhatsAppConnectionStatus.DISCONNECTED && account.isActive;
      });
      
      console.log('Disconnected accounts:', filtered);
      return filtered;
    },

    // Get inactive accounts
    inactiveAccounts(state): WhatsAppAccount[] {
      console.log('Checking for inactive accounts');
      const filtered = state.accounts.filter(account => {
        console.log(`Account ${account.id} status: ${account.status}, isActive: ${account.isActive}`);
        return !account.isActive;
      });
      
      console.log('Inactive accounts:', filtered);
      return filtered;
    },

    // Get account by id
    getAccountById: (state) => (id: string): WhatsAppAccount | undefined => {
      return state.accounts.find(account => account.id === id);
    },

    // Get selected account
    selectedAccount(state): WhatsAppAccount | null {
      if (!state.selectedAccountId) return null;
      const account = state.accounts.find(a => a.id === state.selectedAccountId);
      return account || null;
    },

    // Count of total accounts
    totalAccountCount(state): number {
      return state.accounts.length;
    },

    // Count of active accounts
    activeAccountCount(state): number {
      return this.activeAccounts.length;
    },

    // Has at least one connected account
    hasConnectedAccount(state): boolean {
      return state.accounts.some(
        account => account.status === WhatsAppConnectionStatus.CONNECTED && account.isActive
      );
    }
  },

  actions: {
    // Loading and error management
    setLoading(loading: boolean) {
      this.loading = loading;
    },

    setError(error: string | null) {
      this.error = error;
    },

    // Account management
    async loadAccounts() {
      const { t } = useI18n();
      this.setLoading(true);
      this.setError(null);

      try {
        console.log('WhatsApp store: Fetching accounts');
        const accounts = await fetchWhatsAppAccounts();
        console.log('WhatsApp store: Accounts received', accounts);
        
        // Debug check for expected properties
        if (accounts.length > 0) {
          console.log('First account properties:', Object.keys(accounts[0]));
          console.log('First account sample:', accounts[0]);
        }
        
        this.accounts = accounts;
        console.log('WhatsApp store: Accounts set in store', this.accounts);
      } catch (error) {
        console.error("Error in loadAccounts:", error);
        this.setError(t('integrations.whatsapp.alerts.fetchError'));
      } finally {
        this.setLoading(false);
      }
    },

    async loadAccount(accountId: string) {
      const { t } = useI18n();
      this.setLoading(true);
      this.setError(null);
      this.selectedAccountId = accountId;

      try {
        const account = await fetchWhatsAppAccount(accountId);
        
        if (account) {
          // Update the account in the accounts array
          const accountIndex = this.accounts.findIndex(a => a.id === accountId);
          
          if (accountIndex >= 0) {
            this.accounts[accountIndex] = account;
          } else {
            this.accounts.push(account);
          }
          
          this.activeAccount = account;
        } else {
          this.setError(t('integrations.whatsapp.alerts.fetchAccountError'));
        }
      } catch (error) {
        console.error(`Error in loadAccount(${accountId}):`, error);
        this.setError(t('integrations.whatsapp.alerts.fetchAccountError'));
      } finally {
        this.setLoading(false);
      }
    },

    async createAccount(accountData: WhatsAppAccountFormData) {
      this.setLoading(true);
      this.setError(null);

      try {
        const response = await createWhatsAppAccount(accountData);
        
        if (response.success && response.account) {
          this.accounts.push(response.account);
          this.selectedAccountId = response.account.id;
          this.activeAccount = response.account;
          return response.account;
        } else {
          this.setError(response.message || 'integrations.whatsapp.alerts.connectionFailed');
          return null;
        }
      } catch (error) {
        console.error("Error in createAccount:", error);
        this.setError('integrations.whatsapp.alerts.connectionFailed');
        return null;
      } finally {
        this.setLoading(false);
      }
    },

    async updateAccount(accountId: string, accountData: Partial<WhatsAppAccountFormData>) {
      this.setLoading(true);
      this.setError(null);

      try {
        const response = await updateWhatsAppAccount(accountId, accountData);
        
        if (response.success && response.account) {
          // Update account in accounts array
          const accountIndex = this.accounts.findIndex(a => a.id === accountId);
          
          if (accountIndex >= 0) {
            this.accounts[accountIndex] = response.account;
          }
          
          if (this.selectedAccountId === accountId) {
            this.activeAccount = response.account;
          }
          
          return response.account;
        } else {
          this.setError(response.message || 'Failed to update WhatsApp account');
          return null;
        }
      } catch (error) {
        console.error(`Error in updateAccount(${accountId}):`, error);
        this.setError('Failed to update WhatsApp account');
        return null;
      } finally {
        this.setLoading(false);
      }
    },

    async verifyConnection(accountId: string) {
      this.setLoading(true);
      this.setError(null);

      try {
        const response = await verifyWhatsAppConnection(accountId);
        
        if (response.success && response.account) {
          // Update account in accounts array
          const accountIndex = this.accounts.findIndex(a => a.id === accountId);
          
          if (accountIndex >= 0) {
            this.accounts[accountIndex] = response.account;
          }
          
          if (this.selectedAccountId === accountId) {
            this.activeAccount = response.account;
          }
          
          return response.account;
        } else {
          this.setError(response.message || 'integrations.whatsapp.alerts.connectionFailed');
          return null;
        }
      } catch (error) {
        console.error(`Error in verifyConnection(${accountId}):`, error);
        this.setError('integrations.whatsapp.alerts.connectionFailed');
        return null;
      } finally {
        this.setLoading(false);
      }
    },

    async activateAccount(accountId: string) {
      this.setLoading(true);
      this.setError(null);

      try {
        const response = await activateWhatsAppAccount(accountId);
        
        if (response.success && response.account) {
          // Update account in accounts array
          const accountIndex = this.accounts.findIndex(a => a.id === accountId);
          
          if (accountIndex >= 0) {
            this.accounts[accountIndex] = response.account;
          }
          
          if (this.selectedAccountId === accountId) {
            this.activeAccount = response.account;
          }
          
          return response.account;
        } else {
          this.setError(response.message || 'Failed to activate WhatsApp account');
          return null;
        }
      } catch (error) {
        console.error(`Error in activateAccount(${accountId}):`, error);
        this.setError('Failed to activate WhatsApp account');
        return null;
      } finally {
        this.setLoading(false);
      }
    },

    async deactivateAccount(accountId: string) {
      this.setLoading(true);
      this.setError(null);

      try {
        const response = await deactivateWhatsAppAccount(accountId);
        
        if (response.success && response.account) {
          // Update account in accounts array
          const accountIndex = this.accounts.findIndex(a => a.id === accountId);
          
          if (accountIndex >= 0) {
            this.accounts[accountIndex] = response.account;
          }
          
          if (this.selectedAccountId === accountId) {
            this.activeAccount = response.account;
          }
          
          return response.account;
        } else {
          this.setError(response.message || 'Failed to deactivate WhatsApp account');
          return null;
        }
      } catch (error) {
        console.error(`Error in deactivateAccount(${accountId}):`, error);
        this.setError('Failed to deactivate WhatsApp account');
        return null;
      } finally {
        this.setLoading(false);
      }
    },

    async deleteAccount(accountId: string) {
      this.setLoading(true);
      this.setError(null);

      try {
        const response = await deleteWhatsAppAccount(accountId);
        
        if (response.success) {
          // Remove account from accounts array
          this.accounts = this.accounts.filter(a => a.id !== accountId);
          
          if (this.selectedAccountId === accountId) {
            this.selectedAccountId = null;
            this.activeAccount = null;
          }
          
          return true;
        } else {
          this.setError(response.message || 'Failed to delete WhatsApp account');
          return false;
        }
      } catch (error) {
        console.error(`Error in deleteAccount(${accountId}):`, error);
        this.setError('Failed to delete WhatsApp account');
        return false;
      } finally {
        this.setLoading(false);
      }
    },

    // Select account for viewing/editing
    selectAccount(accountId: string | null) {
      this.selectedAccountId = accountId;
      this.activeAccount = accountId ? this.accounts.find(a => a.id === accountId) || null : null;
    },

    // Clear active account selection
    clearActiveAccount() {
      this.selectedAccountId = null;
      this.activeAccount = null;
    },

    // Reset store state
    $reset() {
      this.accounts = [];
      this.selectedAccountId = null;
      this.activeAccount = null;
      this.loading = false;
      this.error = null;
    }
  }
});
