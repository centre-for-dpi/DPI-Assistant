# DPI for Healthcare



1
DPI for Healthcare

2
DPI blocks for Health

3
Digital Public Infrastructure
approach to Healthcare
Healthcare is inherently complex, comprising an intricate web of needs, solutions,
and stakeholders all aimed at one goal: Universal Health Coverage (UHC). The
journey towards digitization in healthcare, which gained momentum in the 1990s
with the adoption of electronic medical records, has showcased significant benefits
but also highlighted substantial challenges.
The landscape of healthcare is vastly diverse, shaped by geographical,
socioeconomic, and demographic factors. This diversity demands tailored
approaches—whether addressing chronic lifestyle diseases or managing
outbreaks of infectious diseases. While some nations have robust public
healthcare systems, others rely heavily on private sectors, or a mix of both, often
supported by global aid and development partners.
Innovation is relentless in healthcare. Advances in medical science, from gene
therapy to artificial intelligence (AI), are revolutionizing treatments and patient care.
Technologies like AI are personalizing healthcare, IoT devices are enhancing real-
time monitoring, and 3D printing is transforming prosthetics and surgical
procedures. These innovations are shifting healthcare from a traditional patient-
care model to a more efficient, individualized care-patient model, facilitated by
microdevices and edge computing.
However, the current efforts are fragmented. The high cost of coordination and
the redundancy of efforts across systems result in inefficiencies and barriers to
effective healthcare delivery. Hospitals and healthcare schemes often operate in
isolation, each developing unique patient ID systems and digital solutions, which
hampers the portability of health records and integration across different platforms.

4
To address these challenges, a paradigm shift is necessary—a shift towards a
Digital Public Infrastructure (DPI) approach. This model proposes a minimalist yet
robust infrastructure underpinned by sound governance models, enabling
diverse market players—both public and private—to innovate and scale solutions
effectively. By establishing shared standards and interoperable systems, DPI can
eliminate the repetition of efforts, lower costs, and trigger positive flywheel
effects via serendipitous innovations that will take us closer to UHC.
Read more about the digital public infrastructure approach here. 
The next series of blogs detail what are the few reusable blocks that can spur
inclusive innovation in healthcare. It is also important to note that the blocks can
only be considered as DPI if they are built per the technical architecture principles
. 

5
Trusted registries in Healthcare
Healthcare is a highly sensitive and regulated sector. Its success is completely
dependent on how much “trust” a country can bring in ensuring accessible and
safe healthcare across the multimodal (physical & virtual) health delivery
ecosystem. 
Verifying ID & accessing profile data of any ‘nounʼ in an ecosystem: people,
entities, or objects is a crucial foundational function of in any economy. When
moving from physical to remote or digital interactions, the first complication is
establishing trust as to the identity of the counterparty. This identity must be
verifiable: i.e. can be authenticated by some means (a mobile one-time
password, a biometric fingerprint scan, or even face ID authentication).
A fundamental issue plaguing current healthcare systems is the lack of dependable
and accessible single source of truth. There are certain (foundational) data lists
that every solution needs to operate. In healthcare, these include lists of qualified
medical professionals, medical institutions, insurers etc. Multiple health programs
tend to maintain their isolated versions of these lists and every new player ends
up having to recollect this information. As a result, this information is not
verifiable, not reusable and rarely up to date. 
Electronic registries are structured, live identification systems that maintain
standardised, updated data records compliant with standards/schema, ensuring
a 'Single Source of Truth' for entities and offering access via open APIs. In
contrast, conventional databases provide a way to simply store and manage the
data. Databases may have structured data records but may not necessarily be
compliant with any standard/schema, and are not sharable, verifiable or
authenticable.

6
Countries might be in different stages of their registry implementation ranging from
a simple database to a mature registry as is illustrated here. 
Registries should provide:
1) digitally signed data to ensure it is tamper-proof; 
2) Open APIs (and prevent clunky PDF or Excel downloads) to ensure systems
can directly access the information; 
3) machine-readable data to allow algorithms and systems to process and
analyse it easily in service of individuals.
This greatly enhances accessibility and speed, reduces the cost of service delivery,
and triggers competition and innovation across market players. For more detailed
information on registries, see here
As a rule of thumb, if the core data is likely to change often over time it should not
be in a registry! Registries are most useful for a minimal set of data fields which
tend to stay constant. 

7
Identity and Registries
in a Healthcare Context
Creating Trusted Access for Healthcare Delivery:
•
Access to more accurate information on health facilities and service providers,
eg for an ecosystem of telemedicine apps 
•
Registries for healthcare providers help in verifying the credentials and
qualifications of doctors, nurses, and other medical staff, ensuring that patients
receive care from qualified professionals only
Building Resilience In a Healthcare Ecosystem :
•
Policymakers will have better access to data, enabling more informed decision-
making by the Government
•
Health registries are essential for crisis preparedness. They provide real-time
information on available resources, helping governments allocate healthcare
personnel, equipment, and facilities efficiently during health-related crises.
Enabling Access to Service Delivery:
•
Improved discoverability and visibility of healthcare professionals, enhancing
the professional and provider practice.
•
Access to view patientsʼ health history with their consent, in a safe, secure, and
cost-efficient manner
•
Engage with more patients through online presence.
A country's healthcare ecosystem can include different types of registries.
How can Electronic registries transform
healthcare?

8
A drug registry is required to build trust if the country has a significant
spurious drug problem.
An insurers registry is key if there's a large ecosystem of private and public
insurers in the country.
An organ donor registry can help track the people who have signed up to be
organ donors.
A disease registry is useful in a country where there is a need to harmonise
colloquial names and symptoms with scientific names.
While the country can build as many registries as it needs to depending on the
context, three crucial registries are essential in the first phase for accessibility in
healthcare by leveraging all existing players and reducing the barrier to entry for
new players. These are:
•
Virtual Health Address
•
Health Professionals Registry
•
Health Facilities Registry

9
Guiding Principles
•
Minimalist: Only include necessary identifying data (preferably <10 data fields
per registry) that is easy for individuals/entities to keep updated, and tends not
to change significantly over time.
•
Ease of Data Reuse: Make data accessible in machine-readable format via open
APIs to allow seamless reuse across many applications.
•
Privacy & Security by design: Embed privacy and security features into digital
IDs and registries, adopting encryption, strong cybersecurity measures,  and
digital signatures for authentication of source of data.
•
Single source of truth: The registries should ensure that it is the single source
of truth for the entity in question that health systems and organisations can
leverage for data exchange and service deliver
•
Self-Maintainable: 
a. Mechanisms to enable auto-audit ensuring deduplication (if needed), error or
completeness flagging that can be configured at agreed intervals as defined by the
system owner can be enabled. 
b. To ensure data is always updated, interval-based updation alerts to citizens,
organisations, government departments and accountable entities can be enabled
via defined updation and verification processes.
c. Automated updates  to registries can also be ensured by crawling relevant
databases or individual systems with consent and authentication  
Guiding design principles and key technical
characteristics for architecting registries: 

10
•
Ease of Data Capture along with legacy data migration: Should enable features
like bulk uploads or API-based integration to pull/push data from existing legacy
systems and digital databases. For a new registration, multimodal options
should be made available for inclusivity (like mobile app/portal, in-person
enrolment etc)
•
Scalability: Architect the infrastructure to handle national scale volumes of
onboarding & updates while maintaining high performance
•
Trustworthiness/ Integrity of data: Claim and attestation workflows should be
maintained to ensure trustworthy data
•
Auditable: Should ensure mechanisms to maintain logs of data edits, updation,
and deletion with a history of what was changed, by whom and the event when
that happened

11
Pitfalls
These are some of the very common pitfalls to watch out for while architecting
registries:
•
A Tendency to recollect all the data - Registries should leverage data from existing
databases/ data sources and convert these existing databases into verifiable
open-access registries 
•
Insisting on one centralised registry - For any given purpose, multiple federated
registries can co-exist which are machine readable & provide open APIs for
accessing data
•
Registries should collect only whatʼs necessary not whatʼs sufficient; i.e Registries
shouldnʼt contain data the govt. wants to collect, but data the market needs to
scale!

12
Virtual health address
or Health Account
Also known by Health ID
The primary purpose of health IDs or health accounts is to create a reliable and
tamper-proof identification mechanism that underpins all interactions in the
healthcare domain. By assigning digital identities, stakeholders can access health
records, initiate health services and transactions, and engage in communication
while maintaining data integrity and authenticity.
A Virtual Health Address is a secure identification method for an individual in a
health ecosystem, crucial for efficient patient management, data sharing and
access to services across healthcare systems. It ensures that healthcare
providers have access to accurate patient information, enabling consistent and
appropriate care. Additionally, Health addresses are vital for insurance verification,
research, and public health management, contributing to improved healthcare
outcomes and the goal of achieving universal healthcare by streamlining processes
and enhancing data accuracy and accessibility. An individual can have multiple
health addresses.
Purpose for a Health address/account Registry:
•
Share and link medical records in a decentralised federated architecture; thus
enabling the creation of a longitudinal medical record
•
Enabling linking to family PHRs for assisted care delivery & consent
management
•
Track insurance claims or access to any government health programs/benefits
Usage by each stakeholder:

13
Citizen/patient: Choice of identifiers for each person, streamlined and secure
identification and authentication for patients seeking medical care, during
telemedicine consultations, access their health records, scheduling
appointments, and authenticating their identity for receiving G2P benefits.
Healthcare providers: Securely access patient information, log medical
procedures, and maintain accurate treatment histories, administer personalised
care by providing insights into a patient's medical history, diagnoses,
medications, and treatment plans
Hospitals and Health Facilities: Leverage digital IDs for streamlined patient
registration, appointment management, and resource allocation
Government and Regulatory Authorities: Monitor healthcare activities, ensure
compliance with standards, disburse benefits and facilitate data exchange
Insurance Providers: Verify patient identities, process claims, and manage
policyholder information.
Common pitfalls in design of Health ID/ (Virtual) Health Account
1.Overloading the ID registry with excessive data fields that are difficult to keep
updated, and creates challenges in scaling to the full population
2.Mandatory linkage with one or more national ID systems (tends to reduce
adoption of a registry)
3.Absence of health ID aliases/tokens: Tokenisation adds another layer of
privacy (masking of health account address) so that the original information is
not exposed to other systems.  
Should virtual health IDs/ health accounts be unique or should a person be allowed
to have many health accounts? 
Ideally, there shouldnʼt be a cap on the number of health accounts an individual can
create. This is necessary to ensure that the individual can present and take control of
their records in a privacy-preserving manner. 
Our view on some of the common debates regarding
Health ID/ (Virtual) Health account number:

14
But how does that create a longitudinal health record? What if patients hide key
details from someone, for example, an insurer, by not divulging an entire account? 
Individuals should always have the choice to share or withhold their data. Now, rules
and regulations can be imposed on a workflow to incentivise individuals to records
spread across multiple health accounts and failure to do so can be dealt with
separately. 
But, the technology infrastructure should always support the creation of multiple
health records. 
Should health accounts be linked to national IDs or any other IDs?
For privacy and security reasons, it's advisable not to link any ID systems together.
However, if authentication of an individual or entity is necessary for a transaction,
existing digital ID systems or even mobile numbers can be used. Collecting a (unique)
digital ID number during the creation of a health account can aid in deduplication,
which is crucial when taxpayer money is being spent. For all other practical purposes,
you donʼt need to link a health account to a national ID.

15
Health Professionals Registry
The Health Professionals Registry serves as the repository of accredited healthcare
professionals, offering a unified and trustworthy source of information. A Health
Professionals Registry records qualifications, specialities, and credentials, creating
a reliable source of information for patients, regulatory bodies, and healthcare
institutions, reusable for third-party institutions.  It's a mechanism to verify the
authenticity of qualifications, specialities, and credentials of healthcare
professionals. it also serves single, dependable reference for patients and
stakeholders thus eliminating "quacks" that put patient lives at risk.
Data empowerment using registry: The data collected in this registry can also be
converted into a verifiable credential and issued back to a professional to empower
themselves with the data. They can then use this to get access to other services or
benefits like loans, subsidies, tax credits etc.
How do different stakeholders interact with Health Professionals Registry?
Healthcare professionals: Prove their qualifications in a trusted manner for
various contexts
Healthcare institutions: Verify the qualifications of potential hires, access
specialists to deliver care, keep track of current professionals on the role,
ensure a qualified workforce, capacity needs analysis, track malpractice, fraud,
negligence,
Government or Regulatory body: Monitor compliance with licensing standards
and facilitate professional accountability
Patients: Discover professionals and specialists; Check the legitimacy of the
professionals before receiving care 
Policymakers: National-level resource/Capability assessment, Needs analysis
of certain specialisations
Which categories of Professionals could the Registry include?

16
What minimum fields should the registry contain?
Mandatory
•
Name 
•
Credentials
•
Specialties
•
Licenses
•
Contact information 
Optional
•
Education History
•
Current Employment
Necessary - Phase 1Suggested- Phase 2
Doctors - Across multiple systems of
medicine 
Physiotherapists
NursesCompounders
ParamedicsMidwives
Lab Technicians..
Community Health Workers...

17
Health Facilities Registry
The Health Facility Registry acts as a vital resource within the healthcare
ecosystem, offering a comprehensive repository of all healthcare facilities in a
country. This registry shall encompass both public and private health facilities,
ranging from hospitals and clinics to diagnostic laboratories, imaging centres,
pharmacies, and more. It ensures the discoverability of healthcare facilities,
services, locations, and resources, enabling evidence-based decision-making,
efficient resource allocation, and strategic planning within the healthcare sector.
How do different stakeholders use Health Facilities Registry?
Patients: Locating and selecting appropriate healthcare services and facilities
based on needs
Doctors and Healthcare Professionals: Referring patients to suitable facilities
and coordinating care efficiently
Insurance Providers: Managing network providers and processing claims
Health Services Apps: To access a baseline network of facilities that can be
reached for care
Government/Policymakers: Planning healthcare infrastructure, allocating
resources, ensuring access to all, ensuring compliance, crisis management
What minimum fields should the registry contain?
Mandatory
•
Facility Name
•
Type of facility (hospitals, clinics, path labs)
•
Location (geographic coordinates)
•
Contact details
•
Services offered (specialities, treatments)
•
Capacity (number of beds)

18
Point to note: 
A common confusion while architecting the Health Facilities Registry is overloading
the registry with data that changes frequently - like a number of available beds,
doctors' schedules etc. These data fields are very dynamic and should be part of the
catalogue made available by the service provider as opposed to creating a heavy,
never up to date registry. This catalogue can be used by the open network of
healthcare to provide access to services like hospital admission, telemedicine etc

19
Data sharing in Healthcare
Data sharing is at the very crux of healthcare. In fact, this sector has been getting
so much focus often any digital infrastructure-level interventions are synonymous
with data sharing. There can be multiple approaches to data sharing - 
1.The ability to generate verifiable credentials for key certificates/claims in a
digital society and share asynchronously with any requestor (eg. proof of
education of  a doctor; proof of business registration of a hospital; proof of
work experience of  a physiotherapist, proof of vaccination, lab reports etc.) 
2.The ability to share personal data in real-time in a secure, consented manner
with a third party (who is often a part of a network) to avail a service based on
the shared data (eg a health diagnosis, real-time health monitoring data from
devices etc.)
3.The ability for a society to generate open anonymised datasets to enable
research or trends assessments across various sectors
Additionally, the open anonymised datasets can be used to train and publish open
AI/ML models that can be used to better enable access to services based on data,
e.g. real-time language translation models; clinical decision support models etc.
The contextualisation of these building blocks to healthcare can be done by
defining data standards and data schema at a country level. However, there can
never be one schema. The solutions must account for this reality and be
compatible with multiple schemas. The data itself can be self-identifying.

20
Verifiable credentials
Verifiable Credentials | Centre for Digital Public Infrastructure

21
Data sharing networks
Data Sharing, Credentials and Models | Centre for Digital Public
Infrastructure

22
Aggregated, anonymised
open data sets
Non-personal Anonymised Datasets | Centre for Digital Public
Infrastructure

23
Capturing consent
In the healthcare sector, the stream of personal data generated during every
transaction enables better decision-making and service delivery. Itʼs hence
imperative to empower users by enabling consented sharing of granular personal
health data in a secure, privacy-protected manner. In any user-driven data-
sharing framework, the data consumer needs to request the user (individual or
entity) for their personal data by specifying the quantum of data required, the
receiver of the data, the purpose itʼs going to be used for, the duration the data is
needed for, the frequency of data pull etc. This step is a precursor to the actual
sharing of data by the data provider. Maintaining logs of the agreed-upon data-
sharing transaction in a non-repudiable, auditable fashion is a key check. The
consent given for a specific interaction must be revokable at the userʼs will. 
Electronic consent is an artefact/ data structure that records and stores the consent
for that data-sharing agreement.
Consent artefacts can also be used for non-personal data sharing. An example of
this would be a research institute defining the terms to make their clinical trial data
available to other innovators to consume. 
Itʼs worthwhile noting that consent artefact is useful in capturing consent along with
the bounds of it and is different from wet signature/ e-signature. For some use-
cases, especially in capturing agreement in the legal domain, the latter will suffice.
For example,  in capturing consent for medical procedures an e-signature would be
enough, while a consent artefact can be used for sharing data with a doctor for
treatment. 
The consent artefact in conjunction with the data-sharing framework powers a lot
of use cases for different stakeholders:
eConsent | Centre for Digital Public Infrastructure

24
•
Healthcare professional/ facility: Used to request past medical records, and
share healthcare data with insurance players, other HPs, health techs, govts.
etc
•
Patient (user): Used to share medical records for better medical care, health
insurance claims, and preventive care as well as consent to anonymised data
aggregation
•
Quality councils: Uses sampled individual/ aggregated data to ensure quality
standards are met and standard treatment guidelines are followed 
•
Government: To audit and ensure that there are no malpractices in data sharing
and the user is in control of the data
•
Insurance: Used to request individualʼs treatment data to adjudicate claims
requests, request individualsʼ medical and related data (from wearablesʼ etc.) to
structure claims 
Good Design Principles
•
Aim for data integrity: Ensure digital signatures and consent artefacts are
tamper-proof, securing the authenticity and integrity of critical documents.
•
User empowerment: Design consent management objects that put patients in
control, allowing them to grant, modify, and revoke granular consent easily.
•
Non-repudiation: This ensures that the origin of the signed content is verifiable
and accepted by all involved parties. In this context, "repudiation" denotes the
act of a signer denying any affiliation with or responsibility for the signed
content.
•
Auditability: Implement comprehensive audit trails that log consent changes,
digital signature actions, and data access to ensure transparency and
accountability.
•
Machine-readable:  The signatures and any consent object should be machine-
readable to facilitate efficient digital transactions

25
Health care services
A DPI approach to service delivery (or transactions) represents the capability to
avail any service or purchase any good across any app in an interoperable manner.
Accessing govt schemes and services
Interoperable telemedicine and more

26
Accessing govt
schemes and services
This block discusses harnessing the power of open APIs to unlock services that
sit in closed systems.
All governments offer a variety of welfare schemes and other services to their
citizens. The common practice is to provide a new portal or a new application for
discovery and information about these services. Many countries also attempt to
bundle all services and provide it in a single portal (Government Services Bus). This
is cumbersome, excludes access to certain segments of the population and is a
single point of failure, vulnerable to attacks. 
Instead, APIs for all govt. schemes can be opened for public usage. This includes
such services as checking guidelines & eligibility, enrollment, beneficiary certificate
issuance, voucher issuance, submitting documents, payments and many more.
Third parties can integrate these APIs into their workflows and the user can
perform the same functions through any app of their choice. This is also powerful
because of the following:
•
Empowers by enabling user choice: Third-party apps can innovate on the user
experience and even accessibility settings best suited for the user 
•
Increased uptime: Works even when the main portal(s) are down
•
Compatibility with other systems: Can be integrated with open network for
health services for availing care
Open APIs for Govt. schemes 

27
Why is this unlocking key? 
1.Healthtech apps/ start-ups can integrate value added services into their
workflows and increase customer satisfaction
2.Governments can ensure maximum utilisation of all their schemes and services
3.Patients/ end-users benefit from the convenience of asserting their choice by
accessing services in the language, and interfaces they prefer - resulting in
better user experience
This network can be further expanded to create a wider public-private network to
enable the discovery and fulfilment of all kinds of healthcare services. 

28
Interoperable telemedicine and more
The Open Network for Health Services is designed to create a network enabled
by open protocols that connect healthcare providers, patients, and other
stakeholders. Its primary purpose is to facilitate the discovery of available
healthcare services, appointments, and resources, streamlining the patient
journey.
With every passing day, more and more services are becoming digital, often
powered by private platforms that have disrupted traditional service providers.
Strong network effects and hence concentration of data with these few large
players is a pattern we see. Closed-loop marketplaces are the norm. Apps are not
interoperable and all the individual businesses have to solve all parts of the
transaction cycle, i.e - discovery, ordering, fulfilment & post fulfilment. 
While an aggregator-led model (where both service providers and end users are
onboarded to the same platform) seems to work, it does not scale beyond a point.
Besides, large aggregators often adopt business policies that are advantageous to
neither the service provider(seller) nor the end user. 
Data in silos, predatory monopolistic practices, lack of scale and exclusion of
certain population segments - all indicate a need to shift the approach from a
“platform” to a more“network” approach. Imagine trusted, low-cost, decentralised
transactions and at scale - this is what open networks aim to achieve!
Open Network for Health Services 

29
In healthcare, we need to access many services - booking a doctor's appointment,
ordering medicines/lab tests online, booking the nearest ambulance in case of an
emergency, and consultation via telemedicine are just a few of these.  Normally all
these services are in siloed apps or platforms. If a patient uses app A and their
doctor uses app B, they can only consult the doctor if both are on the same
platform. This creates monopolistic practices, and a lack of scale - all resulting in
exclusion.
What if we could create a network and use open protocols to access any good or
service on any platform? The patient can now use app A to consult their doctor on
app B and this creates an open network of health services- This also implies that
not all apps have to solve demand and supply individually. Now the user-side apps
can be then customised to their demographics -  for low digital literacy, people
speaking local languages etc. and will still solve for care - which is very powerful. 

30
In developing economies, thereʼs often diversity in terms of language, income
group, location and culture, digital literacy, access to phones/ digital and more. One
(or two) solutions do not fit the needs of all. For example, itʼs a very common
practice for governments to launch “the national telemedicine app” to improve
access to care for impoverished sections of the population.  While, itʼs a great effort
this will not scale for all of society, neither all the caregivers nor care seekers.
Fundamentally, what an open health network does is unbundle the user interface
from the service providers, while connecting them both, eliminating the need to
aggregate both sides. There can be many user interfaces - solving for differently
abled sections of population, low tech literate sections, old people etc - all having
access to the same service providers (doctors, pharmacists, labs ..)
This approach is also advantageous for the service providers as they have more
choice in terms of who they choose to work with, are in control of their (digitally
signed) transaction data (which they can use to get access to loans) and now have
access to almost whole of the population.
The same network can be extended beyond patients to providers. Healthcare
facilities can discover their service providers through this network and solve for any
resource gaps. For example, a primary care centre can discover and use a cloud
diagnostics service, and idle ambulances and give their patients better care. 
Other functions like online dispute resolution, contracting, and regulations can be
layered on the network. This network can interact with open other networks for
fulfilment of allied goods and services.  
How can various stakeholders benefit from an open network of health services?
For patients 
•
Discover any healthcare service or good  - Check the availability of beds/
procedures/ equipment at a hospital, discover & consult a doctor (via
telemedicine), order medicines online, book an ambulance, discover nearby
vaccination camps and many more!
For healthcare facilities 

31
•
Be discovered by consumers of the services they provide by uploading their
service catalogue to any of the network applications.
•
Discover any service providers for any ancillary service - Ambulances,  Cloud
diagnostics etc
For healthcare professionals ‍⚕️
•
Be discovered by consumers of the services they provide by uploading their
service catalogue to any of the applications - without being on multiple apps.
Key  considerations in designing an open network for health services :
•
Solving for trust: Design should solve for trust by verifying all the network
participants and making this service available to all other participants 
•
Separate data package exchange from user experience allowing for multiple
implementations: The design should allow for multiple manifestations of the
end user-facing layer across form factors, connectivity, devices etc. For
example, the same network should be accessible via a smartphone, feature
phone, USSD etc.
•
Special focus on multilateral dispute resolution and grievance redressal: The
network/ protocol design should also leave provisions for multi-party dispute
resolution and mediation. 
•
Open specifications allowing for interoperability: Standardised open
specifications for information exchange between any two participants
irrespective of technology or medium of exchange.  
•
Decentralised:  Should support a network among the end-user/participants
with no centralised intelligence; the intelligence, influence and control are
distributed to the end-users
•
Layered design: Should allow for higher-level applications to be built via
unbundling the whole process.  

32
Payments in healthcare
Health Claims Exchange is a block that facilitates electronic claims management
throughout the lifecycle of a claim by interacting with payors, patients,
healthcare facilities, technology providers and regulators.
In any healthcare ecosystem, the processing of insurance claims involves a long
sequence of steps including eligibility checks against payee/payor details, pre-
authorisation of request, filing claims, disbursement of payments, audit of logs for
regulatory compliance etc.
A typical flow in the processing of a health insurance claim is as follows:
These processes are often manual, paper-based based or implemented in siloed
systems.Lack of machine readability, non-standardized & manual adjudication
processes, and absence of interoperability make the entire cycle extremely
inefficient - thus driving up the cost of processing claims and increasing
turnaround time. This in turn puts all the stakeholders at a disadvantage. The high
cost of processing a claim also prohibits innovation in insurance products,
eventually adversely affecting the goal of minimizing out-of-pocket expenditure.
Additionally, the regulators/ policymakers do not have adequate visibility to the
whole process and cannot craft data-informed policies or penalise bad actors. 

33
The goal is to create an open, system-agnostic, interoperable Health Claims
Exchange as a DPI block that can bring in efficiency, power innovation, and
increase visibility.  
In the simplest of terms, Healthcare Claims Exchange is a protocol that allows
many fragmented solutions in insurance to interoperate. It can visualised as a
web underpinning all the individual solutions for each step in the claims lifecycle.
Any solution/ model can plug into this exchange to unlock network effects.  
A good approach to solving this is to look at how the right modular technical
approach and governance can empower market players. A Health Claims Exchange
implementation can have the following key components:

34
•
API standards: This outlines the protocol APIs that facilitate requests and
responses for all the transactions like authorisations, communications,
payments, notifications etc. 
•
Data standards: The format and definitions of data used in this system need to
be standardised at a network level. For achieving semantic interoperability,
there should be consensus on terminology and coding systems for clinical
resources (medical condition, procedure, treatment etc.) Country-wise
contextualisation of existing data standards like SNOMED, ICD-10-PCS, and
LOINC is one way to implement this. 
•
The syntax of the data for multiple transactions also needs to be laid out clearly
by defining relevant objects like claims, payments etc. These are nothing but
bundling of data in a machine-readable form.  These facilitate the flow of data
exchange between different systems and data processing in health claim
transactions without the need for human intervention. There might be a need to
define domain-specific standards like policy and bill markup languages that
digitally encode the “insurance product & bills” thus helping with auto
adjudication.
Practically,  there can be a gateway(s) that performs the functions of verifying
participants, routing requests to the right entities and facilitating settlement
guarantees via smart contracts. These gateways can refer back to the Payor
registry (refer to ID & Registries)to get details of verified players in the ecosystem.
They should also be able to talk to the personal health data-sharing network to
fetch individualsʼ medical history after obtaining consent.
The above two standards (protocol API & data) combined with business policies,
governance institutions, and cross-sectoral payments infrastructure for
settlements constitute the key components of a health claims settlement
network.
The DPI approach of establishing API and data standards is key in unlocking an
interoperable, sustainable, and inclusive claims exchange where multiple players
can innovate. 
How do different stakeholders benefit from a Health Claims Exchange?

35
The state/ responsible authority can release open-source reference
implementations of the software involved to catalyse innovation and accelerate
adoption. 
The implementation of unifying Health Claims Exchange(s) (can be many
exchanges that communicate with each other) has the potential to revolutionise the
healthcare sector by significantly enhancing the quality of care, reducing the cost
of care to make it universally affordable, reducing administrative burdens, and
improving overall access to healthcare services. 
Good Design Principles

36
•
Open: Specifications have to be open to promote technical compatibility and
promote vendor neutrality.
•
Interoperability: The infrastructure should allow for interoperability of stores of
values, apps, forms of payments etc.
•
Security by design: The payments infrastructure has to be highly secure
(mandating encryption, SSL certificates etc.) and not expose the ecosystem
players to any systemic risks. 
•
Low cost: Per transaction cost should be nil/ minimal for the payments
infrastructure to work at scale
•
Evolvability & programmability: A modern protocol that is form and mode-
agnostic and can be programmed to support new use cases 
•
Reliability & scalability: The systems should be designed to work at population
scale with continuous uptime
•
Allow user choice: Allow participants to use their choice of
technology/solutions to make/ receive payments
•
Transparency: Mechanisms to view and verify data trails should be available

37
Open source standards
and solutions

38
Technical specifications
to build DPI in healthcare
A list of open source specifications/ reference implementations countries can use
to build their DPI in healthcare. CDPI is a tech neutral entity and does not endorse
any of the following solutions.
a. Registries
1.Govstack: docs | specs
2.G2P connect: docs | specs
3.OpenHIE: docs | specs
Health:
1.Open CR docs | specs
2.SanteMPI docs | specs
3.GeoPrism Registry docs | specs
Foundational registry:
4.OpenCRVS docs | specs
Domain agnostic registry: 
5.Sunbird RC docs | specs
Specification
Reference implementations
Digital ID & Registries

39
a. Personal Data sharing via Verifiable credentials
•
Formats - W3C VC Data Model, W3C VC JSON, ISO mDL, Anonymous
Credentials
•
Issuance - OIDC, W3C VC-API
•
Wallets - W3C Universal Wallet, Open Wallet Foundation
Health:
1.SMART health cards  docs| specs
2.EU DCC docs | specs
3.DIVOC docs | specs
Domain agnostic:
4.Sunbird - Certificate issuance docs | specs
ID credential:
5.Inji by MOSIP docs | specs
b. Personal Data sharing via consented data sharing frameworks :
Specifications
Reference implementations
Data sharing, credentialling, and models

40
1.DEPA docs| specs
2.X-Road docs| specs
3.OpenHIE docs| specs
4.Dataspaces docs | specs
5.G2P connect docs| specs
1.X-road docs | specs
2.Account Aggregator (Financial data sharing) docs | specs
3.Health data sharing (India - HIE) docs | specs
a. Signature
1.E-sign docs | specs
To be added
b. Consent:
First Tab
Reference implementations
Specifications
Reference implementations
Signatures & consent

41
1.Electronic Consent artefact docs | specs
2.Govstack Consent building block docs | specs
3.DEPA consent artefact docs | specs
1.Financial data sharing (Account Aggregator) docs | specs
2.Health data sharing (India - HIE) docs | specs
3.Agri stack (forthcoming)
1.Beckn Protocol - docs | specs
Specifications
Reference implementations
Specifications
Discovery & fulfillment

42
Health:
1.BeckN Decentralised Health Protocol docs | specs
2.UHI docs | specs
Mobility:
1.P2P ride hailing network, Namma Yatri docs| specs
e-Commerce:
1.Open network for digital commerce docs | specs
Skilling & Education:
1.Open network for education and skilling transactions docs | specs 
Agri & Climate:
To be added
a. Claims exchange:
To be added
1.Health claims exchange docs | specs
b. P2P/ M, G2P solutions:
Reference implementations
Specifications
Reference implementations
Payments

43
1.G2P Connect Solution - docs | specs
2.P2P / P2M - Unified Payments Interface Protocol (forthcoming)
3.UK Open Banking Payments - docs| specs
1.Batch payments - Mojaloop, Mifos
2.Beneficiary / Scheme Mgmt partners - OpenG2P, OpenSPP, DIGIT
Specifications
Reference implementations