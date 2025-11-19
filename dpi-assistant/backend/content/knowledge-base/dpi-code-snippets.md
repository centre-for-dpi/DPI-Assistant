# DPI Code Snippets and Technical Examples

## Overview
This document provides illustrative code snippets and technical examples for various DPI components based on global best practices.

## Payment Systems

### Interoperable QR Code Format Example
```json
{
  "version": "01",
  "mode": "12",
  "payeeVPA": "merchant@bank",
  "payeeName": "Example Merchant",
  "payeeAccount": {
    "ifsc": "BANK0001234",
    "account": "1234567890"
  },
  "transactionId": "TXN123456789",
  "transactionRef": "ORD2024001",
  "transactionNote": "Payment for Order #2024001",
  "amount": "1500.00",
  "currency": "INR",
  "merchantCode": "MCH123456"
}
```

### Payment Request API Example
```javascript
// Example: Initiating an interoperable payment request
async function initiatePayment(paymentDetails) {
  const paymentRequest = {
    payer: {
      vpa: "user@bank",
      deviceId: "DEVICE123",
      location: await getCurrentLocation()
    },
    payee: {
      vpa: paymentDetails.payeeVPA,
      name: paymentDetails.payeeName
    },
    transaction: {
      id: generateTransactionId(),
      amount: {
        value: paymentDetails.amount,
        currency: paymentDetails.currency
      },
      type: "P2M",
      refId: paymentDetails.transactionRef,
      note: paymentDetails.transactionNote
    }
  };
  
  return await paymentAPI.initiateTransaction(paymentRequest);
}
```

## Data Sharing Infrastructure

### Consent Artifact Structure
```json
{
  "ver": "1.0",
  "consentId": "CONSENT-2024-123456",
  "timestamp": "2024-03-20T10:30:00Z",
  "dataConsumer": {
    "id": "DC-BANK-001",
    "name": "Example Bank Ltd"
  },
  "dataProvider": {
    "id": "DP-TAX-001",
    "name": "Tax Department"
  },
  "purpose": {
    "code": "LOAN-UNDERWRITING",
    "description": "Income verification for loan application"
  },
  "dataFields": [
    "annualIncome",
    "taxReturns",
    "employmentStatus"
  ],
  "permission": {
    "access": "VIEW",
    "dateRange": {
      "from": "2021-04-01",
      "to": "2024-03-31"
    },
    "frequency": {
      "unit": "MONTH",
      "value": 1,
      "repeats": 3
    }
  },
  "signature": "digitalSignatureHere"
}
```

### Data Request with Consent
```python
import requests
import json
from datetime import datetime

def request_data_with_consent(consent_artifact, api_endpoint):
    """
    Request data from provider using consent artifact
    """
    headers = {
        'Content-Type': 'application/json',
        'X-Consent-Id': consent_artifact['consentId'],
        'X-Request-Id': generate_request_id()
    }
    
    request_body = {
        "ver": "1.0",
        "timestamp": datetime.utcnow().isoformat(),
        "txnid": generate_transaction_id(),
        "consent": {
            "id": consent_artifact['consentId'],
            "digitalSignature": consent_artifact['signature']
        },
        "dataRequest": {
            "fields": consent_artifact['dataFields'],
            "format": "JSON"
        }
    }
    
    response = requests.post(
        api_endpoint,
        headers=headers,
        data=json.dumps(request_body)
    )
    
    return response.json()
```

## Digital Identity

### Authentication Request Example
```yaml
openapi: 3.0.0
paths:
  /auth/verify:
    post:
      summary: Verify user identity
      requestBody:
        content:
          application/json:
            schema:
              type: object
              required:
                - uid
                - authType
              properties:
                uid:
                  type: string
                  pattern: '^[0-9]{12}$'
                authType:
                  type: array
                  items:
                    type: string
                    enum: [OTP, FINGERPRINT, IRIS, FACE]
                otp:
                  type: string
                  pattern: '^[0-9]{6}$'
                biometric:
                  type: object
                  properties:
                    type:
                      type: string
                    data:
                      type: string
                      format: base64
```

### Face Authentication Implementation
```javascript
// Example: Client-side face authentication
async function performFaceAuth(userId) {
  try {
    // Capture face image
    const faceImage = await captureUserFace();
    
    // Create authentication request
    const authRequest = {
      uid: userId,
      authType: ['FACE'],
      timestamp: new Date().toISOString(),
      biometric: {
        type: 'FACE',
        data: await imageToBase64(faceImage),
        quality: assessImageQuality(faceImage)
      },
      device: {
        id: getDeviceId(),
        ip: await getDeviceIP(),
        location: await getDeviceLocation()
      }
    };
    
    // Sign request
    const signedRequest = await signRequest(authRequest);
    
    // Send to authentication service
    return await authAPI.verify(signedRequest);
  } catch (error) {
    console.error('Face authentication failed:', error);
    throw error;
  }
}
```

## Open Networks (Discovery & Fulfillment)

### Service Discovery Request
```json
{
  "context": {
    "domain": "healthcare",
    "country": "IND",
    "city": "Bangalore",
    "action": "search",
    "timestamp": "2024-03-20T10:00:00Z",
    "message_id": "MSG123456",
    "transaction_id": "TXN789012"
  },
  "message": {
    "intent": {
      "fulfillment": {
        "type": "teleconsultation",
        "location": {
          "gps": "12.9716,77.5946"
        }
      },
      "category": {
        "id": "cardiology"
      },
      "provider": {
        "rating": ">4"
      }
    }
  }
}
```

### Service Provider Response
```javascript
// Example: Provider catalog response
const providerCatalog = {
  "context": {
    // ... context from request
  },
  "message": {
    "catalog": {
      "providers": [
        {
          "id": "HOSP001",
          "descriptor": {
            "name": "City Heart Center",
            "short_desc": "Specialized cardiac care",
            "images": ["https://example.com/logo.png"]
          },
          "categories": [
            {
              "id": "cardiology",
              "descriptor": {
                "name": "Cardiology"
              }
            }
          ],
          "items": [
            {
              "id": "TELE-CARDIO-001",
              "descriptor": {
                "name": "Cardiology Teleconsultation",
                "long_desc": "30-minute video consultation"
              },
              "price": {
                "currency": "INR",
                "value": "500"
              },
              "fulfillment_id": "FULFILLMENT001"
            }
          ],
          "fulfillments": [
            {
              "id": "FULFILLMENT001",
              "type": "teleconsultation",
              "provider_name": "Dr. Sarah Johnson",
              "time": {
                "schedule": {
                  "times": [
                    "2024-03-21T10:00:00Z",
                    "2024-03-21T11:00:00Z"
                  ]
                }
              }
            }
          ]
        }
      ]
    }
  }
};
```

## G2P Payments

### ID-Account Mapper Entry
```json
{
  "mapperId": "MAP-2024-567890",
  "beneficiaryId": "BEN123456789",
  "idType": "NATIONAL_ID",
  "idValue": "1234567890",
  "accountDetails": {
    "accountType": "BANK_ACCOUNT",
    "accountNumber": "9876543210",
    "bankCode": "BANK001",
    "branchCode": "BR001"
  },
  "status": "ACTIVE",
  "metadata": {
    "createdAt": "2024-01-15T09:00:00Z",
    "updatedAt": "2024-03-20T10:00:00Z",
    "source": "SOCIAL_WELFARE_DEPT",
    "verificationStatus": "KYC_VERIFIED"
  }
}
```

### Bulk Payment Request
```python
# Example: G2P bulk payment processing
def process_g2p_payments(beneficiary_list, scheme_details):
    """
    Process government-to-person payments in bulk
    """
    payment_batch = {
        "batchId": generate_batch_id(),
        "schemeId": scheme_details['id'],
        "schemeName": scheme_details['name'],
        "paymentDate": datetime.now().isoformat(),
        "totalAmount": 0,
        "currency": "INR",
        "payments": []
    }
    
    for beneficiary in beneficiary_list:
        # Lookup account from ID-Account mapper
        account = id_account_mapper.lookup(
            beneficiary['id'],
            beneficiary['idType']
        )
        
        if account and account['status'] == 'ACTIVE':
            payment = {
                "paymentId": generate_payment_id(),
                "beneficiaryId": beneficiary['id'],
                "amount": beneficiary['entitlement'],
                "account": account['accountDetails'],
                "status": "PENDING"
            }
            payment_batch['payments'].append(payment)
            payment_batch['totalAmount'] += beneficiary['entitlement']
    
    # Submit batch for processing
    return payment_gateway.process_batch(payment_batch)
```

## Notes
- These are illustrative examples based on DPI principles
- Actual implementations should follow local standards and regulations
- Security best practices (encryption, authentication, etc.) should be implemented
- All APIs should include proper error handling and logging
- Consider scalability and performance for national-scale deployments
