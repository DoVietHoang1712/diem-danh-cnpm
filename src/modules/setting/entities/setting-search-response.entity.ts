import { SettingSearchBody } from './setting-search.entity';
export interface SettingSearchResult {
    hits: {
        total: number;
        hits: Array<{
            _source: SettingSearchBody,
        }>;
    };
}