# E-Banking System — API Documentation

> **Base URL:** `http://localhost:8080`
> **Auth:** JWT (sent via `JwtToken` HttpOnly cookie)
> **Database:** PostgreSQL

---

## Table of Contents

1. [Authentication](#1-authentication-apiauth)
2. [User Management](#2-user-management-apiusers)
3. [Admin Management](#3-admin-management-apiadmin)
4. [Branch Management](#4-branch-management-apibranches)
5. [Manager Management](#5-manager-management-apimanager)
6. [Teller Management](#6-teller-management-apiteller)
7. [CSO Management](#7-cso-management-apicso)
8. [Customer Management](#8-customer-management-apicustomers)
9. [Account Operations](#9-account-operations-apiaccounts)
10. [Complaints & Requests (Staff)](#10-complaints--requests--staff-apirequests)
11. [Mobile APIs (Customer)](#11-mobile-apis--customer-apimobile)
12. [Data Models (DTOs)](#12-data-models-dtos)
13. [Enums Reference](#13-enums-reference)
14. [Default Seeded Users](#14-default-seeded-users)

---

## 🔐 Role Hierarchy

| Role | Description |
|------|-------------|
| `ROLE_ADMIN` | System administrator. Can manage branches, managers, admins, and all users. |
| `ROLE_MANAGER` | Branch manager. Can register tellers, CSOs, and manage branch-level operations. |
| `ROLE_TELLER` | Handles cash deposits, withdrawals, transfers, and cheque deposits. |
| `ROLE_CSO` | Customer Service Officer. Registers customers, creates accounts, handles complaints. |
| `ROLE_CUSTOMER` | End customer. Can view profile, accounts, transactions, and file complaints. |

---

## 1. Authentication (`/api/auth`)

### 1.1 Login

```
POST /api/auth/loginUser
```

**Auth Required:** No

**Request Body:**
```json
{
  "email": "admin@niyorabank.com",
  "password": "Admin@123"
}
```

**Response:** `200 OK` — returns `UserDto` in body + sets `JwtToken` HttpOnly cookie (1 hour expiry).

```json
{
  "id": 1,
  "fullName": "System Admin",
  "roles": ["ROLE_ADMIN"],
  "email": "admin@niyorabank.com",
  "phoneNumber": null,
  "status": "ACTIVE",
  "createdAt": "2026-06-25T10:00:00",
  "updatedAt": "2026-06-25T10:00:00",
  "lastLogin": "2026-06-25T12:30:00"
}
```

---

### 1.2 Logout

```
POST /api/auth/logoutUser
```

**Auth Required:** Yes (any role)

**Response:** `200 OK` — clears the `JwtToken` cookie.

```
User logged out successfully
```

---

### 1.3 Get Current User

```
GET /api/auth/getCurrentUser
```

**Auth Required:** Yes (any role)

**Response:** `200 OK` — returns `UserDto` of the currently logged-in user.

---

### 1.4 Confirm Email

```
POST /api/auth/confirmMail
```

**Auth Required:** Yes (any role)

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:** `200 OK`
```
Email is Verified
```

---

## 2. User Management (`/api/users`)

### 2.1 Get User by ID

```
GET /api/users/getUserById/{id}
```

**Auth Required:** Yes

| Param | Type | Description |
|-------|------|-------------|
| `id` | Long | User ID |

**Response:** `200 OK` — `UserDto`

---

### 2.2 Get All Users

```
GET /api/users/getAllUsers
```

**Auth Required:** Yes
**Roles:** `ADMIN`

**Response:** `200 OK` — `List<UserDto>`

---

### 2.3 Change Password

```
PUT /api/users/changePassword/{id}
```

**Auth Required:** Yes

**Request Body:**
```json
{
  "oldPassword": "OldPass@123",
  "newPassword": "NewPass@456",
  "confirmNewPassword": "NewPass@456"
}
```

**Response:** `200 OK` — `UserDto`

---

### 2.4 Update User

```
PUT /api/users/updateUser/{id}
```

**Auth Required:** Yes

**Request Body:** `UserDto` fields to update.

**Response:** `200 OK` — `UserDto`

---

### 2.5 Delete User

```
DELETE /api/users/deleteUser/{id}
```

**Auth Required:** Yes
**Roles:** `ADMIN`

**Response:** `200 OK`

---

## 3. Admin Management (`/api/admin`)

### 3.1 Register Admin User

```
POST /api/admin/registerAdminUser
```

**Auth Required:** Yes (authenticated admin)

**Request Body:**
```json
{
  "email": "newadmin@niyorabank.com",
  "fullName": "New Admin",
  "phoneNumber": "9876543210",
  "password": "StrongPass@123"
}
```

**Response:** `200 OK` — `AdminDTO`

---

### 3.2 Get Admin by ID

```
GET /api/admin/{adminId}
```

**Auth Required:** Yes

| Param | Type | Description |
|-------|------|-------------|
| `adminId` | Long | Admin ID |

**Response:** `200 OK` — `AdminDTO`

---

## 4. Branch Management (`/api/branches`)

### 4.1 Register Branch

```
POST /api/branches/register
```

**Auth Required:** Yes
**Roles:** `ADMIN`

**Request Body:**
```json
{
  "bankName": "Niyora Bank",
  "branchName": "Mumbai Main",
  "branchCode": "100001",
  "branchIfsc": "NIYO0100001",
  "address": "123 Financial District, Mumbai",
  "contactNumber": "022-12345678"
}
```

> **Validation:** `branchCode` must be exactly 6 digits. `branchIfsc` must be 11 chars (4 letters + 0 + 6 alphanumeric).

**Response:** `200 OK` — `BranchRespDto`

---

### 4.2 Get Branch by ID

```
POST /api/branches/{branchId}
```

**Auth Required:** Yes
**Roles:** `ADMIN`

**Response:** `200 OK` — `BranchRespDto`

---

### 4.3 Get Branch by IFSC

```
POST /api/branches/ifsc/{ifsc}
```

**Auth Required:** Yes
**Roles:** `ADMIN`

**Response:** `200 OK` — `BranchRespDto`

---

### 4.4 Get Branch by Branch Code

```
POST /api/branches/branchCode/{branchCode}
```

**Auth Required:** Yes
**Roles:** `ADMIN`

**Response:** `200 OK` — `BranchRespDto`

---

## 5. Manager Management (`/api/manager`)

### 5.1 Register Manager

```
POST /api/manager/registerManager/{branchId}
```

**Auth Required:** Yes
**Roles:** `ADMIN`

| Param | Type | Description |
|-------|------|-------------|
| `branchId` | Long | Branch to assign the manager to |

**Request Body:**
```json
{
  "email": "manager@niyorabank.com",
  "fullName": "Branch Manager",
  "phoneNumber": "9876543210",
  "password": "Manager@123"
}
```

**Response:** `200 OK` — `ManagerDto`

---

### 5.2 Get Manager by ID

```
GET /api/manager/{managerId}
```

**Auth Required:** Yes
**Roles:** `ADMIN`, `MANAGER`

**Response:** `200 OK` — `ManagerDto`

---

## 6. Teller Management (`/api/teller`)

### 6.1 Register Teller

```
POST /api/teller/registerTeller/{branchId}
```

**Auth Required:** Yes
**Roles:** `ADMIN`, `MANAGER`

| Param | Type | Description |
|-------|------|-------------|
| `branchId` | Long | Branch to assign the teller to |

**Request Body:**
```json
{
  "email": "teller1@niyorabank.com",
  "fullName": "Bank Teller",
  "phoneNumber": "9876543210",
  "password": "Teller@123"
}
```

**Response:** `200 OK` — `TellerDto`

---

### 6.2 Get Teller by ID

```
GET /api/teller/{tellerId}
```

**Auth Required:** Yes
**Roles:** `ADMIN`, `MANAGER`, `TELLER`

**Response:** `200 OK` — `TellerDto`

---

### 6.3 Set Cash Drawer

```
POST /api/teller/setCashDrawer/{cashDrawerId}
```

**Auth Required:** Yes
**Roles:** `TELLER`

| Param | Type | Description |
|-------|------|-------------|
| `cashDrawerId` | String | Drawer identifier |

**Response:** `200 OK` — `TellerDto`

---

### 6.4 Set Last Balanced

```
POST /api/teller/setLastBalanced/?lastBalancedDate=2026-06-25T10:30:00
```

**Auth Required:** Yes
**Roles:** `TELLER`

| Query Param | Type | Format | Description |
|-------------|------|--------|-------------|
| `lastBalancedDate` | LocalDateTime | `yyyy-MM-dd'T'HH:mm:ss` | Timestamp of last balance |

**Response:** `200 OK` — `TellerDto`

---

## 7. CSO Management (`/api/cso`)

### 7.1 Register CSO

```
POST /api/cso/registerCso/{branchId}
```

**Auth Required:** Yes
**Roles:** `ADMIN`, `MANAGER`

| Param | Type | Description |
|-------|------|-------------|
| `branchId` | Long | Branch to assign the CSO to |

**Request Body:**
```json
{
  "email": "cso1@niyorabank.com",
  "fullName": "Customer Service Officer",
  "phoneNumber": "9876543210",
  "password": "CSO@123"
}
```

**Response:** `200 OK` — `CsoDto`

---

### 7.2 Get CSO by ID

```
GET /api/cso/{csoId}
```

**Auth Required:** Yes
**Roles:** `ADMIN`, `MANAGER`, `CSO`

**Response:** `200 OK` — `CsoDto`

---

## 8. Customer Management (`/api/customers`)

### 8.1 Register Customer

```
POST /api/customers/register
```

**Auth Required:** Yes
**Roles:** `CSO`, `MANAGER`

**Request Body:**
```json
{
  "email": "customer@example.com",
  "fullName": "John Doe",
  "phoneNumber": "9876543210",
  "password": "Customer@123",
  "fatherName": "Richard Doe",
  "dob": "1990-05-15",
  "gender": "Male",
  "maritalStatus": "MARRIED",
  "address": "456 Elm Street, Mumbai",
  "kycDocs": {
    "AADHAR": "1234-5678-9012",
    "PAN": "ABCDE1234F"
  }
}
```

**Response:** `200 OK` — `CustomerDto`

---

### 8.2 Get Customer by ID

```
GET /api/customers/{customerId}
```

**Auth Required:** Yes
**Roles:** `CSO`, `MANAGER`, `TELLER`

**Response:** `200 OK` — `CustomerDto`

```json
{
  "customerId": 5,
  "createdById": 3,
  "userDetails": { /* UserDto */ },
  "fatherName": "Richard Doe",
  "dob": "1990-05-15",
  "gender": "Male",
  "maritalStatus": "MARRIED",
  "address": "456 Elm Street, Mumbai",
  "kycDocs": { "AADHAR": "1234-5678-9012", "PAN": "ABCDE1234F" },
  "kycstatus": true
}
```

---

### 8.3 Update Customer KYC

```
PATCH /api/customers/{customerId}/KYC
```

**Auth Required:** Yes
**Roles:** `CSO`, `MANAGER`

**Request Body:** (all fields optional — only non-null values are updated)
```json
{
  "fullName": "John D. Doe",
  "phoneNumber": "9876543211",
  "fatherName": "Richard Doe",
  "dob": "1990-05-15",
  "gender": "Male",
  "maritalStatus": "MARRIED",
  "address": "789 Oak Avenue, Mumbai",
  "kycDocs": {
    "AADHAR": "1234-5678-9012",
    "PAN": "ABCDE1234F",
    "VOTER_ID": "XYZ123456"
  }
}
```

> **Note:** KYC status is automatically set to `true` upon update.

**Response:** `200 OK`
```
Customer KYC updated successfully
```

---

## 9. Account Operations (`/api/accounts`)

### 9.1 Create Account

```
POST /api/accounts/create
```

**Auth Required:** Yes
**Roles:** `CSO`

**Request Body:**
```json
{
  "customerId": 5,
  "branchCode": "100001",
  "accountType": "SAVINGS"
}
```

> `accountType` accepts: `SAVINGS`, `CURRENT`

**Response:** `200 OK` — `AccountDto`

```json
{
  "id": 1,
  "accountNumber": "100001000001",
  "customerId": 5,
  "accountType": "SAVINGS",
  "balance": 0.0,
  "createdAt": "2026-06-25T12:00:00",
  "accountStatus": "PENDING",
  "branchName": "Mumbai Main",
  "branchCode": "100001",
  "branchIfsc": "NIYO0100001"
}
```

---

### 9.2 Get Accounts by Customer ID

```
GET /api/accounts/customer/{customerId}
```

**Auth Required:** Yes
**Roles:** `MANAGER`, `CSO`, `CUSTOMER`, `TELLER`

> Customers can only view their own accounts.

**Response:** `200 OK` — `List<AccountDto>`

---

### 9.3 Get Accounts by Branch Code

```
GET /api/accounts/branchCode/{branchCode}
```

**Auth Required:** Yes
**Roles:** `CSO`, `TELLER`, `MANAGER`

**Response:** `200 OK` — `List<AccountDto>`

---

### 9.4 Get Account by Account Number

```
GET /api/accounts/accountNumber/{accountNumber}
```

**Auth Required:** Yes
**Roles:** `CSO`, `TELLER`, `MANAGER`

> Customers are ownership-checked if they call this.

**Response:** `200 OK` — `AccountDto`

---

### 9.5 Cash Deposit

```
POST /api/accounts/cashDeposit
```

**Auth Required:** Yes
**Roles:** `TELLER`

**Request Body:**
```json
{
  "accountNumber": "100001000001",
  "amount": 5000.00
}
```

> First deposit on a `PENDING` account will automatically set status to `ACTIVE`.

**Response:** `200 OK` — `AccountDto` (updated balance)

---

### 9.6 Cash Withdrawal

```
POST /api/accounts/cashWithdraw
```

**Auth Required:** Yes
**Roles:** `TELLER`

**Request Body:**
```json
{
  "accountNumber": "100001000001",
  "amount": 2000.00
}
```

**Response:** `200 OK` — `AccountDto` (updated balance)

**Errors:**
- `400` — Insufficient balance

---

### 9.7 Internal Money Transfer

```
POST /api/accounts/transfer/internal
```

**Auth Required:** Yes
**Roles:** `TELLER`

**Request Body:**
```json
{
  "fromAccountNumber": "100001000001",
  "toAccountNumber": "100001000002",
  "amount": 1000.00
}
```

> Creates two transactions: `INTERNAL_TRANSFER_DEBIT` on the source account and `INTERNAL_TRANSFER_CREDIT` on the destination account. Uses pessimistic locking to prevent deadlocks.

**Response:** `200 OK`
```
Transfer successful
```

---

### 9.8 Cheque Deposit

```
POST /api/accounts/chequeDeposit
```

**Auth Required:** Yes
**Roles:** `TELLER`, `CSO`

**Request Body:**
```json
{
  "chequeNumber": "CHQ-2026-001",
  "issuingBank": "Niyora Bank",
  "branchCode": "100001",
  "issuerAccountNumber": "100001000001",
  "payeeAccountNumber": "100001000002",
  "amount": 3000.00,
  "issueDate": "2026-06-20"
}
```

> Creates a `Cheque` record, debits the issuer account (`CHEQUE_WITHDRAWAL`), credits the payee account (`CHEQUE_DEPOSIT`), and links the cheque to the credit transaction.

**Response:** `200 OK`
```
Cheque deposit successful
```

**Errors:**
- `400` — Insufficient balance, inactive accounts, same-account transfer

---

### 9.9 Get Transactions by Account Number

```
GET /api/accounts/transactions/{accountNumber}
```

**Auth Required:** Yes
**Roles:** `MANAGER`, `CSO`, `CUSTOMER`, `TELLER`

> Customers are ownership-checked.

**Response:** `200 OK` — `List<TransactionRespDto>`

```json
[
  {
    "transactionType": "CASH_DEPOSIT",
    "amount": 5000.00,
    "transactionDate": "2026-06-25T12:00:00",
    "status": "SUCCESS",
    "processedById": 3,
    "remarks": "Cash deposit of amount: 5000.0"
  }
]
```

---

## 10. Complaints & Requests — Staff (`/api/requests`)

### 10.1 Get All Complaints

```
GET /api/requests/complaints
```

**Auth Required:** Yes
**Roles:** `CSO`, `MANAGER`, `ADMIN`

**Response:** `200 OK` — `List<ComplaintRespDto>`

```json
[
  {
    "complaintId": 1,
    "customerId": 5,
    "customerName": "John Doe",
    "branchId": 1,
    "branchName": "Mumbai Main",
    "description": "ATM not working at branch",
    "status": "PENDING",
    "createdAt": "2026-06-25T14:00:00",
    "rejectReason": null,
    "resolvedById": null
  }
]
```

---

### 10.2 Get Complaint by ID

```
GET /api/requests/complaints/{complaintId}
```

**Auth Required:** Yes
**Roles:** `CSO`, `MANAGER`, `ADMIN`

**Response:** `200 OK` — `ComplaintRespDto`

---

### 10.3 Handle Complaint (Resolve / Reject)

```
PATCH /api/requests/complaints/{complaintId}/handle
```

**Auth Required:** Yes
**Roles:** `CSO`, `MANAGER`

**Request Body (Resolve):**
```json
{
  "status": "RESOLVED"
}
```

**Request Body (Reject):**
```json
{
  "status": "REJECTED",
  "rejectReason": "Complaint is not valid — ATM is functioning normally"
}
```

> **Validation:** `rejectReason` is mandatory when status is `REJECTED`. Cannot re-handle an already resolved/rejected complaint (returns `409 CONFLICT`).

**Response:** `200 OK` — `ComplaintRespDto` (updated)

---

## 11. Mobile APIs — Customer (`/api/mobile`)

> All mobile endpoints are locked to `ROLE_CUSTOMER` only. The customer identity is always resolved from the JWT token — no customer ID is ever passed from the client.

---

### 11.1 Get My Profile

```
GET /api/mobile/profile
```

**Auth Required:** Yes
**Roles:** `CUSTOMER`

**Response:** `200 OK` — `CustomerDto`

```json
{
  "customerId": 5,
  "createdById": 3,
  "userDetails": {
    "id": 5,
    "fullName": "John Doe",
    "roles": ["ROLE_CUSTOMER"],
    "email": "customer@example.com",
    "phoneNumber": "9876543210",
    "status": "ACTIVE",
    "createdAt": "2026-06-25T10:00:00",
    "updatedAt": "2026-06-25T10:00:00",
    "lastLogin": "2026-06-25T15:00:00"
  },
  "fatherName": "Richard Doe",
  "dob": "1990-05-15",
  "gender": "Male",
  "maritalStatus": "MARRIED",
  "address": "456 Elm Street, Mumbai",
  "kycDocs": { "AADHAR": "1234-5678-9012" },
  "kycstatus": true
}
```

---

### 11.2 Get My Accounts

```
GET /api/mobile/accounts
```

**Auth Required:** Yes
**Roles:** `CUSTOMER`

**Response:** `200 OK` — `List<AccountDto>`

---

### 11.3 Get Account Balance

```
GET /api/mobile/accounts/{accountNumber}/balance
```

**Auth Required:** Yes
**Roles:** `CUSTOMER`

> Returns `403 FORBIDDEN` if the account does not belong to the authenticated customer.

**Response:** `200 OK` — `AccountDto`

---

### 11.4 Get Account Transactions

```
GET /api/mobile/accounts/{accountNumber}/transactions
```

**Auth Required:** Yes
**Roles:** `CUSTOMER`

> Returns `403 FORBIDDEN` if the account does not belong to the authenticated customer.

**Response:** `200 OK` — `List<TransactionRespDto>`

---

### 11.5 File Complaint

```
POST /api/mobile/requests/fileComplaint
```

**Auth Required:** Yes
**Roles:** `CUSTOMER`

**Request Body:**
```json
{
  "description": "ATM near MG Road is not dispensing cash",
  "branchIfsc": "NIYO0100001"
}
```

**Response:** `201 CREATED` — `ComplaintRespDto`

---

### 11.6 Get My Complaints

```
GET /api/mobile/requests/complaints
```

**Auth Required:** Yes
**Roles:** `CUSTOMER`

> Returns only the complaints filed by the authenticated customer.

**Response:** `200 OK` — `List<ComplaintRespDto>`

---

## 12. Data Models (DTOs)

### UserDto
```json
{
  "id": "Long",
  "fullName": "String",
  "roles": ["String"],
  "email": "String",
  "phoneNumber": "String",
  "status": "ACTIVE | INACTIVE | BLOCKED",
  "createdAt": "LocalDateTime",
  "updatedAt": "LocalDateTime",
  "lastLogin": "LocalDateTime"
}
```

### AccountDto
```json
{
  "id": "Long",
  "accountNumber": "String (12-digit)",
  "customerId": "Long",
  "accountType": "SAVINGS | CURRENT",
  "balance": "Double",
  "createdAt": "String",
  "accountStatus": "PENDING | ACTIVE | INACTIVE | CLOSED",
  "branchName": "String",
  "branchCode": "String (6-digit)",
  "branchIfsc": "String (11-char)"
}
```

### CustomerDto
```json
{
  "customerId": "Long",
  "createdById": "Long",
  "userDetails": "UserDto",
  "fatherName": "String",
  "dob": "LocalDate",
  "gender": "String",
  "maritalStatus": "MARRIED | UNMARRIED",
  "address": "String",
  "kycDocs": { "docType": "docValue" },
  "kycstatus": "boolean"
}
```

### TransactionRespDto
```json
{
  "transactionType": "CASH_DEPOSIT | CHEQUE_DEPOSIT | CHEQUE_WITHDRAWAL | WITHDRAWAL | INTERNAL_TRANSFER_DEBIT | INTERNAL_TRANSFER_CREDIT",
  "amount": "Double",
  "transactionDate": "LocalDateTime",
  "status": "PENDING | SUCCESS | FAILED",
  "processedById": "Long",
  "remarks": "String"
}
```

### ComplaintRespDto
```json
{
  "complaintId": "Long",
  "customerId": "Long",
  "customerName": "String",
  "branchId": "Long",
  "branchName": "String",
  "description": "String",
  "status": "PENDING | RESOLVED | REJECTED",
  "createdAt": "LocalDateTime",
  "rejectReason": "String (nullable)",
  "resolvedById": "Long (nullable)"
}
```

---

## 13. Enums Reference

| Enum | Values |
|------|--------|
| `User.Status` | `ACTIVE`, `INACTIVE`, `BLOCKED` |
| `Account.AccountType` | `SAVINGS`, `CURRENT` |
| `Account.Status` | `PENDING`, `ACTIVE`, `INACTIVE`, `CLOSED` |
| `Transaction.TransactionType` | `CASH_DEPOSIT`, `CHEQUE_DEPOSIT`, `CHEQUE_WITHDRAWAL`, `WITHDRAWAL`, `INTERNAL_TRANSFER_DEBIT`, `INTERNAL_TRANSFER_CREDIT` |
| `Transaction.Status` | `PENDING`, `SUCCESS`, `FAILED` |
| `Cheque.Status` | `PENDING`, `CLEARED`, `BOUNCED`, `CANCELLED` |
| `Complaint.Status` | `PENDING`, `RESOLVED`, `REJECTED` |
| `Customer.MaritalStatus` | `MARRIED`, `UNMARRIED` |

---

## 14. Default Seeded Users

The `UserSeederService` (currently commented out) seeds the following users on startup:

| Email | Password | Role |
|-------|----------|------|
| `admin@niyorabank.com` | `Admin@123` | `ROLE_ADMIN` |
| `manager@niyorabank.com` | `Admin@123` | `ROLE_MANAGER` |
| `teller@niyorabank.com` | `Admin@123` | `ROLE_TELLER` |
| `cso@niyorabank.com` | `Admin@123` | `ROLE_CSO` |

> To enable, uncomment the class in `Utils/UserSeederService.java`.

---

## Error Responses

| HTTP Code | Meaning |
|-----------|---------|
| `400` | Bad Request — validation failed or business rule violation |
| `401` | Unauthorized — missing or invalid JWT token |
| `403` | Forbidden — authenticated but lacks required role or ownership |
| `404` | Not Found — resource does not exist |
| `409` | Conflict — e.g., attempting to re-handle an already resolved complaint |
| `500` | Internal Server Error |

---

> **Last updated:** June 25, 2026
