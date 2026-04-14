# Core Module

**Purpose**: Infrastructure and configuration shared across the entire application.

**Naming Pattern**:
- Folders: `kebab-case`
- Files: 
  - API client: `camelCase.js`
  - Config: `UPPER_SNAKE_CASE.js` for constants
  - Styles: `kebab-case.css`

**Structure**:
- `api/` - Axios client with interceptors
- `config/` - Environment configuration and constants
- `styles/` - Global CSS variables and base styles

**Import Pattern**:
```javascript
import { apiClient } from '../core/api';
import { API_ENDPOINTS } from '../core/config';
```
