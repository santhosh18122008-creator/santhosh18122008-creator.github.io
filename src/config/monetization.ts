export interface MonetizationConfig {
  adsenseEnabled: boolean;
  adsensePublisherId: string;
  analyticsEnabled: boolean;
  analyticsId: string;
  searchConsoleVerification: string;
}

// Keep everything OFF until you have real approved IDs.
// See docs/ADSENSE-PLAYBOOK.md for activation steps.
export const monetization: MonetizationConfig = {
  adsenseEnabled: false,
  adsensePublisherId: '', // e.g. 'pub-1234567890123456' after approval
  analyticsEnabled: false,
  analyticsId: '', // e.g. 'G-XXXXXXXXXX' after creating a GA4 property
  searchConsoleVerification: '', // paste your Google Search Console code here
};
