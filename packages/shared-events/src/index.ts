// Phase 2 — BullMQ event bus types
// Defines all async job types across the platform

export interface BaseEvent {
  id: string;
  timestamp: string;
  source: string;
}

export interface IngestCompleteEvent extends BaseEvent {
  type: "ingest.complete";
  payload: {
    showId: string;
    bandId: string;
    assetCount: number;
    totalSizeGb: number;
  };
}

export interface MetadataCompleteEvent extends BaseEvent {
  type: "metadata.complete";
  payload: {
    assetId: string;
    showId: string;
    tags: string[];
    qualityScore: number;
  };
}

export interface ContentApprovedEvent extends BaseEvent {
  type: "content.approved";
  payload: {
    assetId: string;
    bandId: string;
    approvedBy: string;
    distributionTargets: string[];
  };
}

export type PlatformEvent =
  | IngestCompleteEvent
  | MetadataCompleteEvent
  | ContentApprovedEvent;
