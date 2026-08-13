# MarqDesk AdSense Playbook

This document explains how to activate monetization SAFELY and LEGALLY once you have a real, approved Google AdSense account.

## 0. Eligibility reality check
- The AdSense account holder must be 18 or older (if under 18, a parent/guardian must own the account).
- The site must contain original, useful content and clear navigation, privacy policy, and contact information (already implemented).
- Review can take from a few days to a few weeks. Do not add ad code before approval.
- Never click your own ads, never ask others to click, never buy traffic. These cause permanent bans.

## 1. Apply
1. Go to https://adsense.google.com and sign in with a Google account.
2. Add your site URL: https://santhosh18122008-creator.github.io
3. Follow the instructions and wait for approval.

## 2. After approval — activate in 4 steps
1. Open `src/config/monetization.ts` and set:
   - `adsenseEnabled: true`
   - `adsensePublisherId: 'pub-XXXXXXXXXXXXXXXX'` (your real publisher ID)
2. Create `public/ads.txt` containing exactly:
   `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`
3. Update `src/pages/privacy.astro` to describe advertising and cookies (the cookie consent banner appears automatically when ads are enabled).
4. Commit and push. Ads will appear in the pre-placed AdSlot positions on tool pages and guides.

## 3. Google Search Console (recommended, independent of AdSense)
1. Add your site in Google Search Console and copy the HTML verification code.
2. Paste it into `searchConsoleVerification` in `src/config/monetization.ts`.
3. Push, then submit the sitemap: https://santhosh18122008-creator.github.io/sitemap-index.xml

## 4. Ad placement rules we follow
- Ads are placed between content sections, never overlapping tools.
- No more than a few ad units per page.
- No ads that cause accidental clicks (no ads next to buttons).
