# Verifiable Credential Schema Examples

## Overview
Verifiable Credentials (VCs) in DPI follow W3C standards while being adapted for specific use cases. Here are illustrative examples based on DPI principles.

## Common VC Patterns

### Example 1: Educational Credential
```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1"
  ],
  "id": "http://example.edu/credentials/3732",
  "type": ["VerifiableCredential", "UniversityDegreeCredential"],
  "issuer": {
    "id": "https://university.edu/issuers/14",
    "name": "National Technical University"
  },
  "issuanceDate": "2024-01-15T00:00:00Z",
  "credentialSubject": {
    "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
    "degree": {
      "type": "BachelorDegree",
      "name": "Bachelor of Science in Computer Science",
      "degreeProgram": "Computer Science",
      "college": "School of Engineering",
      "graduationDate": "2024-01-15"
    }
  },
  "proof": {
    "type": "RsaSignature2018",
    "created": "2024-01-15T14:00:00Z",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "https://university.edu/issuers/14#key-1",
    "jws": "eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..."
  }
}
```

### Example 2: Healthcare Vaccination Certificate
```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://w3id.org/vaccination/v1"
  ],
  "type": ["VerifiableCredential", "VaccinationCertificate"],
  "issuer": {
    "id": "https://health.gov/issuers/vaccines",
    "name": "Ministry of Health"
  },
  "issuanceDate": "2024-03-20T12:00:00Z",
  "expirationDate": "2025-03-20T12:00:00Z",
  "credentialSubject": {
    "id": "did:example:123456789",
    "type": "VaccinationEvent",
    "batchNumber": "B12345",
    "administeringCentre": "City General Hospital",
    "healthProfessional": "Dr. Jane Smith",
    "countryOfVaccination": "IN",
    "recipient": {
      "type": "VaccineRecipient",
      "givenName": "John",
      "familyName": "Doe",
      "birthDate": "1990-01-01"
    },
    "vaccine": {
      "type": "Vaccine",
      "code": "J07BX03",
      "marketingAuthorizationHolder": "Vaccine Corp"
    }
  }
}
```

### Example 3: Government-Issued Identity Credential
```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://w3id.org/citizenship/v1"
  ],
  "type": ["VerifiableCredential", "IdentityCredential"],
  "issuer": {
    "id": "https://government.example/issuers/identity",
    "name": "National Identity Authority"
  },
  "issuanceDate": "2024-01-01T00:00:00Z",
  "expirationDate": "2034-01-01T00:00:00Z",
  "credentialSubject": {
    "id": "did:gov:ABC123456789",
    "givenName": "Alice",
    "familyName": "Johnson",
    "dateOfBirth": "1985-05-15",
    "nationalIdNumber": "ABC123456789",
    "gender": "Female",
    "address": {
      "streetAddress": "123 Main Street",
      "locality": "Metro City",
      "postalCode": "12345",
      "country": "Example Country"
    },
    "biometricData": {
      "type": "BiometricData",
      "biometricType": "fingerprint",
      "biometricDataHash": "sha256:abcd1234..."
    }
  }
}
```

### Example 4: Simple QR-Based VC (Quick Win Implementation)
```json
{
  "version": "1.0",
  "type": "TrainingCertificate",
  "issuer": "Skills Development Authority",
  "issued": "2024-03-15",
  "expires": "2026-03-15",
  "subject": {
    "name": "Robert Brown",
    "id": "SDA/2024/0001234"
  },
  "credential": {
    "courseName": "Digital Marketing Fundamentals",
    "completionDate": "2024-03-10",
    "grade": "A",
    "certificateNumber": "CERT-2024-DM-1234"
  },
  "signature": "base64EncodedDigitalSignature"
}
```

## Code Examples

### Verification Code Example (JavaScript)
```javascript
// Example: Verifying a simple digitally signed credential
async function verifyCredential(credential, publicKey) {
  try {
    // Extract signature from credential
    const { signature, ...credentialData } = credential;
    
    // Create hash of credential data
    const dataString = JSON.stringify(credentialData);
    const hash = await crypto.subtle.digest('SHA-256', 
      new TextEncoder().encode(dataString)
    );
    
    // Verify signature
    const signatureBuffer = base64ToArrayBuffer(signature);
    const isValid = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      publicKey,
      signatureBuffer,
      hash
    );
    
    return {
      isValid,
      issuer: credential.issuer,
      expiryDate: credential.expires
    };
  } catch (error) {
    return { isValid: false, error: error.message };
  }
}
```

### QR Code Generation Example (Python)
```python
import json
import qrcode
import hashlib
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding, rsa

def create_vc_qr(credential_data, private_key):
    """
    Create a QR code for a verifiable credential
    """
    # Convert credential to JSON
    credential_json = json.dumps(credential_data, sort_keys=True)
    
    # Create digital signature
    signature = private_key.sign(
        credential_json.encode(),
        padding.PSS(
            mgf=padding.MGF1(hashes.SHA256()),
            salt_length=padding.PSS.MAX_LENGTH
        ),
        hashes.SHA256()
    )
    
    # Add signature to credential
    signed_credential = {
        **credential_data,
        "signature": signature.hex()
    }
    
    # Create QR code
    qr = qrcode.QRCode(
        version=None,  # Auto-determine version
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    
    qr.add_data(json.dumps(signed_credential))
    qr.make(fit=True)
    
    return qr.make_image(fill_color="black", back_color="white")
```

### API Schema for VC Issuance
```yaml
openapi: 3.0.0
info:
  title: VC Issuance API
  version: 1.0.0
paths:
  /credentials/issue:
    post:
      summary: Issue a new verifiable credential
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - credentialSubject
                - credentialType
              properties:
                credentialType:
                  type: string
                  enum: [EducationCredential, HealthCredential, IdentityCredential]
                credentialSubject:
                  type: object
                  properties:
                    id:
                      type: string
                    additionalProperties: true
                expirationDate:
                  type: string
                  format: date-time
      responses:
        '200':
          description: Successfully issued credential
          content:
            application/json:
              schema:
                type: object
                properties:
                  credential:
                    type: object
                  verificationUrl:
                    type: string
```

## Key DPI Principles for VCs

1. **Interoperability**: Support multiple standards (W3C VC, ISO mDL, etc.)
2. **Privacy-Preserving**: Enable selective disclosure where possible
3. **Offline Verification**: Include mechanisms for offline verification
4. **Scalability**: Design for national-scale implementations
5. **Inclusivity**: Support both high-tech (wallet apps) and low-tech (QR codes) approaches

## Notes
- These are illustrative examples following DPI and W3C VC principles
- Actual implementations should consider local regulations and standards
- Quick wins can start with simple JSON + digital signatures
- Full W3C compliance can be achieved incrementally
