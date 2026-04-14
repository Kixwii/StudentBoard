# Auth Module

**Purpose**: Authentication feature - login, logout, auth state.

**Naming Pattern**:
- Components: `PascalCase.jsx`
- Hooks: `camelCase.js` starting with `use`
- Tests: `*.test.jsx`

**Structure**:
- `components/` - Login form UI
- `hooks/` - Auth-related hooks

**Import Pattern**:
```javascript
import { Login } from '../auth/components';
```
