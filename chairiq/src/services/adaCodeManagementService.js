import { supabase } from '../lib/supabase';

/**
 * ADA Code Management Service
 * Handles CRUD operations for ADA codes and canonical procedure mappings
 */

/**
 * Fetch all ADA codes with their canonical procedure mappings
 */
export const getAllAdaCodes = async (filters = {}) => {
  try {
    let query = supabase?.from('ada_codes')?.select(`
        code,
        description,
        canonical_slug,
        is_active,
        created_at,
        updated_at,
        canonical_procedures!inner (
          slug,
          display_name_en,
          display_name_es,
          category
        )
      `)?.order('code', { ascending: true });

    // Apply filters
    if (filters?.searchTerm) {
      query = query?.or(`code.ilike.%${filters?.searchTerm}%,description.ilike.%${filters?.searchTerm}%`);
    }

    if (filters?.category) {
      query = query?.eq('canonical_procedures.category', filters?.category);
    }

    if (filters?.mappingStatus === 'mapped') {
      query = query?.not('canonical_slug', 'is', null);
    } else if (filters?.mappingStatus === 'unmapped') {
      query = query?.is('canonical_slug', null);
    }

    if (filters?.activeStatus !== undefined) {
      query = query?.eq('is_active', filters?.activeStatus);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching ADA codes:', error);
    return { success: false, error: error?.message };
  }
};

/**
 * Fetch all canonical procedures for mapping dropdown
 */
export const getCanonicalProcedures = async () => {
  try {
    const { data, error } = await supabase?.from('canonical_procedures')?.select('slug, display_name_en, display_name_es, category')?.order('display_name_en', { ascending: true });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching canonical procedures:', error);
    return { success: false, error: error?.message };
  }
};

/**
 * Update ADA code mapping to canonical procedure
 */
export const updateAdaCodeMapping = async (code, canonicalSlug) => {
  try {
    const { data, error } = await supabase?.from('ada_codes')?.update({ 
        canonical_slug: canonicalSlug,
        updated_at: new Date()?.toISOString()
      })?.eq('code', code)?.select();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error updating ADA code mapping:', error);
    return { success: false, error: error?.message };
  }
};

/**
 * Create new ADA code
 */
export const createAdaCode = async (adaCodeData) => {
  try {
    const { data, error } = await supabase?.from('ada_codes')?.insert([{
        code: adaCodeData?.code,
        description: adaCodeData?.description,
        canonical_slug: adaCodeData?.canonicalSlug || null,
        is_active: adaCodeData?.isActive !== undefined ? adaCodeData?.isActive : true
      }])?.select();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error creating ADA code:', error);
    return { success: false, error: error?.message };
  }
};

/**
 * Update ADA code details
 */
export const updateAdaCode = async (code, updates) => {
  try {
    const updateData = {
      updated_at: new Date()?.toISOString()
    };

    if (updates?.description !== undefined) updateData.description = updates?.description;
    if (updates?.canonicalSlug !== undefined) updateData.canonical_slug = updates?.canonicalSlug;
    if (updates?.isActive !== undefined) updateData.is_active = updates?.isActive;

    const { data, error } = await supabase?.from('ada_codes')?.update(updateData)?.eq('code', code)?.select();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error updating ADA code:', error);
    return { success: false, error: error?.message };
  }
};

/**
 * Delete ADA code
 */
export const deleteAdaCode = async (code) => {
  try {
    const { data, error } = await supabase?.from('ada_codes')?.delete()?.eq('code', code)?.select();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error deleting ADA code:', error);
    return { success: false, error: error?.message };
  }
};

/**
 * Bulk update ADA code mappings
 */
export const bulkUpdateAdaCodeMappings = async (mappings) => {
  try {
    const results = [];
    
    for (const mapping of mappings) {
      const { data, error } = await supabase?.from('ada_codes')?.update({ 
          canonical_slug: mapping?.canonicalSlug,
          updated_at: new Date()?.toISOString()
        })?.eq('code', mapping?.code)?.select();

      if (error) {
        results?.push({ code: mapping?.code, success: false, error: error?.message });
      } else {
        results?.push({ code: mapping?.code, success: true, data });
      }
    }

    const successCount = results?.filter(r => r?.success)?.length;
    const failCount = results?.filter(r => !r?.success)?.length;

    return { 
      success: true, 
      results,
      summary: { total: mappings?.length, success: successCount, failed: failCount }
    };
  } catch (error) {
    console.error('Error bulk updating ADA codes:', error);
    return { success: false, error: error?.message };
  }
};

/**
 * Export ADA codes to CSV format
 */
export const exportAdaCodesToCSV = async (filters = {}) => {
  try {
    const result = await getAllAdaCodes(filters);
    
    if (!result?.success) {
      throw new Error(result.error);
    }

    const adaCodes = result?.data;

    // CSV header
    const headers = ['Code', 'Description', 'Canonical Slug', 'Canonical Procedure (EN)', 'Category', 'Is Active'];
    
    // CSV rows
    const rows = adaCodes?.map(code => [
      code?.code,
      code?.description,
      code?.canonical_slug || '',
      code?.canonical_procedures?.display_name_en || '',
      code?.canonical_procedures?.category || '',
      code?.is_active ? 'Yes' : 'No'
    ]);

    // Convert to CSV string
    const csvContent = [
      headers?.join(','),
      ...rows?.map(row => row?.map(cell => `"${cell}"`)?.join(','))
    ]?.join('\n');

    return { success: true, csvContent, rowCount: rows?.length };
  } catch (error) {
    console.error('Error exporting ADA codes:', error);
    return { success: false, error: error?.message };
  }
};

/**
 * Parse CSV file and validate data
 */
export const parseCSVFile = (csvText) => {
  try {
    const lines = csvText?.split('\n')?.filter(line => line?.trim());
    
    if (lines?.length < 2) {
      return { success: false, error: 'CSV file is empty or invalid' };
    }

    // Parse header
    const headers = lines?.[0]?.split(',')?.map(h => h?.replace(/"/g, '')?.trim());
    
    // Validate required columns
    const requiredColumns = ['Code', 'Description', 'Canonical Slug'];
    const missingColumns = requiredColumns?.filter(col => !headers?.includes(col));
    
    if (missingColumns?.length > 0) {
      return { 
        success: false, 
        error: `Missing required columns: ${missingColumns?.join(', ')}` 
      };
    }

    // Parse data rows
    const data = [];
    const errors = [];

    for (let i = 1; i < lines?.length; i++) {
      const values = lines?.[i]?.split(',')?.map(v => v?.replace(/"/g, '')?.trim());
      
      const row = {
        code: values?.[headers?.indexOf('Code')],
        description: values?.[headers?.indexOf('Description')],
        canonicalSlug: values?.[headers?.indexOf('Canonical Slug')] || null,
        isActive: headers?.includes('Is Active') 
          ? values?.[headers?.indexOf('Is Active')]?.toLowerCase() === 'yes' 
          : true
      };

      // Validate row data
      if (!row?.code || !row?.description) {
        errors?.push({ row: i + 1, error: 'Missing required fields (Code or Description)' });
        continue;
      }

      data?.push(row);
    }

    return { 
      success: true, 
      data,
      errors,
      summary: { 
        total: lines?.length - 1, 
        valid: data?.length, 
        invalid: errors?.length 
      }
    };
  } catch (error) {
    console.error('Error parsing CSV:', error);
    return { success: false, error: error?.message };
  }
};

/**
 * Bulk import ADA codes from CSV data
 */
export const bulkImportAdaCodes = async (csvData) => {
  try {
    const results = [];
    
    for (const item of csvData) {
      // Check if code exists
      const { data: existing } = await supabase?.from('ada_codes')?.select('code')?.eq('code', item?.code)?.single();

      if (existing) {
        // Update existing
        const result = await updateAdaCode(item?.code, {
          description: item?.description,
          canonicalSlug: item?.canonicalSlug,
          isActive: item?.isActive
        });
        results?.push({ code: item?.code, action: 'updated', ...result });
      } else {
        // Create new
        const result = await createAdaCode(item);
        results?.push({ code: item?.code, action: 'created', ...result });
      }
    }

    const successCount = results?.filter(r => r?.success)?.length;
    const failCount = results?.filter(r => !r?.success)?.length;

    return { 
      success: true, 
      results,
      summary: { total: csvData?.length, success: successCount, failed: failCount }
    };
  } catch (error) {
    console.error('Error bulk importing ADA codes:', error);
    return { success: false, error: error?.message };
  }
};

/**
 * Get mapping statistics
 */
export const getMappingStatistics = async () => {
  try {
    const { data: allCodes, error: allError } = await supabase?.from('ada_codes')?.select('code, canonical_slug, is_active');

    if (allError) throw allError;

    const total = allCodes?.length;
    const mapped = allCodes?.filter(c => c?.canonical_slug)?.length;
    const unmapped = total - mapped;
    const active = allCodes?.filter(c => c?.is_active)?.length;
    const inactive = total - active;

    return { 
      success: true, 
      stats: { 
        total, 
        mapped, 
        unmapped, 
        active, 
        inactive,
        mappingPercentage: total > 0 ? Math.round((mapped / total) * 100) : 0
      }
    };
  } catch (error) {
    console.error('Error fetching mapping statistics:', error);
    return { success: false, error: error?.message };
  }
};

/**
 * Run comprehensive bulk audit checks
 * Detects unmapped ADA codes, procedures missing visuals, 
 * incomplete bilingual content, and canonical-to-procedure conflicts
 */
export const runBulkAuditChecks = async () => {
  try {
    // Fetch all required data
    const [adaCodesResult, canonicalResult, procedureLibResult, visualsResult] = await Promise.all([
      supabase?.from('ada_codes')?.select('code, description, canonical_slug, is_active'),
      supabase?.from('canonical_procedures')?.select('slug, display_name_en, display_name_es, category'),
      supabase?.from('procedure_library')?.select('canonical_slug, title_en, title_es, summary_en, summary_es, why_en, why_es, risks_en, risks_es, aftercare_en, aftercare_es, is_published'),
      supabase?.from('procedure_visuals')?.select('canonical_slug, image_url')
    ]);

    if (adaCodesResult?.error) throw adaCodesResult?.error;
    if (canonicalResult?.error) throw canonicalResult?.error;
    if (procedureLibResult?.error) throw procedureLibResult?.error;
    if (visualsResult?.error) throw visualsResult?.error;

    const adaCodes = adaCodesResult?.data || [];
    const canonicalProcedures = canonicalResult?.data || [];
    const procedureLibrary = procedureLibResult?.data || [];
    const procedureVisuals = visualsResult?.data || [];

    // Audit 1: Detect unmapped ADA codes
    const unmappedAdaCodes = adaCodes?.filter(code => !code?.canonical_slug && code?.is_active)?.map(code => ({
      code: code?.code,
      description: code?.description,
      issue: 'No canonical mapping',
      severity: 'warning'
    }));

    // Audit 2: Flag procedures missing visuals
    const visualsByCanonical = procedureVisuals?.reduce((acc, visual) => {
      if (!acc?.[visual?.canonical_slug]) {
        acc[visual?.canonical_slug] = [];
      }
      acc?.[visual?.canonical_slug]?.push(visual);
      return acc;
    }, {});

    const proceduresMissingVisuals = canonicalProcedures?.filter(proc => !visualsByCanonical?.[proc?.slug] || visualsByCanonical?.[proc?.slug]?.length === 0)?.map(proc => ({
      slug: proc?.slug,
      display_name: proc?.display_name_en,
      category: proc?.category,
      issue: 'No visual assets found',
      severity: 'error'
    }));

    // Audit 3: Highlight incomplete bilingual content
    const incompleteBilingualContent = procedureLibrary?.filter(proc => {
      const missingFields = [];
      
      if (!proc?.title_en || !proc?.title_es) missingFields?.push('title');
      if (!proc?.summary_en || !proc?.summary_es) missingFields?.push('summary');
      if (!proc?.why_en || !proc?.why_es) missingFields?.push('why');
      if (!proc?.risks_en || !proc?.risks_es) missingFields?.push('risks');
      if (!proc?.aftercare_en || !proc?.aftercare_es) missingFields?.push('aftercare');

      return missingFields?.length > 0;
    })?.map(proc => {
      const missingFields = [];
      
      if (!proc?.title_en || !proc?.title_es) missingFields?.push('title');
      if (!proc?.summary_en || !proc?.summary_es) missingFields?.push('summary');
      if (!proc?.why_en || !proc?.why_es) missingFields?.push('why');
      if (!proc?.risks_en || !proc?.risks_es) missingFields?.push('risks');
      if (!proc?.aftercare_en || !proc?.aftercare_es) missingFields?.push('aftercare');

      return {
        canonical_slug: proc?.canonical_slug,
        missing_fields: missingFields,
        issue: `Missing translations: ${missingFields?.join(', ')}`,
        severity: 'warning'
      };
    });

    // Audit 4: Identify canonical-to-procedure conflicts
    const procedureLibraryByCanonical = procedureLibrary?.reduce((acc, proc) => {
      if (proc?.canonical_slug) {
        acc[proc?.canonical_slug] = proc;
      }
      return acc;
    }, {});

    const canonicalConflicts = canonicalProcedures?.filter(canonical => {
      const hasAdaCodes = adaCodes?.some(code => code?.canonical_slug === canonical?.slug);
      const hasProcedureLibEntry = procedureLibraryByCanonical?.[canonical?.slug];
      
      return hasAdaCodes && !hasProcedureLibEntry;
    })?.map(canonical => ({
      slug: canonical?.slug,
      display_name: canonical?.display_name_en,
      category: canonical?.category,
      issue: 'ADA codes mapped to canonical but no procedure library entry exists',
      severity: 'error',
      affected_ada_codes: adaCodes?.filter(code => code?.canonical_slug === canonical?.slug)?.map(c => c?.code)
    }));

    // Additional check: Unpublished procedures with mappings
    const unpublishedWithMappings = procedureLibrary?.filter(proc => {
      const hasAdaCodes = adaCodes?.some(code => code?.canonical_slug === proc?.canonical_slug);
      return !proc?.is_published && hasAdaCodes;
    })?.map(proc => ({
      canonical_slug: proc?.canonical_slug,
      issue: 'Procedure is unpublished but has ADA code mappings',
      severity: 'warning',
      affected_ada_codes: adaCodes?.filter(code => code?.canonical_slug === proc?.canonical_slug)?.map(c => c?.code)
    }));

    // Compile summary statistics
    const summary = {
      total_ada_codes: adaCodes?.length,
      unmapped_ada_codes: unmappedAdaCodes?.length,
      procedures_missing_visuals: proceduresMissingVisuals?.length,
      incomplete_bilingual_content: incompleteBilingualContent?.length,
      canonical_conflicts: canonicalConflicts?.length,
      unpublished_with_mappings: unpublishedWithMappings?.length,
      total_issues: unmappedAdaCodes?.length + proceduresMissingVisuals?.length + incompleteBilingualContent?.length + canonicalConflicts?.length + unpublishedWithMappings?.length
    };

    return {
      success: true,
      summary,
      details: {
        unmapped_ada_codes: unmappedAdaCodes,
        procedures_missing_visuals: proceduresMissingVisuals,
        incomplete_bilingual_content: incompleteBilingualContent,
        canonical_conflicts: canonicalConflicts,
        unpublished_with_mappings: unpublishedWithMappings
      }
    };
  } catch (error) {
    console.error('Error running bulk audit checks:', error);
    return { success: false, error: error?.message };
  }
};

/**
 * Export audit results to CSV format
 */
export const exportAuditResultsToCSV = (auditData) => {
  try {
    if (!auditData?.details) {
      return { success: false, error: 'No audit data provided' };
    }

    const rows = [];

    // Add unmapped ADA codes
    auditData?.details?.unmapped_ada_codes?.forEach(item => {
      rows?.push([
        'Unmapped ADA Code',
        item?.code,
        item?.description,
        item?.issue,
        item?.severity,
        ''
      ]);
    });

    // Add procedures missing visuals
    auditData?.details?.procedures_missing_visuals?.forEach(item => {
      rows?.push([
        'Missing Visuals',
        item?.slug,
        item?.display_name,
        item?.issue,
        item?.severity,
        item?.category || ''
      ]);
    });

    // Add incomplete bilingual content
    auditData?.details?.incomplete_bilingual_content?.forEach(item => {
      rows?.push([
        'Incomplete Bilingual',
        item?.canonical_slug,
        item?.missing_fields?.join('; '),
        item?.issue,
        item?.severity,
        ''
      ]);
    });

    // Add canonical conflicts
    auditData?.details?.canonical_conflicts?.forEach(item => {
      rows?.push([
        'Canonical Conflict',
        item?.slug,
        item?.display_name,
        item?.issue,
        item?.severity,
        item?.affected_ada_codes?.join('; ') || ''
      ]);
    });

    // Add unpublished with mappings
    auditData?.details?.unpublished_with_mappings?.forEach(item => {
      rows?.push([
        'Unpublished with Mappings',
        item?.canonical_slug,
        '',
        item?.issue,
        item?.severity,
        item?.affected_ada_codes?.join('; ') || ''
      ]);
    });

    // CSV header
    const headers = ['Issue Type', 'Identifier', 'Details', 'Issue Description', 'Severity', 'Additional Info'];
    
    // Convert to CSV string
    const csvContent = [
      headers?.join(','),
      ...rows?.map(row => row?.map(cell => `"${cell}"`)?.join(','))
    ]?.join('\n');

    return { 
      success: true, 
      csvContent, 
      rowCount: rows?.length,
      summary: auditData?.summary
    };
  } catch (error) {
    console.error('Error exporting audit results:', error);
    return { success: false, error: error?.message };
  }
};