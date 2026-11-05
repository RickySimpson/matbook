# Matbook

A personal training log for Striking, No-Gi BJJ, MMA Fundamentals, Sparring, and Bag Conditioning. Check in whenever you train, with optional notes. No streaks, weekly quotas, or missed-day penalties.

## Your fightprint

Each session leaves a colored mark in a growing circular pattern. Select a class to highlight its marks and see its count. The visual shows the latest 180 sessions; all totals include your complete history.

## Road to Blue

- Five personal training chapters using approximate **total** No-Gi BJJ class counts:

  | Chapter | Approximate total classes | Suggested focus |
  | --- | --- | --- |
  | 0 to 1 stripe | 50 | Survival & basic escapes |
  | 1 to 2 stripes | 100 | Guard retention & posture |
  | 2 to 3 stripes | 150 | Sweeps & basic submissions |
  | 3 to 4 stripes | 200 | Chaining moves together |
  | The blue belt | 250+ | Consistently executing against new white belts |

- The class count suggests a chapter: 0–49 selects the first, 50–99 the second, and so on; 200+ stays on the blue-belt chapter. You can explore any chapter. This selection never changes your saved focus or rank.
- **Use this focus** saves a chapter's suggestion. You can also write your own focus or keep your coach's advice.
- **Record my rank** lets you save coach-awarded white-belt stripes or blue belt. The belt visual reflects only this manual entry. New and migrated logs start with no recorded rank.
- An optional **Save this BJJ note as a small win** checkbox when logging or editing a BJJ session. Recent wins appear on the Road to Blue; older wins remain accessible.

This is a personal roadmap, not belt requirements or a promotion forecast. Your coach awards stripes and belts. Editing or deleting a session updates counts and wins; recorded rank stays as you set it. There are no deadlines or attendance countdowns.

## Publish on GitHub Pages

1. Extract this ZIP on your computer.
2. Create a GitHub repository and upload the extracted files directly to its root. `index.html` should sit at the top level of the repository, not inside another folder. Include the font files and license files. The `.nojekyll` file is included for static hosting.
3. In the repository's Settings, open Pages. Choose deployment from a branch, select your branch (usually `main`) and the `/ (root)` folder, then save.
4. Open the Pages URL GitHub provides after deployment.

No installation, build command, server, API keys, or package manager is needed. All CSS, JavaScript, and fonts are included. Relative file paths support both repository URLs and custom domains.

Official setup guide: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

## Custom domain

After the site works on its GitHub Pages URL, add your domain under the repository's Pages settings and configure its DNS in Cloudflare using GitHub's custom-domain guide. No CNAME file is included because your domain has not been specified.

Official custom-domain guide: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site

## Storage and privacy

This version stores sessions, small wins, your current focus, and your recorded rank in the browser's local storage. Cloudflare D1, Google Drive integration, login, and cross-device synchronization have NOT been implemented.

The ChatGPT sign-in on the previously hosted version was provided by that hosting service; it is not part of this source. This GitHub Pages version has no built-in login. Your training records are stored locally in your own browser and are not uploaded to GitHub or included in this archive.

Storage is specific to a browser and website address. Before switching from the old site to GitHub Pages, download a backup under **Your data** on the old site. On the new site, use **Your data → Restore backup**. Repeat this transfer if you later move from a GitHub URL to a custom domain. Keep regular backups until shared persistent storage is added.

Existing sessions and version 1 and 2 backups are supported. New version 3 backups include your focus, small-win flags, and recorded rank. Restore merges entries by ID, keeping existing entries, any current nonempty focus, and any recorded rank (including a white belt with zero stripes). When no rank is recorded, a backup's rank is adopted. Download a version 3 backup before reverting to an older release; older code does not preserve all new fields.

## Files

- `index.html`: page structure and class choices.
- `app.js`: check-ins, notes, counts, focus, wins, history, backup and restore.
- `model.js`: data validation, legacy migration, counts, backup merging, and Fightprint geometry.
- `style.css`: base styles.
- `fighter.css`: fighter theme and responsive layout.
- `classes.css`: five-class selectors and colors.
- `journey.css`: Fightprint, Road to Blue, and responsive layouts.
- `barlow-condensed.ttf`, `libre-caslon.ttf`: self-hosted fonts.
- `BARLOW-LICENSE.txt`, `FONT-LICENSE.txt`: font licenses.
- `.nojekyll`: serves the site as plain static files.

There are no training records, credentials, or private hosting configuration in this package.

## Data checks

With Node.js installed, run `node tests/model.test.cjs` to check legacy data migration, backup round trips, merge preservation, validation, class counts, the bounded Fightprint, chapter boundaries, and manual rank handling. Node.js is only needed for these checks, not for hosting or using Matbook.
