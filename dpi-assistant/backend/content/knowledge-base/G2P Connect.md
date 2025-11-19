# G2P Connect



1
G2P Connect

2
G2P Connect

3
Overview
In its daily workings, governments across local, state and national levels make
various payments to people of a country. This may be in the form of subsidies,
pensions, scholarships, incentives during emergencies and more. Citizens may
choose to receive these payments in different ways such as through cash, bank
transfers, mobile wallets, prepaid vouchers, etc.
Each government entity who is a facilitator of any of these g2p benefit schemes is
required to build its own system to verify individuals, authenticate transactions and
transfer money. They often have to communicate across departments to
accumulate all the data needed to make an informed decision regarding the
eligibility for a payment transfer, and then across another set of departments to
actually disburse that payment. In order to coordinate this monumental, yet routine
effort, duplication of systems, effort and resources takes place at every level of
government and across departments. It also causes delays, high costs, leakages
and loss of transparency, as a result of which funds donʼt always reach their
intended beneficiaries.
Creating a centralised storage of data doesnʼt work either because it creates
honeypots that pose large security risks, have no formal method for setting
accountability of data-updation and require building entirely new systems. This
solution follows the traditional mindset of digitisation ie: taking things ‘onlineʼ
without accounting for political realities, human centric design, different speeds and
degrees of adoption, and a future-focused, innovation mindset. This is not what
Digital Public Infrastructure refers to.
A G2P DPI is about building an overarching architecture that ensures
interoperability, inclusion, privacy, security, autonomy and asynchronous
adoption by design.
The common steps of executing any g2p payment includes:

4
1.Checking for eligibility of the beneficiaries according to pre-set scheme criteria
using data from federated functional registries
2.Authenticating the identity of the eligible beneficiaries using online/offline,
self/assisted modes
3.Mapping the authenticated, eligible beneficiaries to a store of value of their
choice in which they choose to receive these payments using multiple payment
rails
The easiest way to increase the efficiency, effectiveness and security of these g2p
payments is to build a secure, decentralised architecture that provides common
building blocks (solving for the 3 points listed above), that individual departments
can then customise on top. This is what G2P Connect solves!
G2P connect enables the creation of a shared infrastructure in a country that
different agencies can use to deliver any kind of government to person payment
digitally end-to-end. This includes establishing the identity of the beneficiary,
eligibility, enrolment, mapping IDs to bank accounts, disbursement, last mile cash
access and scheme monitoring.
G2P Connect is an open source effort to enable government-to-person digital
payments built through interoperablestandardsand design blueprints
G2P Connect enables policy makers across various departments to ‘talkʼ to each
other without revealing any sensitive information. This means that:
•
Every department is allowed to own its own information. They simply
standardise the information using a common identifier for each individual and
link their database through APIs.
•
Other departments that require information to make a decision regarding a
transfer, can specify their eligibility criteria (which can freely change with the
times) as they do currently
•
All systems are standardised to share telemetry information for policy makers to
observe key performance metrics and to make informed decisions
Thus, autonomy, freedom of choice and change, and simplification of the process
is ensured at each step.

5
The process of a transaction carried out through G2P works like this (NOTE: this is
a generalised flow, individual transactions may vary depending on sector of
implementation):
1.An individual will request funds from the scheme he is interested in and specify
his store of value. He will provide his identifier number and may be required to
do additional authentication (such as through OTPs or biometrics)
2.His identifier number will be sent to the issuing department and a request will
be logged.
3.According to the eligibility criteria set out by the issuing department, this
identifier number will be ‘mappedʼ to the various data sources across
government databases that host this relevant information. This will be done
through the common APIs.
4.The interface will not transfer any data from one store house to another, but
simply return a ‘yes/noʼ answer about whether the individual has met the
eligibility criteria or not. The answers across databases will be compiled and a
final ‘yesʼ or ‘noʼ answer will be communicated to the requesting
department/agency.
5.If the individual is eligible, then this identifier number will connect to the store of
value he has chosen. The social benefit sponsoring department simply has to
authorise the transfer and the funds will reach the beneficiaryʼs account.
This allows for a secure, quick transfer of funds from g2p across use cases and
departments in a federated, using near real time info and in privacy protecting
manner.
G2P Connect also provides a range of other benefits for beneficiaries:
•
Beneficiaries get easy, secure, quick access to funds in cases of emergencies
by undertaking minimal steps (sometimes as easy as entering their identifier
number on the relevant government portal!)
•
Beneficiaries get to authorise the sharing of their data with specific
departments for specific purposes.
•
Verification and authentication of transactions (through timestamps and digital
signatures) prevent fraud from being carried out by citizens and prevent errors
from the governmentʼs side.

6
Solution Blueprint
G2P Connect Solution Blueprint
Components of G2P Connect solution
blueprint:

7
1.Foundational Digital ID System
2.Trusted Data Sharing & Digital Credentialing Infrastructure
3.Civil & Other Federated Registries
4.ID-Account Mapper
5.Social Program & Beneficiary Management
6.Payment & Settlement Switch
7.Bank/Mobile-wallet System
8.Last Mile Cash-In/Cash-Out System
9.Unified View for Policy Makers
10.Unified View for Beneficiaries
11.Banking/Wallet Interface Systems
G2P Connect APIs

8
Protocol

9
Overview
G2P Connect API Specifications is an open source effort to standardise the key
integrations across functional categories defined in G2P Connect Technology
Architecture Blueprint.
G2P Connect Integration Specification assumes interactions between various DPI
solution providers (i.e DPGs, Proprietary/Existing systems) may vary due to country
specific policies and availability of digital/banking/last mile connectivity
infrastructure. For e.g.,
a. Few countries may have centralised payment switch operated by central bank
while others may operate directly with financial institutions.
b. Countries may decide to manage ID to Financial Address mapping either at
Payment Switch layer or Financial Institution(s) or Beneficiary Management
Platforms or an independent entity.
c. Countries may not have a foundational de-duplicated digital id.
G2P Connect is flexible to enable DPI solution providers (i.e DPGs,
Proprietary/Existing systems) to orchestrate flows based on various use case
scenarios that are specific to country's operating requirements.
The following are key objectives of G2P Connect Specifications:
Objectives

10
1.Focus on G2P Connect solution blueprint - enable seamless integration
between solutions relevant to end to end G2P payment scope keeping policy
maker and beneficairy at the center.
2.Flexible to accomodate existing standards where applicable, e.g., OAuth2,
OpenID Connect, W3C Verifiable Crendentialing.
3.Standardise message envelope to support harmonised integrations across
various solutions with key features:
•
Transport layer agnositc communication
•
Async based processing with retry/polling support
•
Offline processing capability enabling store & forward
•
Batch processing
•
Support plug n play for other payloads e.g. OpenID / country specific
custom data or verifiable credentials
•
Support for digitally signed and encrypted payloads
4.Enable integration between existing proprietary, DPI/DPGs or country specific
custom in-house solutions.
5.Focus is on standardising core interfaces and NOT on implementation.
6.Each interface act as a connector between solutions and allow country
implementations to realize various use cases.
All communications using G2P Connect specifications have following structure:
Message Structure

11
FieldDescription
signature
element holding signature to prove non-
repudiability of payload (header & message)
between sender & receiver
header
common header to track messages
between sender & receiver for traceability
and to track message delivery at transport
layer
message
message to hold transaction
request/response entities
"signature": "Signature:  namespace=\"g2p\", kidId=\"{sender_id}|
{unique_key_id}|{algorithm}\", algorithm=\"ed25519\", 
created=\"1606970629\", expires=\"1607030629\", headers=\"(created) 
(expires) digest\", signature=\"Base64(signing content)"
"header": {
    "version": "0.1.0",
    "message_id": "123456789020211216223812",
    "message_ts": "2022-12-04T18:01:07+00:00",
    "action": "disburse",
    "sender_id": "10089",
    "sender_uri": "https://pymts.sender.org/g2p/callback/on-disburse",
    "receiver_id": "52077",
    "receiver_uri": "",
    "total_count": 21800,
    "encryption_algo": "aes+rsa"
}
Identifiers

12
1.message_id: scope of message_id in header is to track paylaod delivery
between sender and receiver.
2.transaction_id: scope of transaction_id in message is to uniquely corelate
business request(s).
3.reference_id: scope of the reference_id in message domain entity is to corelate
individual business request.
1.To enable payment processing using various store of value accounts, G2P
Connect uses normative addressing format and refer these as financial
addresses (fa). e.g. payer fa, payee fa etc.,
2.To enable integration with various identity systems/registries all beneficiary id's
are also represented in normative formats.
type: string
description: "<br>
  1. Financial address is case insensitive normative represenation of a 
store of value account represented as id-type:id@provider <br>
  2. Every payer/payee financial address must resolve to an actual 
store of value account number for processing the payment instruction 
<br>
  3. It is recommended the mapping between id and store of value 
account details to be held only at final store of value entity and 
intermediaries can hold 
  3. Few examples: <br>
      - token@id-provider e.g token:12345@mosip <br>
      - uid@pymt-rail e.g uid:12345@mosip <br>
      - vid@id-provider e.g vid:12345@PhilID <br>
      - mobile@mobile-provider e.g mobile:12345@m-pesa <br>
      - account-id@bank-psp-code e.g account:12345@gtbank <br>
      - account-no@ifsc-code.ifsc.npci e.g 
account:12345@HDFC0000001.ifsc.npci <br>
      - user-id@psp-code e.g. joeuser@gtbank <br>
      - token@psp-code e.g token:123456@sbi <br>
      - code@purpose-code.voucher-provider e.g 
voucher:12345@food.sodexo <br>
      - cdbc-id@cdbc e.g. 12345@DCash"
format: "^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+$"
example: "token:12345@gtbank"
Normative Addressing

13
1.G2P Connect Integration Specification is designed to be transport layer
agnostic viz. JSON entities over HTTPS, pub/sub event based messaging or file
exchanges.
2.header field helps in reliable exchange at transport layer between sender and
receiver.
type: string
description: "<br>
  1. Beneficiary id is case insensitve normative represenation as id-
type:id@provider <br>
  2. This will enumerate foundational and functioanl id's to easily 
resolvable addressess <br>
  3. This property is intended to unambiguously refer to an object, 
such as a person, organization, etc., <br>
  4. Few examples: <br>
      - id@identifier-type.id-provider e.g token:12345@mosip, 
vid:12345@philid <br>
      - id@civil-registry.issuing-agency e.g id:12345@rwanda, 
id:12345@ejanma.karnataka <br>
      - id@functional-identifier.issuing-agency e.g 
id:12345@voter.Rwanda, id:12345@DL.karnataka, 
mobile:12345@fruits.karnataka <br>
  Note: id provider should be made configurable and solutions should 
adapt to the local jurisdiction and policies.<br>
        e.g fruits.karnataka represents farmer registry in karnataka 
state govt.<br>"
format: "^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+$"
example: "vid:12345@mosip"
Transport Protocol
Communication Protocol

14
1.Most of the interactions are asynchronous in nature between sender/receiver.
2.Sender initiates with message_id and receiver synchronously acknowledge with
receipt of the message with ACK/NACK/ERR status codes.
3.ACK represent async callback, NACK represent end of exchange and ERR
represent message couldn't be successfully parsed for processing.
4.For all async /xxxx service end points, Senders are required to implement
/on_xxxx end points to receive callback responses.
5.All services implement /{service}/txn/status and /{service}/txn/on_status end
points to poll and fetch responses of previously attempted requests using
transaction_id or reeference_id
6.For service end points that are exposed to end user interfacing UX channels
where call back processing becomes challenging or technical not-feasibile,
receiver systems are required to implement GET status api's. Sender systems
may poll to GET transaction status/detailed information and limit count of
individual business requests (i.e reference_id's).
1.For file based exchange it is recommended to use the JSON payloads. JSON
format is hierarchal, self describing for easy integrations.
2.If a country has use case to use other formats (e.g. CSV) then it is
recommended to use the same JSON definitions by flattening each entity as a
file row. In this scenario, signature element shall be part of the first row, header
elements in second row followed by one or more message array listed in each
row. nested objects are to be flatted in the same row.
3.Above logic shall work for encrypted request element as well.
4.File exchange may happen using HTTPS, sFTP or any other file exchange
mechanisms.
File based processing
Event based processing

15
1.G2P Connect JSON based request/response entities shall work as events over
messaging infrastructure.
2.Trusted sender and receiver systems on a network should create pub/sub end
points.
1.All dates and timestamps are represented in RFC3339 format including
timezone e.g., 2022-12-04T18:01:07+05:30
2.All currency codes represented in ISO 4217 format
Data Formats

16
Terminology
TermDescription
sender
Initiator of request by any
application/service/system/platform using
G2P Connect compliant interfaces
receiver
Receive of request by any
application/service/system/platform using
G2P Connect compliant interfaces and
either process or forwards downstream with
minimal or no validations as a Sender
payer
a person or organization that gives money
from a store of value account
payee
a person or organization that receives
money into a store of value account
fa
Financial Address to uniquely identify
person/organization to a store of value
account
Scheme Mgmt or Program Mgmt
Interchangeably used to define issuance
mechanisms of a social assistance
Beneficiary
a person or organization that receives
money as part of social assistance

17
Interfaces
Below core interfaces & codes help to easily identity functional areas for
implementation partners.
Interface (Code)VersionRelease DateDescription
Identity (ID)0.1.0Draft
APIs to access
authentication &
eKYC services
Credentialing
(CRED)
0.1.0Draft
Issue, manage
digital verifiable
credentials
Registries (REG)0.1.0Draft
Subscribe, Notify
and Search civil
registry info
Financial Address
Mapper (FAM)
0.1.0Draft
Manage ID to
financial address
mapper registry
Disbursement
(DSBT)
0.1.0Draft
Payment
disbursements
Social Program
Management (SPM)
0.1.0Draft
Manage social
programs
Beneficiary
Management (BM)
0.1.0Draft
Manage
beneficiaries
G2P Connect Core Interfaces
Other Interfaces

18
Interface (Code)VersionRelease DateDescription
Authorization
(AUTHZ)
0.1.0Draft
OAuth2 compliant
authz token to
connect

19
Identity
1.G2P Connect recommends Gov Stack published Identity Building Block 
specifications
2.Below G2P Connect API's with batch / async support is an additional option for
implementing systems to consider to integrate with digital ID systems.
1.API specification link
2.Discussion thread
Interface IDEnd PointDescription
ID-VRFYPOST /identity/verify
Authenticate using otp,
demo or bio factors
ID-ON-VRFYPOST /identity/on-verify
Authentication response
through callback
ID-TXNSTS
POST /identity/txn/on-
status
Perform async status check
of previous identity
transanctions using
transaction_id and/or
reference_id(s)
ID-ON-TXNSTS
POST /identity/txn/on-
status
Response to async status
check of previous identity
transanctions using
callback
Overview
References
Interface List
Utilities

20
Below are few utilities that community can open source:
1.Mobile / web app Toolkits to easily read a person's Verifibale Credentials to
auto populate for social programs registration processes.
2.Toolkits to enable "offline" verification of beneficiary using VC data + local face
match for proof of presence.
3.Online Auth/Kyc APIs using biometric based auth modalities using country
specific Foundation ID implemenations.
4.Demographic deduplication utilities for scoial protection platforms where de-
duplicated foundational ID is not be available/accessible.
Integration Schematics

21
Credentialing
1.Standardising credential issuance, search, verification, revokation and status
check capabilities between G2P enabling DPGS/Products/Systems.
2.Country operational model shall decide the entity that manages one or more
crendentialling systems.
1.API specification link
2.Discussion thread
Overview
References
Interface List

22
Interface IDEnd PointDescription
CRED-ISSUPOST /credential/issueIssue credential
CRED-ON-ISSUPOST /credential/on-issue
Issuance info through
callback
CRED-SRCHPOST /credential/search
Search credential by
credential id, issuer,
beneficary id, etc.,
CRED-ON-SRCHPOST /credential/on-search
Credentail search results
through call back
CRED-STSPOST /credential/status
Credential status update
request
CRED-ON-STSPOST /credential/on-status
Credentail status update
results through call back
CRED-TXNSTS
POST /credential/txn/on-
status
Perform async status check
of previous credential
requests using
transaction_id and/or
reference_id(s)
CRED-ON-TXNSTS
POST /credential/txn/on-
status
Response async status
using callback
Integration Schematics

23
Registries
Success of any G2P program delivery depends on access to beneficiary
information across various foundational and functional registries. 
The scope of G2P Connect Registry interfaces is to enable federated minimal read-
only data access between platforms using consented, interoperable specifications. 
G2P Connect blueprint recommends federated data access using electronic
registries over centralised data stores using below design principles:
An electronic registry is a structured & live identification system 
that gathers, saves, and maintains uniformed updated data or 
information on an entity, such as a patient, person, employee, student, 
or facility, and is constantly updated to serve as the entity's "Single 
Source of Truth" which is also verifiable. 
[ref: Sunbird-RC](https://docs.sunbirdrc.dev/learn/electronic-
registries)
Overview
Federated Data Access

24
1.Social Protection Platforms MUST only have a cache copy of data
2.Social Protection Platforms (SPP) MUST fetch ONLY the minimal or aggregated
data. for e.g., 
•
Year of Birth or Age band instead of Date of Birth
•
Count by vehicle types instead of each vehicle info
•
Farmer land total acreage info instead of each identifiable land parcel info,
etc., 
3.Design/Implementation MUST allow minimal unified read only view of data as a
cache. Implementations should avoid
•
Creating centralised data store(s)
•
Enabling capabilities to managing data attributes where legal mandate (i.e
source of truth) is with another system(s)
•
Siloed data stores and with no capability to be in automated sync with
source system(s)
Above principles are also applicable to other domains like Agriculture, Health,
Education, etc, where system to system data access is required for service delivery. 
G2P Connect recommends all systems involved in data exchange to enable below
core features for interoperability using G2P connect Registry APIs:
1.
search - System in want of data shall pull from source system using search 
query
2.
subscribe - System in want of data shall register to data subscription service(s)
using event(s) and additional filters (optional) with the source system.
3.
notify - Source system shall push data (on event or agreed frequency) to systems
User consent is a core tenant of any digital process or digital infrastructure
integrations. Registry data access API design accomdates the concept of the
concept to enable access to data / services.
Consent for data access is broadly classified in one of below operational modes
with design aspects embedded into the core Registry API:
Consented Data Sharing

25
Entity or system that is in need of user's data to provide services to the
user shall obtain the consent directly from the user to initiate the data
access process.
For service requests initiated by beneficairy, Registry APIs allows to
send the implicit consent in search query requests.
In Social Protection use case, this consent may be obtained during
registration of the beneficiary into a social program and the consent may
be very specific or broad enough to access required data from various
systems, frequency or duration.
Note: For benficiary services initiated by entity/system through
emergency and/or by legal process or intervention may use
"authorise" attribute to access data. 
Entity or system that is in need of (or providing) user's data may obtain
explicit (i.e informed) consent from a common trusted entity (e.g.,
consent manager).
In search flow, entity/system in want of data shall obtain explicit
consent. Entity/system providing access to data shall verify the consent
shared in search request was indeed obtained from the common trusted
entity (e.g., consent manager) before release the data as part of search
query response.
In subscribe/notify flow, entity/system providing data shall directly
obtain explicit consent with the user and acts as a consent manager.
Implicit Consent
Explicit Consent

26
If user has access to verifiable credential(s) through that can be directly
shared with entity/system providing the service user intends to avail then
this is considered implied consent. If verifiable credential has the
required data then no futher action is required to seek additional data, If
verifiable credential is an auth token then entity/system providing data
can use this as implied consent to release the data through search
response.
G2P Connect recommends a digitally signed machine readable consent artefact for
trusted data exchange between entities. In the absence of this, the existing paper
based, techno-legal approach may work for entities to trust each other to exchange
data using Registry APIs.
Use of "consent" attribute in APIs is recommend to implement this feature.
In emergency scenarios where local laws allow intervention access to critical data
on time is critical to reach out to beneficiaries in need to provide immediate relief. In
these scenarios, obtaining regular consent may not practically possible. 
Implied Consent
Consent TypeData ConsumerData Provider
Implicit search: on-search:
Explicit search: on-search:
Implied 
User shares VC to directly
avail service
N/A
Consent Flows
Authorised Data Sharing

27
Authorise attribute in search/subsribe requests enable data providers to share data
to requesting entity. Authorise attribute may contain document reference that
enable access to user data for specific purpose. Systems may audit this information
for future references.  
G2P Connect specifications is an attempt to enable interoperability both at
Technology and Domain layers.
Technology interoperability of the APIs are based on design principles to enable
communcation/messaging protocol between systems in a trusted manner. for e.g.,
•
Transport layer agnostic support using REST, file exchange or message queues
•
Sync/Async modes
•
Reliable message delivery
•
End to end payload security, non-repudiable capabilities 
Auditability of data exchange requests is not in scope of these interfaces. As a best
practice, registries that are providing data access services and systems consuming
data should have good auditing mechanism built-in.
G2P Connect does recommend to implement consent and authorised data artefacts to
request and service  
Additionally, G2P Connect Registry APIs are designed to accomodate various 
Domain process flows, data/message structures for data exchange that are
country/department/use case context specific.
1.API specifications - html | yaml
2.Discussion thread
Interoperability
References

28
Async
1./registry/subscribe - Subscribe for an event with registry
2./registry/notify - Notify with data upon event or requested frequency
3./registry/search - Search request using key identifiers or simple queries
4./registry/on-search - Search results through callback
5./registry/txn/status - Status check request for Async API using txn id or ref
id
6./registry/txn/on-status - Status check response through callback
Sync
1./registry/sync/search - Search request/response on same thread
2./registry/sync/subscriptions -  Fetch registered subscriptions
3./registry/sync/unsubscribe - Unsubscribe to stop receiving data on notify
API
4./registry/sync/txn/status - Async APIs status check invoked synchronously
Interface List
Additional Information

29
The Implementating systems are free to define registry type values using
/.well-known folder as meta data for integration. 
Registry type is an optional value to indicate registry to query against and notify
using event subscription. This is useful in case of system hosting multiple
registries under an entity id!
https://github.com/G2P-
Connect/specs/blob/5edb5d8ab179ccb3110769ce975bfe806452e897
/src/registry/schema/core/RegistryType.yaml
Registry Types
type: string
description: |
  1. Country specific implementations should extend and allow 
other registries.
  2. In most scenarios, receiver i.e receipient of 
search/subsribe request determine which registry is being 
searched
  3. example: civil, population, national-id, family, household, 
social, beneficiary, disability, student, farmer, land, utiltiy, 
other
example:
  - "civil" 
  - "population"
  - "national-id"
  - "family"
  - "household"
  - "social"
  - "beneficiary"
  - "disability"
  - "student"
  - "farmer"
  - "land"
  - "utility"
  - "other"

30
The Implementating systems are free to define event type values using /.well-
known folder as meta data for integration. 
Event type is a mandatory value to indicate subscription service offered by a
registry to notify data upon occurrence of an event. Optionally subscribers may
opt for aggregated data push at requested frequency!
Events can be defined at domain level registries. e.g., civil, farmer, student,
disability, social, etc., 
Civil Registry
https://github.com/G2P-
Connect/specs/blob/5edb5d8ab179ccb3110769ce975bfe806452e897
/src/registry/schema/civil/EventType.yaml
Event Types
description: |
  1. Civil registration event list used to record and interact 
with a typical civil registry
  2. This is an indicative list as reference and every country, 
organisation, system shall customise to local requirements as 
extensions
  3. Example Civil Registration events: person, birth, death, 
marriage, divorce, annulment, seperation, adoption, demo_change, 
unregister, etc.,
type: string
example:
  - "person"
  - "birth"
  - "death"
  - "marriage"
  - "divorce"
  - "annulment"
  - "seperation"
  - "adoption"
  - "demo_change"
  - "unregister"

31
https://github.com/G2P-
Connect/specs/blob/5edb5d8ab179ccb3110769ce975bfe806452e897
/src/registry/schema/core/EventType.yaml
description: |
  Functional registry event types:
    1. update - search or subscribe to update events; e.g update 
to postal_code 12345 between date_range
    2. link - search or subscribe to linking events; e.g mobile 
no link with ID, national ID link with civil reg record, etc.,
    3. unlink - search or subscribe to unlinking events; <br>
  Note: update event can also cover link/unlink events on a 
registry record.
type: string
enum:
  - "update"
  - "link"
  - "unlink"
Functional Registry

32
https://github.com/G2P-
Connect/specs/blob/7a04e8c01910af7cb1256d5734221d5d25db6f74/
src/common/schema/Consent.yaml
Consent
type: object
description: Consent artefact. TODO - enrich consent object!
properties:
  id:
    type: string
    format: uri or did
    description: consent id
  ts:
    $ref: ./DateTime.yaml
  purpose:
    type: object
    properties:
      text:
        type: string
      code: 
        type: string
        description: From a fixed set, documented at refUri
      refUri:
          type: string
          format: uri
          description: Uri to provide more info on consent codes

33
https://github.com/G2P-
Connect/specs/blob/7a04e8c01910af7cb1256d5734221d5d25db6f74/
src/common/schema/Consent.yaml
Authorise
type: object
description: Consent artefact. TODO - enrich consent object!
properties:
  id:
    type: string
    format: uri or did
    description: consent id
  ts:
    $ref: ./DateTime.yaml
  purpose:
    type: object
    properties:
      text:
        type: string
      code: 
        type: string
        description: From a fixed set, documented at refUri
      refUri:
          type: string
          format: uri
          description: Uri to provide more info on consent codes

34
Social Registry
In any social protection use case, access to beneficiary data from various
department systems is key to determine beneficiary eligibility to a social assitance
program/scheme. 
In social protection platform, criteria like below are common to determine an eligible
beneficiary:
1.Be part of bottom x% of beneficiaries against set of social indicators;
2.Income at household level;
3.Assets - house, land, vehicle ownership, etc;
4.Expenditure - Electricity units consumed; last x months, avg of last x months,
etc;
5.Not be partof other social programs - e.g Unemployment pension, Farmer
Support Income, etc;
One traditional approach is to create centralised database or data lake using one
time pull/push of data sets from all relevant dept systems. This approach ends up
creating a centralised data store where data quickly gets out of sync with source
systems and social program administrators can't target the right beneficiaries.
Complex scenarios (like below) forces implementations of social protection
platforms to build centralised data stores and soon the data goes out of sync with
source systems.
1.Criteria #1 (above) to determine bottom x% requires pooling all beneficiary data
into one single data store 
2.Criteria #5 (above) where proving beneficiary is NOT part of a registry
G2P Connect recommends creating cache data complying to federated data access
principles.
Overview

35
Beneficiary Management

36
Mapper Architecture
Governments around the world transfer funds to individuals for a variety of
purposes - cash benefits programs, subsidies, salaries, scholarships, etc - which
are often programs managed by various departments at federal/national,
state/province-level, or district levels. However, a nation can craft a reusable and
minimalist digital public infrastructure component that can power multiple
departments to run various G2P programs in an efficient and high agency manner.
This DPI building block can allow any government department to direct a payment
to a financial account using just an identity number from an existing ID system,
without recollecting financial information or re-engineering its own payments
infrastructure. This architecture document highlights a recommended technology
architecture design to enable any government to build its own financial address
mapper.
Any Government 2 Person (G2P) Payments program requires two key identifiers to
complete the last leg of any benefit disbursement process -
1.Beneficiary Identifier
2.Target account information.
Technology Architecture
Version 1.0
1. Introduction

37
The G2P Connect Blueprint, among other functions, enables abstraction of the
target account where the beneficiary receives digital payments as a store of value.
The store of value can be a Bank Account, Mobile Wallet, Voucher, PrePaid Card,
Digital Currency, etc. A Financial Address Mapper is a simple key / value look up
registry to manage Beneficiary ID to Store of Value account information as a Digital
Public Infrastructure. Such a mapper is one building block of the G2P Connect
Blueprint.
Designing a Financial Address Mapper (FAM) should meet below core design
principles. It is highly recommended that policy & technical architects take below
principles into consideration when conceptualising and designing Financial Address
Mapper as a Digital Public Infrastructure.
2. Design Principles
2.1 Minimalism

38
Financial Address Mapper shall require minimal information about beneficiaries. In
an ideal scenario, Only four fields - Beneficiary ID, Name, Store of Value Address,
Linking Status - are required to manage this registry. Where possible, the store of
value address need not be full bank account/mobile money account details; it can
simply direct to the financial institution holding the store of value account.
FAM should avoid having information about benefit schemes, scheme/beneficiary
eligibility info, store of value account status, etc., Having minimal data in mapper
shall keep external platform/system dependencies to a minimum.
Building a Financial Address Mapper that is compliant with G2P Connect mapper
open specifications allows authorised systems/services to access the mapper.
Architecture enables interoperability with any bank, any wallet, any device, and any
social protection program. It is up to the policy makers to control which ecosystem
participants are allowed to support / implement Mapper features. For e.g., Linking
API can be implemented by Social Protection System or Store of Value Account
Provider or directly by the Mapper Hosting Entity.
Financial Address Mapper specifications use normalised addresses to represent ID
and Financial Address. Normalised addressing enables innovation to easily
accommodate new forms of foundational / functional IDs, Store of Value account
types. Additionally, allows ecosystem participants innovate capabilities for easy
access and updates to mapper.
2.2 Interoperability
2.3 Innovation
2.4 Asynchornous

39
Financial Address Mapper architecture & design unbundle the capabilities to
encourage multiple players in the ecosystem to participate in. Financial account
information resides in Banking Platforms while other ecosystem participants
interact with aliases. This enables interaction between ecosystem participants
loosely coupled to encourage market driven play.
Programs adopt mapper usage voluntarily bases on readiness. This allows adoption
to evolve asynchronously i.e incrementally rather big bang approach.
Financial Address Mapper specifications recommends managing minimal
information with optimal ignorance to protect security & privacy of the beneficiary.
The design ensures only the required participants will have access to account
details for final debit/credit actions on store of value accounts.
The Mapper should be designed to cover multiple types of store of value accounts
that are inclusive across the population - for instance bank accounts, wallets,
mobile money accounts, etc., Market innovation like purpose limited vouchers,
digital currencies etc., can easily be implemented using the G2P Connect proposed
normative addressing.
Normative addressing is representing store of value account information using
aliases like:
a. token:12345@mosip
b. vid:12345@PhilID
c. account:12345@gtbank
d. account:12345@HDFC0000001.ifsc.npci
e. joeuser@gtbank
f. token:123456@sbi
g. 12345@DCash
2.5 Privacy & Security by Design
2.6 Inclusivity & User Centric

40
Beneficiaries are central to any Financial Address Mapper design / roll out.
Beneficiaries should have easy access to one or more entities to link, manage life
cycle events of mapper. Ecosystem players shall innovate to allow self
service/assisted use and online/offline access capabilities to reach diverse
category of users.
Financial Address Mapper is one such component that can be easily unbundled
from the existing platforms/systems/processes to build a new DPI component that
opens up non-linear adoption with ease by embracing all aspects of DPI design
principles.
The Financial Address Mapper is not restricted to one instance in a country. G2P
Connect Mapper specifications enable multiple mappers to co-exists and easily
interoperate with each other through interoperable open specifications. Registries
can evolve independently across account types, authentication modes, sectors,
regulatory or governance aspects of a country.
A typical Financial Address Mapper ecosystem players are:
Entity managing mapper registry and ecosystem partners. It is recommended a
neutral agency to host the mapper.
Mapper Hosting Entity is responsible for:
2.7 +1 Change
2.8 Evolvability
3. Mapper Ecosystem
3.1 Mapper Hosting Entity

41
1.Onboarding ecosystem partners and enabling access to mapper services
through Open APIs, batch file interfaces, etc.,
2.Design, Build, Operate Mapper registry.
3.Regulate and support other ecosystem partners through operational policies
based on country specific context.
Store of value providers that have direct relationships with beneficiaries to provide
banking / financial services.
Store of value provider performs below activities:
1.Help interface Beneficiary to manage ID to Store of value address with entity
hosting the mapper registry.
2.Authorise mapper linking requests by authenticating the right beneficiary.
3.Provide Resolution of financial address to store of value account info for final
leg of digital payment credit using the underlying payment rails.
4.Transfer digital payments to store value accounts.
3.2 Store of Value Provider

42
A person approved by the social protection system to receive benefits from one or
more social protection schemes.
Beneficiaries get following benefits:
1.Manage store of value account info to receive all social benefits with one single
entity and manage any life cycle changes only once.
2.Donʼt have to share sensitive financial account information with multiple entities.
System delivering social protection to beneficiaries.
Social protection systems enable with following capabilities: Help interface
Beneficiary to manage ID to Store of value address with entity hosting the mapper
registry. Create disbursement instructions to payment processing systems/rails to
initiate benefit transfer using beneficiary id.
3.3 Beneficiary
3.4 Social Protection System

43
G2P Connect specifications recommends below features to be available to enable
seamless integration between G2P payments processing ecosystem participants:
1.Link - Link Store of Value address with a beneficiary ID. Entity enabling
beneficiaries to link shall ensure authentication and obtaining required
consents.
2.UnLink - Performs a soft or hard delete of the mapper registry entry.
3.Resolve - Given a foundational or functional ID help find Store of Value
normative address. Country specific implementation may allow resolution to
financial entity codes or end store of value account identifiers.
4.Status Check - Systems integration service endpoint for applications to
communicate and reconcile in an automated manner. Enables reliability and
user experience capabilities.
5.Update - Update financial and other linked information. Entity enabling
beneficiaries to update shall ensure authentication and obtaining required
consents.
Below is an illustration of mapper implemenation to benefit beneficiary to access
funds or draw cash:
4. Mapper Features

44
1.G2P Connect specification allows more than one mapper registry within a
country. Having a registry within each ministry/agency or sector is perfectly fine
as part of initial roll out and if there are enough synergies and trust built up,
incremental consolidation will help both implementing agencies, beneficiaries.
2.Entities enabling linking (and life cycle management services) with mapper
registry MUST authenticate the Owner of the account holder with the ID of the
person being linked is indeed the same person. Specifications allow any
existing authentication methods followed by the store of value service provider.
3.Obtaining consent is decentralised with the entities operating in the mapper
registry ecosystem. This enables existing systems and business processes to
adopt mapper registry as Digital Public Infrastructure. Migrating to Digital
Consents shall help in population scale with trust and enable automation.
Countries may use the below checklist to start the DPI journey:
5. Recommended Best Practices
6. Next Steps

45
1.The Ministry/Department operating one or more social benefit program(s) may
consider a single Mapper Registry as Digital Public Infrastructure building block
Department to identify. This agency may own and operate the Mapper registry.
2.Work with ecosystem participants to identify policies and operational guidelines
to use the existing services digitally.
1.Financial Address Mapper - Architecture Overview
2.Financial Address Mapper - Policy Overview
3.Financial Address Mapper - Mapper API Specification
7. Additional References

46
Mapper Specs
1.Financial Address (FA) representred in normative form is pre-requisite for these
api's to work
2.Payer/Payee FAs are to be obtianed by the respective financial entity that holds
store of value accounts
1.API specification link
2.Discussion thread
Assumptions
References
Interface List

47
Interface IDEnd PointDescription
FAMAP-LNKPOST /mapper/link
Linking id / fa to mapper
registry
FAMAP-ON-LNKPOST /mapper/on-link
Linking response through
callback end point
FAMAP-UPDTPOST /mapper/update
Updating fa details against
an id in mapper registry
FAMAP-ON-UPDTPOST /mapper/on-update
Update response through
callback end point
FAMAP-ULNKPOST /mapper/unlink
remove id/fa link from
mapper registry
FAMAP-ON-ULNKPOST /mapper/on-unlink
Unlinking response through
callback end point
FAMAP-RSLVPOST /mapper/resolve
Resolve fa / beneficiary id
to a store of value details
FAMAP-ON-RSLVPOST /mapper/on-resolve
Resolve response through
callback end point
FAMAP-TXNSTSPOST /mapper/txn/status
Status check on any of the
mapper actions using
transaction_id or
reference_id(s)
FAMAP-ON-TXNSTS
POST /mapper/txn/on-
status
Status check response
through callback end point
Integration Schematics

48

49
Eligibility Determination
In order to make direct transfers governments need to identify the right
beneficiaries for the various schemes - based on the scheme specific criteria. The
data required for determining eligibility may include land holdings, electricity usage,
vehicle ownership, financial transactions, age, gender, caste etc. These records
currently reside in the respective departments but many ministries/departments are
running initiatives to pull data into a centralised database.
Over time systems have collated all the data into a centralised databases and are in
a position to correlate these data to formulate a comprehensive profile of all the
citizens. While the objective of such databases is to identify eligible beneficiaries,
there are several challenges that may not aling with an ideal DPI design principles.
1.Single Source of Truth - The respective departments are the legal “registrars”
of the respective attributes e.g. Vehicle records are owned by the Road
Transport Department and so on. If data is being pushed into the central
database, the ownership of ensuring the data is up to date should reside with
the respective departments. The system must be designed in a manner to
ensure that the most recent record is used to determine the eligibility criteria.
2.Security - Creating such a centralised database will make it a high risk asset
and will require substantial investments in security to ensure adequate
protection. Any compromise and unauthorised access to this database may
cause irreverasable damage.
3.Privacy - Several questions around privacy arise which needs to be addressed
e.g. will beneficiaries have visibility in the attributes that are being stored and
used for eligibility determination, is there a process for them to raise correction
requests, what mechanisms are put in place to ensure limit purpose of use of
these databases, can beneficiaries opt out of such a database, etc.
4.Anomaly Detection - Since this database will be used for beneficiary eligibility,
it will be a target for fraud. Mechanisms need to be put in place to detect
anomalies e.g. population stability indexes must be computed and compared to
ensure no large scale changes in the database are happening to enable
inclusion in a specific scheme.

50
To solve for above design principles, designers of these systems must consider
federated services architecture rather than centralised databases. Instead of pulling
all the data into a central database, it may be possible to implement a centralised
“Beneficiary Eligibility” service which in turn calls respective departments
“Beneficiary Eligibility” service that returns a “Yes/No” answer or minimal required
information. So a scheme system queries the centralised beneficiary eligibility API
by sending one or multiple records to it. The service then calls the respective
department systems to check the beneficiary eligibility in their respective
databases and revert with a result.
The social program registry may cache this minimal information and additionally
integrate with subscribe/notify api's to get notified on any source data changes at
an agreed frequency to ensure latest correct data is available. This API driven
approach shall ensure seamless integration with no manual intervention for each
refresh cycle.
Registration into social program scheme can allow beneficiary grant/revoke
consent to access federated registries. Social program eligibility rules determine
the source data sources to be linked to enable eligibiltiy determination. In addition
to beneficiary consent, additional governance policies between systems to control
attribute, aggregate level access to bring in trust.
A federated architecture as illustrated below ensures the legal registrars of the data
continue to hold respective the system of records while granting limited access to
determine eligibility through standardised interfaces like registry search api.
Vehicle 
Registry
Dept/Social 
Program's
Eligibility 
Registry
vehicle type, 
count
Household
Registry
count by
gender/age, 
disability, etc.,
Land 
Registry
type, 
acearage
Farmer
Registry
farmer type
Student
Registry
grade,
attendance,
etc
Electricity
count of meters,
consumption > x ?
Is 
Eligible?
Social Program System
Registration
Disbursement
Grievance 
Mgmt

51
Program Management

52
Disbursement
1.G2P Connect payment disbursement APIs intent is to enable standardisation
between social protection and payment processing/rails systems integration.
2.Disburse and DisburseStatue are core entities to enable generation of payment
instruction and reconcile processing status.
1.API specification link
2.Disbursement feature relate discussion thread
Overview
References
Interface List

53
Interface IDEnd PointDescription
DISB-DISBPOST /disburse
Social protection platofrom
initiating g2p disbursements
DISB-ON-DISBPOST /on-disburse
Disbursement initiating
systems receive
disbursement status info
through callback end points
DISB-STSPOST /disburse/status
Request for disbursement
status from (e.g) social
protection, Treasury
systems
DISB-ON-STSPOST /disburse/on-status
Disbursement status to
social protection, Treasury
systems.
DISB-ON-TXNSTSPOST /disburse/txn/status
Disbursement status to
social protection, Treasury
systems.
DISB-ON-TXNSTS
POST /disburse/txn/on-
status
Disbursement status to
social protection, Treasury
systems.
DISB-STS-TXNID
GET
/disburse/status/{transactio
n_id} /{summary_only}
Disbursement status to
social protection, Treasury
systems
DISB-STS-REFID
GET
/disburse/status/{reference
_id}]
Disbursement status to
social protection, Treasury
systems
Integration Schematics

54

55
Security

56
Authorization
1.The scope of these end points is to standardise issuance of access tokens
using existing OAuth2/OIDC standards.\
2.Helps standardise end point access across g2p complaint api stack using x-
access-token that is compliant with JWT specs.\
3.DPGs & COTS products may also provide similar authz api end points with G2P
Connect documented scopes as part of each country specific implementation
(if any).\
4.Additional security like IP white listing, private networks, etc are outside the
scope of G2P Connect standards. Each country shall decide required
operational models.\
1.API specification link
2.Discussion thread
Interface IDEnd PointDescription
AUTHZ-TOKN/oauth2/client/token
Provide access token to
registered senders &
receivers
Overview
References
Interface List
Integration Schematics

57
Singature Validation

58
Additional Info

59
References
1.GitHub Specification Source
2.G2P Connect APIs
3.G2P Connect Discussions
4.G2P Connect Website

60
Acknowledgments
Thanks to below organization/individuals for their contributions and influencing the
G2P Connect standards.
1.G2P community members

61
Licensing
Content of this site is licensed under CC BY-SA 4.0 by CDPI

62
Group 1