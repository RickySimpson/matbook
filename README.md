# Matbook

A personal training log for Striking, No-Gi BJJ, MMA Fundamentals, Sparring, and Bag Conditioning. Includes optional notes, editable sessions, all-time counts, a training-mix visual, and JSON backup/restore.

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

This is the current working version. It stores sessions in the browser's local storage. Cloudflare D1, Google Drive integration, login, and cross-device synchronization have NOT been implemented.

The ChatGPT sign-in on the previously hosted version was provided by that hosting service; it is not part of this source. This GitHub Pages version has no built-in login. Your training records are stored locally in your own browser and are not uploaded to GitHub or included in this archive.

Storage is specific to a browser and website address. Before switching from the old site to GitHub Pages, download a backup under **Your data** on the old site. On the new site, use **Your data → Restore backup**. Repeat this transfer if you later move from a GitHub URL to a custom domain. Keep regular backups until shared persistent storage is added.

## Files

- `index.html`: page structure and class choices.
- `app.js`: check-ins, notes, counts, history, backup and restore.
- `style.css`: base styles.
- `fighter.css`: fighter theme and responsive layout.
- `classes.css`: five-class scoreboard and selectors.
- `barlow-condensed.ttf`, `libre-caslon.ttf`: self-hosted fonts.
- `BARLOW-LICENSE.txt`, `FONT-LICENSE.txt`: font licenses.
- `.nojekyll`: serves the site as plain static files.

There are no training records, credentials, or private hosting configuration in this package.
