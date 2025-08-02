export interface DocumentInfo {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  content?: string;
}

export interface QueryStructure {
  age?: number;
  gender?: string;
  procedure?: string;
  location?: string;
  policyDuration?: string;
  policyType?: string;
  rawQuery: string;
}

export interface ClauseMatch {
  id: string;
  text: string;
  relevanceScore: number;
  documentSource: string;
  section: string;
  pageNumber?: number;
}

export interface ProcessingResult {
  decision: 'approved' | 'rejected' | 'pending';
  amount?: number;
  currency?: string;
  confidence: number;
  justification: {
    summary: string;
    clauseMapping: ClauseMatch[];
    reasoningSteps: string[];
  };
  queryStructure: QueryStructure;
  processingTime: number;
}

export interface QueryHistory {
  id: string;
  query: string;
  timestamp: Date;
  result: ProcessingResult;
}