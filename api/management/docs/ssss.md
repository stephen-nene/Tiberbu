Here's a comprehensive ViewSet for the `Specialization` model with all CRUD operations and additional useful endpoints:

### Key Features of this Implementation:

1. **Complete CRUD Operations**:
   - Create, Retrieve, Update, Delete (soft delete)
   - List view with filtering capabilities

2. **Custom Endpoints**:
   - `/specializations/departments/` - List all departments
   - `/specializations/surgical/` - Only surgical specialties
   - `/specializations/primary_care/` - Only primary care specialties
   - `/specializations/{slug}/toggle_active/` - Toggle active status

3. **Filtering Options**:
   - By department: `?department=Cardiology`
   - By surgical status: `?is_surgical=true`
   - By primary care status: `?is_primary_care=false`

4. **Security & Permissions**:
   - Read access for everyone
   - Write operations require authentication
   - Soft delete instead of hard delete

5. **Best Practices**:
   - Slug-based lookup
   - Active records filtering by default
   - Proper ordering (display_order)
   - Automatic slug generation on create

### Example Requests:

1. **List all active specializations**:
   ```
   GET /api/specializations/
   ```

2. **Get surgical specializations**:
   ```
   GET /api/specializations/surgical/
   ```

3. **Toggle active status**:
   ```
   POST /api/specializations/cardiology/toggle_active/
   ```

4. **Filter by department**:
   ```
   GET /api/specializations/?department=Pediatrics
   ```

This implementation provides a robust API for managing medical specializations in your hospital management system while following RESTful conventions and Django best practices.