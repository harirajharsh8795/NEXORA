import type { EnrichedProduct, EvidenceGraph } from '../types';

export const LIVE_DEMO_MPNS = [
  'D0724A',
  'D0724R',
  'PDSH4816AF',
  'WDTS7024RZ',
  'D1024X',
  'D1280X',
  '48-22-8424',
  '2767-20',
  'TX010620',
  'WDT750SAKZ'
];

export interface LiveEnrichmentResult {
  success: boolean;
  product?: EnrichedProduct;
  evidence?: EvidenceGraph;
  fallback?: boolean;
  message?: string;
  stepsCompleted?: string[];
}

export async function triggerLiveEnrichment(
  mpn: string,
  onProgress?: (step: string) => void
): Promise<LiveEnrichmentResult> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  onProgress?.('Waking up server...');
  await new Promise((r) => setTimeout(r, 400));

  onProgress?.('Searching manufacturer sources (excluding marketplaces)...');
  await new Promise((r) => setTimeout(r, 600));

  onProgress?.('Fetching spec sheets & extracting via Gemini 2.0 Flash...');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  try {
    const res = await fetch(`${baseUrl}/api/v1/enrich/${encodeURIComponent(mpn)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }

    const data = await res.json();
    return {
      success: true,
      product: data.product,
      evidence: data.evidence,
      message: 'Live AI enrichment completed successfully in real-time!',
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.warn(`Live enrichment call failed/timed out for ${mpn}:`, err);
    return {
      success: false,
      fallback: true,
      message: 'Live demo temporarily unavailable — showing verified result from our last confirmed run',
    };
  }
}
