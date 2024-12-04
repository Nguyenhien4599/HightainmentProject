// src/types/api.ts
import { ligatures } from '../../node_modules/@fortawesome/free-solid-svg-icons/fa0.d';

export interface DbRecommendations {
    type: DbRecommendationType;
    headers: number[];
    recommendations: DbTrack[][];
}

export enum DbRecommendationType {
    GENRES = 'GENRES',
    TAGS = 'TAGS',
    BASE = 'BASE',
}

export interface DbUser {
    id: string;
    username: string;
    email: string;
    reviews?: DbReview[];
    watched_tracks?: DbTrack[];
    watch_later_tracks?: DbTrack[];
    parent_watch_providers?: DbParentWatchProvider[];
}

export interface DbTitle {
    id: number;
    english_name: string;
    local_name: string;
    summary: string;
    main_photo_url: string;
    type: DbTitleType;
}

export interface DbSearchResult {
    movies: DbTrack[];
    tv_series: DbTrack[];
}

export interface DbTrack {
    id: number;
    title?: DbTitle;
    title_id?: number;
    name: string;
    season: number;
    episode: number;
    release_date: string;
    duration_in_seconds: number;
    summary: string;
    type: DbTitleType;
    genres?: DbGenre[];
    // tags?: DbTag[];
    track_to_tags?: DbTrackToTag[];
    track_to_watch_providers?: DbTrackToWatchProvider[];
    main_photo_url: string;
    backdrop_photo_url: string;
    reviews?: DbReview[];
    user_score: number;
    user_score_count: number;
    hightainment_score: number;
}

export interface DbGenre {
    id: number;
    name: string;
    display_priority: number;
}

export interface DbTag {
    id: number;
    name: string;
    display_priority: number;
}

export interface DbTrackToWatchProvider {
    id: number;
    watch_provider: DbWatchProvider;
    watch_provider_type: string;
    watch_provider_link: string;
    watch_provider_locale: string;
}

export interface DbTrackToTag {
    id: number;
    tag: DbTag;
    tag_id: number;
    track_id: number;
    average_rating: number;
    rating_count: number;
}

export interface DbParentWatchProvider {
    id: number;
    name: string;
    logo_url: string;
    display_priority: number;
    watch_providers: DbWatchProvider[];
}
export interface DbWatchProvider {
    id: number;
    name: string;
    logo_url: string;
    display_priority: number;
}

export enum DbTitleType {
    MOVIE = 'MOVIE',
    TV_SERIES = 'TV_SERIES',
}

export interface DbReview {
    id: number;
    user: DbUser;
    track_id: number;
    track?: DbTrack;
    rating: number;
    content: string;
    review_to_tags: DbReviewToTag[];
    created_at: string;
    updated_at: string;
}

export interface DbReviewToTag {
    review_id: number;
    rating: number;
    tag_id: number;
    rating_denominator: number;
    tag: DbTag;
}

export interface DbAura {
    id: number;
    name: string;
    tags?: DbTag[];
    genres?: DbGenre[];
    min_release_date: Date | null;
    max_release_date: Date | null;
    media_type: DbTitleType | null;
}
