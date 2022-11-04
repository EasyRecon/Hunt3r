# Changelog

## Version 1.6.4

**Backend Improvements :**

- Handle new Intigriti login workflow

**Scan Improvements :**

- Update WappaGo

## Version 1.6.3

**Backend Improvements :**

- Fix namespace confusion when calling methods

**Scan Improvements :**

- Update WappaGo

**Backend Improvements :**

- Fix error when webhook is missing

## Version 1.6.2

**Scan Improvements :**

- Update WappaGo

## Version 1.6.1

**Scan Improvements :**

- Fix Whoxy file output on intel scan

## Version 1.6.0

**Frontend Improvements :**

- Fix domains UI filtering
- Improve mobile version
- Improves the display of technologies with the versions
- Added statistics for Hackerone

**Backend Improvements :**

- Add case insensitive search on programs
- Improvements on domain registration during a scan
- Fix H1 API login
- Adding versions for detected technologies
- Add log rotation to avoid overloading the disk space

**Scan Improvements :**

- Update all tools versions
- Replace Naabu / HTTPX / Wappalyzer & GoWitness by WappaGo
- Fix of a case where the status of a server is updated after its removal

## Version 1.5.0

**Frontend Improvements :**

- Improve Mobile Version
- Redirect to login when unauthorized
- Fix notifications box size
- Remove referer when clicking on a subdomain link
- Improve pagination
- Add multiples vulnerabilities deletion

**Backend Improvements :**

- Add AWS as cloud provider
- Improve Nuclei configuration managements
- Improve platforms sync

**Scan Improvements :**

- Tools update
- Add Slack notifications
- Add more exclusions to GAU
- Intel recon improvements

## Version 1.4.0

**Scan Improvements :**

- Fix exclusions when multiples regex is used
- Improve subdomains filtering

## Version 1.3.0

**Scan Improvements :**

- Improve Amass recursive check
- Improve HTTPX scan

**Backend Improvements :**

- Dependabot fix
- Reverse scan order

## Version 1.2.0

**Frontend Improvements :**

- Add URLs management

**Scan Improvements :**

- Improve concurrency

## Version 1.1.0
**Bug Fix :**

- Proxy URL [#205](https://github.com/EasyRecon/Hunt3r/pull/205) to not have `backend.local` when an NDD is not setup

**Frontend Improvements :**

- Improve scan view UI
- Order vulnerabilities by criticity

**Backend Improvements :**

- Check if Nuclei config is present before launching a scan
- Better display of server costs
- Fix the display on the order of the scans

**Scan Improvements :**

- Added NodeJS Wappalyzer CLI temporarily to improve technology detection

## Version 1.0
- First release with main features