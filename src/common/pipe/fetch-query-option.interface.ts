export interface FetchQueryOption {
    page?: number;
    limit?: number;
    skip?: number;
    select?: Record<string, unknown>;
    sort?: Record<string, unknown>;
}
