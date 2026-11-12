const CURRENT_DATASET_VERSION = 'v6_vanguard_crm_login_first';
const VERSION_KEY = 'crm_dataset_version';

export const ensureIndianDataMigration = () => {
  try {
    if (typeof window === 'undefined') return;
    const currentVersion = localStorage.getItem(VERSION_KEY);
    if (currentVersion !== CURRENT_DATASET_VERSION) {
      // Clear out outdated pre-INR mock keys
      localStorage.removeItem('crm_leads');
      localStorage.removeItem('crm_deals');
      localStorage.removeItem('crm_customers');
      localStorage.removeItem('crm_tasks');
      localStorage.removeItem('crm_activities');
      localStorage.removeItem('crm_user');
      localStorage.removeItem('crm_is_auth');
      localStorage.setItem(VERSION_KEY, CURRENT_DATASET_VERSION);
    }
    // Always clear crm_is_auth so opening the link shows AuthPage first
    localStorage.removeItem('crm_is_auth');
  } catch (e) {
    console.error('Storage migration error', e);
  }
};

// Execute immediately upon module evaluation
ensureIndianDataMigration();

