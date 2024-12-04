import { createContext, useContext, useEffect, useState } from 'react';
import ReactGA from 'react-ga4';

import { Aura, Genre, Recommendations, Tag, TitleType, User, WatchProvider } from '../types/domain-models';
import { ApiContext, IApiContext } from './ApiContextProvider';
import { IUserContext, UserContext } from './UserContextProvider';

interface IDataContext {
    genreIdToGenre: { [key: number]: Genre };
    tagIdToTag: { [key: number]: Tag };
    auras: Aura[];
    aura: Aura | null;
    watchProviders: WatchProvider[];
    setAuras: (auras: Aura[]) => void;
    setAura: (auras: Aura | null) => void;
    recommendations: Recommendations | null;
    setSelectedFilter: (selectedFilter: SelectedFilter) => void;
    selectedFilter: SelectedFilter;
    setRecommendations: (Recommendations: Recommendations | null) => void;
    setPage: (page: number) => void;
    user: User | null;
    setUser: (user: User) => void;
    loading: boolean;
    isOpenAuraInMobile: boolean;
    setIsOpenAuraInMobile: Function;
}

interface Props {
    children: JSX.Element | Array<JSX.Element>;
}

interface SelectedFilter {
    genres: Genre[] | null;
    tags: Tag[] | null;
    minReleaseDate: Date | null;
    maxReleaseDate: Date | null;
    types: TitleType[] | null;
    page: number;
}

export const defaultDataContext: IDataContext = {
    genreIdToGenre: [],
    tagIdToTag: [],
    auras: [],
    watchProviders: [],
    setAuras: () => {},
    setAura: () => {},
    aura: null,
    recommendations: null,
    setRecommendations: () => {},
    setSelectedFilter: () => {},
    selectedFilter: {
        genres: null,
        tags: null,
        minReleaseDate: null,
        maxReleaseDate: null,
        types: null,
        page: 1,
    },
    setPage: () => {},
    user: null,
    setUser: () => {},
    loading: false,
    isOpenAuraInMobile: false,
    setIsOpenAuraInMobile: () => {},
};

const DataContext = createContext(defaultDataContext);

const DataContextProvider = (props: Props) => {
    const { getGenres, getTags, getAuras, getWatchProviders, getRecommendations, getUser } =
        useContext<IApiContext>(ApiContext);
    const { authUser } = useContext<IUserContext>(UserContext);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [auras, setAuras] = useState<Aura[]>([]);
    const [aura, setAura] = useState<Aura | null>(null);
    const [watchProviders, setWatchProviders] = useState<WatchProvider[]>([]);
    const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
    const [selectedFilter, setSelectedFilter] = useState<SelectedFilter>(defaultDataContext.selectedFilter);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [isOpenAuraInMobile, setIsOpenAuraInMobile] = useState(false);
    const parentWatchProviderToWatchProviders = watchProviders.reduce(
        (agg: { [key: number]: WatchProvider[] }, wp: WatchProvider) => {
            if (!agg[wp.id]) {
                agg[wp.id] = [];
            }
            agg[wp.id].push(...wp.subWatchProviders);
            return agg;
        },
        {}, // Initial value for the accumulator
    );

    const setPage = (page: number) => {
        setSelectedFilter({ ...selectedFilter, page: page });
    };

    useEffect(() => {
        if (!authUser) {
            return;
        }
        const fetchData = async () => {
            try {
                const [fetchedGenres, fetchedTags, fetchedAuras, fetchedWatchProviders, fetchedUser] =
                    await Promise.all([
                        getGenres(),
                        getTags(),
                        getAuras(),
                        getWatchProviders(),
                        getUser(authUser?.userId),
                    ]);

                setGenres(fetchedGenres.sort((a: Genre, b: Genre) => b.displayPriority - a.displayPriority));
                setTags(fetchedTags.sort((a: Tag, b: Tag) => a.displayPriority - b.displayPriority));
                setAuras(fetchedAuras);
                setWatchProviders(fetchedWatchProviders.sort((w1, w2) => w1.displayPriority - w2.displayPriority));
                setUser(fetchedUser);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (aura && user) {
            setSelectedFilter({
                genres: aura.genres,
                tags: aura.tags,
                minReleaseDate: aura.minReleaseDate,
                maxReleaseDate: aura.maxReleaseDate,
                types: aura.types,
                page: 1,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [aura]);

    useEffect(() => {
        const startTime = Date.now();
        if (!user) return;

        if (selectedFilter.page === 1) setLoading(true);

        getRecommendations(
            user.watchProviders
                ? user.watchProviders.flatMap((parent) => {
                      return parentWatchProviderToWatchProviders[parent.id] || [];
                  })
                : [],
            selectedFilter.genres ? selectedFilter.genres : [],
            selectedFilter.tags ? selectedFilter.tags : [],
            selectedFilter.minReleaseDate,
            selectedFilter.maxReleaseDate,
            selectedFilter.types ? selectedFilter.types : [],
            selectedFilter.page,
        )
            .then((recommendations: Recommendations | null) => {
                setLoading(false);
                if (selectedFilter.page !== 1) {
                    setRecommendations((prev) => {
                        if (!recommendations) return prev;
                        return {
                            ...prev,
                            ...recommendations,
                            recommendations:
                                prev?.recommendations.length && recommendations.recommendations.length
                                    ? prev.recommendations.map((p, i: number) => {
                                          return [...p, ...(recommendations.recommendations[i] || [])];
                                      })
                                    : recommendations.recommendations,
                        };
                    });
                } else setRecommendations(recommendations);
                const endTime = Date.now();
                const seconds = ((endTime - startTime) / 1000).toFixed(2);
                ReactGA.event({
                    category: 'Recommentation',
                    action: 'Call api',
                    label: `Total time to call recommendation api is ${seconds} seconds`,
                });
            })
            .catch((e) => {
                console.log(e);
                setLoading(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFilter, user]);

    return (
        <DataContext.Provider
            value={{
                genreIdToGenre: genres.reduce((acc: { [key: number]: Genre }, genre) => {
                    acc[genre.id] = genre;
                    return acc;
                }, {}),
                tagIdToTag: tags.reduce((acc: { [key: number]: Tag }, tag) => {
                    acc[tag.id] = tag;
                    return acc;
                }, {}),
                auras,
                setAuras,
                aura,
                setAura,
                watchProviders,
                recommendations,
                setRecommendations,
                setSelectedFilter,
                selectedFilter,
                setPage,
                user,
                setUser,
                loading,
                isOpenAuraInMobile,
                setIsOpenAuraInMobile,
            }}
        >
            {props.children}
        </DataContext.Provider>
    );
};

export { DataContextProvider, DataContext };
export type { IDataContext };
