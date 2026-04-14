# Shared Module

**Purpose**: Reusable components, hooks, and utilities used across multiple features.

**Naming Pattern**:
- Components: `PascalCase.jsx`
- Hooks: `camelCase.js` starting with `use`
- Utils: `camelCase.js`
- Tests: `*.test.jsx` / `*.test.js`

**Structure**:
- `components/` - Shared UI components (ProfilePhotoModal, etc.)
- `hooks/` - Shared hooks (useProfilePhoto, etc.)
- `utils/` - Helper functions

**Rule**: If used by 2+ features, it belongs here.

**Import Pattern**:
```javascript
import { ProfilePhotoModal } from '../shared/components';
import { useProfilePhoto } from '../shared/hooks';
```
