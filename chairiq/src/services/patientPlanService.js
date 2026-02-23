import { supabase } from '../lib/supabase';
import { twilioService } from './twilioService';
import { procedureEducationGeneratorService } from './procedureEducationGeneratorService';
import { normalizeProcedureKey } from '../utils/procedureNormalization';
import proceduresLibrary from '../data/procedures';

const DENTAL_SYNONYMS = {
  clean: ['cleaning', 'clean', 'remove', 'removing'],
  canal: ['canal', 'canals', 'root'],
  seal: ['seal', 'sealing', 'sealed', 'obturation', 'obturat', 'fill', 'filling', 'filled'],
  crown: ['crown', 'cap', 'restoration'],
  placement: ['placement', 'place', 'placing', 'cemented', 'cement'],
  build: ['build', 'buildup', 'core', 'reconstruct', 'reconstruction'],
  access: ['access', 'opening', 'open', 'entry'],
  prep: ['preparation', 'prepare', 'prepared', 'prep', 'reshape', 'reshaped'],
  impression: ['impression', 'impressions', 'scan', 'scanning', 'mold', 'molds'],
  temp: ['temporary', 'temp', 'interim', 'provisional'],
  lab: ['lab', 'laboratory', 'fabrication', 'fabricate', 'crafted'],
  numb: ['numb', 'numbing', 'anesthesia', 'anesthetic', 'anestesia'],
  decay: ['decay', 'decayed', 'cavity', 'caries', 'carious'],
  polish: ['polish', 'polishing', 'shape', 'shaping', 'contour'],
  bite: ['bite', 'occlusion', 'occlusal', 'check'],
  assess: ['assessment', 'assess', 'evaluate', 'evaluation', 'measure', 'probe'],
  scale: ['scaling', 'scale', 'deep', 'scrape'],
  planing: ['planing', 'plane', 'smooth', 'smoothing', 'root'],
  rinse: ['rinse', 'antimicrobial', 'medicated', 'mouthwash'],
  extract: ['extract', 'extraction', 'remove', 'pull', 'loosen'],
  suture: ['suture', 'stitch', 'close', 'closure'],
  bridge: ['bridge', 'pontic', 'span'],
  support: ['support', 'supporting', 'abutment', 'anchor'],
};

function getWordSet(title) {
  return (title || '').toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(w => w.length > 2);
}

function expandWithSynonyms(words) {
  const expanded = new Set(words);
  for (const word of words) {
    for (const [, synonyms] of Object.entries(DENTAL_SYNONYMS)) {
      if (synonyms.some(s => s === word || word.includes(s) || s.includes(word))) {
        synonyms.forEach(s => expanded.add(s));
      }
    }
  }
  return expanded;
}

function titleMatchScore(aiTitle, visualTitle) {
  const aiWords = getWordSet(aiTitle);
  const visualWords = getWordSet(visualTitle);
  if (aiWords.length === 0 || visualWords.length === 0) return 0;

  const aiExpanded = expandWithSynonyms(aiWords);
  const visualExpanded = expandWithSynonyms(visualWords);

  let score = 0;
  for (const w of aiExpanded) {
    if (visualExpanded.has(w)) score++;
  }
  return score;
}

function buildVisualTitleMap(procedureId) {
  const proc = proceduresLibrary?.find(p => p?.id === procedureId);
  if (!proc?.visualGuideSteps?.length) return null;
  const map = {};
  proc.visualGuideSteps.forEach((step, idx) => {
    map[`step_${idx + 1}`] = {
      titleEn: step?.title_en || '',
      titleEs: step?.title_es || '',
    };
  });
  return map;
}

/**
 * Patient Plan Service - Handles all patient plan CRUD operations
 * Manages patients, treatment plans, and procedures with proper case conversion
 */

export const patientPlanService = {
  /**
   * Create new patient with treatment plan and procedures
   * @param {Object} patientData - Patient information
   * @param {Object} planData - Treatment plan information
   * @param {Array} procedures - List of procedures
   * @returns {Promise<Object>} Created plan with public token
   */
  async createPatientPlan(patientData, planData, procedures) {
    try {
      // Step 1: Check if patient exists by phone, if not create new patient
      let patient;
      
      // First, try to find existing patient by phone - use maybeSingle() to handle 0 rows
      const { data: existingPatient, error: findError } = await supabase
        ?.from('patients')
        ?.select('*')
        ?.eq('phone', patientData?.phone)
        ?.maybeSingle();

      if (findError) {
        if (import.meta.env?.DEV) {
          console.error('🔍 [DEV] Error finding patient by phone:', findError);
        }
        throw findError;
      }

      if (existingPatient) {
        // Update existing patient - use maybeSingle() for safety
        const { data: updatedPatient, error: updateError } = await supabase
          ?.from('patients')
          ?.update({
            first_name: patientData?.firstName,
            last_name: patientData?.lastName,
            preferred_language: patientData?.preferredLanguage
          })
          ?.eq('id', existingPatient?.id)
          ?.select()
          ?.maybeSingle();

        if (updateError) {
          if (import.meta.env?.DEV) {
            console.error('🔍 [DEV] Error updating patient:', updateError);
          }
          throw updateError;
        }
        patient = updatedPatient;
      } else {
        // Create new patient - use maybeSingle() for consistency
        const { data: newPatient, error: createError } = await supabase
          ?.from('patients')
          ?.insert({
            first_name: patientData?.firstName,
            last_name: patientData?.lastName,
            phone: patientData?.phone,
            preferred_language: patientData?.preferredLanguage
          })
          ?.select()
          ?.maybeSingle();

        if (createError) {
          if (import.meta.env?.DEV) {
            console.error('🔍 [DEV] Error creating patient:', createError);
          }
          throw createError;
        }
        patient = newPatient;
      }

      // Step 2: Create treatment plan - use maybeSingle() for resilience
      const { data: treatmentPlan, error: planError } = await supabase
        ?.from('treatment_plans')
        ?.insert({
          patient_id: patient?.id,
          dentist_name: planData?.dentistName,
          practice_name: planData?.practiceName
        })
        ?.select()
        ?.maybeSingle();

      if (planError) {
        if (import.meta.env?.DEV) {
          console.error('🔍 [DEV] Error creating treatment plan:', planError);
        }
        throw planError;
      }

      // Step 3: Resolve canonical slugs for procedures before inserting
      const proceduresWithCanonicalSlug = await Promise.all(
        procedures?.map(async (proc, index) => {
          let canonicalSlug = null;

          // Priority 1: If procedureSlug exists, fetch canonical_slug from procedure_library
          if (proc?.procedureSlug) {
            const { data: library, error: libraryError } = await supabase
              ?.from('procedure_library')
              ?.select('canonical_slug')
              ?.eq('slug', proc?.procedureSlug)
              ?.maybeSingle();
            
            if (libraryError && import.meta.env?.DEV) {
              console.error('🔍 [DEV] Error fetching library canonical_slug:', libraryError);
            }
            
            canonicalSlug = library?.canonical_slug || proc?.procedureSlug;
          }

          // Priority 2: If adaCode exists and no canonical_slug yet, fetch from ada_codes table
          if (!canonicalSlug && proc?.adaCode) {
            const { data: adaCode, error: adaError } = await supabase
              ?.from('ada_codes')
              ?.select('canonical_slug')
              ?.eq('code', proc?.adaCode)
              ?.maybeSingle();
            
            if (adaError && import.meta.env?.DEV) {
              console.error('🔍 [DEV] Error fetching ada_code canonical_slug:', adaError);
            }
            
            canonicalSlug = adaCode?.canonical_slug;
          }

          // Return procedure with canonical_slug resolved
          return {
            treatment_plan_id: treatmentPlan?.id,
            procedure_name: proc?.procedureName || proc?.displayTitle,
            procedure_slug: proc?.procedureSlug || null,
            display_title: proc?.displayTitle || null,
            ada_code: proc?.adaCode || null,
            canonical_slug: canonicalSlug,
            tooth_numbers: proc?.toothNumbers || null,
            priority: proc?.priority,
            est_time: proc?.estTime,
            notes_for_patient: proc?.notesForPatient,
            sort_order: index
          };
        })
      );

      const { data: proceduresResult, error: proceduresError } = await supabase
        ?.from('plan_procedures')
        ?.insert(proceduresWithCanonicalSlug)
        ?.select();

      if (proceduresError) {
        if (import.meta.env?.DEV) {
          console.error('🔍 [DEV] Error inserting procedures:', proceduresError);
        }
        throw proceduresError;
      }

      // Return complete plan data with camelCase conversion
      return {
        patient: {
          id: patient?.id,
          firstName: patient?.first_name,
          lastName: patient?.last_name,
          phone: patient?.phone,
          preferredLanguage: patient?.preferred_language
        },
        treatmentPlan: {
          id: treatmentPlan?.id,
          patientId: treatmentPlan?.patient_id,
          dentistName: treatmentPlan?.dentist_name,
          practiceName: treatmentPlan?.practice_name,
          publicToken: treatmentPlan?.public_token,
          createdAt: treatmentPlan?.created_at
        },
        procedures: proceduresResult?.map(proc => ({
          id: proc?.id,
          treatmentPlanId: proc?.treatment_plan_id,
          procedureName: proc?.procedure_name,
          procedureSlug: proc?.procedure_slug,
          displayTitle: proc?.display_title,
          adaCode: proc?.ada_code,
          canonicalSlug: proc?.canonical_slug,
          toothNumbers: proc?.tooth_numbers,
          priority: proc?.priority,
          estTime: proc?.est_time,
          notesForPatient: proc?.notes_for_patient,
          sortOrder: proc?.sort_order
        }))
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get patient plan by public token (for patient view)
   * @param {string} publicToken - Unique public token
   * @returns {Promise<Object>} Complete plan data
   */
  async getPatientPlanByToken(publicToken) {
    try {
      // Get treatment plan with patient info - use maybeSingle() and handle null
      const { data: plan, error: planError } = await supabase
        ?.from('treatment_plans')
        ?.select(`
          *,
          patients (*)
        `)
        ?.eq('public_token', publicToken)
        ?.maybeSingle();

      if (planError) {
        if (import.meta.env?.DEV) {
          console.error('🔍 [DEV] Error fetching plan by token:', planError);
        }
        throw planError;
      }
      
      if (!plan) {
        throw new Error('Treatment plan not found');
      }

      // Get procedures for this plan
      const { data: procedures, error: proceduresError } = await supabase
        ?.from('plan_procedures')
        ?.select('*')
        ?.eq('treatment_plan_id', plan?.id)
        ?.order('sort_order', { ascending: true });

      if (proceduresError) throw proceduresError;

      // Convert to camelCase
      return {
        patient: {
          firstName: plan?.patients?.first_name,
          lastName: plan?.patients?.last_name,
          phone: plan?.patients?.phone,
          preferredLanguage: plan?.patients?.preferred_language
        },
        treatmentPlan: {
          dentistName: plan?.dentist_name,
          practiceName: plan?.practice_name,
          createdAt: plan?.created_at
        },
        procedures: procedures?.map(proc => ({
          id: proc?.id,
          procedureName: proc?.procedure_name,
          adaCode: proc?.ada_code,
          priority: proc?.priority,
          estTime: proc?.est_time,
          notesForPatient: proc?.notes_for_patient,
          sortOrder: proc?.sort_order
        }))
      };
    } catch (error) {
      console.error('Error fetching patient plan:', error);
      throw error;
    }
  },

  /**
   * Fetch visuals for a procedure using step_key matching
   * FIXED: Uses step_key for stable mapping instead of array indices
   * ENHANCED: Cache-busting with updated_at timestamp or visual_id fallback
   * @param {string} canonicalSlug - Canonical slug for the procedure
   * @param {Array} steps - Array of procedure steps with step_id
   * @returns {Promise<Array>} Array of visual objects matched by step_key
   */
  resolveVisualUrl(imageUrl) {
    if (!imageUrl) return null;

    const isSupabaseStorageUrl = imageUrl?.includes('supabase.co/storage');
    if (!isSupabaseStorageUrl) return imageUrl;

    const isPublicUrl = imageUrl?.includes('/object/public/');
    if (isPublicUrl) return imageUrl;

    const isPrivateUrl = imageUrl?.includes('/object/') && !imageUrl?.includes('/object/public/');
    if (isPrivateUrl && supabase) {
      const pathMatch = imageUrl?.match(/\/object\/(?:sign\/)?(.+?)$/);
      if (pathMatch) {
        const parts = pathMatch[1]?.split('/');
        const bucket = parts?.[0];
        const filePath = parts?.slice(1)?.join('/');
        
        if (bucket && filePath) {
          console.log('🔐 [URL RESOLVER] Generating signed URL:', { bucket, filePath });
          const { data } = supabase?.storage?.from(bucket)?.getPublicUrl(filePath);
          if (data?.publicUrl) return data.publicUrl;
        }
      }
    }

    return imageUrl;
  },

  async fetchProcedureVisualsByStepId(canonicalSlug, steps) {
    try {
      if (!canonicalSlug) {
        console.warn('🚨 [VISUAL MAPPER] No canonical_slug provided - cannot fetch visuals');
        return [];
      }

      console.log('🔍 [VISUAL MAPPER] REQUEST:', {
        canonical_slug: canonicalSlug,
        steps_count: steps?.length,
        timestamp: new Date()?.toISOString()
      });

      // Fetch all visuals for this procedure
      const { data: visuals, error: visualsError, status: httpStatus } = await supabase
        ?.from('procedure_visuals')
        ?.select('*')
        ?.eq('canonical_slug', canonicalSlug)
        ?.order('sort_order', { ascending: true });

      // 🎯 ENHANCED: Log response details
      console.log('📡 [VISUAL MAPPER] RESPONSE:', {
        http_status: httpStatus || 'unknown',
        visuals_count: visuals?.length || 0,
        payload_size: JSON.stringify(visuals || [])?.length,
        error: visualsError ? visualsError?.message : null
      });

      if (visualsError) {
        const isRLSError = visualsError?.message?.includes('permission') || 
                           visualsError?.message?.includes('policy') ||
                           visualsError?.code === '42501' ||
                           httpStatus === 403;
        console.error('💥 [VISUAL MAPPER] SUPABASE ERROR:', {
          error_message: visualsError?.message,
          error_details: visualsError?.details,
          error_hint: visualsError?.hint,
          canonical_slug: canonicalSlug,
          is_rls_error: isRLSError,
          fix_hint: isRLSError 
            ? 'RLS is blocking anonymous SELECT on procedure_visuals. Add policy: CREATE POLICY "Allow public read" ON procedure_visuals FOR SELECT USING (true);'
            : null
        });
        return [];
      }

      if (!visuals || visuals?.length === 0) {
        console.log('⚠️ [VISUAL MAPPER] NO VISUALS FOUND:', {
          canonical_slug: canonicalSlug,
          query_executed: true,
          result_empty: true
        });
        return [];
      }

      // ✅ FIX: Map visuals by step_key for stable, non-array-dependent matching
      const visualsByStepKey = {};
      visuals?.forEach(visual => {
        if (visual?.step_key) {
          visualsByStepKey[visual?.step_key] = visual;
          console.log(`📋 [VISUAL MAPPER] Mapped visual:`, {
            step_key: visual?.step_key,
            visual_id: visual?.id,
            image_url: visual?.image_url?.substring(0, 50),
            has_url: !!visual?.image_url,
            has_updated_at: !!visual?.updated_at
          });
        }
      });

      console.log('✅ [VISUAL MAPPER] MAPPING COMPLETE:', {
        total_visuals: visuals?.length,
        mapped_step_keys: Object.keys(visualsByStepKey),
        steps_to_match: steps?.length
      });

      // ✅ FIX: Match steps to visuals using step_id ONLY (no array indices)
      // Each step has a step_id (e.g., "step_1", "step_2") that matches visual.step_key
      const mappedVisuals = steps?.map((step) => {
        // Use step_id as the stable identifier for matching
        const stepKey = step?.step_id;
        const matchingVisual = visualsByStepKey?.[stepKey];

        if (matchingVisual) {
          // ✅ CACHE-BUSTING FIX: Priority order - updated_at → visual_id → current timestamp
          let cacheBusterValue;
          if (matchingVisual?.updated_at) {
            cacheBusterValue = new Date(matchingVisual?.updated_at)?.getTime();
          } else if (matchingVisual?.id) {
            cacheBusterValue = matchingVisual?.id;
          } else {
            cacheBusterValue = Date.now();
          }

          const resolvedUrl = this.resolveVisualUrl(matchingVisual?.image_url);
          const separator = resolvedUrl?.includes('?') ? '&' : '?';
          const cachedUrl = `${resolvedUrl}${separator}v=${cacheBusterValue}`;

          console.log(`✅ [VISUAL MAPPER] MATCH FOUND:`, {
            step_id: step?.step_id,
            step_key: stepKey,
            visual_id: matchingVisual?.id,
            image_url: cachedUrl,
            cache_buster: cacheBusterValue,
            cache_source: matchingVisual?.updated_at ? 'updated_at' : matchingVisual?.id ? 'visual_id' : 'timestamp'
          });

          return {
            step_id: step?.step_id,
            step_order: step?.step_order || step?.step_index,
            visual_id: matchingVisual?.id,
            canonical_slug: canonicalSlug,
            image_url: cachedUrl,
            alt_text_en: matchingVisual?.alt_text_en,
            alt_text_es: matchingVisual?.alt_text_es,
            updated_at: matchingVisual?.updated_at || matchingVisual?.created_at
          };
        } else {
          console.warn(`⚠️ [VISUAL MAPPER] NO MATCH FOR STEP:`, {
            step_id: step?.step_id,
            step_key: stepKey,
            available_keys: Object.keys(visualsByStepKey)
          });
          return null;
        }
      })?.filter(v => v !== null);

      console.log('🏁 [VISUAL MAPPER] FINAL RESULT:', {
        canonical_slug: canonicalSlug,
        total_steps: steps?.length,
        matched_visuals: mappedVisuals?.length,
        unmatched_count: steps?.length - mappedVisuals?.length
      });

      return mappedVisuals || [];

    } catch (error) {
      console.error('💥 [VISUAL MAPPER] EXCEPTION:', {
        error_message: error?.message,
        error_stack: error?.stack,
        canonical_slug: canonicalSlug
      });
      return [];
    }
  },

  /**
   * Get enriched patient plan with procedure library content using canonical normalization
   * @param {string} publicToken - Public token from URL
   * @returns {Promise<Object>} Treatment plan with full procedure details from library
   */
  async getEnrichedPatientPlan(publicToken) {
    try {
      // Get treatment plan with patient info and procedures - use maybeSingle() for resilience
      const { data: plan, error: planError } = await supabase
        ?.from('treatment_plans')
        ?.select(`
          *,
          patients (*),
          plan_procedures (
            id,
            procedure_name,
            procedure_slug,
            display_title,
            ada_code,
            tooth_numbers,
            canonical_slug,
            priority,
            est_time,
            notes_for_patient,
            sort_order
          )
        `)
        ?.eq('public_token', publicToken)
        ?.maybeSingle();

      if (planError) {
        if (import.meta.env?.DEV) {
          console.error('🔍 [DEV] Error fetching enriched plan:', planError);
        }
        throw planError;
      }
      
      if (!plan) {
        throw new Error('Treatment plan not found');
      }

      // Get patient's preferred language
      const patientLanguage = plan?.patients?.preferred_language || 'EN';

      const CANONICAL_TO_VISUAL_SLUG = {
        crown: 'dental-crown',
        root_canal: 'root-canal',
        bridge: 'dental-bridge',
        srp: 'scaling-root-planing',
        extraction: 'simple-extraction',
        filling: 'composite-filling',
      };

      // Normalize canonical keys for all procedures using new normalization function
      const resolvedProcedures = plan?.plan_procedures?.map((proc) => {
        const canonicalKey = normalizeProcedureKey({
          canonical_slug: proc?.canonical_slug,
          ada_code: proc?.ada_code,
          procedure_name: proc?.procedure_name || proc?.display_title
        });

        return {
          ...proc,
          resolvedCanonicalSlug: canonicalKey
        };
      });

      // Enrich procedures with education content using getEducationForPlanItem
      const enrichedProcedures = await Promise.all(
        resolvedProcedures?.map(async (proc) => {
          const canonicalKey = proc?.resolvedCanonicalSlug;

          // Fetch education content with AI fallback (NEVER returns null)
          const educationContent = await this.getEducationForPlanItem({
            ada_code: proc?.ada_code,
            procedure_name: proc?.procedure_name || proc?.display_title,
            canonicalKey: canonicalKey,
            language: patientLanguage
          });

          // Convert education object to UI-compatible format
          const uiContent = {
            EN: educationContent?.steps || [],
            ES: educationContent?.steps || []
          };

          let visualsForSteps = [];
          try {
            if (canonicalKey && canonicalKey !== 'unknown' && educationContent?.steps?.length > 0) {
              console.log(`🔎 [VISUALS FETCH] Querying procedure_visuals table:`, {
                table: 'procedure_visuals',
                filter: `canonical_slug = '${canonicalKey}'`,
                procedure_id: proc?.id,
                procedure_name: proc?.procedure_name,
                steps_count: educationContent?.steps?.length,
                step_ids: educationContent?.steps?.map(s => s?.step_id)
              });
              const slugsToTry = [canonicalKey];
              if (CANONICAL_TO_VISUAL_SLUG[canonicalKey]) {
                slugsToTry.push(CANONICAL_TO_VISUAL_SLUG[canonicalKey]);
              }
              let visuals = [];
              for (const slug of slugsToTry) {
                visuals = await this.fetchProcedureVisualsByStepId(slug, educationContent?.steps);
                if (visuals?.length > 0) break;
              }
              console.log(`📊 [VISUALS FETCH] Result for ${canonicalKey} (tried: ${slugsToTry.join(', ')}):`, {
                visuals_returned: visuals?.length || 0,
                error: null,
                first_visual: visuals?.[0] ? { id: visuals[0]?.visual_id, step_id: visuals[0]?.step_id, image_url: visuals[0]?.image_url?.substring(0, 80) } : 'none'
              });
              
              const visualSlugForSteps = CANONICAL_TO_VISUAL_SLUG[canonicalKey] || canonicalKey;
              const titleMapForSteps = buildVisualTitleMap(visualSlugForSteps);

              let visualEntriesForSteps = null;
              if (titleMapForSteps && visuals?.length > 0) {
                visualEntriesForSteps = [];
                visuals.forEach(v => {
                  const stepKey = v?.step_key || v?.step_id;
                  const meta = titleMapForSteps[stepKey];
                  if (meta?.titleEn) visualEntriesForSteps.push({ visual: v, titleEn: meta.titleEn });
                });
              }

              const usedVisualsForSteps = new Set();
              visualsForSteps = educationContent?.steps?.map((step, idx) => {
                let matchingVisual = null;

                if (visualEntriesForSteps) {
                  let bestScore = 0;
                  let bestEntry = null;
                  for (const entry of visualEntriesForSteps) {
                    const key = entry.visual?.step_key || entry.visual?.step_id;
                    if (usedVisualsForSteps.has(key)) continue;
                    const score = titleMatchScore(step?.title, entry.titleEn);
                    if (score > bestScore) {
                      bestScore = score;
                      bestEntry = entry;
                    }
                  }
                  if (bestEntry && bestScore >= 2) {
                    const key = bestEntry.visual?.step_key || bestEntry.visual?.step_id;
                    usedVisualsForSteps.add(key);
                    matchingVisual = bestEntry.visual;
                  }
                }

                if (!matchingVisual) {
                  const stepId = step?.step_id || `step_${idx + 1}`;
                  const fallback = visuals?.find(v => v?.step_id === stepId && !usedVisualsForSteps.has(v?.step_id));
                  if (fallback) matchingVisual = fallback;
                }
                
                return {
                  ...step,
                  visual: matchingVisual ? {
                    image_url: matchingVisual?.image_url,
                    alt_text: matchingVisual?.[`alt_text_${patientLanguage?.toLowerCase()}`] || 'Procedure visual'
                  } : {
                    image_url: null,
                    alt_text: patientLanguage === 'EN' ? 'Visual coming soon' : 'Visual próximamente',
                    placeholder: true
                  }
                };
              });
            }
          } catch (visualError) {
            console.error(`⚠️ Error fetching visuals for ${canonicalKey}:`, visualError);
            // Continue without visuals - show placeholder
            visualsForSteps = educationContent?.steps?.map(step => ({
              ...step,
              visual: {
                image_url: null,
                alt_text: patientLanguage === 'EN' ? 'Visual coming soon' : 'Visual próximamente',
                placeholder: true
              }
            }));
          }

          let visualsData = null;
          try {
            if (canonicalKey && canonicalKey !== 'unknown') {
              const slugsToTry = [canonicalKey];
              if (CANONICAL_TO_VISUAL_SLUG[canonicalKey]) {
                slugsToTry.push(CANONICAL_TO_VISUAL_SLUG[canonicalKey]);
              }

              let allVisuals = null;
              for (const slug of slugsToTry) {
                const { data } = await supabase
                  ?.from('procedure_visuals')
                  ?.select('step_key, image_url')
                  ?.eq('canonical_slug', slug)
                  ?.order('sort_order', { ascending: true });
                if (data?.length > 0) {
                  allVisuals = data;
                  break;
                }
              }

              if (allVisuals?.length > 0) {
                const heroVisual = allVisuals.find(v => v.step_key === 'hero');
                const stepVisuals = allVisuals.filter(v => v.step_key !== 'hero');

                const visualSlug = CANONICAL_TO_VISUAL_SLUG[canonicalKey] || canonicalKey;
                const titleMap = buildVisualTitleMap(visualSlug);

                const educSteps = educationContent?.steps || [];
                const alignedStepKeys = [];

                if (titleMap && educSteps.length > 0) {
                  const visualEntries = [];
                  stepVisuals.forEach(v => {
                    const meta = titleMap[v.step_key];
                    if (meta?.titleEn) visualEntries.push({ visual: v, titleEn: meta.titleEn });
                  });

                  const usedVisuals = new Set();
                  for (const step of educSteps) {
                    let bestMatch = null;
                    let bestScore = 0;
                    for (const entry of visualEntries) {
                      if (usedVisuals.has(entry.visual.step_key)) continue;
                      const score = titleMatchScore(step?.title, entry.titleEn);
                      if (score > bestScore) {
                        bestScore = score;
                        bestMatch = entry;
                      }
                    }
                    if (bestMatch && bestScore >= 2) {
                      usedVisuals.add(bestMatch.visual.step_key);
                      alignedStepKeys.push(this.resolveVisualUrl(bestMatch.visual.image_url));
                    } else {
                      alignedStepKeys.push(null);
                    }
                  }
                } else {
                  const stepVisualsMap = {};
                  stepVisuals.forEach(v => {
                    const num = parseInt(v.step_key?.replace('step_', '')) || 0;
                    if (num > 0) stepVisualsMap[num] = v;
                  });
                  for (let i = 0; i < educSteps.length; i++) {
                    const v = stepVisualsMap[i + 1];
                    alignedStepKeys.push(v ? this.resolveVisualUrl(v.image_url) : null);
                  }
                }

                const visualSlugForHero = CANONICAL_TO_VISUAL_SLUG[canonicalKey] || canonicalKey;
                const staticProc = proceduresLibrary?.find(p => p?.id === visualSlugForHero);
                const fallbackHero = staticProc?.heroImage || null;

                visualsData = {
                  heroKey: heroVisual ? this.resolveVisualUrl(heroVisual.image_url) : fallbackHero,
                  stepKeys: alignedStepKeys
                };
              }
            }
          } catch (visualsLookupError) {
            console.error('Error fetching visuals data:', visualsLookupError);
          }

          if (canonicalKey) {
            const heroSlug = CANONICAL_TO_VISUAL_SLUG[canonicalKey] || canonicalKey;
            const heroProc = proceduresLibrary?.find(p => p?.id === heroSlug);
            if (heroProc?.heroImage) {
              visualsData = visualsData || {};
              visualsData.heroKey = heroProc.heroImage;
            }
          }

          const langSuffix = patientLanguage === 'ES' ? 'Es' : 'En';
          const altLangSuffix = patientLanguage === 'ES' ? 'En' : 'Es';

          const whyText = (educationContent?.whyRecommendedBullets || []).length > 0
            ? educationContent.whyRecommendedBullets.map(b => `- ${b}`).join('\n')
            : null;
          const aftercareText = (educationContent?.aftercareBullets || []).length > 0
            ? educationContent.aftercareBullets.map(b => `- ${b}`).join('\n')
            : null;
          const whatIfNotText = (educationContent?.redFlagsBullets || []).length > 0
            ? educationContent.redFlagsBullets.map(b => `- ${b}`).join('\n')
            : null;

          const stepsForLanding = educationContent?.steps?.map(s => ({
            title: s?.title,
            description: s?.whatWeDo || s?.description || s?.body || '',
            whatYouMayFeel: s?.whatYouMayFeel || null,
            whyItMatters: s?.whyItMatters || null
          })) || [];

          return {
            id: proc?.id,
            procedureName: proc?.procedure_name || proc?.display_title || 'Not specified',
            displayTitle: proc?.display_title || proc?.procedure_name || 'Not specified',
            procedureSlug: proc?.procedure_slug,
            canonicalSlug: canonicalKey,
            adaCode: proc?.ada_code,
            toothNumbers: proc?.tooth_numbers,
            priority: proc?.priority,
            estTime: proc?.est_time,
            notesForPatient: proc?.notes_for_patient,
            sortOrder: proc?.sort_order,
            library: {
              content: {
                [patientLanguage]: visualsForSteps?.length > 0 ? visualsForSteps : educationContent?.steps
              },
              title: educationContent?.title || proc?.displayTitle,
              [`title${langSuffix}`]: educationContent?.title || proc?.display_title || proc?.procedure_name,
              [`title${altLangSuffix}`]: educationContent?.title || proc?.display_title || proc?.procedure_name,
              [`summary${langSuffix}`]: educationContent?.whatThisIs || null,
              [`summary${altLangSuffix}`]: educationContent?.whatThisIs || null,
              [`why${langSuffix}`]: whyText,
              [`why${altLangSuffix}`]: whyText,
              [`steps${langSuffix}`]: stepsForLanding,
              [`steps${altLangSuffix}`]: stepsForLanding,
              [`aftercare${langSuffix}`]: aftercareText,
              [`aftercare${altLangSuffix}`]: aftercareText,
              [`whatIfNot${langSuffix}`]: whatIfNotText,
              [`whatIfNot${altLangSuffix}`]: whatIfNotText,
              [`faqs${langSuffix}`]: null,
              [`faqs${altLangSuffix}`]: null,
              whatThisIs: educationContent?.whatThisIs,
              whyRecommendedBullets: educationContent?.whyRecommendedBullets || [],
              aftercareBullets: educationContent?.aftercareBullets || [],
              redFlagsBullets: educationContent?.redFlagsBullets || [],
              disclaimer: educationContent?.disclaimer,
              visuals: visualsData
            }
          };
        })
      );

      return {
        success: true,
        patient: {
          firstName: plan?.patients?.first_name || 'Patient',
          lastName: plan?.patients?.last_name || '',
          phone: plan?.patients?.phone,
          preferredLanguage: patientLanguage
        },
        treatmentPlan: {
          dentistName: plan?.dentist_name || 'Your Dentist',
          practiceName: plan?.practice_name || 'Our Practice',
          createdAt: plan?.created_at
        },
        procedures: enrichedProcedures || []
      };
    } catch (error) {
      console.error('Error fetching enriched patient plan:', error);
      return {
        success: false,
        error: error?.message || 'Failed to load treatment plan',
        errorDetails: error
      };
    }
  },

  /**
   * Get education content for a single plan item with AI fallback
   * @param {Object} params - Education retrieval parameters
   * @returns {Promise<Object>} Education object matching UI schema
   */
  async getEducationForPlanItem({ ada_code, procedure_name, canonicalKey, language = 'EN' }) {
    try {
      // Normalize the canonical key if not provided
      const resolvedCanonicalKey = canonicalKey || normalizeProcedureKey({
        ada_code,
        procedure_name
      });

      if (resolvedCanonicalKey === 'unknown') {
        return this._createFallbackEducationObject(procedure_name, language);
      }

      // Try to fetch curated content from database - use maybeSingle() to handle missing content gracefully
      const { data: library, error: libraryError } = await supabase
        ?.from('procedure_library')
        ?.select('*')
        ?.eq('canonical_slug', resolvedCanonicalKey)
        ?.eq('is_published', true)
        ?.maybeSingle();

      if (libraryError) {
        if (import.meta.env?.DEV) {
          console.error('🔍 [DEV] Error fetching procedure library:', libraryError);
        }
      }

      // If curated content exists, return it
      if (library) {
        return this._convertLibraryToEducationObject(library, language, resolvedCanonicalKey);
      }

      // No curated content - generate AI fallback and cache it
      console.log(`🤖 [AI FALLBACK] No curated content for ${resolvedCanonicalKey}, generating...`);

      const generationResult = await procedureEducationGeneratorService?.generateAndSaveProcedureEducation(
        resolvedCanonicalKey,
        procedure_name,
        ada_code,
        null // No existing content to extend
      );

      if (generationResult?.success) {
        console.log(`✅ [AI FALLBACK] Generated and cached content for ${resolvedCanonicalKey}`);
        return this._convertLibraryToEducationObject(generationResult?.procedure, language, resolvedCanonicalKey);
      } else {
        console.error(`❌ [AI FALLBACK] Failed to generate content for ${resolvedCanonicalKey}:`, generationResult?.error);
        return this._createFallbackEducationObject(procedure_name, language);
      }
    } catch (error) {
      console.error('[EDUCATION FETCH] Error:', error);
      return this._createFallbackEducationObject(procedure_name, language);
    }
  },

  /**
   * Convert procedure library data to education object matching UI schema
   * ENHANCED: Returns education content in format expected by UI components
   * @private
   * @param {Object} library - Library data from database or generated content
   * @param {string} language - Language code ('EN' or 'ES')
   * @param {string} canonicalKey - Canonical key for visual fetching
   * @returns {Object} Education object matching UI schema
   */
  _convertLibraryToEducationObject(library, language, canonicalKey) {
    const isEnglish = language === 'EN';
    const steps = isEnglish ? library?.steps_en : library?.steps_es;
    
    // Convert steps array to match UI schema with required fields
    const convertedSteps = Array.isArray(steps) ? steps?.map((section, idx) => ({
      step_index: idx + 1,
      step_id: `step_${idx + 1}`,
      title: section?.title || `Step ${idx + 1}`,
      whatWeDo: section?.description || section?.content || section?.body || section?.whatWeDo || '',
      whatYouMayFeel: section?.whatYouMayFeel || null,
      whyItMatters: section?.whyItMatters || null
    })) : [];

    return {
      title: (isEnglish ? library?.title_en : library?.title_es) || 'Dental Procedure',
      whatThisIs: (isEnglish ? library?.summary_en : library?.summary_es) || '',
      whyRecommendedBullets: this._extractBullets(isEnglish ? library?.why_en : library?.why_es),
      steps: convertedSteps,
      aftercareBullets: this._extractBullets(isEnglish ? library?.aftercare_en : library?.aftercare_es),
      redFlagsBullets: this._extractBullets(isEnglish ? library?.what_if_not_en : library?.what_if_not_es),
      disclaimer: language === 'EN' ?'This is general education about dental procedures, not medical advice. Consult your dentist for personalized treatment recommendations.' :'Esta es educación general sobre procedimientos dentales, no consejo médico. Consulte a su dentista para recomendaciones de tratamiento personalizadas.',
      canonicalKey
    };
  },

  /**
   * Extract bullet points from markdown text
   * @private
   * @param {string} text - Markdown text with bullets
   * @returns {Array<string>} Array of bullet points
   */
  _extractBullets(text) {
    if (!text) return [];
    
    // Extract lines starting with - or * (markdown bullets)
    const lines = text?.split('\n');
    const bullets = lines?.filter(line => line?.trim()?.match(/^[-*]\s+/))?.map(line => line?.trim()?.replace(/^[-*]\s+/, ''));
    
    return bullets?.length > 0 ? bullets : [];
  },

  /**
   * Create fallback education object when no content is available
   * ENHANCED: Returns minimal but valid education content with proper structure
   * @private
   * @param {string} procedureName - Procedure name
   * @param {string} language - Language code ('EN' or 'ES')
   * @returns {Object} Minimal education object with at least 3 steps
   */
  _createFallbackEducationObject(procedureName, language) {
    const isEnglish = language === 'EN';
    
    // Minimal fallback content with 3 steps
    const fallbackSteps = isEnglish ? [
      {
        step_index: 1,
        step_id: 'step_1',
        title: 'What This Is',
        whatWeDo: `${procedureName || 'This dental procedure'} is a common treatment recommended by your dentist to maintain or improve your oral health.`,
        whatYouMayFeel: 'Your dentist will ensure you are comfortable throughout the procedure.',
        whyItMatters: 'This treatment helps prevent future dental problems and keeps your smile healthy.'
      },
      {
        step_index: 2,
        step_id: 'step_2',
        title: 'Why You Need It',
        whatWeDo: 'Your dentist has recommended this treatment based on your specific dental needs and examination findings.',
        whatYouMayFeel: 'This procedure addresses current issues and helps prevent more serious problems.',
        whyItMatters: 'Timely treatment can save you time, discomfort, and cost in the long run.'
      },
      {
        step_index: 3,
        step_id: 'step_3',
        title: 'What to Expect',
        whatWeDo: 'Your dentist will explain the procedure steps and answer any questions before starting treatment.',
        whatYouMayFeel: 'Most patients experience minimal discomfort, and your dentist will work to keep you comfortable.',
        whyItMatters: 'Understanding what to expect helps you feel more confident and prepared for your appointment.'
      }
    ] : [
      {
        step_index: 1,
        step_id: 'step_1',
        title: 'Qué es esto',
        whatWeDo: `${procedureName || 'Este procedimiento dental'} es un tratamiento común recomendado por su dentista para mantener o mejorar su salud bucal.`,
        whatYouMayFeel: 'Su dentista se asegurará de que esté cómodo durante todo el procedimiento.',
        whyItMatters: 'Este tratamiento ayuda a prevenir futuros problemas dentales y mantiene su sonrisa saludable.'
      },
      {
        step_index: 2,
        step_id: 'step_2',
        title: 'Por qué lo necesita',
        whatWeDo: 'Su dentista ha recomendado este tratamiento según sus necesidades dentales específicas y los hallazgos del examen.',
        whatYouMayFeel: 'Este procedimiento aborda problemas actuales y ayuda a prevenir problemas más graves.',
        whyItMatters: 'El tratamiento oportuno puede ahorrarle tiempo, incomodidad y costo a largo plazo.'
      },
      {
        step_index: 3,
        step_id: 'step_3',
        title: 'Qué esperar',
        whatWeDo: 'Su dentista explicará los pasos del procedimiento y responderá cualquier pregunta antes de comenzar el tratamiento.',
        whatYouMayFeel: 'La mayoría de los pacientes experimentan molestias mínimas y su dentista trabajará para mantenerlo cómodo.',
        whyItMatters: 'Comprender qué esperar le ayuda a sentirse más seguro y preparado para su cita.'
      }
    ];
    
    return {
      title: procedureName || (isEnglish ? 'Dental Procedure' : 'Procedimiento Dental'),
      whatThisIs: isEnglish 
        ? `This is a dental procedure recommended by your dentist. For detailed information about ${procedureName || 'this treatment'}, please ask your dental team.`
        : `Este es un procedimiento dental recomendado por su dentista. Para obtener información detallada sobre ${procedureName || 'este tratamiento'}, consulte a su equipo dental.`,
      whyRecommendedBullets: isEnglish ? [
        'Maintains your oral health',
        'Prevents future dental problems',
        'Recommended based on your specific needs'
      ] : [
        'Mantiene su salud bucal',
        'Previene futuros problemas dentales',
        'Recomendado según sus necesidades específicas'
      ],
      steps: fallbackSteps,
      aftercareBullets: isEnglish ? [
        'Follow your dentist\'s post-treatment instructions',
        'Contact the office if you have any concerns',
        'Maintain good oral hygiene'
      ] : [
        'Siga las instrucciones posteriores al tratamiento de su dentista',
        'Comuníquese con la oficina si tiene alguna inquietud',
        'Mantenga una buena higiene bucal'
      ],
      redFlagsBullets: [],
      disclaimer: isEnglish 
        ? 'This is general education about dental procedures, not medical advice. Consult your dentist for personalized treatment recommendations.'
        : 'Esta es educación general sobre procedimientos dentales, no consejo médico. Consulte a su dentista para recomendaciones de tratamiento personalizadas.',
      canonicalKey: 'unknown'
    };
  },

  /**
   * Generate patient SMS message (does not actually send)
   * @param {string} firstName - Patient first name
   * @param {string} practiceName - Practice name
   * @param {string} publicToken - Public token for plan link
   * @returns {string} SMS message text
   */
  generateSMSMessage(firstName, practiceName, publicToken) {
    const planUrl = `${window.location?.origin}/p/${publicToken}`;
    return `Hi ${firstName}, your dental treatment plan from ${practiceName} is ready. Tap to view: ${planUrl}`;
  },

  /**
   * Get all treatment plans (for dentist dashboard if needed)
   * @returns {Promise<Array>} List of all plans
   */
  async getAllPlans() {
    try {
      const { data, error } = await supabase?.from('treatment_plans')?.select(`
          *,
          patients (*)
        `)?.order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(plan => ({
        id: plan?.id,
        publicToken: plan?.public_token,
        dentistName: plan?.dentist_name,
        practiceName: plan?.practice_name,
        createdAt: plan?.created_at,
        patient: {
          firstName: plan?.patients?.first_name,
          lastName: plan?.patients?.last_name,
          phone: plan?.patients?.phone
        }
      }));
    } catch (error) {
      console.error('Error fetching all plans:', error);
      throw error;
    }
  },

  /**
   * Resend treatment plan SMS link to patient
   * @param {string} publicToken - Public token for the treatment plan
   * @returns {Promise<Object>} Result of SMS sending operation
   */
  async resendTreatmentPlanLink(publicToken) {
    try {
      // Get plan data with patient info
      const planData = await this.getEnrichedPatientPlan(publicToken);

      if (!planData?.success) {
        throw new Error(planData?.error || 'Failed to load treatment plan data');
      }

      // Validate patient phone number exists
      if (!planData?.patient?.phone) {
        throw new Error('Patient phone number not found');
      }

      // Send SMS using Twilio service
      const smsResult = await twilioService?.sendTreatmentPlanSMS(
        planData?.patient?.phone,
        planData?.patient?.firstName,
        planData?.treatmentPlan?.practiceName,
        publicToken
      );

      if (!smsResult?.success) {
        throw new Error(smsResult?.userMessage || smsResult?.error || 'Failed to send SMS');
      }

      // Store SMS record in database - use maybeSingle() to handle missing plan ID gracefully
      const { data: treatmentPlan, error: planError } = await supabase
        ?.from('treatment_plans')
        ?.select('id')
        ?.eq('public_token', publicToken)
        ?.maybeSingle();

      if (planError && import.meta.env?.DEV) {
        console.error('🔍 [DEV] Error fetching treatment plan ID:', planError);
      }

      if (treatmentPlan?.id) {
        const patientLink = `${window?.location?.origin}/p/${publicToken}`;
        const messageContent = `Hi ${planData?.patient?.firstName}! Your treatment plan from ${planData?.treatmentPlan?.practiceName} is ready. View it here: ${patientLink}`;

        await supabase?.from('sms_messages')?.insert({
          phone_number: twilioService?.formatPhoneNumber(planData?.patient?.phone),
          message_content: messageContent,
          message_type: 'treatment_plan',
          plan_link_url: patientLink,
          treatment_plan_id: treatmentPlan?.id,
          delivery_status: 'sent',
          twilio_message_sid: smsResult?.messageSid,
          sent_at: new Date()?.toISOString()
        });
      }

      return {
        success: true,
        message: 'Treatment plan link resent successfully',
        data: smsResult
      };
    } catch (error) {
      console.error('Error resending treatment plan link:', error);
      return {
        success: false,
        error: error?.message || 'Failed to resend treatment plan link',
        userMessage: error?.message || 'An error occurred while resending the link'
      };
    }
  },

  /**
   * Get treatment plan by ID for modification
   * @param {string} treatmentPlanId - Treatment plan ID
   * @returns {Promise<Object>} Treatment plan with procedures
   */
  async getTreatmentPlanById(treatmentPlanId) {
    try {
      // Use maybeSingle() and handle null result
      const { data: plan, error: planError } = await supabase
        ?.from('treatment_plans')
        ?.select(`
          *,
          patients (*),
          plan_procedures (*)
        `)
        ?.eq('id', treatmentPlanId)
        ?.maybeSingle();

      if (planError) {
        if (import.meta.env?.DEV) {
          console.error('🔍 [DEV] Error fetching plan by ID:', planError);
        }
        throw planError;
      }
      
      if (!plan) {
        throw new Error('Treatment plan not found');
      }

      return {
        id: plan?.id,
        publicToken: plan?.public_token,
        dentistName: plan?.dentist_name,
        practiceName: plan?.practice_name,
        createdAt: plan?.created_at,
        patient: {
          id: plan?.patients?.id,
          firstName: plan?.patients?.first_name,
          lastName: plan?.patients?.last_name,
          phone: plan?.patients?.phone,
          preferredLanguage: plan?.patients?.preferred_language
        },
        procedures: plan?.plan_procedures?.map(proc => ({
          id: proc?.id,
          treatmentPlanId: proc?.treatment_plan_id,
          procedureName: proc?.procedure_name,
          procedureSlug: proc?.procedure_slug,
          displayTitle: proc?.display_title,
          adaCode: proc?.ada_code,
          canonicalSlug: proc?.canonical_slug,
          toothNumbers: proc?.tooth_numbers,
          priority: proc?.priority,
          estTime: proc?.est_time,
          notesForPatient: proc?.notes_for_patient,
          sortOrder: proc?.sort_order
        })) || []
      };
    } catch (error) {
      console.error('Error fetching treatment plan by ID:', error);
      throw error;
    }
  },

  /**
   * Add procedure to existing treatment plan
   * @param {string} treatmentPlanId - Treatment plan ID
   * @param {Object} procedureData - Procedure information
   * @returns {Promise<Object>} Added procedure
   */
  async addProcedureToTreatmentPlan(treatmentPlanId, procedureData) {
    try {
      // Get current procedures count for sort_order - use limit(1) with maybeSingle() for ordering queries
      const { data: latestProcedure, error: countError } = await supabase
        ?.from('plan_procedures')
        ?.select('sort_order')
        ?.eq('treatment_plan_id', treatmentPlanId)
        ?.order('sort_order', { ascending: false })
        ?.limit(1)
        ?.maybeSingle();

      if (countError && import.meta.env?.DEV) {
        console.error('🔍 [DEV] Error fetching latest procedure:', countError);
      }

      const nextSortOrder = latestProcedure?.sort_order 
        ? latestProcedure?.sort_order + 1 
        : 0;

      // Resolve canonical_slug - use maybeSingle() for lookups
      let canonicalSlug = null;
      if (procedureData?.procedureSlug) {
        const { data: library, error: libraryError } = await supabase
          ?.from('procedure_library')
          ?.select('canonical_slug')
          ?.eq('slug', procedureData?.procedureSlug)
          ?.maybeSingle();
        
        if (libraryError && import.meta.env?.DEV) {
          console.error('🔍 [DEV] Error fetching library canonical_slug:', libraryError);
        }
        
        canonicalSlug = library?.canonical_slug || procedureData?.procedureSlug;
      }

      if (!canonicalSlug && procedureData?.adaCode) {
        const { data: adaCode, error: adaError } = await supabase
          ?.from('ada_codes')
          ?.select('canonical_slug')
          ?.eq('code', procedureData?.adaCode)
          ?.maybeSingle();
        
        if (adaError && import.meta.env?.DEV) {
          console.error('🔍 [DEV] Error fetching ada_code canonical_slug:', adaError);
        }
        
        canonicalSlug = adaCode?.canonical_slug;
      }

      // Insert new procedure - use maybeSingle() for resilience
      const { data: newProcedure, error: insertError } = await supabase
        ?.from('plan_procedures')
        ?.insert({
          treatment_plan_id: treatmentPlanId,
          procedure_name: procedureData?.procedureName || procedureData?.displayTitle,
          procedure_slug: procedureData?.procedureSlug || null,
          display_title: procedureData?.displayTitle || null,
          ada_code: procedureData?.adaCode || null,
          canonical_slug: canonicalSlug,
          tooth_numbers: procedureData?.toothNumbers || null,
          priority: procedureData?.priority || 'Soon',
          est_time: procedureData?.estTime || null,
          notes_for_patient: procedureData?.notesForPatient || null,
          sort_order: nextSortOrder
        })
        ?.select()
        ?.maybeSingle();

      if (insertError) {
        if (import.meta.env?.DEV) {
          console.error('🔍 [DEV] Error inserting procedure:', insertError);
        }
        throw insertError;
      }

      return {
        id: newProcedure?.id,
        treatmentPlanId: newProcedure?.treatment_plan_id,
        procedureName: newProcedure?.procedure_name,
        procedureSlug: newProcedure?.procedure_slug,
        displayTitle: newProcedure?.display_title,
        adaCode: newProcedure?.ada_code,
        canonicalSlug: newProcedure?.canonical_slug,
        toothNumbers: newProcedure?.tooth_numbers,
        priority: newProcedure?.priority,
        estTime: newProcedure?.est_time,
        notesForPatient: newProcedure?.notes_for_patient,
        sortOrder: newProcedure?.sort_order
      };
    } catch (error) {
      console.error('Error adding procedure to treatment plan:', error);
      throw error;
    }
  },

  /**
   * Remove procedure from treatment plan
   * @param {string} procedureId - Procedure ID to remove
   * @returns {Promise<boolean>} Success status
   */
  async removeProcedureFromTreatmentPlan(procedureId) {
    try {
      const { error } = await supabase
        ?.from('plan_procedures')
        ?.delete()
        ?.eq('id', procedureId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error removing procedure from treatment plan:', error);
      throw error;
    }
  },

  /**
   * Update procedure details in treatment plan
   * @param {string} procedureId - Procedure ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated procedure
   */
  async updateProcedureInTreatmentPlan(procedureId, updates) {
    try {
      const updateData = {};
      
      if (updates?.procedureName !== undefined) updateData.procedure_name = updates?.procedureName;
      if (updates?.displayTitle !== undefined) updateData.display_title = updates?.displayTitle;
      if (updates?.adaCode !== undefined) updateData.ada_code = updates?.adaCode;
      if (updates?.toothNumbers !== undefined) updateData.tooth_numbers = updates?.toothNumbers;
      if (updates?.priority !== undefined) updateData.priority = updates?.priority;
      if (updates?.estTime !== undefined) updateData.est_time = updates?.estTime;
      if (updates?.notesForPatient !== undefined) updateData.notes_for_patient = updates?.notesForPatient;

      // Use maybeSingle() for update resilience
      const { data: updatedProcedure, error: updateError } = await supabase
        ?.from('plan_procedures')
        ?.update(updateData)
        ?.eq('id', procedureId)
        ?.select()
        ?.maybeSingle();

      if (updateError) {
        if (import.meta.env?.DEV) {
          console.error('🔍 [DEV] Error updating procedure:', updateError);
        }
        throw updateError;
      }

      return {
        id: updatedProcedure?.id,
        treatmentPlanId: updatedProcedure?.treatment_plan_id,
        procedureName: updatedProcedure?.procedure_name,
        procedureSlug: updatedProcedure?.procedure_slug,
        displayTitle: updatedProcedure?.display_title,
        adaCode: updatedProcedure?.ada_code,
        canonicalSlug: updatedProcedure?.canonical_slug,
        toothNumbers: updatedProcedure?.tooth_numbers,
        priority: updatedProcedure?.priority,
        estTime: updatedProcedure?.est_time,
        notesForPatient: updatedProcedure?.notes_for_patient,
        sortOrder: updatedProcedure?.sort_order
      };
    } catch (error) {
      console.error('Error updating procedure in treatment plan:', error);
      throw error;
    }
  }
};