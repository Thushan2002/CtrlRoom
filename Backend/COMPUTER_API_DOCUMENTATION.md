# Computer Management API Documentation

This document describes the Computer Management API endpoints for the CtrlRoom application.

## Database Schema

The `computers` table contains the following fields:

| Field         | Type      | Description                                       |
| ------------- | --------- | ------------------------------------------------- |
| id            | bigint    | Primary key (auto-increment)                      |
| system_status | enum      | Computer status: `available`, `under_maintenance` |
| complaints    | json      | Array of complaint strings (nullable)             |
| os            | string    | Operating system information                      |
| processor     | string    | Processor/CPU information                         |
| ram           | string    | RAM/Memory information                            |
| storage       | string    | Storage/Hard drive information                    |
| graphics_card | string    | Graphics card information                         |
| motherboard   | string    | Motherboard information                           |
| location      | string    | Physical location of the computer                 |
| asset_tag     | string    | Unique asset identifier                           |
| created_at    | timestamp | Record creation time                              |
| updated_at    | timestamp | Record last update time                           |

## API Endpoints

### Base URL

All endpoints are prefixed with `/api/computers`

### 1. List All Computers

```
GET /api/computers
```

**Query Parameters:**

-   `system_status` (optional): Filter by status (`available`, `under_maintenance`)
-   `location` (optional): Filter by location (partial match)
-   `search` (optional): Search in OS, processor, asset_tag, location
-   `page` (optional): Pagination page number
-   `per_page` (optional): Items per page (default: 15)

**Example Requests:**

```
GET /api/computers
GET /api/computers?system_status=available
GET /api/computers?location=Lab%201
GET /api/computers?search=Intel
GET /api/computers?page=2&per_page=10
```

**Response:**

```json
{
    "success": true,
    "data": {
        "current_page": 1,
        "data": [
            {
                "id": 1,
                "system_status": "available",
                "complaints": null,
                "os": "Windows 11",
                "processor": "Intel Core i7-11700",
                "ram": "16GB DDR4",
                "storage": "512GB SSD",
                "graphics_card": "NVIDIA RTX 3060",
                "motherboard": "ASUS PRIME B450M-A",
                "location": "Computer Lab 1",
                "asset_tag": "PC-1001",
                "created_at": "2024-01-01T10:00:00.000000Z",
                "updated_at": "2024-01-01T10:00:00.000000Z",
                "system_info": {
                    "os": "Windows 11",
                    "processor": "Intel Core i7-11700",
                    "ram": "16GB DDR4",
                    "storage": "512GB SSD",
                    "graphics_card": "NVIDIA RTX 3060",
                    "motherboard": "ASUS PRIME B450M-A"
                }
            }
        ],
        "first_page_url": "http://localhost/api/computers?page=1",
        "from": 1,
        "last_page": 3,
        "last_page_url": "http://localhost/api/computers?page=3",
        "links": [...],
        "next_page_url": "http://localhost/api/computers?page=2",
        "path": "http://localhost/api/computers",
        "per_page": 15,
        "prev_page_url": null,
        "to": 15,
        "total": 35
    }
}
```

### 2. Create Computer

```
POST /api/computers
```

**Request Body:**

```json
{
    "system_status": "available",
    "complaints": ["Screen flickering", "Slow boot time"],
    "os": "Windows 11",
    "processor": "Intel Core i7-11700",
    "ram": "16GB DDR4",
    "storage": "512GB SSD",
    "graphics_card": "NVIDIA RTX 3060",
    "motherboard": "ASUS PRIME B450M-A",
    "location": "Computer Lab 1",
    "asset_tag": "PC-1001"
}
```

**Validation Rules:**

-   `system_status`: Required, must be `available` or `under_maintenance`
-   `complaints`: Optional array of strings
-   `os`: Optional string, max 255 characters
-   `processor`: Optional string, max 255 characters
-   `ram`: Optional string, max 255 characters
-   `storage`: Optional string, max 255 characters
-   `graphics_card`: Optional string, max 255 characters
-   `motherboard`: Optional string, max 255 characters
-   `location`: Optional string, max 255 characters
-   `asset_tag`: Optional string, max 255 characters, must be unique

**Response:**

```json
{
    "success": true,
    "message": "Computer created successfully",
    "data": {
        "id": 1,
        "system_status": "available",
        "complaints": ["Screen flickering", "Slow boot time"],
        "os": "Windows 11",
        "processor": "Intel Core i7-11700",
        "ram": "16GB DDR4",
        "storage": "512GB SSD",
        "graphics_card": "NVIDIA RTX 3060",
        "motherboard": "ASUS PRIME B450M-A",
        "location": "Computer Lab 1",
        "asset_tag": "PC-1001",
        "created_at": "2024-01-01T10:00:00.000000Z",
        "updated_at": "2024-01-01T10:00:00.000000Z"
    }
}
```

### 3. Get Single Computer

```
GET /api/computers/{id}
```

**Response:**

```json
{
    "success": true,
    "data": {
        "id": 1,
        "system_status": "available",
        "complaints": null,
        "os": "Windows 11",
        "processor": "Intel Core i7-11700",
        "ram": "16GB DDR4",
        "storage": "512GB SSD",
        "graphics_card": "NVIDIA RTX 3060",
        "motherboard": "ASUS PRIME B450M-A",
        "location": "Computer Lab 1",
        "asset_tag": "PC-1001",
        "created_at": "2024-01-01T10:00:00.000000Z",
        "updated_at": "2024-01-01T10:00:00.000000Z"
    }
}
```

### 4. Update Computer

```
PUT /api/computers/{id}
PATCH /api/computers/{id}
```

**Request Body:**

```json
{
    "system_status": "under_maintenance",
    "complaints": ["Hardware failure"],
    "location": "Computer Lab 2"
}
```

**Response:**

```json
{
    "success": true,
    "message": "Computer updated successfully",
    "data": {
        "id": 1,
        "system_status": "under_maintenance",
        "complaints": ["Hardware failure"],
        "os": "Windows 11",
        "processor": "Intel Core i7-11700",
        "ram": "16GB DDR4",
        "storage": "512GB SSD",
        "graphics_card": "NVIDIA RTX 3060",
        "motherboard": "ASUS PRIME B450M-A",
        "location": "Computer Lab 2",
        "asset_tag": "PC-1001",
        "created_at": "2024-01-01T10:00:00.000000Z",
        "updated_at": "2024-01-01T12:00:00.000000Z"
    }
}
```

### 5. Delete Computer

```
DELETE /api/computers/{id}
```

**Response:**

```json
{
    "success": true,
    "message": "Computer deleted successfully"
}
```

### 6. Get Computers by Status

```
GET /api/computers/status/{status}
```

**Parameters:**

-   `status`: `available` or `under_maintenance`

**Example:**

```
GET /api/computers/status/available
GET /api/computers/status/under_maintenance
```

**Response:**

```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "system_status": "available",
            "complaints": null,
            "os": "Windows 11",
            "processor": "Intel Core i7-11700",
            "ram": "16GB DDR4",
            "storage": "512GB SSD",
            "graphics_card": "NVIDIA RTX 3060",
            "motherboard": "ASUS PRIME B450M-A",
            "location": "Computer Lab 1",
            "asset_tag": "PC-1001",
            "created_at": "2024-01-01T10:00:00.000000Z",
            "updated_at": "2024-01-01T10:00:00.000000Z"
        }
    ]
}
```

### 7. Update Computer Status

```
PATCH /api/computers/{id}/status
```

**Request Body:**

```json
{
    "system_status": "under_maintenance"
}
```

**Response:**

```json
{
    "success": true,
    "message": "Computer status updated successfully",
    "data": {
        "id": 1,
        "system_status": "under_maintenance",
        "complaints": null,
        "os": "Windows 11",
        "processor": "Intel Core i7-11700",
        "ram": "16GB DDR4",
        "storage": "512GB SSD",
        "graphics_card": "NVIDIA RTX 3060",
        "motherboard": "ASUS PRIME B450M-A",
        "location": "Computer Lab 1",
        "asset_tag": "PC-1001",
        "created_at": "2024-01-01T10:00:00.000000Z",
        "updated_at": "2024-01-01T12:00:00.000000Z"
    }
}
```

### 8. Update Computer Complaints

```
PATCH /api/computers/{id}/complaints
```

**Request Body:**

```json
{
    "complaints": ["Screen flickering", "USB ports not working"]
}
```

**Response:**

```json
{
    "success": true,
    "message": "Computer complaints updated successfully",
    "data": {
        "id": 1,
        "system_status": "available",
        "complaints": ["Screen flickering", "USB ports not working"],
        "os": "Windows 11",
        "processor": "Intel Core i7-11700",
        "ram": "16GB DDR4",
        "storage": "512GB SSD",
        "graphics_card": "NVIDIA RTX 3060",
        "motherboard": "ASUS PRIME B450M-A",
        "location": "Computer Lab 1",
        "asset_tag": "PC-1001",
        "created_at": "2024-01-01T10:00:00.000000Z",
        "updated_at": "2024-01-01T12:30:00.000000Z"
    }
}
```

### 9. Get Statistics

```
GET /api/computers/statistics/overview
```

**Response:**

```json
{
    "success": true,
    "data": {
        "total_computers": 35,
        "available_computers": 25,
        "under_maintenance_computers": 10,
        "computers_with_complaints": 8,
        "availability_percentage": 71.43
    }
}
```

## Error Responses

### Validation Error (422)

```json
{
    "message": "The given data was invalid.",
    "errors": {
        "system_status": ["The selected system status is invalid."],
        "asset_tag": ["The asset tag has already been taken."]
    }
}
```

### Not Found Error (404)

```json
{
    "message": "No query results for model [App\\Models\\Computer] 999"
}
```

### Server Error (500)

```json
{
    "success": false,
    "message": "Internal server error"
}
```

## Setup Instructions

1. **Run Migration:**

    ```bash
    php artisan migrate
    ```

2. **Seed Database (Optional):**

    ```bash
    php artisan db:seed --class=ComputerSeeder
    ```

3. **Generate Factory Data (Optional):**
    ```bash
    php artisan tinker
    \App\Models\Computer::factory(10)->create();
    ```

## Model Features

The Computer model includes several helper methods:

-   `isAvailable()`: Returns true if computer status is available
-   `isUnderMaintenance()`: Returns true if computer status is under maintenance
-   `getSystemStatuses()`: Returns array of valid system statuses
-   `system_info` accessor: Returns formatted system information array

## Usage Examples

### Creating a Computer via API

```bash
curl -X POST http://localhost/api/computers \
  -H "Content-Type: application/json" \
  -d '{
    "system_status": "available",
    "os": "Ubuntu 22.04",
    "processor": "AMD Ryzen 5 5600X",
    "ram": "16GB DDR4",
    "storage": "512GB SSD",
    "graphics_card": "AMD Radeon RX 6600",
    "location": "Computer Lab 1",
    "asset_tag": "PC-2001"
  }'
```

### Updating Computer Status

```bash
curl -X PATCH http://localhost/api/computers/1/status \
  -H "Content-Type: application/json" \
  -d '{"system_status": "under_maintenance"}'
```

### Searching Computers

```bash
curl "http://localhost/api/computers?search=AMD&system_status=available"
```
