# Strategy Note Compilation

## Implementation Strategy Note for the Implementation of a Digital Credentialing System in Jamaica

### Executive Summary

Jamaica's National Identification Card (NIC) launch at the end of 2024 signals a strategic shift toward secure, verifiable digital credentials, addressing challenges in document verification that currently rely on non-verifiable PDFs and paper-based processes. These outdated methods create delays, inefficiencies, and risk of fraud, affecting a range of critical services from accessing financial products to educational and social programs.

This policy note outlines the implementation of a Verifiable Credentials (VCs) ecosystem, starting with NIC and birth certificates. The roadmap will establish foundational digital infrastructure to securely issue, store, and manage credentials in a digital wallet. This Digital Public Infrastructure (DPI) initiative will streamline verification processes, enhancing access to essential services and building a foundation for expansion to additional credentials and sectors over time, fostering a more efficient and innovative digital economy.

### Problem Statement and Objectives

Jamaica's reliance on paper-based and non-verifiable digital documents creates barriers in accessing services, particularly for marginalized communities who face delays and costs associated with document verification. Inefficiencies in identity verification restrict access to services like banking, social programs, and educational opportunities. While paper records promote inclusion in developing economies, they come with high creation costs and low trust due to the risks of fraud and inefficiency. Individuals often lose work time waiting for documents or miss services because their records can't be verified. Although digitization has reduced costs, it has also raised trust issues.

Jamaica is advancing digital governance by shifting from paper-based systems to a secure, decentralized credentialing model. This initiative aims to streamline the issuance and verification of essential credentials, such as the National ID and birth certificates, enhancing efficiency and service accessibility. Through MOSIP's Inji system, Jamaica will issue Verifiable Digital Credentials (VCs), enabling secure, interoperable credential management. Citizens and businesses will gain the convenience of digitally storing, sharing, and verifying credentials, ultimately reducing fraud, promoting inclusion, and improving trust in public services. Offline verification should be integrated to support secure credential validation even in areas with limited internet connectivity, enabling secure identity checks without requiring real-time connectivity, reducing fraud and inefficiencies in verification.

The digital credentialing system will benefit the population at large, and particularly those needing secure identity verification for accessing banking, government services, and educational credentials. By providing verifiable credentials through the Inji Wallet, which can be accessed via mobile devices, the project supports digital inclusion and secure identity management. The system benefits citizens by improving access to services, reducing verification costs, and increasing trust.

### Objectives for Initial 100-Day Proof of Concept Rollout

- Launch digital credentialing for NICs and birth certificates, building scalable infrastructure for additional credentials.
- Issue NICs and birth certificates as Verifiable Credentials, accessible via a secure mobile wallet.
- Develop and release a policy framework to support secure, user-centered credentialing for potential national adoption.
- Encourage private and public innovation around verifiable credentials (VCs) to build a flexible, resilient credentialing ecosystem.

### Actors

Key agencies and stakeholders involved in the implementation are:

| Ministry/Department/Organization | Focal Point | Designation | Role |
|---|---|---|---|
| eGov | Michelle McKenzie | Project Manager | Anchor of the Digital Credential Wallet initiative |
| National Identification and Registration Authority | TBD | Project Manager | Issuer institution for NIC and birth certificates |
| Registrar General Department | TBD | Project Manager | Issuer institution for NIC and birth certificates |
| Inter American Development Bank | | Implementation Partner | Supports technical deployment |
| Local Service Provider | TBD | Certified Service Provider | Program management and technical support |

EGov will lead the initiative, overseeing integration with national infrastructure and coordinating with CDPI and other technical partners for efficient implementation.

### Action Plan, Technology Stack, and Partners

The implementation will employ a phased approach, beginning with the rollout of MOSIP's Inji Stack to provide secure digital credentialing for NICs and birth certificates. Key technology components include the Inji Digital Credentialing Stack and eSignet for signature verification, both compliant with W3C Verifiable Credentials standards. Partnerships with local and international organizations will ensure the solution is sustainable and adaptable, with CDPI offering program management and support for integrating credentials into Jamaica's existing digital systems.

### Guiding Design Principles for Rapid and Scalable Rollout

- **Interoperable**: Built on open standards to encourage competition and innovation, ensuring seamless connectivity across public and private sectors.
- **Minimalist and Reusable Technology**: Integrates into existing systems to minimize infrastructure changes, allowing Jamaica to quickly modernize without comprehensive system rebuilds.
- **Diverse and Inclusive**: Supports multi-modal access, including online, low-bandwidth, and offline environments, to maximize reach across urban and rural populations.
- **Federated and Decentralized**: Allows multiple issuing institutions to manage credentials independently, reducing reliance on a central system.
- **Security & Privacy by Design**: Utilizes tamper-proof, encrypted digital credentials with machine-readable formats to ensure data integrity without centralized storage or queries.

### Conclusion

Improving Digital Public Infrastructure in Jamaica by implementing verifiable credentials will streamline document issuance and verification, enhancing access to essential services and fostering an inclusive digital economy. Built on MOSIP's Inji Stack and W3C standards, this system empowers citizens to manage identities in a single digital wallet, supporting NICs, birth certificates, and eventually more. By reducing the need for physical documents, it will improve citizens' quality of life in their interactions with public services, create a secure digital ecosystem, and enable a resilient digital economy that promotes economic growth and public trust.

---

## Barbados Digital Identity Guidance and Digital Public Infrastructure Roadmap

The Government of Barbados is advancing its national digital transformation by strengthening the foundations of its Digital Public Infrastructure (DPI). Building on its successful national identity program, Barbados now seeks to expand its capabilities through secure digital authentication, verifiable credentials, and citizen-centered data sharing frameworks.

This roadmap outlines immediate priorities and medium-term strategies for implementing three core DPI building blocks:

- Digital Identity Authentication
- Verifiable Credentials Ecosystem
- Consent-Based Data Sharing Framework

Guided by DPI principles of reusability, interoperability, inclusion, privacy and security, minimalism, private sector innovation, and decentralized design, this strategy positions Barbados to deliver public value, safeguard sovereignty, and enable sustainable digital innovation.

### Context

The Government of Barbados, through GovTech Barbados, has successfully registered approximately 260,000 citizens and issued smart ID cards based on ICAO standards. The majority of the population has already received their cards. Entrust has been the technical partner for card issuance and PKI services.

- **Pending Work**: Mobile ID deployment and middleware integration are still outstanding, and are critical next steps for enabling citizen authentication and service access.
- **Governance Risk**: There is strong awareness of potential vendor lock-in risks tied to centralized PKI services, and a strategic interest in gradually adopting sovereign and decentralized trust models.
- **Strategic Goals**: To ensure that its digital infrastructure is modular, open, and future-proof, enabling public and private innovation.

Immediate priorities include:
- Deploying middleware to allow citizen-driven authentication and service integration.
- Launching mobile ID services to expand access across devices.
- Preparing for decentralized trust mechanisms alongside proprietary infrastructure.

### Strategic Objectives

#### Digital Identity Authentication
- Immediate rollout of citizen authentication capabilities leveraging the existing smart ID cards.
- Integration of PIN-protected middleware to enable citizen consent and controlled data sharing.
- Launch of mobile ID to extend access to digital services across devices.

#### Foundational Interoperability and Middleware
- Development of a national interoperability layer based on open APIs and standard protocols.
- Deployment of a middleware platform to allow government services and private sector partners to verify ID attributes and credentials, ensuring privacy and consent.
- Preparation for sovereign governance of trust services (including PKI and/or decentralized identifiers).

#### Verifiable Credentials and Data Sharing Ecosystem
- Introduction of verifiable credentials for use cases such as health certifications, educational qualifications, and business licensing.
- Development of an open-source, credential-based data sharing framework, empowering citizens to control their data.
- Pilot projects to support cross-sector data access with granular consent, minimizing centralized data aggregation.

### Implementation Plan

#### Short-Term Phase (2025)
- Deploy mobile ID to enable citizen authentication, while securing contractual safeguards for future sovereignty and migration.
- Require contract terms that preserve Barbados' ability to migrate to sovereign or decentralized systems in the future.
- Start decentralized pilot projects focused on decentralized identifiers (DIDs) and verifiable credentials (VCs) in key sectors.

#### Medium-Term Phase (2026–2027)
- Introduce decentralized identifiers (DIDs) for sector-specific credentials, such as education, health, and professional licenses.
- Set up a sovereign PKI or domain-based decentralized identifier registry to govern credential issuance and trust frameworks.
- Expand pilot projects to broader service areas and relying parties.

#### Long-Term Phase (2027+)
- Establish a verifiable credentials ecosystem using open-source DaaS modules, including Inji for authentication and E-Signet for credential issuance.
- Expand the decentralized trust infrastructure across government and private sector services.

### Design Principles for DPI Transformation

Our approach to DPI transformation is guided by a set of core design principles, which ensure that our system is scalable, secure, and citizen-centric:

- **Reusability**: Technology should be broken down into modular, reusable building blocks with open protocols. These blocks can be combined in various ways, allowing for flexibility, lower costs, and higher trust when reused by public and private entities. This modular approach enables simplicity, scalability, innovation, and adaptability to future needs, avoiding the complexity and risks of monolithic solutions, which often stifle innovation and lead to exclusion.

- **Interoperability**: Accelerate network effects to drive innovation and competition with technological specifications, protocols and standards for various functions that enable interoperability across multiple actors. Prevent silos, fragmentation of networks, monopolisation, and walled gardens by design.

- **Inclusion**: A DPI should foster public and private innovation by enabling scalable solutions through open APIs, rather than a monolithic approach. It should support diverse access—online, semi-online, and offline—across various devices to serve all populations, not just the digitally connected. For instance, systems should offer multiple authentication modes (e.g., QR codes, offline tools) to address different needs and reduce the digital divide. Private innovation can help build and use the DPI, while adoption should remain voluntary and demand-driven for sustained success.

- **Privacy and Security**: Design the architecture with minimal data collection, ensuring systems only know what's necessary. Enhance auditability and trust through digitally signed data, non-repudiable change logs, and authenticated transaction trails. Use independent participant registries and verifiable credentials for increased trust and information verifiability. Implement granular, auditable consent frameworks for secure data sharing across systems, supported by multi-factor authentication and authorization.

- **Minimalism**: The DPI will adopt a minimalist approach, ensuring that the system is lean, scalable, and avoids unnecessary complexity.

- **Private Sector Innovation**: We will create an open ecosystem that allows for innovation by private actors, ensuring that our DPI can be extended with new services and solutions as needed.

- **Federated & Decentralised by Design**: Avoid centralization by using federated systems and databases that are reusable and accessible to individuals, preventing large data aggregations that pose cybersecurity and privacy risks. With modern protocols, it's possible to unify systems without centralization. While central systems may seem more secure, they often become prime targets for cyberattacks. Decentralized systems, interconnected by best practices, offer higher security and significantly reduce the risk of large-scale data breaches.

---

## Inji System Architecture Explanation

### Common Components Across Both PKI and DID approach

1. **Inji Certify (Single Instance)**
   - Central server for credential issuance and management
   - Interacts with issuers through JDXP

2. **JDXP (Centralized Interoperability Manager)**
   - Acts as a broker between multiple issuers and Inji Certify
   - Standardizes communication protocols

3. **Inji Wallet**
   - Available on multiple platforms:
     - iOS and Android mobile apps
     - Web browser application
   - Stores and manages user credentials

4. **Inji Verify**
   - Two deployment options:
     - Web application for online verification
     - Standalone app for offline verification

### PKI-Based Workflow

1. Issuers request credential issuance through JDXP
2. JDXP forwards these requests to Inji Certify
3. Inji Certify signs credentials using PKI certificates from a trusted Certificate Authority
4. Signed credentials are delivered to Inji Wallet (mobile or web)
5. For verification:
   - Verifiers use Inji Verify (web or offline app)
   - Verification occurs by checking signatures against the Public Key Directory
   - Certificate validation follows standard PKI chain of trust

### DID Web-Based Workflow

1. Issuers request credential issuance through JDXP
2. JDXP forwards these requests to Inji Certify
3. Inji Certify signs credentials using keys referenced in DID documents
4. Signed credentials are delivered to Inji Wallet (mobile or web)
5. For verification:
   - Verifiers use Inji Verify (web or offline app)
   - Verification occurs by resolving the DID via HTTPS
   - The DID document (hosted at a well-known HTTPS endpoint) provides the verification keys
   - No central CA is required as each entity controls their own DID document

### Key Differences

**PKI Approach**:
- Relies on centralized Certificate Authorities
- Uses established X.509 certificate hierarchy
- Requires Public Key Directory for verification
- More traditional, widely adopted approach

**DID Web Approach**:
- Decentralized trust model
- Each entity (issuers and Inji) hosts their own DID documents
- Verification happens through HTTPS-based DID resolution
- More modern, self-sovereign approach
- Reduces dependency on central authorities

---

## On-Premise Deployment Specifications

### Hardware Resources and Kubernetes Configuration

#### Kubernetes Cluster Requirements

| Component | Specification | Quantity | Purpose |
|---|---|---|---|
| Control Plane Nodes | 8 CPU cores, 16GB RAM, 100GB SSD | 3 | Kubernetes control plane (HA configuration) |
| High-Performance Worker Nodes | 16 CPU cores, 64GB RAM, 500GB SSD | 3-5 | Running Inji Certify and JDXP pods |
| Standard Worker Nodes | 8 CPU cores, 32GB RAM, 250GB SSD | 3-5 | Running web applications and supporting services |
| Storage Nodes | 8 CPU cores, 32GB RAM, 2TB+ SSD/NVMe | 3 | Distributed storage for persistent volumes |
| Network | 10Gbps internal networking minimum | - | Low-latency inter-node communication |
| Load Balancers | Physical or virtual | 2+ | Traffic distribution and high availability |

#### Helm Deployment Structure

```
# Simplified structure of Helm deployment
inji-platform/
├── charts/
│   ├── inji-certify/          # Inji Certify server
│   ├── jdxp-connector/        # JDXP integration service
│   ├── inji-wallet-web/       # Web wallet application
│   ├── inji-verify-web/       # Web verification application
│   ├── inji-database/         # Database cluster
│   ├── inji-redis/            # Redis cluster for caching
│   ├── inji-monitoring/       # Monitoring stack (Prometheus, Grafana)
│   └── inji-security/         # Security components
└── values/
    ├── production.yaml        # Production configuration
    ├── staging.yaml           # Staging configuration
    ├── pki-values.yaml        # PKI-specific configuration
    └── did-values.yaml        # DID Web-specific configuration
```

---

## High Availability Architecture for Inji System with PKI

Inji system can be deployed across primary and secondary sites to achieve high availability. This multi-site architecture ensures business continuity even if an entire data center or region becomes unavailable.

### Key Components for High Availability

#### Global Load Balancing

1. **Global Server Load Balancer (GSLB)**
   - Distributes traffic geographically based on:
     - User proximity (latency-based routing)
     - Site health and availability
     - Current load metrics
   - Can operate in either Active/Active or Active/Passive mode
   - Example: F5 DNS Load Balancer

#### Redundant Site Architecture

Each site contains a complete, self-sufficient deployment including:

1. **Kubernetes Cluster**
   - Independent control plane
   - Full set of worker nodes
   - Site-specific ingress controllers

2. **Application Services**
   - Complete set of application components
   - Independently scalable based on site-specific load

3. **Infrastructure Services**
   - Database clusters with cross-site replication
   - Redis caches with replication
   - Vault clusters with secrets replication

4. **PKI Infrastructure**
   - Certificate Authority (potentially with hierarchical structure)
   - Public Key Directory with synchronization
   - Certificate Revocation List (CRL) services

#### Cross-Site Services

1. **Data Synchronization & Replication**
   - Database replication (synchronous or asynchronous depending on requirements)
   - State synchronization for stateful services
   - PKI directory synchronization
   - Options:
     - PostgreSQL streaming replication
     - MongoDB replica sets
     - Redis sentinel or cluster
     - Custom synchronization services

2. **Global Monitoring & Alerting**
   - Centralized monitoring across all sites
   - Site health checking and availability metrics
   - Anomaly detection for early warning
   - Cross-site alerting and notification

3. **Managed DNS**
   - Dynamic DNS updates based on site health
   - TTL management for failover scenarios
   - Integration with GSLB for routing policy enforcement

### High Availability Deployment Strategies

#### Active/Active Configuration

In this configuration, both primary and secondary sites actively handle traffic simultaneously:
- GSLB routes requests based on geographic proximity or load balancing
- Both sites maintain synchronized state through replication
- Total system capacity is the sum of both sites
- Gradual load shifting is possible during planned maintenance

#### Active/Passive Configuration

In this configuration, the primary site handles all traffic while the secondary remains on standby:
- Secondary site is fully provisioned but handles minimal or no production traffic
- Regular data synchronization ensures secondary site is ready for failover
- GSLB redirects all traffic to secondary site during primary site failure
- Recovery Time Objective (RTO) is minimized through automated failover

### PKI-Specific High Availability Considerations

1. **CA Hierarchy Options**
   - Root CA can be maintained offline for security
   - Intermediate CAs at each site can issue certificates
   - Cross-signing between site CAs for mutual trust

2. **Certificate Distribution**
   - PKI directories synchronized between sites
   - CRLs published at both sites with identical content
   - OCSP responders deployed at both sites

3. **Key Management**
   - Hardware Security Modules (HSMs) at each site
   - Secure key backup and recovery procedures
   - Strict access controls and audit logging

### Helm Chart Configuration for Multi-Site Deployment

For Kubernetes orchestration, you would use site-specific Helm values files:

```yaml
# Example: primary-site-values.yaml
global:
  environment: production
  site: primary
  replication:
    role: primary
    peerSites:
      - name: secondary
        endpoint: secondary.inji.internal

# Database configuration for primary site
database:
  primary: true
  replication:
    enabled: true
    method: streaming

# PKI specific configuration
pki:
  ca:
    role: primary
  replication:
    enabled: true
```

This architecture provides resilience against various failure scenarios, including complete site failures, network partitions, and regional disasters, ensuring the Inji system maintains high availability for all users and partners.

---

## Data Protection in Inji Certify

Inji Certify includes several mechanisms to promote data protection while managing digital credentials. Here's how data protection is handled and what's stored in the PostgreSQL database:

### Data Protection Mechanisms

1. **Data Minimization**
   - Inji Certify follows the principle of data minimization, collecting and storing only data necessary for credential issuance and verification
   - Implements selective disclosure capabilities where credential holders can reveal only required attributes without exposing the entire credential

2. **Encryption**
   - Data at rest encryption for the PostgreSQL database
   - Transport Layer Security (TLS) for all communications
   - End-to-end encryption for credential transmission to wallets

3. **Key Management**
   - Secure storage of cryptographic keys in HashiCorp Vault or HSMs
   - Key rotation policies for long-term security
   - Strict access controls for key operations

4. **Access Controls**
   - Role-based access control (RBAC) for administrative functions
   - Audit logging for all data access and modification
   - IP-based restrictions for administrative interfaces

5. **Data Lifecycle Management**
   - Automated data retention policies
   - Secure deletion processes for expired credentials
   - Data archiving for compliance with retention requirements

### PostgreSQL Database Contents

The PostgreSQL database in Inji Certify typically stores:

1. **Metadata About Credentials**
   - Credential identifiers and types
   - Issuance and expiration dates
   - Revocation status
   - Schema information

2. **Issuer Information**
   - Issuer identifiers and public keys
   - Issuer metadata and service endpoints
   - Issuance policies and restrictions

3. **Credential Templates**
   - Schema definitions
   - Display templates for different credential types
   - Validation rules and constraints

4. **Holder Information**
   - Pseudonymous identifiers
   - Public key material (for holder binding)
   - Consent records for credential issuance

5. **System Configuration**
   - API endpoints and integration settings
   - Security policies and parameters
   - PKI or DID configuration details

6. **Audit Records**
   - Credential issuance events
   - Administrative actions
   - Authentication attempts
   - API access logs

### What Is Not Stored

To enhance data protection, Inji Certify typically does not store:

1. **Complete Credential Content**
   - The actual credential data is typically not retained after issuance
   - Only metadata needed for verification is kept

2. **Private Keys of Holders**
   - Holder private keys remain solely in the Inji Wallet
   - Zero-knowledge techniques may be used for verification

3. **Raw Personal Data**
   - After credential issuance, raw personal data is not retained
   - Hashed or encrypted references may be stored for revocation purposes

4. **Verification Results**
   - The results of verification operations are typically not persisted
   - Verification is treated as a stateless operation

In the PKI model, the database also stores certificate serial numbers and revocation information, while in the DID Web model, it stores DID references and resolution metadata. The overall approach prioritizes privacy by design while maintaining the necessary functionality for a trusted credential ecosystem.

### Other Key points to note:

- National ID usage comes in as an Identity layer for authentication. NIRA has exposed through JDXP, a biometric verification endpoint that needs biometric and ID data to run the verification. It uses Oauth 2.0

---

## Verifiable Credentialing Infrastructure - DaaS Scope Document Peru

*version 1.1*  
*Document approved by CDPI on July 7, 2025*  
*Document approved by RENIEC on July 7, 2025*

### Table of Contents

1. Table of Contents
2. Glossary
3. Executive Summary
4. Intended Audience & Purpose
5. Country Context
6. Actors
7. Components
8. Requirements Matrix
9. Scope for Rollout - Program & Technical Deliverables
10. Project Governance
11. Additional Information

### Glossary

| Term | Definition |
|---|---|
| DCS | Digital Credentials Stack |
| DaaS | DPI as a packaged Solution |
| DPG | Digital Public Good |
| DPI | Digital Public Infrastructure |
| ICT | Information and Communication Technology |
| ISV | Independent Software Vendor |
| KRA | Key Result Areas |
| L1 Support | Level 1 support; setup, configuration, basic troubleshooting |
| L2 Support | Level 2 support; minor bug fixes to code, test, build and deploy |
| L3 Support | Level 3 support; new feature development, test, build and deploy |
| RENIEC | Registro Nacional de Identificación y Estado Civil (National Civil and Identity Registry) |
| SaaS | Software as a Service |
| SDK | Software Development Kit |
| SP | Service Provider |
| SGTD | Secretaría de Gobierno y Transformación Digital (Secretary of Government and Digital Transformation) |
| VC | Verifiable Credential |
| VP | Verifiable Presentation |
| ZKP | Zero Knowledge Proof |

### Executive Summary

**Disclaimer**: This Country Scope Document, read with the DaaS Legal Framework, sets out the entire agreement between the parties with regard to the scope set out herein. Upon non-compliance of the Service Provider with the requirements outlined in this Country Scope Document, the DaaS DPG Partner may terminate this Country Scope Document.

**Scope**: This Scope Document outlines the programmatic and technical framework for implementing a national Verifiable Credential (VC) infrastructure in Peru following the DPI as a Packaged Solution (DaaS) approach.

**Strategic Vision and Technical Approach**: Peru's VC rollout seeks to establish a low-cost, high-trust digital ecosystem by enabling cryptographically signed, user-controlled credentials. The approach leverages modular, standards-based components for issuance, storage, and verification—enabling asynchronous adoption by diverse ecosystem actors. The rollout is aligned with Peru's broader digital transformation goals and leverages the leadership of RENIEC and the Secretaría de Gobierno y Transformación Digital (SGTD).

### Introduction to Verifiable Credentials

Credentials offer a mechanism for low-cost, high-trust, user-centric data sharing

### Potential Path Forward

Credentialing both attributes and transactions are the necessary foundation for building digital, equitable economies

### Solution Approach to Credentialing DPI

#### Open loop VC issuance platforms
#### Inclusive approach to credential stores
#### Verifications SDK
#### Supporting Trust Infrastructure

This comprehensive strategy note compilation covers digital credentialing systems implementation across multiple countries (Jamaica, Barbados, and Peru), providing detailed technical architectures, deployment strategies, and governance frameworks for establishing secure, interoperable digital public infrastructure.