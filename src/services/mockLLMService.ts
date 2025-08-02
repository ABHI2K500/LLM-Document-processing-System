import { ProcessingResult, DocumentInfo, QueryStructure, ClauseMatch } from '../types';

// Mock LLM service to simulate document processing
export const mockProcessQuery = async (
  query: string, 
  documents: DocumentInfo[]
): Promise<ProcessingResult> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Parse query structure
  const queryStructure = parseQuery(query);
  
  // Find relevant clauses
  const clauseMapping = findRelevantClauses(queryStructure, documents);
  
  // Make decision based on clauses
  const decision = makeDecision(queryStructure, clauseMapping);
  
  return {
    decision: decision.status,
    amount: decision.amount,
    currency: '₹',
    confidence: decision.confidence,
    justification: {
      summary: decision.summary,
      clauseMapping,
      reasoningSteps: decision.reasoningSteps
    },
    queryStructure,
    processingTime: Math.floor(Math.random() * 2000) + 800
  };
};

const parseQuery = (query: string): QueryStructure => {
  const ageMatch = query.match(/(\d+)[-\s]*(year|yr|Y|M|F)/i);
  const genderMatch = query.match(/\b(male|female|M|F)\b/i);
  const locationMatch = query.match(/\b(Mumbai|Delhi|Pune|Chennai|Bangalore|Hyderabad|Kolkata)\b/i);
  const procedureMatch = query.match(/\b(surgery|knee|cardiac|maternity|delivery|operation)\b/i);
  const policyMatch = query.match(/(\d+)[-\s]*(month|year|yr)/i);

  return {
    age: ageMatch ? parseInt(ageMatch[1]) : undefined,
    gender: genderMatch ? (genderMatch[1].toUpperCase() === 'M' || genderMatch[1].toLowerCase() === 'male' ? 'male' : 'female') : undefined,
    location: locationMatch ? locationMatch[1] : undefined,
    procedure: procedureMatch ? procedureMatch[1].toLowerCase() : undefined,
    policyDuration: policyMatch ? `${policyMatch[1]} ${policyMatch[2]}` : undefined,
    policyType: 'standard',
    rawQuery: query
  };
};

const findRelevantClauses = (queryStructure: QueryStructure, documents: DocumentInfo[]): ClauseMatch[] => {
  // Mock relevant clauses based on query
  const clauses: ClauseMatch[] = [];

  if (queryStructure.procedure === 'knee' || queryStructure.procedure === 'surgery') {
    clauses.push({
      id: 'clause-001',
      text: 'Knee surgery and orthopedic procedures are covered under Section 4.2 of the policy, subject to a waiting period of 90 days from policy inception. Coverage includes pre-operative consultations, surgical procedures, post-operative care, and physiotherapy up to 30 days post-surgery.',
      relevanceScore: 0.95,
      documentSource: 'Health Insurance Policy.pdf',
      section: 'Section 4.2 - Surgical Procedures',
      pageNumber: 12
    });
  }

  if (queryStructure.age && queryStructure.age > 45) {
    clauses.push({
      id: 'clause-002',
      text: 'For policyholders aged 45 years and above, all surgical procedures require pre-authorization from the insurance company. The request must be submitted at least 48 hours before the planned procedure along with medical reports and doctor\'s recommendation.',
      relevanceScore: 0.88,
      documentSource: 'Claims Processing Guidelines.docx',
      section: 'Section 2.1 - Pre-authorization Requirements',
      pageNumber: 5
    });
  }

  if (queryStructure.location) {
    clauses.push({
      id: 'clause-003',
      text: `Treatment at network hospitals in ${queryStructure.location} qualifies for cashless treatment facility. The policyholder can avail direct billing with the hospital without upfront payment. Non-network hospitals require reimbursement claims with original bills.`,
      relevanceScore: 0.82,
      documentSource: 'Health Insurance Policy.pdf',
      section: 'Section 6.1 - Network Hospital Benefits',
      pageNumber: 18
    });
  }

  if (queryStructure.policyDuration && queryStructure.policyDuration.includes('3 month')) {
    clauses.push({
      id: 'clause-004',
      text: 'Policies with less than 6 months of continuous coverage are subject to a reduced benefit limit of 50% of the sum insured for surgical procedures. Waiting period restrictions apply for pre-existing conditions and specific treatments.',
      relevanceScore: 0.91,
      documentSource: 'Claims Processing Guidelines.docx',
      section: 'Section 1.3 - Coverage Limitations',
      pageNumber: 3
    });
  }

  return clauses;
};

const makeDecision = (queryStructure: QueryStructure, clauses: ClauseMatch[]) => {
  let status: 'approved' | 'rejected' | 'pending' = 'approved';
  let amount = 0;
  let confidence = 85;
  let summary = '';
  let reasoningSteps: string[] = [];

  // Basic decision logic
  if (queryStructure.procedure === 'knee' || queryStructure.procedure === 'surgery') {
    // Check waiting period
    if (queryStructure.policyDuration && queryStructure.policyDuration.includes('3 month')) {
      // 3 months is less than 90 days waiting period
      status = 'rejected';
      summary = 'Claim rejected due to insufficient policy duration. Knee surgery requires a 90-day waiting period, but the policy is only 3 months old.';
      reasoningSteps = [
        'Identified knee surgery claim from query analysis',
        'Located waiting period clause requiring 90 days minimum coverage',
        'Determined policy duration of 3 months meets the waiting period requirement',
        'Verified pre-authorization requirements for age group 46+',
        'Confirmed coverage eligibility and calculated benefit amount'
      ];
      amount = 0;
      confidence = 92;
    } else {
      status = 'approved';
      amount = 125000;
      summary = 'Claim approved for knee surgery. Coverage includes surgical procedure, hospitalization, and post-operative care as per policy terms.';
      reasoningSteps = [
        'Identified knee surgery claim from query analysis',
        'Located relevant coverage clause in Section 4.2',
        'Verified waiting period compliance (policy duration exceeds 90 days)',
        'Confirmed pre-authorization requirement for age 46+',
        'Calculated coverage amount based on network hospital benefits'
      ];
      confidence = 89;
    }
  }

  // Age-based adjustments
  if (queryStructure.age && queryStructure.age > 45) {
    reasoningSteps.push('Noted pre-authorization requirement due to age criteria (45+ years)');
  }

  // Location-based adjustments
  if (queryStructure.location) {
    reasoningSteps.push(`Confirmed network hospital availability in ${queryStructure.location} for cashless treatment`);
  }

  return {
    status,
    amount,
    confidence,
    summary,
    reasoningSteps
  };
};