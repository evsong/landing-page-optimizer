## ADDED Requirements

### Requirement: REQ-AI-001 Actionable Optimization Suggestions
The system SHALL generate specific, actionable optimization suggestions based on analysis results using an AI API (Claude or GPT).

#### Scenario: Suggestion generation
- **WHEN** analysis and scoring are complete
- **THEN** system sends the scores, detected issues, and page content to AI API and receives a list of prioritized suggestions, each with: issue description, impact level (high/medium/low), specific fix recommendation, and affected dimension

#### Scenario: FREE tier summary
- **WHEN** user is on FREE plan
- **THEN** system shows only the top 3 suggestions as brief summaries without detailed fix recommendations, with a prompt to upgrade for full suggestions

### Requirement: REQ-AI-002 Copy Rewrite Suggestions
The system SHALL generate alternative copy for underperforming text elements (headlines, CTAs, value propositions).

#### Scenario: Headline rewrite
- **WHEN** copy quality score identifies a weak headline (score < 70)
- **THEN** system generates 3 alternative headline options with brief rationale for each

#### Scenario: CTA rewrite
- **WHEN** conversion score identifies weak CTA text
- **THEN** system generates 3 alternative CTA text options optimized for action-orientation

#### Scenario: PRO-only gating
- **WHEN** user is on FREE plan and copy rewrites are generated
- **THEN** system shows rewrite suggestions as locked/blurred with upgrade prompt

### Requirement: REQ-AI-003 AI Cost Control
The system SHALL limit AI API costs by using efficient prompts and appropriate model tiers.

#### Scenario: Model selection
- **WHEN** generating suggestions
- **THEN** system uses Claude Haiku or GPT-4o-mini for standard suggestions and reserves Claude Sonnet/GPT-4o for Vision analysis only

#### Scenario: Prompt caching
- **WHEN** the same URL is analyzed within 24 hours
- **THEN** system returns cached AI suggestions instead of making new API calls
