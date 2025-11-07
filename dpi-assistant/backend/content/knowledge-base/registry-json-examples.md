# Registry JSON Schema Examples

## Overview
Registries in DPI follow certain common patterns. While specific implementations vary by use case and country context, here are illustrative examples based on DPI principles.

## Common Registry Patterns

### Basic Registry Entry Structure
A typical registry entry following DPI principles includes:
- **Core Attributes**: Unique identifier, name/title, description, status
- **Metadata**: Creation date, modification date, version, source
- **Relationships**: Links to other entities or external systems
- **Schema Definition**: Data types and validation rules

### Example 1: Healthcare Provider Registry
```json
{
  "registry_type": "healthcare_provider",
  "version": "1.0",
  "entry": {
    "id": "HP-2024-001234",
    "name": "City General Hospital",
    "type": "hospital",
    "registration_number": "REG/2024/HOS/1234",
    "status": "active",
    "address": {
      "street": "123 Health Street",
      "city": "Metro City",
      "postal_code": "12345"
    },
    "contact": {
      "phone": "+1234567890",
      "email": "info@citygeneral.health"
    },
    "services": ["emergency", "surgery", "pediatrics"],
    "capacity": {
      "beds": 250,
      "icu_beds": 30
    },
    "metadata": {
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-03-20T14:30:00Z",
      "source": "health_ministry",
      "verification_status": "verified"
    }
  }
}
```

### Example 2: Educational Institution Registry
```json
{
  "registry_type": "educational_institution", 
  "version": "1.0",
  "entry": {
    "id": "EDU-2024-005678",
    "name": "National Technical University",
    "type": "university",
    "accreditation_number": "ACC/2024/UNI/5678",
    "status": "active",
    "programs_offered": [
      {
        "name": "Computer Science",
        "level": "undergraduate",
        "duration_years": 4
      },
      {
        "name": "Data Science",
        "level": "postgraduate",
        "duration_years": 2
      }
    ],
    "contact": {
      "website": "https://ntu.edu",
      "email": "admissions@ntu.edu"
    },
    "metadata": {
      "created_at": "2024-02-01T09:00:00Z",
      "updated_at": "2024-03-15T11:00:00Z",
      "source": "education_ministry"
    }
  }
}
```

### Example 3: Farmer Registry (Agriculture)
```json
{
  "registry_type": "farmer_registry",
  "version": "1.0",
  "entry": {
    "id": "FARM-2024-009012",
    "farmer_id": "AGR/2024/FARM/9012",
    "name": "John Farmer",
    "status": "active",
    "farm_details": {
      "location": {
        "village": "Green Valley",
        "district": "Agricultural District",
        "coordinates": {
          "latitude": 12.9716,
          "longitude": 77.5946
        }
      },
      "total_area_hectares": 5.5,
      "crops": ["wheat", "rice", "vegetables"],
      "irrigation_type": "drip"
    },
    "government_schemes": [
      {
        "scheme_id": "PM-KISAN",
        "enrollment_date": "2023-04-01",
        "status": "active"
      }
    ],
    "bank_account": {
      "account_type": "savings",
      "bank_name": "Rural Bank",
      "branch_code": "RB001"
    },
    "metadata": {
      "created_at": "2024-01-20T08:00:00Z",
      "updated_at": "2024-03-10T16:00:00Z",
      "source": "agriculture_department",
      "verification_method": "field_verification"
    }
  }
}
```

### Example 4: Generic Business Registry
```json
{
  "registry_type": "business_registry",
  "version": "1.0",
  "entry": {
    "id": "BUS-2024-003456",
    "business_name": "Tech Solutions Ltd",
    "registration_number": "CRN/2024/TECH/3456",
    "type": "private_limited",
    "status": "active",
    "incorporation_date": "2020-06-15",
    "primary_activity": "software_development",
    "address": {
      "registered_office": "456 Tech Park, Innovation City",
      "postal_code": "54321"
    },
    "directors": [
      {
        "name": "Jane Doe",
        "designation": "CEO",
        "appointment_date": "2020-06-15"
      }
    ],
    "compliance": {
      "tax_id": "TAX123456789",
      "last_filing_date": "2024-03-31"
    },
    "metadata": {
      "created_at": "2024-02-10T10:30:00Z",
      "updated_at": "2024-04-01T09:00:00Z",
      "source": "corporate_affairs",
      "api_access": true
    }
  }
}
```

## Schema Definition Example
```json
{
  "schema_name": "generic_registry_schema",
  "version": "1.0",
  "fields": {
    "id": {
      "type": "string",
      "required": true,
      "unique": true,
      "pattern": "^[A-Z]{3}-\\d{4}-\\d{6}$"
    },
    "name": {
      "type": "string",
      "required": true,
      "min_length": 3,
      "max_length": 255
    },
    "status": {
      "type": "string",
      "required": true,
      "enum": ["active", "inactive", "suspended", "pending"]
    },
    "metadata": {
      "type": "object",
      "required": true,
      "properties": {
        "created_at": {
          "type": "datetime",
          "required": true
        },
        "updated_at": {
          "type": "datetime",
          "required": true
        },
        "source": {
          "type": "string",
          "required": true
        }
      }
    }
  }
}
```

## Key DPI Registry Principles

1. **Interoperability**: Use standard formats (JSON, XML) and well-defined schemas
2. **Accessibility**: Provide APIs for programmatic access
3. **Verifiability**: Include digital signatures and verification mechanisms
4. **Extensibility**: Design schemas to accommodate future fields
5. **Privacy**: Only expose necessary fields through APIs
6. **Audit Trail**: Maintain creation and modification timestamps

## Notes
- These are illustrative examples following DPI principles
- Actual implementations should be tailored to specific country contexts and use cases
- Consider data protection regulations when designing registry schemas
- Use established standards where available (e.g., HL7 FHIR for healthcare)
