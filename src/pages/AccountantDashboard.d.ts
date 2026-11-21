import type { ComponentType } from 'react';

declare const AccountantDashboard: ComponentType<{
  companyID: string;
  onSignOut: () => void | Promise<void>;
}>;

export default AccountantDashboard;
