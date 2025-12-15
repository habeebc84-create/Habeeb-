
export interface GroundingChunk {
  maps?: {
    sourceId?: string;
    title?: string;
    uri?: string;
    placeAnswerSources?: {
      reviewSnippets?: {
        content?: string;
      }[];
    };
  };
}

export interface GroundingMetadata {
  groundingChunks: GroundingChunk[];
  groundingSupports?: any[];
  webSearchQueries?: string[];
}

export interface DealResult {
  text: string;
  places: GroundingChunk[];
}

export interface LocationState {
  lat: number;
  lng: number;
}
