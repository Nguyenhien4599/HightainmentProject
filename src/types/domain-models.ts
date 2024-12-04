// src/types/models.ts

export interface Recommendations {
    type: RecommendationType;
    headers: number[];
    recommendations: Track[][];
}

export enum RecommendationType {
    GENRES = 'GENRES',
    TAGS = 'TAGS',
    BASE = 'BASE',
}

export interface User {
    id: string;
    username: string;
    email: string;
    reviews: Review[];
    watchedTracks: SimpleTrack[];
    watchLaterTracks: SimpleTrack[];
    watchProviders: WatchProvider[];
}

export interface Title {
    id: number;
    englishName: string;
    localName: string;
    summary: string;
    mainPhotoUrl: string;
    type: TitleType | undefined;
}

export interface Track {
    id: number;
    title: Title;
    name: string;
    season: number;
    episode: number;
    releaseDate: Date;
    durationInSeconds: number;
    mainPhotoUrl: string;
    backdropPhotoUrl: string;
    summary: string;
    genres: Genre[];
    tags: Tag[];
    watchProviders: WatchProvider[];
    userScore: number;
    userScoreCount: number;
    hightainmentScore: number;
}

export interface SimpleTrack {
    id: number;
    titleId: number | undefined;
    name: string;
    season: number;
    episode: number;
    releaseDate: Date;
    durationInSeconds: number;
    mainPhotoUrl: string;
    backdropPhotoUrl: string;
    userScore: number;
    userScoreCount: number;
    hightainmentScore: number;
    summary: string;
}

export interface SearchResult {
    movies: SimpleTrack[];
    tvSeries: SimpleTrack[];
}

export interface Genre {
    id: number;
    name: string;
    displayPriority: number;
}

export interface Tag {
    id: number;
    name: string;
    averageRating: number;
    ratingCount: number;
    displayPriority: number;
}

export interface WatchProvider {
    id: number;
    name: string;
    watchProviderLogoUrl: string;
    watchProviderType: string;
    displayPriority: number;
    watchProviderLink: string;
    subWatchProviders: WatchProvider[];
}

export enum TitleType {
    MOVIE = 'MOVIE',
    TV_SERIES = 'TV_SERIES',
}

export interface Review {
    id: number;
    user: User;
    trackID: number;
    track?: SimpleTrack;
    rating: number;
    content: string;
    tagRatings: ReviewTagRating[];
    createdAt: Date;
    updatedAt: Date;
}

export interface AddReviewBody {
    rating: number;
    content: string;
    tagRatings: ReviewTagRating[];
}

export interface ReviewTagRating {
    tagID: number;
    tagName: string;
    tagRating: number;
}

export interface Aura {
    id?: number;
    name: string;
    tags: Tag[];
    genres: Genre[];
    minReleaseDate: Date | null;
    maxReleaseDate: Date | null;
    types: TitleType[] | null;
}
