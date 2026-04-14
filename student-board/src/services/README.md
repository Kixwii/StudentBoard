# Services Module

**Purpose**: API service modules organized by domain.

**Naming Pattern**:
- Files: `kebab-case.js` (e.g., `guardian-service.js`)
- Exports: `camelCase` objects/functions
- Tests: `*.test.js`

**Pattern**: Each service exports an object with domain methods

**Available Services**:
- `guardian-service` - Guardian/parent operations
- `student-service` - Student operations
- `fee-service` - Fee and payment operations
- `document-service` - Document operations
- `mock-data-service` - LocalStorage mock data for offline mode

**Import Pattern**:
```javascript
import { guardianService, feeService } from '../services';
```
