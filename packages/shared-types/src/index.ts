// ── User & Auth ─────────────────────────────────────────────────

export type UserRole =
  | "co_owner"
  | "band_admin"
  | "band_member"
  | "promoter"
  | "label"
  | "fan";

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  githubId?: string;
  githubUsername?: string;
  firstLoginComplete: boolean;
  coOwnerSignedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CoOwnerSignature {
  id: string;
  userId: string;
  agreementVersion: string;
  signedAt: string;
  ipAddress: string;
  agreementHash: string;
}

export interface Session {
  id: string;
  userId: string;
  refreshTokenHash: string;
  deviceInfo?: Record<string, unknown>;
  ipAddress?: string;
  expiresAt: string;
  createdAt: string;
}

// ── Band & Content ──────────────────────────────────────────────

export type BandTier = "emerging" | "touring" | "arena" | "stadium";
export type BandMemberRole = "owner" | "manager" | "artist" | "crew" | "viewer";
export type TourStatus = "planning" | "active" | "complete" | "archived";
export type ShowStatus = "scheduled" | "pre_show" | "live" | "post_show" | "complete";

export interface Band {
  id: string;
  name: string;
  slug: string;
  tier: BandTier;
  storageQuotaGb: number;
  storageUsedGb: number;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface Tour {
  id: string;
  bandId: string;
  name: string;
  startDate?: string;
  endDate?: string;
  status: TourStatus;
  productionConfig?: Record<string, unknown>;
  createdAt: string;
}

export interface Show {
  id: string;
  tourId: string;
  bandId: string;
  venueName: string;
  venueCity: string;
  venueCountry: string;
  showDate: string;
  status: ShowStatus;
  ingestNodeId?: string;
  cameraCount: number;
  totalContentGb: number;
  createdAt: string;
}

// ── Ingest & Metadata ───────────────────────────────────────────

export interface AssetMetadata {
  assetId: string;
  showId: string;
  bandId: string;
  cameraSlot: number;
  timecodeStart: string;
  timecodeEnd: string;
  durationSeconds: number;
  technical: {
    codec: string;
    resolution: string;
    frameRate: string;
    audioChannels: number;
    fileSizeGb: number;
  };
  content: {
    sceneType: string;
    performersDetected: string[];
    instrumentsDetected: string[];
    lyricsTranscript?: string;
    songTitleDetected?: string;
    energyLevel: number;
    crowdReaction: number;
  };
  rights: {
    licenseStatus: string;
    clearanceRequired: string[];
    doNotDistribute: boolean;
  };
  brandsDetected: string[];
  tags: string[];
  qualityScore: number;
  processedAt: string;
}

// ── Licensing ───────────────────────────────────────────────────

export type LicenseTier = "standard" | "premium" | "exclusive";

export interface License {
  id: string;
  assetId: string;
  bandId: string;
  grantedTo: string;
  tier: LicenseTier;
  validFrom: string;
  validUntil?: string;
  usageTerms: string;
  createdAt: string;
}

// ── Onboarding ──────────────────────────────────────────────────

export type OnboardingStep =
  | "set_credentials"
  | "connect_github"
  | "sign_agreement"
  | "complete";

export interface OnboardingState {
  currentStep: OnboardingStep;
  username?: string;
  githubConnected: boolean;
  agreementSigned: boolean;
}
