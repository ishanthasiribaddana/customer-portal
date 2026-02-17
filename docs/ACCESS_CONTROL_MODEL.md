# Customer Portal Access Control Model

## Developer Reference Guide

**Version:** 1.0  
**Last Updated:** February 2026  
**Applies To:** `customer-portal`, `SSOService`

---

## Overview

The Customer Portal uses a **Role-Based Access Control (RBAC)** model with two levels:

1. **Role Level** - Determines which applications/portals a user can access
2. **Permission Level** - Determines what actions a user can perform within an application

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER LOGIN                              │
│                    (user_login table)                           │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼ (many-to-many)
┌─────────────────────────────────────────────────────────────────┐
│                   USER_LOGIN_HAS_ROLE                           │
│            (Junction table - multiple roles per user)           │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         USER_ROLE                               │
│        (Borrower, Customer, Staff, Manager, Admin)              │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼ (many-to-many)
┌─────────────────────────────────────────────────────────────────┐
│                  USER_ROLE_HAS_PERMISSION                       │
│             (Junction table - permissions per role)             │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        PERMISSION                               │
│          (Fine-grained actions: loan:read, loan:create)         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Tables

### 1. `user_login_has_role` (User-Role Junction)

Enables **many-to-many** relationship between users and roles. A staff member can also be a borrower.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `user_login_id` | INT | FK to `user_login.id` |
| `user_role_id` | INT | FK to `user_role.id` |
| `is_primary` | TINYINT(1) | Primary role for UI display |
| `is_active` | TINYINT(1) | Soft delete flag |
| `assigned_at` | DATETIME | When role was assigned |
| `assigned_by` | INT | FK to user who assigned |

### 2. `permission` (Permission Definitions)

Defines granular actions using `module:action` format.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `code` | VARCHAR(50) | Unique code: `loan:read`, `payment:create` |
| `name` | VARCHAR(100) | Human readable name |
| `description` | VARCHAR(255) | Description |
| `module` | VARCHAR(50) | Module grouping: `loan`, `payment`, `customer` |
| `is_active` | TINYINT(1) | Active flag |

### 3. `user_role_has_permission` (Role-Permission Junction)

Links roles to permissions.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key |
| `user_role_id` | INT | FK to `user_role.id` |
| `permission_id` | INT | FK to `permission.id` |
| `granted_at` | DATETIME | When permission was granted |
| `granted_by` | INT | FK to user who granted |

---

## Roles

### Customer Portal Roles

| Role | Description | Portal Access |
|------|-------------|---------------|
| **Borrower** | Loan applicant/customer | Customer Portal ✅ |
| **Customer** | General customer (alias for Borrower) | Customer Portal ✅ |
| **Staff** | Internal employee | Admin Portal |
| **Manager** | Department manager | Admin Portal |
| **Admin** | System administrator | All Portals |

### Multi-Role Support

A user can have **multiple roles simultaneously**:

```sql
-- Staff member who is also a borrower
INSERT INTO user_login_has_role (user_login_id, user_role_id, is_primary) VALUES
(123, 2, 1),  -- Staff (primary)
(123, 5, 0);  -- Borrower (secondary)
```

---

## Permissions

### Permission Code Format

```
{module}:{action}
```

| Module | Actions |
|--------|---------|
| `loan` | `read`, `read_own`, `create`, `update`, `delete`, `approve`, `reject`, `disburse` |
| `payment` | `read`, `read_own`, `create`, `update`, `delete`, `approve` |
| `customer` | `read`, `read_own`, `create`, `update`, `update_own`, `delete` |
| `document` | `read`, `upload`, `download`, `delete` |
| `report` | `view`, `export`, `financial` |
| `admin` | `user_manage`, `role_manage`, `system_config`, `audit_log` |

### Special Permissions

| Permission | Description |
|------------|-------------|
| `*:read_own` | Can only access own data (filtered by user ID) |
| `*:read` | Can access all data in module |
| `*:update_own` | Can only modify own records |

---

## Permission Matrix

### Borrower/Customer Role

| Permission | Granted | Notes |
|------------|:-------:|-------|
| `loan:read_own` | ✅ | View own loans only |
| `loan:create` | ✅ | Apply for new loans |
| `loan:read` | ❌ | Cannot view other loans |
| `loan:approve` | ❌ | Cannot approve loans |
| `payment:read_own` | ✅ | View own payments |
| `payment:create` | ✅ | Make payments |
| `customer:read_own` | ✅ | View own profile |
| `customer:update_own` | ✅ | Update own profile |
| `document:read` | ✅ | View own documents |
| `document:upload` | ✅ | Upload documents |

---

## Backend Implementation

### Entity Classes

```
lk.temcobank.entity.Permission
lk.temcobank.entity.UserLoginHasRole
lk.temcobank.entity.UserRoleHasPermission
```

### Service Classes

```
SSOService handles authentication and RBAC permission checking.
```

---

## API Usage

### RBACService Methods

```java
@EJB
private RBACService rbacService;

// ==================== ROLE CHECKS ====================

// Get all roles for a user
List<UserRole> roles = rbacService.getUserRoles(userId);

// Get role names
List<String> roleNames = rbacService.getUserRoleNames(userId);

// Check if user has specific role
boolean isStaff = rbacService.hasRole(userId, "Staff");

// Check if user has any of the specified roles
boolean canAccess = rbacService.hasAnyRole(userId, "Borrower", "Customer");

// Check if user is a borrower (customer portal access)
boolean isBorrower = rbacService.isBorrower(userId);

// Get primary role
UserRole primaryRole = rbacService.getPrimaryRole(userId);

// ==================== PERMISSION CHECKS ====================

// Check if user has specific permission
boolean canCreateLoan = rbacService.hasPermission(userId, "loan:create");

// Check if user has any of the specified permissions
boolean canManage = rbacService.hasAnyPermission(userId, "loan:approve", "loan:reject");

// Check if user has all specified permissions
boolean isFullAccess = rbacService.hasAllPermissions(userId, "loan:read", "loan:create");

// Get all user permissions
List<String> permissions = rbacService.getUserPermissions(userId);

// ==================== ROLE MANAGEMENT ====================

// Assign role to user
rbacService.assignRole(userId, roleId, assignedByUserId, isPrimary);

// Remove role from user
rbacService.removeRole(userId, roleId);

// ==================== PERMISSION MANAGEMENT ====================

// Grant permission to role
rbacService.grantPermissionToRole(roleId, permissionId, grantedByUserId);

// Revoke permission from role
rbacService.revokePermissionFromRole(roleId, permissionId);
```

---

## Controller Implementation

### Protecting Endpoints

```java
@Path("/v1/customer/loans")
public class CustomerLoansController {

    @EJB
    private RBACService rbacService;
    
    @EJB
    private CustomerAuthService authService;

    @POST
    @Path("/apply")
    public Response applyForLoan(@HeaderParam("Authorization") String authHeader, String body) {
        // 1. Validate session
        String token = extractToken(authHeader);
        Optional<CustomerSession> sessionOpt = authService.validateSession(token);
        
        if (sessionOpt.isEmpty()) {
            return Response.status(401).entity("Unauthorized").build();
        }
        
        Integer userId = sessionOpt.get().getUserId();
        
        // 2. Check permission
        if (!rbacService.hasPermission(userId, "loan:create")) {
            return Response.status(403).entity("Permission denied: loan:create required").build();
        }
        
        // 3. Process request
        // ...
    }
    
    @GET
    @Path("/all")
    public Response getAllLoans(@HeaderParam("Authorization") String authHeader) {
        // Only users with loan:read (not loan:read_own) can see all loans
        if (!rbacService.hasPermission(userId, "loan:read")) {
            return Response.status(403).entity("Permission denied").build();
        }
        // ...
    }
}
```

### Data Filtering Pattern

For `*_own` permissions, filter data by user:

```java
@GET
@Path("/my-loans")
public Response getMyLoans(@HeaderParam("Authorization") String authHeader) {
    Integer userId = getCurrentUserId(authHeader);
    
    // User with loan:read_own can only see their own loans
    if (rbacService.hasPermission(userId, "loan:read")) {
        // Can see all loans
        return getAllLoans();
    } else if (rbacService.hasPermission(userId, "loan:read_own")) {
        // Can only see own loans - filter by userId
        return getLoansByUserId(userId);
    } else {
        return Response.status(403).build();
    }
}
```

---

## Frontend Implementation

### Storing Permissions

After login, store user permissions in auth store:

```typescript
// src/store/authStore.ts
interface AuthState {
  user: User | null;
  token: string | null;
  roles: string[];
  permissions: string[];
}

// After login, fetch permissions
const fetchPermissions = async (userId: number) => {
  const response = await api.get(`/v1/auth/permissions/${userId}`);
  return response.data.permissions;
};
```

### Permission Checking in Components

```tsx
// src/hooks/usePermission.ts
export function usePermission(permission: string): boolean {
  const { permissions } = useAuthStore();
  return permissions.includes(permission);
}

export function useAnyPermission(...perms: string[]): boolean {
  const { permissions } = useAuthStore();
  return perms.some(p => permissions.includes(p));
}

// Usage in component
function LoanActions() {
  const canCreate = usePermission('loan:create');
  const canApprove = usePermission('loan:approve');
  
  return (
    <div>
      {canCreate && <button>Apply for Loan</button>}
      {canApprove && <button>Approve</button>}
    </div>
  );
}
```

### Protected Routes

```tsx
// src/components/ProtectedRoute.tsx
function ProtectedRoute({ 
  permission, 
  children 
}: { 
  permission: string; 
  children: React.ReactNode 
}) {
  const hasPermission = usePermission(permission);
  
  if (!hasPermission) {
    return <Navigate to="/unauthorized" />;
  }
  
  return <>{children}</>;
}

// Usage
<Route 
  path="/loans/apply" 
  element={
    <ProtectedRoute permission="loan:create">
      <LoanApplicationPage />
    </ProtectedRoute>
  } 
/>
```

---

## Database Views

### v_user_permissions

Quick lookup of all user permissions:

```sql
SELECT * FROM v_user_permissions WHERE user_login_id = 123;

-- Returns:
-- user_login_id | username | role_id | role_name | permission_id | permission_code | module
-- 123           | john@... | 5       | Borrower  | 1             | loan:read_own   | loan
-- 123           | john@... | 5       | Borrower  | 3             | loan:create     | loan
```

### v_user_roles

Quick lookup of user roles:

```sql
SELECT * FROM v_user_roles WHERE user_login_id = 123;

-- Returns:
-- user_login_id | username | role_id | role_name | is_primary | assigned_at
-- 123           | john@... | 5       | Borrower  | 1          | 2026-02-08
-- 123           | john@... | 2       | Staff     | 0          | 2026-02-08
```

---

## Migration

### Running the Migration

```bash
# Apply RBAC migration
mysql -u root -p temco_system < V2024_02_08__RBAC_Complete_System.sql
```

### Migrating Existing Users

The migration script automatically copies existing `user_role_id` values to `user_login_has_role`:

```sql
-- Already included in migration
INSERT IGNORE INTO user_login_has_role (user_login_id, user_role_id, is_primary)
SELECT id, user_role_id, 1 FROM user_login WHERE user_role_id IS NOT NULL;
```

---

## Best Practices

### 1. Always Check Permissions Server-Side

Frontend checks are for UX only. **Always validate on the backend**:

```java
// ❌ Bad - relies on frontend
@POST
public Response createLoan(LoanRequest request) {
    return processLoan(request);
}

// ✅ Good - server-side validation
@POST  
public Response createLoan(@HeaderParam("Authorization") String auth, LoanRequest request) {
    if (!rbacService.hasPermission(getUserId(auth), "loan:create")) {
        return Response.status(403).build();
    }
    return processLoan(request);
}
```

### 2. Use Specific Permissions Over Role Checks

```java
// ❌ Bad - checking role directly
if (rbacService.hasRole(userId, "Manager")) {
    approveLoan();
}

// ✅ Good - checking permission
if (rbacService.hasPermission(userId, "loan:approve")) {
    approveLoan();
}
```

### 3. Filter Data for `*_own` Permissions

```java
// ✅ Always filter by userId for own permissions
if (rbacService.hasPermission(userId, "loan:read_own") && 
    !rbacService.hasPermission(userId, "loan:read")) {
    // Must filter to only show user's loans
    query.setParameter("ownerId", userId);
}
```

### 4. Audit Permission Changes

```java
// Log all role/permission changes
rbacService.assignRole(userId, roleId, currentUserId, isPrimary);
auditService.log("ROLE_ASSIGNED", "User " + userId + " assigned role " + roleId);
```

---

## Troubleshooting

### User Can't Access Customer Portal

1. Check if user has `Borrower` or `Customer` role:
   ```sql
   SELECT * FROM v_user_roles WHERE user_login_id = ?;
   ```

2. Check if role assignment is active:
   ```sql
   SELECT * FROM user_login_has_role WHERE user_login_id = ? AND is_active = 1;
   ```

### Permission Denied Errors

1. Check user's permissions:
   ```sql
   SELECT * FROM v_user_permissions WHERE user_login_id = ?;
   ```

2. Check if permission exists and is active:
   ```sql
   SELECT * FROM permission WHERE code = 'loan:create' AND is_active = 1;
   ```

3. Check if role has the permission:
   ```sql
   SELECT * FROM user_role_has_permission 
   WHERE user_role_id = ? AND permission_id = ?;
   ```

---

## Related Documentation

- [SSO Implementation Guide](../../docs/SSO_IMPLEMENTATION.md)
- [Lending Migration Plan](../../docs/lending-migration-plan.md)
- [API Documentation](./API_DOCUMENTATION.md)
