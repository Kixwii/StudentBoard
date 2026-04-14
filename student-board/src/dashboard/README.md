# Dashboard Module

**Purpose**: Dashboard views for different user roles (parent, teacher).

**Naming Pattern**:
- Components: `PascalCase.jsx`
- Shared: Place in `shared/` subfolder
- Tests: `*.test.jsx`

**Structure**:
- `parent/` - Parent dashboard components
- `teacher/` - Teacher dashboard components
- `shared/` - Dashboard components used by both

**Import Pattern**:
```javascript
import { ParentDashboard } from '../dashboard/parent/components';
import { TeacherDashboard } from '../dashboard/teacher/components';
```
