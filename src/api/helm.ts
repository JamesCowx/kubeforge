export interface Chart { name: string; version: string; description: string; values: Record<string, any>; templates: ChartTemplate[]; }
export interface ChartTemplate { name: string; content: string; }
export function generateChart(chart: Chart): Record<string, string> { return { 'Chart.yaml': `apiVersion: v2
name: ${chart.name}
version: ${chart.version}
description: ${chart.description}`, 'values.yaml': Object.entries(chart.values).map(([k, v]) => `${k}: ${v}`).join('\n') }; }
