import { RATING_SCALE, formatDateToYyyyMmDd } from '@/common/helper';
import {
    mapDbAuraToAura,
    mapDbGenreToGenre,
    mapDbParentWatchProviderToWatchProvider,
    mapDbRecommendationsToRecommendations,
    mapDbReviewToReview,
    mapDbSearchResultToSearchResult,
    mapDbTagToTag,
    mapDbTitleToTitle,
    mapDbTrackToSimpleTrack,
    mapDbTrackToTrack,
    mapDbUserToUser,
} from '@/mappers/mappers';
import {
    DbAura,
    DbGenre,
    DbParentWatchProvider,
    DbRecommendations,
    DbReview,
    DbSearchResult,
    DbTag,
    DbTitle,
    DbTrack,
    DbUser,
} from '@/types/api-models';
import {
    AddReviewBody,
    Aura,
    Genre,
    Recommendations,
    Review,
    ReviewTagRating,
    SearchResult,
    SimpleTrack,
    Tag,
    Title,
    TitleType,
    Track,
    User,
    WatchProvider,
} from '@/types/domain-models';
import { del, get, post, put } from '@aws-amplify/api';
import { JWT } from 'aws-amplify/auth';
import { HttpStatusCode } from 'axios';
import { createContext, useContext } from 'react';
import { IUserContext, UserContext } from './UserContextProvider';

interface IApiContext {
    getRecommendations: (
        watchProviders: WatchProvider[],
        genres: Genre[],
        tags: Tag[],
        minReleaseDate: Date | null,
        maxReleaseDate: Date | null,
        types: TitleType[],
        page: number,
    ) => Promise<Recommendations | null>;
    getTitle: (titleId: number) => Promise<Title | null>;
    getTrack: (trackId: number) => Promise<Track | null>;
    getReviews: (titleId: number, trackId: number) => Promise<Review[] | null>;
    addReview: (titleId: number, trackId: number, review: AddReviewBody) => Promise<Review | null>;
    updateReview: (reviewId: number, review: AddReviewBody) => Promise<Review | null>;
    getGenres: () => Promise<Genre[]>;
    getTags: () => Promise<Tag[]>;
    getWatchProviders: () => Promise<WatchProvider[]>;
    getAuras: () => Promise<Aura[]>;
    addAura: (aura: Aura) => Promise<Aura | null>;
    deleteAura: (auraID: number) => Promise<boolean>;
    updateAura: (auraID: number, auraName: string) => Promise<Aura | null>;
    getUser: (userID: string) => Promise<User | null>;
    updateUser: (userID: string, username: string, email: string) => Promise<User | null>;
    search: (query: string) => Promise<SearchResult | null>;
    addToWatched: (titleId: number, trackId: number) => Promise<SimpleTrack | null>;
    deleteFromWatched: (titleId: number, trackId: number) => Promise<boolean>;
    addToWatchLater: (titleId: number, trackId: number) => Promise<SimpleTrack | null>;
    deleteFromWatchLater: (titleId: number, trackId: number) => Promise<boolean>;
    addWatchProviderToUser: (userId: string, watchProviderId: number) => Promise<User | null>;
    deleteWatchProviderFromUser: (userId: string, watchProviderId: number) => Promise<boolean>;
}

interface Props {
    children: JSX.Element | Array<JSX.Element>;
}

const defaultContext: IApiContext = {
    getRecommendations: () => Promise.resolve(null),
    getTitle: () => Promise.resolve(null),
    getTrack: () => Promise.resolve(null),
    getReviews: () => Promise.resolve(null),
    addReview: () => Promise.resolve(null),
    updateReview: () => Promise.resolve(null),
    getGenres: () => Promise.resolve([]),
    getTags: () => Promise.resolve([]),
    getWatchProviders: () => Promise.resolve([]),
    getAuras: () => Promise.resolve([]),
    addAura: () => Promise.resolve(null),
    deleteAura: () => Promise.resolve(false),
    updateAura: () => Promise.resolve(null),
    getUser: () => Promise.resolve(null),
    updateUser: () => Promise.resolve(null),
    search: () => Promise.resolve(null),
    addToWatched: () => Promise.resolve(null),
    deleteFromWatched: () => Promise.resolve(false),
    addToWatchLater: () => Promise.resolve(null),
    deleteFromWatchLater: () => Promise.resolve(false),
    addWatchProviderToUser: () => Promise.resolve(null),
    deleteWatchProviderFromUser: () => Promise.resolve(false),
};

const ApiContext = createContext(defaultContext);

const AWS_API_NAME = 'hightainmentRestAPI';

async function getRecommendationsApi(
    accessToken: JWT,
    watchProviders: WatchProvider[],
    genres: Genre[],
    tags: Tag[],
    minReleaseDate: Date | null,
    maxReleaseDate: Date | null,
    types: TitleType[],
    page: number = 1,
): Promise<Recommendations> {
    const response = await get({
        apiName: AWS_API_NAME,
        path: '/recommendations',
        options: {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            queryParams: {
                watch_providers: watchProviders.map((watchProvider: WatchProvider) => watchProvider.id).join(','),
                genres: genres.map((genre: Genre) => genre.id.toString()).join(','),
                tags: tags.map((tag: Tag) => tag.id.toString()).join(','),
                ...(minReleaseDate && { min_release_date: formatDateToYyyyMmDd(minReleaseDate) }),
                ...(maxReleaseDate && { max_release_date: formatDateToYyyyMmDd(maxReleaseDate) }),
                title_types: types.join(','),
                page: page.toString(),
            },
        },
    }).response;

    const data = await response.body.json(); // Assuming response has a json() method
    return mapDbRecommendationsToRecommendations(data as unknown as DbRecommendations);
}

async function getTitleApi(accessToken: JWT, titleId: number): Promise<Title> {
    try {
        const response = await get({
            apiName: AWS_API_NAME,
            path: `/titles/${titleId}`,
            options: {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        }).response;

        const data = await response.body.json();
        return mapDbTitleToTitle(data as unknown as DbTitle);
    } catch (error) {
        throw new Error('Error fetching title'); // Or throw error directly
    }
}

async function getTrackApi(accessToken: JWT, trackId: number): Promise<Track> {
    try {
        const response = await get({
            apiName: AWS_API_NAME,
            path: `/tracks/${trackId}`,
            options: {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        }).response;

        const data = await response.body.json();
        return mapDbTrackToTrack(data as unknown as DbTrack);
    } catch (error) {
        throw new Error('Error fetching title'); // Or throw error directly
    }
}

async function getReviewsApi(accessToken: JWT, titleId: number, trackId: number): Promise<Review[]> {
    try {
        const response = await get({
            apiName: AWS_API_NAME,
            path: `/titles/${titleId}/tracks/${trackId}/reviews`,
            options: {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        }).response;

        const data = await response.body.json();
        return (data as unknown as DbReview[]).map((review: DbReview) => mapDbReviewToReview(review));
    } catch (error) {
        throw new Error('Error fetching title');
    }
}

async function addReviewApi(
    accessToken: JWT,
    titleId: number,
    trackId: number,
    review: AddReviewBody,
): Promise<Review> {
    try {
        const response = await post({
            apiName: AWS_API_NAME,
            path: `/titles/${titleId}/tracks/${trackId}/reviews`,
            options: {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: {
                    content: review.content,
                    rating: review.rating / RATING_SCALE,
                    tag_id_to_ratings: review.tagRatings.reduce(
                        (acc: { [key: number]: number }, reviewTagRating: ReviewTagRating) => {
                            acc[reviewTagRating.tagID] = reviewTagRating.tagRating / RATING_SCALE;
                            return acc;
                        },
                        {},
                    ),
                },
            },
        }).response;

        const data = await response.body.json();
        return mapDbReviewToReview(data as unknown as DbReview);
    } catch (error) {
        throw new Error('Error adding review');
    }
}

async function updateReviewApi(accessToken: JWT, reviewId: number, review: AddReviewBody): Promise<Review> {
    try {
        const response = await put({
            apiName: AWS_API_NAME,
            path: `/reviews/${reviewId}`,
            options: {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: {
                    content: review.content,
                    rating: review.rating / RATING_SCALE,
                    tag_id_to_ratings: review.tagRatings.reduce(
                        (acc: { [key: number]: number }, reviewTagRating: ReviewTagRating) => {
                            acc[reviewTagRating.tagID] = reviewTagRating.tagRating / RATING_SCALE;
                            return acc;
                        },
                        {},
                    ),
                },
            },
        }).response;

        const data = await response.body.json();
        return mapDbReviewToReview(data as unknown as DbReview);
    } catch (error) {
        throw new Error('Error adding review');
    }
}

async function getGenresApi(accessToken: JWT): Promise<Genre[]> {
    try {
        const response = await get({
            apiName: AWS_API_NAME,
            path: `/genres`,
            options: {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        }).response;

        const data = await response.body.json();
        return (data as unknown as DbGenre[]).map((genre: DbGenre) => mapDbGenreToGenre(genre));
    } catch (error) {
        throw new Error('Error fetching genres');
    }
}

async function getTagsApi(accessToken: JWT): Promise<Tag[]> {
    try {
        const response = await get({
            apiName: AWS_API_NAME,
            path: `/tags`,
            options: {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        }).response;

        const data = await response.body.json();
        return (data as unknown as DbTag[]).map((tag: DbTag) => mapDbTagToTag(tag));
    } catch (error) {
        throw new Error('Error fetching tags');
    }
}

async function getWatchProvidersApi(accessToken: JWT): Promise<WatchProvider[]> {
    try {
        const response = await get({
            apiName: AWS_API_NAME,
            path: `/watch_providers`,
            options: {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        }).response;

        const data = await response.body.json();
        return (data as unknown as DbParentWatchProvider[]).map(mapDbParentWatchProviderToWatchProvider);
    } catch (error) {
        throw new Error('Error fetching watch providers');
    }
}

async function getAurasApi(accessToken: JWT): Promise<Aura[]> {
    try {
        const response = await get({
            apiName: AWS_API_NAME,
            path: '/auras',
            options: {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        }).response;

        const data = await response.body.json();

        return (data as unknown as DbAura[]).map((aura: DbAura) => mapDbAuraToAura(aura));
    } catch (error) {
        throw new Error('Error fetching auras');
    }
}

async function addAuraApi(accessToken: JWT, aura: Aura): Promise<Aura> {
    try {
        const result = await post({
            apiName: AWS_API_NAME,
            path: '/auras',
            options: {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: {
                    name: aura.name,
                    tag_ids: aura.tags.map((t: Tag) => t.id),
                    genre_ids: aura.genres.map((t: Genre) => t.id),
                    min_release_date: aura.minReleaseDate?.toDateString() || null,
                    max_release_date: aura.maxReleaseDate?.toDateString() || null,
                    media_type: !aura.types || aura.types.length === 2 ? null : aura.types[0],
                },
            },
        }).response;
        const data = await result.body.json();
        return mapDbAuraToAura(data as unknown as DbAura);
    } catch (error) {
        throw new Error('Error adding aura');
    }
}

async function deleteAuraApi(accessToken: JWT, auraID: number): Promise<boolean> {
    try {
        const response = await del({
            apiName: AWS_API_NAME,
            path: `/auras/${auraID}`,
            options: {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        }).response;

        return response.statusCode === HttpStatusCode.Ok;
    } catch (error) {
        throw new Error('Error deleting aura');
    }
}

async function updateAuraApi(accessToken: JWT, auraID: number, auraName: string): Promise<Aura> {
    try {
        const response = await put({
            apiName: AWS_API_NAME,
            path: `/auras/${auraID}`,
            options: {
                body: {
                    name: auraName,
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        }).response;

        const data = await response.body.json();
        return mapDbAuraToAura(data as unknown as DbAura);
    } catch (error) {
        throw new Error('Error updating aura');
    }
}

async function getUserApi(accessToken: JWT, userID: string): Promise<User> {
    try {
        const response = await get({
            apiName: AWS_API_NAME,
            path: `/users/${userID}`,
            options: {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        }).response;

        const data = await response.body.json();
        return mapDbUserToUser(data as unknown as DbUser);
    } catch (error) {
        throw new Error('Error getting user');
    }
}

async function updateUserApi(accessToken: JWT, userID: string, username: string, email: string): Promise<User> {
    try {
        const response = await put({
            apiName: AWS_API_NAME,
            path: `/users/${userID}`,
            options: {
                body: {
                    username: username,
                    email: email,
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        }).response;

        const data = await response.body.json();
        return mapDbUserToUser(data as unknown as DbUser);
    } catch (error) {
        throw new Error('Error updating user');
    }
}

async function searchApi(accessToken: JWT, query: string): Promise<SearchResult> {
    try {
        const response = await get({
            apiName: AWS_API_NAME,
            path: '/search',
            options: {
                queryParams: {
                    query: query,
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        }).response;

        const data = await response.body.json();
        return mapDbSearchResultToSearchResult(data as unknown as DbSearchResult);
    } catch (error) {
        throw new Error('Error retrieving search result');
    }
}

async function addToWatchedApi(accessToken: JWT, titleId: number, trackId: number): Promise<SimpleTrack> {
    try {
        const result = await post({
            apiName: AWS_API_NAME,
            path: `/titles/${titleId}/tracks/${trackId}/watched`,
            options: {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        }).response;
        const data = await result.body.json();
        return mapDbTrackToSimpleTrack(data as unknown as DbTrack);
    } catch (error) {
        throw new Error('Error adding watched');
    }
}

async function deleteFromWatchedApi(accessToken: JWT, titleId: number, trackId: number): Promise<boolean> {
    try {
        const response = await del({
            apiName: AWS_API_NAME,
            path: `/titles/${titleId}/tracks/${trackId}/watched`,
            options: {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        }).response;
        return response.statusCode === HttpStatusCode.Ok;
    } catch (error) {
        throw new Error('Error deleting from  watched');
    }
}

async function addToWatchedLaterApi(accessToken: JWT, titleId: number, trackId: number): Promise<SimpleTrack> {
    try {
        const result = await post({
            apiName: AWS_API_NAME,
            path: `/titles/${titleId}/tracks/${trackId}/watch_later`,
            options: {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        }).response;
        const data = await result.body.json();
        return mapDbTrackToSimpleTrack(data as unknown as DbTrack);
    } catch (error) {
        throw new Error('Error adding watch_later');
    }
}

async function deleteFromWatchLaterApi(accessToken: JWT, titleId: number, trackId: number): Promise<boolean> {
    try {
        const response = await del({
            apiName: AWS_API_NAME,
            path: `/titles/${titleId}/tracks/${trackId}/watch_later`,
            options: {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        }).response;
        return response.statusCode === HttpStatusCode.Ok;
    } catch (error) {
        throw new Error('Error deleting from  watch_later');
    }
}

async function addWatchProviderToUserApi(accessToken: JWT, userId: string, watchProviderId: number): Promise<User> {
    try {
        const result = await post({
            apiName: AWS_API_NAME,
            path: `/users/${userId}/watch_providers`,
            options: {
                body: { id: watchProviderId },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        }).response;
        const data = await result.body.json();
        return mapDbUserToUser(data as unknown as DbUser);
    } catch (error) {
        throw new Error('Error adding watch_later');
    }
}

async function deleteWatchProviderFromUserApi(
    accessToken: JWT,
    userId: string,
    watchProviderId: number,
): Promise<boolean> {
    console.log(`/users/${userId}/watch_providers/${watchProviderId}`);
    try {
        const response = await del({
            apiName: AWS_API_NAME,
            path: `/users/${userId}/watch_providers/${watchProviderId}`,
            options: {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        }).response;
        return response.statusCode === HttpStatusCode.Ok;
    } catch (error) {
        throw new Error('Error deleting watch provider from user');
    }
}

const ApiContextProvider = (props: Props) => {
    const { getAccessToken } = useContext<IUserContext>(UserContext);
    const withAccessToken = async <T extends unknown>(
        callback: (token: JWT) => Promise<T>,
        defaultValue: T,
    ): Promise<T> => {
        const accessToken = await getAccessToken();
        if (!accessToken) return defaultValue;
        return callback(accessToken);
    };

    const getRecommendations = (
        watchProviders: WatchProvider[],
        genres: Genre[],
        tags: Tag[],
        minReleaseDate: Date | null,
        maxReleaseDate: Date | null,
        types: TitleType[],
        page = 1,
    ) =>
        withAccessToken(
            (token) =>
                getRecommendationsApi(token, watchProviders, genres, tags, minReleaseDate, maxReleaseDate, types, page),
            null,
        );

    const getTitle = (titleId: number) => withAccessToken((token) => getTitleApi(token, titleId), null);

    const getTrack = (trackId: number) => withAccessToken((token) => getTrackApi(token, trackId), null);

    const getReviews = (titleId: number, trackId: number) =>
        withAccessToken((token) => getReviewsApi(token, titleId, trackId), []);

    const addReview = (titleId: number, trackId: number, review: AddReviewBody) =>
        withAccessToken((token) => addReviewApi(token, titleId, trackId, review), null);

    const updateReview = (reviewId: number, review: AddReviewBody) =>
        withAccessToken((token) => updateReviewApi(token, reviewId, review), null);

    const getGenres = () => withAccessToken(getGenresApi, []);

    const getTags = () => withAccessToken(getTagsApi, []);

    const getWatchProviders = () => withAccessToken(getWatchProvidersApi, []);

    const addAura = (aura: Aura) => withAccessToken((token) => addAuraApi(token, aura), null);

    const getAuras = () => withAccessToken(getAurasApi, []);

    const deleteAura = (auraID: number) => withAccessToken((token) => deleteAuraApi(token, auraID), false);

    const updateAura = (auraID: number, auraName: string) =>
        withAccessToken((token) => updateAuraApi(token, auraID, auraName), null);

    const getUser = (userID: string) => withAccessToken((token) => getUserApi(token, userID), null);

    const updateUser = (userID: string, username: string, email: string) =>
        withAccessToken((token) => updateUserApi(token, userID, username, email), null);

    const search = (query: string) => withAccessToken((token) => searchApi(token, query), null);

    const addToWatched = (titleId: number, trackId: number) =>
        withAccessToken((token) => addToWatchedApi(token, titleId, trackId), null);

    const deleteFromWatched = (titleId: number, trackId: number) =>
        withAccessToken((token) => deleteFromWatchedApi(token, titleId, trackId), false);

    const addToWatchLater = (titleId: number, trackId: number) =>
        withAccessToken((token) => addToWatchedLaterApi(token, titleId, trackId), null);

    const deleteFromWatchLater = (titleId: number, trackId: number) =>
        withAccessToken((token) => deleteFromWatchLaterApi(token, titleId, trackId), false);

    const addWatchProviderToUser = (userId: string, watchProviderId: number) =>
        withAccessToken((token) => addWatchProviderToUserApi(token, userId, watchProviderId), null);

    const deleteWatchProviderFromUser = (userId: string, watchProviderId: number) =>
        withAccessToken((token) => deleteWatchProviderFromUserApi(token, userId, watchProviderId), false);

    return (
        <ApiContext.Provider
            value={{
                getRecommendations,
                getTitle,
                getTrack,
                getReviews,
                addReview,
                updateReview,
                getGenres,
                getTags,
                getWatchProviders,
                getAuras,
                addAura,
                deleteAura,
                updateAura,
                getUser,
                updateUser,
                search,
                addToWatched,
                deleteFromWatched,
                addToWatchLater,
                deleteFromWatchLater,
                addWatchProviderToUser,
                deleteWatchProviderFromUser,
            }}
        >
            {props.children}
        </ApiContext.Provider>
    );
};

export { ApiContext, ApiContextProvider };
export type { IApiContext };
