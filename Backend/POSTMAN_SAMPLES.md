# Postman Sample JSON Documents for Computer API

This document contains sample JSON requests and expected responses for testing the Computer Management API in Postman.

## Environment Variables (Recommended Setup)

First, set up these environment variables in Postman:

-   `base_url`: `http://localhost:8000` (or your Laravel server URL)
-   `api_prefix`: `/api`

## 1. Create Computer (POST)

**Endpoint:** `{{base_url}}{{api_prefix}}/computers`
**Method:** POST
**Headers:**

```json
{
    "Content-Type": "application/json",
    "Accept": "application/json"
}
```

### Sample Request Body 1 - Complete Computer

```json
{
    "system_status": "available",
    "complaints": null,
    "os": "Windows 11 Pro",
    "processor": "Intel Core i7-12700K",
    "ram": "32GB DDR4-3200",
    "storage": "1TB NVMe SSD",
    "graphics_card": "NVIDIA GeForce RTX 4060",
    "motherboard": "ASUS PRIME Z690-P",
    "location": "Computer Lab 1 - Station 01",
    "asset_tag": "CL1-PC-001"
}
```

### Sample Request Body 2 - Computer with Complaints

```json
{
    "system_status": "under_maintenance",
    "complaints": [
        "Screen flickering intermittently",
        "USB ports not responding",
        "Fan making unusual noise"
    ],
    "os": "Ubuntu 22.04 LTS",
    "processor": "AMD Ryzen 7 5800X",
    "ram": "16GB DDR4-3600",
    "storage": "512GB SSD + 1TB HDD",
    "graphics_card": "AMD Radeon RX 6700 XT",
    "motherboard": "MSI B550 TOMAHAWK",
    "location": "Computer Lab 2 - Station 05",
    "asset_tag": "CL2-PC-005"
}
```

### Sample Request Body 3 - Minimal Computer

```json
{
    "system_status": "available",
    "asset_tag": "LIB-PC-010"
}
```

### Sample Request Body 4 - Gaming Setup

```json
{
    "system_status": "available",
    "complaints": null,
    "os": "Windows 11 Gaming Edition",
    "processor": "Intel Core i9-13900K",
    "ram": "64GB DDR5-5600",
    "storage": "2TB NVMe SSD",
    "graphics_card": "NVIDIA GeForce RTX 4090",
    "motherboard": "ASUS ROG MAXIMUS Z790 HERO",
    "location": "Gaming Lab - Station 01",
    "asset_tag": "GL-PC-001"
}
```

## 2. Update Computer (PUT/PATCH)

**Endpoint:** `{{base_url}}{{api_prefix}}/computers/{id}`
**Method:** PUT or PATCH

### Sample Update 1 - Status Change

```json
{
    "system_status": "under_maintenance",
    "complaints": ["Hard drive failure detected", "System randomly shuts down"]
}
```

### Sample Update 2 - Hardware Upgrade

```json
{
    "ram": "64GB DDR4-3200",
    "storage": "2TB NVMe SSD",
    "graphics_card": "NVIDIA GeForce RTX 4070"
}
```

### Sample Update 3 - Location Change

```json
{
    "location": "Faculty Office - Room 201",
    "system_status": "available"
}
```

## 3. Update Computer Status (PATCH)

**Endpoint:** `{{base_url}}{{api_prefix}}/computers/{id}/status`
**Method:** PATCH

### Sample Status Update 1 - Set to Maintenance

```json
{
    "system_status": "under_maintenance"
}
```

### Sample Status Update 2 - Set to Available

```json
{
    "system_status": "available"
}
```

## 4. Update Computer Complaints (PATCH)

**Endpoint:** `{{base_url}}{{api_prefix}}/computers/{id}/complaints`
**Method:** PATCH

### Sample Complaints Update 1 - Hardware Issues

```json
{
    "complaints": [
        "Blue screen of death (BSOD) occurring frequently",
        "Keyboard keys are sticky",
        "Monitor has dead pixels in the center",
        "Mouse scroll wheel is not working"
    ]
}
```

### Sample Complaints Update 2 - Software Issues

```json
{
    "complaints": [
        "Windows updates keep failing",
        "Antivirus software not updating",
        "Chrome browser crashes frequently",
        "Excel files won't open properly"
    ]
}
```

### Sample Complaints Update 3 - Clear Complaints

```json
{
    "complaints": []
}
```

## 5. Testing Query Parameters

### Get All Computers with Filters

**Endpoint:** `{{base_url}}{{api_prefix}}/computers`
**Method:** GET

#### Query Examples:

1. **Filter by status:** `?system_status=available`
2. **Filter by location:** `?location=Computer Lab 1`
3. **Search computers:** `?search=Intel`
4. **Combined filters:** `?system_status=available&location=Lab&search=RTX`
5. **Pagination:** `?page=2&per_page=5`

### Get Computers by Status

**Endpoint:** `{{base_url}}{{api_prefix}}/computers/status/available`
**Method:** GET

**Endpoint:** `{{base_url}}{{api_prefix}}/computers/status/under_maintenance`
**Method:** GET

## 6. Expected Response Samples

### Successful Create Response

```json
{
    "success": true,
    "message": "Computer created successfully",
    "data": {
        "id": 1,
        "system_status": "available",
        "complaints": null,
        "os": "Windows 11 Pro",
        "processor": "Intel Core i7-12700K",
        "ram": "32GB DDR4-3200",
        "storage": "1TB NVMe SSD",
        "graphics_card": "NVIDIA GeForce RTX 4060",
        "motherboard": "ASUS PRIME Z690-P",
        "location": "Computer Lab 1 - Station 01",
        "asset_tag": "CL1-PC-001",
        "created_at": "2024-01-15T10:30:00.000000Z",
        "updated_at": "2024-01-15T10:30:00.000000Z"
    }
}
```

### Validation Error Response

```json
{
    "message": "The given data was invalid.",
    "errors": {
        "system_status": ["The selected system status is invalid."],
        "asset_tag": ["The asset tag has already been taken."]
    }
}
```

### Statistics Response

```json
{
    "success": true,
    "data": {
        "total_computers": 45,
        "available_computers": 32,
        "under_maintenance_computers": 13,
        "computers_with_complaints": 8,
        "availability_percentage": 71.11
    }
}
```

## 7. Error Testing Samples

### Invalid System Status

```json
{
    "system_status": "broken",
    "asset_tag": "TEST-001"
}
```

### Duplicate Asset Tag (should fail on second attempt)

```json
{
    "system_status": "available",
    "asset_tag": "CL1-PC-001"
}
```

### Invalid Data Types

```json
{
    "system_status": "available",
    "complaints": "This should be an array, not a string",
    "asset_tag": 12345
}
```

## 8. Bulk Testing Data

### Create Multiple Computers Script

You can use this in Postman's pre-request script or Tests tab:

```javascript
// Array of computers to create
const computers = [
    {
        system_status: "available",
        os: "Windows 10 Pro",
        processor: "Intel Core i5-10400",
        ram: "16GB DDR4",
        storage: "512GB SSD",
        graphics_card: "Intel UHD Graphics",
        motherboard: "ASUS PRIME B460M-A",
        location: "Library - Section A",
        asset_tag: "LIB-PC-" + (Math.floor(Math.random() * 1000) + 100),
    },
    {
        system_status: "under_maintenance",
        complaints: ["Slow performance", "Overheating"],
        os: "macOS Ventura",
        processor: "Apple M2",
        ram: "16GB Unified Memory",
        storage: "512GB SSD",
        graphics_card: "Apple M2 GPU",
        motherboard: "Apple Logic Board",
        location: "Design Lab",
        asset_tag: "DL-MAC-" + (Math.floor(Math.random() * 1000) + 100),
    },
];

// Set one random computer as request body
pm.globals.set(
    "randomComputer",
    JSON.stringify(computers[Math.floor(Math.random() * computers.length)])
);
```

## 9. Postman Collection Structure

Organize your Postman requests in this folder structure:

```
Computer Management API/
├── Create Operations/
│   ├── Create Basic Computer
│   ├── Create Computer with Complaints
│   ├── Create Gaming Computer
│   └── Create Minimal Computer
├── Read Operations/
│   ├── Get All Computers
│   ├── Get Computer by ID
│   ├── Get Available Computers
│   ├── Get Maintenance Computers
│   ├── Search Computers
│   └── Get Statistics
├── Update Operations/
│   ├── Full Update Computer
│   ├── Partial Update Computer
│   ├── Update Status Only
│   └── Update Complaints Only
├── Delete Operations/
│   └── Delete Computer
└── Error Testing/
    ├── Invalid Status Test
    ├── Duplicate Asset Tag Test
    └── Invalid Data Types Test
```

## 10. Test Automation Scripts

### Pre-request Script for Dynamic Asset Tags

```javascript
// Generate unique asset tag
const timestamp = Date.now();
const randomNum = Math.floor(Math.random() * 1000);
pm.globals.set("uniqueAssetTag", `TEST-${timestamp}-${randomNum}`);
```

### Test Script for Successful Creation

```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Response has success true", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
});

pm.test("Computer has ID", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data.id).to.be.a("number");
    pm.globals.set("lastComputerId", jsonData.data.id);
});
```

Remember to replace `{id}` in the URLs with actual computer IDs when testing update and delete operations!
