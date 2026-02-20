## ADDED Requirements

### Requirement: Benchmark percentile scoring
The system SHALL calculate a benchmark score as the percentile rank of the current page's total score among all historical analyses stored in the database.

#### Scenario: Page scores in 75th percentile
- **WHEN** a page receives a total score of 72 and 75% of historical analyses scored below 72
- **THEN** the benchmark score is 75

#### Scenario: First analysis (no history)
- **WHEN** no historical analyses exist in the database
- **THEN** the benchmark score is 50 (default median)

### Requirement: Benchmark stats updated after each analysis
The system SHALL update aggregate statistics after each completed analysis to keep percentile calculations current.

#### Scenario: New analysis updates stats
- **WHEN** an analysis completes successfully
- **THEN** the total score is recorded for future percentile calculations
