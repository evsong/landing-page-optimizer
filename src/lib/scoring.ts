import { DomData } from './dom-extractor'
import { HarData } from './har-analyzer'
import { ExtendedMetrics } from './extended-metrics'
import { Pa11yResult } from './pa11y'
import { scoreStructure } from './rules/structure'
import { scoreConversion } from './rules/conversion'
import { scoreSeo } from './rules/seo'
import { scoreAccessibility } from './rules/accessibility'
import { scoreFrontendQuality } from './rules/frontend-quality'

export interface Issue {
  dimension: string
  severity: 'high' | 'medium' | 'low'
  message: string
  code?: string
  selector?: string
}

export interface ScoringResult {
  overallScore: number
  letterGrade: string
  structureScore: number
  designScore: number | null
  copyScore: number | null
  conversionScore: number
  performanceScore: number
  seoScore: number
  benchmarkScore: number | null
  accessibilityPenalty: number
  structureIssues: Issue[]
  conversionIssues: Issue[]
  performanceIssues: Issue[]
  seoIssues: Issue[]
  accessibilityIssues: Issue[]
  frontendQualityIssues: Issue[]
}

const WEIGHTS = {
  structure: 0.15,
  design: 0.10,
  copy: 0.15,
  conversion: 0.20,
  performance: 0.15,
  seo: 0.15,
  benchmark: 0.10,
}

function letterGrade(score: number): string {
  if (score >= 95) return 'A+'
  if (score >= 90) return 'A'
  if (score >= 85) return 'B+'
  if (score >= 75) return 'B'
  if (score >= 60) return 'C'
  if (score >= 40) return 'D'
  return 'F'
}

export function computeScores(
  domData: DomData,
  lighthouseData: any,
  pa11yData: Pa11yResult | null,
  harData: HarData | null,
  extendedMetrics: ExtendedMetrics | null,
): ScoringResult {
  // Structure
  const structure = scoreStructure(domData)

  // Conversion
  const conversion = scoreConversion(domData)

  // Performance — Lighthouse base + HAR penalties
  let performanceScore = lighthouseData?.categories?.performance?.score ?? 50
  const performanceIssues: Issue[] = []

  if (harData) {
    if (harData.totalTransferSize > 3 * 1024 * 1024) {
      performanceScore -= 5
      performanceIssues.push({ dimension: 'performance', severity: 'high', message: `Total transfer size ${(harData.totalTransferSize / 1024 / 1024).toFixed(1)}MB exceeds 3MB` })
    }
    if (harData.totalRequests > 80) {
      performanceScore -= 3
      performanceIssues.push({ dimension: 'performance', severity: 'medium', message: `${harData.totalRequests} requests exceeds 80 limit` })
    }
    if (harData.renderBlockingCount > 5) {
      performanceScore -= 3
      performanceIssues.push({ dimension: 'performance', severity: 'medium', message: `${harData.renderBlockingCount} render-blocking resources` })
    }
  }
  if (extendedMetrics) {
    if (extendedMetrics.domNodeCount > 1500) {
      performanceScore -= 2
      performanceIssues.push({ dimension: 'performance', severity: 'low', message: `${extendedMetrics.domNodeCount} DOM nodes exceeds 1500` })
    }
    if (extendedMetrics.longTaskCount > 3) {
      performanceScore -= 2
      performanceIssues.push({ dimension: 'performance', severity: 'medium', message: `${extendedMetrics.longTaskCount} long tasks (>50ms) detected` })
    }
  }
  performanceScore = Math.max(0, Math.min(100, performanceScore))

  // SEO
  const seo = scoreSeo(domData, lighthouseData)

  // Accessibility (Pa11y penalties)
  const accessibility = scoreAccessibility(pa11yData)

  // Frontend quality
  const frontendQuality = scoreFrontendQuality(harData, extendedMetrics)

  // Weighted overall (exclude null dimensions)
  const dimensions: Array<{ score: number; weight: number }> = [
    { score: structure.score, weight: WEIGHTS.structure },
    { score: conversion.score, weight: WEIGHTS.conversion },
    { score: performanceScore, weight: WEIGHTS.performance },
    { score: seo.score, weight: WEIGHTS.seo },
  ]

  let totalWeight = dimensions.reduce((sum, d) => sum + d.weight, 0)
  let weightedSum = dimensions.reduce((sum, d) => sum + d.score * d.weight, 0)

  // Design and copy are null until AI runs — excluded from initial calc
  // Benchmark is null until we have industry data

  const overallScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0

  // Apply accessibility penalty to overall
  const finalScore = Math.max(0, Math.min(100, overallScore - accessibility.penalty))

  return {
    overallScore: finalScore,
    letterGrade: letterGrade(finalScore),
    structureScore: structure.score,
    designScore: null,
    copyScore: null,
    conversionScore: conversion.score,
    performanceScore,
    seoScore: seo.score,
    benchmarkScore: null,
    accessibilityPenalty: accessibility.penalty,
    structureIssues: structure.issues,
    conversionIssues: conversion.issues,
    performanceIssues,
    seoIssues: seo.issues,
    accessibilityIssues: accessibility.issues,
    frontendQualityIssues: frontendQuality.issues,
  }
}
