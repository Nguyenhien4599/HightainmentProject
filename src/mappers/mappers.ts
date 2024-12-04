// src/mappers/mappers.ts

import { RATING_SCALE } from '@/common/helper';
import {
    DbGenre,
    DbTag,
    DbTitle,
    DbTrack,
    DbTitleType,
    DbTrackToWatchProvider,
    DbReview,
    DbReviewToTag,
    DbRecommendations,
    DbRecommendationType,
    DbAura,
    DbWatchProvider,
    DbUser,
    DbTrackToTag,
    DbSearchResult,
    DbParentWatchProvider,
} from '../types/api-models';
import {
    ReviewTagRating,
    Genre,
    Tag,
    Title,
    Track,
    TitleType,
    WatchProvider,
    Review,
    Recommendations,
    RecommendationType,
    Aura,
    User,
    SimpleTrack,
    SearchResult,
} from '../types/domain-models';

export function mapDbRecommendationsToRecommendations(dbRecommendations: DbRecommendations): Recommendations {
    return {
        type: mapDbRecommendationTypeToRecommendationType(dbRecommendations.type),
        headers: dbRecommendations.headers,
        recommendations: dbRecommendations.recommendations.map((recommendationRow: DbTrack[]) =>
            recommendationRow.map(mapDbTrackToTrack),
        ),
    };
}

export function mapDbRecommendationTypeToRecommendationType(
    dbRecommendationType: DbRecommendationType,
): RecommendationType {
    if (dbRecommendationType === DbRecommendationType.GENRES) {
        return RecommendationType.GENRES;
    }

    if (dbRecommendationType === DbRecommendationType.TAGS) {
        return RecommendationType.TAGS;
    }

    return RecommendationType.BASE;
}

export function mapDbTitleToTitle(dbTitle: DbTitle): Title {
    return {
        id: dbTitle.id,
        englishName: dbTitle.english_name, // Mapping the different property name
        localName: dbTitle.local_name,
        summary: dbTitle.summary,
        mainPhotoUrl: dbTitle.main_photo_url,
        type: getTitleTypeFromDbTitleType(dbTitle.type),
    };
}

export function mapDbSearchResultToSearchResult(dbSearchResult: DbSearchResult): SearchResult {
    return {
        movies: dbSearchResult.movies.map(mapDbTrackToSimpleTrack),
        tvSeries: dbSearchResult.tv_series.map(mapDbTrackToSimpleTrack),
    };
}

export function mapDbTrackToSimpleTrack(dbTrack: DbTrack): SimpleTrack {
    return {
        id: dbTrack.id,
        titleId: dbTrack.title_id || dbTrack.title?.id,
        name: dbTrack.name, // Mapping the different property name
        season: dbTrack.season,
        episode: dbTrack.episode,
        releaseDate: new Date(dbTrack.release_date),
        durationInSeconds: dbTrack.duration_in_seconds,
        mainPhotoUrl: dbTrack.main_photo_url,
        backdropPhotoUrl: dbTrack.backdrop_photo_url,
        userScore: parseFloat((RATING_SCALE * dbTrack.user_score).toFixed(2)),
        userScoreCount: dbTrack.user_score_count,
        hightainmentScore: dbTrack.hightainment_score,
        summary: dbTrack.summary
    };
}

export function mapDbTrackToTrack(dbTrack: DbTrack): Track {
    return {
        id: dbTrack.id,
        title: mapDbTitleToTitle(dbTrack.title!!),
        name: dbTrack.name, // Mapping the different property name
        season: dbTrack.season,
        episode: dbTrack.episode,
        releaseDate: new Date(dbTrack.release_date),
        durationInSeconds: dbTrack.duration_in_seconds,
        mainPhotoUrl: dbTrack.main_photo_url,
        backdropPhotoUrl: dbTrack.backdrop_photo_url,
        summary: dbTrack.summary,
        genres: dbTrack.genres?.map(mapDbGenreToGenre) || [],
        tags: dbTrack.track_to_tags?.map(mapDbTrackToTagToTag) || [],
        watchProviders: dbTrack.track_to_watch_providers?.map(mapDbTrackToWatchProviderToWatchProvider) || [],
        userScore: parseFloat((RATING_SCALE * dbTrack.user_score).toFixed(2)),
        userScoreCount: dbTrack.user_score_count,
        hightainmentScore: dbTrack.hightainment_score,
    };
}

export function mapDbGenreToGenre(dbGenre: DbGenre): Genre {
    return {
        id: dbGenre.id,
        name: dbGenre.name,
        displayPriority: dbGenre.display_priority,
    };
}

export function mapDbTrackToTagToTag(dbTrackToTag: DbTrackToTag): Tag {
    return {
        id: dbTrackToTag.tag.id,
        name: dbTrackToTag.tag.name,
        averageRating: RATING_SCALE * dbTrackToTag.average_rating || 0,
        ratingCount: dbTrackToTag.rating_count || 0,
        displayPriority: 0,
    };
}

export function mapDbParentWatchProviderToWatchProvider(dbParentWatchProvider: DbParentWatchProvider): WatchProvider {
    return {
        id: dbParentWatchProvider.id,
        name: dbParentWatchProvider.name,
        watchProviderLogoUrl: dbParentWatchProvider.logo_url,
        watchProviderType: '',
        displayPriority: dbParentWatchProvider.display_priority,
        watchProviderLink: '',
        subWatchProviders:
            dbParentWatchProvider.watch_providers?.map((dbWatchProvider: DbWatchProvider) => {
                return {
                    id: dbWatchProvider.id,
                    name: dbWatchProvider.name,
                    watchProviderLogoUrl: dbWatchProvider.logo_url,
                    watchProviderType: '',
                    displayPriority: dbWatchProvider.display_priority,
                    watchProviderLink: '',
                    subWatchProviders: [],
                };
            }) || [],
    };
}

export function mapDbTagToTag(dbTag: DbTag): Tag {
    return {
        id: dbTag.id,
        name: dbTag.name,
        averageRating: 0,
        ratingCount: 0,
        displayPriority: dbTag.display_priority,
    };
}

export function mapDbAuraToAura(dbAura: DbAura): Aura {
    const auraTitleType = getTitleTypeFromDbTitleType(dbAura.media_type);
    return {
        id: dbAura.id,
        name: dbAura.name,
        tags: dbAura.tags?.map(mapDbTagToTag) || [],
        genres: dbAura.genres?.map(mapDbGenreToGenre) || [],
        minReleaseDate: dbAura.min_release_date,
        maxReleaseDate: dbAura.max_release_date,
        types: dbAura.media_type && auraTitleType ? [auraTitleType] : null,
    };
}

export function mapDbReviewToReview(dbReview: DbReview, user: User | undefined = undefined): Review {
    return {
        id: dbReview.id,
        user: user ? user : mapDbUserToUser(dbReview.user),
        trackID: dbReview.track_id,
        track: dbReview.track ? mapDbTrackToSimpleTrack(dbReview.track) : undefined,
        content: dbReview.content,
        rating: parseFloat((RATING_SCALE * dbReview.rating).toFixed(2)),
        tagRatings: dbReview.review_to_tags.map((reviewToTag: DbReviewToTag) =>
            DbReviewToTagToReviewTagRating(reviewToTag),
        ),
        createdAt: new Date(dbReview.created_at),
        updatedAt: new Date(dbReview.updated_at),
    };
}

export function DbReviewToTagToReviewTagRating(dbReviewToTag: DbReviewToTag): ReviewTagRating {
    return {
        tagID: dbReviewToTag.tag_id,
        tagName: dbReviewToTag.tag.name,
        tagRating: parseFloat((RATING_SCALE * dbReviewToTag.rating).toFixed(2)),
    };
}

export function mapDbTrackToWatchProviderToWatchProvider(
    dbTrackToWatchProvider: DbTrackToWatchProvider,
): WatchProvider {
    return {
        id: dbTrackToWatchProvider.watch_provider.id,
        name: dbTrackToWatchProvider.watch_provider.name,
        watchProviderLogoUrl: dbTrackToWatchProvider.watch_provider.logo_url,
        watchProviderType: dbTrackToWatchProvider.watch_provider_type,
        displayPriority: dbTrackToWatchProvider.watch_provider.display_priority,
        watchProviderLink: dbTrackToWatchProvider.watch_provider_link,
        subWatchProviders: [],
    };
}

export function getTitleTypeFromDbTitleType(dbTitleType: DbTitleType | undefined | null): TitleType | undefined {
    if (!dbTitleType) {
        return undefined;
    }
    // Ensure the string value matches one of the enum values
    return (Object.values(TitleType) as string[]).includes(dbTitleType.valueOf())
        ? (dbTitleType.valueOf() as TitleType)
        : undefined;
}

export function mapDbUserToUser(dbUser: DbUser): User {
    const reviews =
        dbUser.reviews?.map(
            (dbReview: DbReview) =>
                mapDbReviewToReview(dbReview, {
                    id: dbUser.id,
                    username: dbUser.username,
                    email: dbUser.email,
                    reviews: [],
                    watchedTracks: [],
                    watchLaterTracks: [],
                    watchProviders: [],
                })!!,
        ) || [];
    return {
        id: dbUser.id,
        username: dbUser.username,
        email: dbUser.email,
        reviews: reviews,
        watchedTracks:
            [
                ...(dbUser.watched_tracks || []).map(mapDbTrackToSimpleTrack),
                ...(reviews || []).filter((r) => r !== undefined).map((r) => r.track!!),
            ] || [],
        watchLaterTracks: dbUser.watch_later_tracks?.map(mapDbTrackToSimpleTrack) || [],
        watchProviders: dbUser.parent_watch_providers?.map(mapDbParentWatchProviderToWatchProvider) || [],
    };
}
