# DPI Specific Implementation Details

## G2P (Government-to-Person) Building Blocks

The core DPI building blocks for G2P benefits include:

- **Beneficiary registries** (for targeting and eligibility management)
- **ID authentication and eKYC** (for beneficiary verification - optional but recommended)
- **G2P mapper / ID-Account Mapper** (for linking identities to financial addresses. Note: The "ID" here can be ANY authenticable identifier including mobile number, email ID, or other functional IDs - not just foundational IDs)
- **Cash in Cash out (CICO) infrastructure** (for last mile delivery)
- **Payment systems** (for disbursement)

**CRITICAL NOTE**: G2P Connect is NOT a DPI building block - it's a community initiative that provides specifications and standards. Countries CANNOT "implement G2P Connect". The actual DPI building block is **G2P Payments infrastructure**, which countries can build using G2P Connect specifications as a reference.

## Verifiable Credentials - Quick Win or Long-term?

**IMPORTANT: Verifiable Credentials can be BOTH quick wins and long-term projects:**

### Paper-based VCs as QUICK WINS (3-6 months):
- Adding QR codes to existing paper certificates
- Simple verification portals/apps to scan QR codes
- PDF certificates with digital signatures
- Basic credential verification without complex infrastructure
- Examples: COVID vaccination certificates, basic educational certificates

### Digital VC Ecosystem as LONG-TERM (12+ months):
- Full W3C-compliant VC infrastructure
- Interoperable credential wallets
- Privacy-preserving selective disclosure
- Cross-border credential recognition
- Blockchain/DLT-based systems
- Self-sovereign identity integration

## DaaS (DPI as a packaged Solution)

DPI as a packaged Solution (DaaS) refers to rapid deployment of DPI through:

- Upgrades of existing infrastructure (not greenfield implementations)
- Non-procurement routes for speed
- 90-day deployment + 90-day sustenance (180 days total) for proof of success
- Pre-packaged offerings with open source DPGs + pre-trained service providers
- Funded cohort programs through CDPI and partners
- Three models:
  1. Funded program with everything included
  2. Just open source artefacts
  3. Just pre-trained service providers