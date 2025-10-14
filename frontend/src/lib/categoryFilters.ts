// This integrates with categoryFields.ts to ensure filters match what users can specify when creating listings
// Instead of hardcoding filters, we convert the existing CategoryField definitions into CategoryFilter format

import { categoryFields, CategoryField, hasSubSubcategoryFields } from './categoryFields'

export interface FilterOption {
  label: string
  value: string
}

export interface CategoryFilter {
  name: string
  label: string
  type: 'checkbox' | 'radio' | 'range' | 'select'
  options?: FilterOption[]
  fieldName: string  // Used to match against listing.categorySpecificFields
}

// Convert a CategoryField to a CategoryFilter (only for select/multiselect types)
function convertFieldToFilter(field: CategoryField): CategoryFilter | null {
  // Skip boolean fields - they don't work well as sidebar filters
  if (field.type === 'boolean') {
    return null
  }
  
  // Only create filters for fields with predefined options
  if (field.type === 'select' || field.type === 'multiselect') {
    return {
      name: field.name,
      label: field.label,
      fieldName: field.name,
      type: field.type === 'select' ? 'radio' : 'checkbox',  // select = single choice, multiselect = multiple
      options: field.options?.map(opt => ({
        label: opt,
        value: opt
      })) || []
    }
  }
  
  // Skip text and number fields - they don't work well as sidebar filters
  return null
}

/**
 * Get filters for a specific category/subcategory/sub-subcategory combination.
 * Uses smart hierarchy fallback:
 * - If sub-subcategory is specified: use its exact fields
 * - If only subcategory is specified: aggregate all fields from its sub-subcategories
 * - If only category is specified: aggregate all fields from entire category tree
 */
export function getFiltersForCategory(
  category?: string | null,
  subcategory?: string | null, 
  subSubcategory?: string | null
): CategoryFilter[] {
  if (!category) return []
  
  const categoryData = categoryFields[category]
  if (!categoryData) return []
  
  let fields: CategoryField[] = []
  
  if (subcategory && categoryData[subcategory]) {
    const subcategoryData = categoryData[subcategory]
    
    // Check if this subcategory has sub-subcategories
    if (hasSubSubcategoryFields(subcategoryData)) {
      if (subSubcategory && subcategoryData[subSubcategory]) {
        // Most specific: use exact sub-subcategory fields
        fields = subcategoryData[subSubcategory]
      } else {
        // Aggregate all fields from all sub-subcategories, deduplicated by field name
        const allFields: CategoryField[] = []
        Object.values(subcategoryData).forEach(subSubFields => {
          if (Array.isArray(subSubFields)) {
            allFields.push(...subSubFields)
          }
        })
        
        // Deduplicate by field name (first occurrence wins)
        const uniqueFields = new Map<string, CategoryField>()
        allFields.forEach(field => {
          if (!uniqueFields.has(field.name)) {
            uniqueFields.set(field.name, field)
          }
        })
        fields = Array.from(uniqueFields.values())
      }
    } else {
      // This subcategory has direct fields (no sub-subcategories)
      fields = subcategoryData as CategoryField[]
    }
  } else {
    // No subcategory specified: aggregate from entire category
    const allFields: CategoryField[] = []
    Object.values(categoryData).forEach(subcatData => {
      if (Array.isArray(subcatData)) {
        allFields.push(...subcatData)
      } else if (typeof subcatData === 'object') {
        // Has sub-subcategories
        Object.values(subcatData).forEach(subSubFields => {
          if (Array.isArray(subSubFields)) {
            allFields.push(...subSubFields)
          }
        })
      }
    })
    
    // Deduplicate by field name
    const uniqueFields = new Map<string, CategoryField>()
    allFields.forEach(field => {
      if (!uniqueFields.has(field.name)) {
        uniqueFields.set(field.name, field)
      }
    })
    fields = Array.from(uniqueFields.values())
  }
  
  // Convert CategoryFields to CategoryFilters, filtering out nulls (text/number/boolean fields)
  return fields
    .map(convertFieldToFilter)
    .filter((f): f is CategoryFilter => f !== null)
}

// Helper function to format attribute names for display
export function formatAttributeName(name: string): string {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}
