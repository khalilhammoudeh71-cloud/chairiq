# AI-Driven Personalization System

## Overview

This system uses **OpenAI GPT-5** and **Google Gemini 2.5** to dynamically adapt dental procedure content based on patient engagement patterns and learning history.

## Architecture

### Services

1. **patientLearningProfileService.js**
   - Tracks patient engagement patterns from Supabase analytics
   - Analyzes learning pace, attention span, content preferences
   - Provides procedure-specific engagement history

2. **aiPersonalizationService.js**
   - **OpenAI GPT-5**: Adapts procedure explanations and aftercare instructions
   - **Gemini 2.5 Flash**: Adapts complexity levels and structured expectations
   - Combines both AI services for comprehensive personalization

3. **geminiClient.js**
   - Initializes Google Gemini AI client
   - Configured with VITE_GEMINI_API_KEY

### Data Sources

- **patient_engagement_events**: Individual engagement events (views, clicks, time spent)
- **patient_session_analytics**: Aggregated session data (total time, pages viewed)
- **procedure_completion_tracking**: Completion status and progress
- **patient_language_preferences**: Language change history

## Personalization Logic

### Engagement Patterns Analysis

**Engagement Level** (low/medium/high):
- Based on average session time
- High: 10+ minutes average
- Low: <3 minutes average

**Learning Pace** (slow/moderate/fast):
- Based on completion rate
- Fast: >70% completion rate
- Slow: <30% completion rate

**Content Preference** (visual/text/balanced):
- Analyzes time spent on visual vs text sections
- Visual: 1.5x more time on images/visuals
- Text: 1.5x more time on explanations

**Attention Span** (short/average/long):
- Correlates with engagement level
- Long: High engagement (10+ min sessions)
- Short: Low engagement (<3 min sessions)

### AI Adaptation Rules

#### OpenAI GPT-5 (Explanations & Aftercare)

**For LOW engagement:**
- Shorter, simpler sentences
- More encouragement and reassurance
- Bullet points and clear action items

**For HIGH engagement:**
- Detailed technical information
- Comprehensive explanations of WHY
- Clinical precision and context

**For VISUAL preference:**
- Descriptive imagery and spatial references
- "What it looks like" descriptions

**For TEXT preference:**
- Clear, detailed written explanations
- Comprehensive care timelines

**For SHORT attention span:**
- Break into smaller chunks
- Prioritize 3-5 most critical points
- Concise responses (max 500 tokens)

**For LONG attention span:**
- Comprehensive information
- Interconnected details
- Expanded responses (up to 1000 tokens)

#### Gemini 2.5 Flash (Complexity Levels)

**First-time viewers:**
- Comprehensive, step-by-step details
- More context and explanations

**Repeat viewers:**
- Focus on key points they may have missed
- Streamlined information

**High engagement + repeat views:**
- Add advanced details
- Clinical context and technical depth

**Low engagement:**
- Simplify language
- Add more reassurance
- Use everyday comparisons

**Fast learners:**
- Increase technical depth
- Focus on clinical precision

**Slow learners:**
- Add more analogies
- Everyday comparisons
- Step-by-step breakdowns

## Implementation

### Individual Procedure Detail Page

```javascript
// Personalizes explanation and aftercare
const personalized = await aiPersonalizationService.generatePersonalizedContent({
  procedureName,
  baseContent: {
    explanation: procedure.description_en,
    expectations: [...],
    aftercare: procedure.aftercare_en,
  },
  learningProfile,
  procedureEngagementHistory,
  language: 'en',
});
```

### Step-by-Step Treatment Flow

```javascript
// Adapts complexity level and aftercare for each step
const adaptedExpectations = await aiPersonalizationService.adaptComplexityLevel({
  procedureName,
  baseExpectations,
  learningProfile,
  procedureEngagementHistory,
  language: 'en',
});

const adaptedAftercare = await aiPersonalizationService.adaptAftercareInstructions({
  procedureName,
  baseAftercare,
  learningProfile,
  language: 'en',
});
```

## UI Indicators

### Personalization Badges

- **Blue badge**: "Personalized for you" on explanations
- **Purple badge**: "Adapted for [pace] learners" on expectations
- **Green badge**: "Personalized aftercare" on aftercare sections
- **Gradient badge**: "AI Personalized" on step cards

### Loading States

- Shows "Personalizing content based on your learning history..." during AI processing
- Displays "Adapting content to your learning pace..." in step-by-step flow

### Error Handling

- Falls back to base content if personalization fails
- Shows warning: "Using standard content (personalization unavailable)"
- Does not break user experience

## Patient Context

Personalization requires patient identification:

```javascript
const patientId = localStorage.getItem('chairiq-patient-id');
const treatmentPlanId = localStorage.getItem('chairiq-treatment-plan-id');
```

If not available, pages display standard content without personalization.

## API Keys Required

### Environment Variables

```env
VITE_OPENAI_API_KEY=your-openai-api-key
VITE_GEMINI_API_KEY=your-gemini-api-key
```

### OpenAI Usage

- Model: `gpt-5-mini` (cost-effective, fast)
- Parameters: `reasoning_effort: 'medium'`, `verbosity: 'medium'/'high'`
- Max tokens: 400-1000 based on attention span

### Gemini Usage

- Model: `gemini-2.5-flash` (fast, structured data)
- Returns JSON arrays for structured expectations
- Handles multimodal content adaptation

## Performance Considerations

### Caching

- Personalized content is cached per procedure ID
- Prevents redundant API calls for same procedure
- Resets when language changes

### Parallel Processing

```javascript
const [adaptedExplanation, adaptedAftercare] = await Promise.all([
  adaptProcedureExplanation(...),
  adaptAftercareInstructions(...),
]);
```

### Error Resilience

- Engagement tracking failures don't break UI
- AI errors fall back to base content
- Console logging for debugging (not user-facing errors)

## Future Enhancements

1. **Real-time adaptation**: Adjust content mid-session based on scroll patterns
2. **A/B testing**: Compare personalized vs standard content effectiveness
3. **Feedback loop**: Learn from patient interactions to improve adaptations
4. **Multi-language support**: Extend beyond English/Spanish
5. **Voice preferences**: Adapt tone based on patient communication style
6. **Accessibility adaptations**: Adjust for screen readers, cognitive load

## Testing

To test personalization:

1. Set patient context in localStorage:
   ```javascript
   localStorage.setItem('chairiq-patient-id', 'test-patient-uuid');
   localStorage.setItem('chairiq-treatment-plan-id', 'test-plan-uuid');
   ```

2. Ensure Supabase has engagement data for test patient

3. Navigate to procedure detail or step-by-step flow

4. Observe personalization indicators and adapted content

## Monitoring

### Key Metrics

- Personalization success rate
- API response times (OpenAI vs Gemini)
- Fallback frequency
- Patient engagement improvement post-personalization

### Logging

- Service errors logged to console
- Engagement events tracked in Supabase
- AI adaptation metadata stored with personalized content

## Security

- API keys stored in environment variables
- Patient data accessed via authenticated Supabase queries
- No sensitive data sent to AI services (only anonymized patterns)
- Content generation follows HIPAA-compliant guidelines