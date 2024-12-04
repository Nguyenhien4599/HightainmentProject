import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import Carousel from '@/components/carousel';
import CarouselItem from '@/components/carousel/CarouselItem';
import Loading from '@/components/Loading';
import { ApiContext, IApiContext } from '@/context/ApiContextProvider';
import { DataContext, IDataContext } from '@/context/DataContextProvider';
import { SearchResult, SimpleTrack } from '@/types/domain-models';

enum ResultType {
    WATCHED = 'Watched',
    WATCH_LATER = 'Watch Later',
    REVIEWED = 'Reviewed',
    SEARCHED = 'Searched',
}

export default function SearchResults() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
    const { search } = useContext<IApiContext>(ApiContext);
    const { user } = useContext<IDataContext>(DataContext);
    const [resultType, setResultType] = useState<ResultType>(ResultType.SEARCHED);
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');
    const location = useLocation();
    const currentPath = location.pathname;

    useEffect(() => {
        setLoading(true);
        if (location.pathname === '/watched' && user) {
            setResultType(ResultType.WATCHED);
            setSearchResults({
                movies: user.watchedTracks.filter((t: SimpleTrack) => t.season === null),
                tvSeries: user.watchedTracks.filter((t: SimpleTrack) => t.season !== null),
            });
            setLoading(false);
            return;
        }
        if (location.pathname === '/watch_later' && user) {
            setResultType(ResultType.WATCH_LATER);
            setSearchResults({
                movies: user.watchLaterTracks.filter((t: SimpleTrack) => t.season === null),
                tvSeries: user.watchLaterTracks.filter((t: SimpleTrack) => t.season !== null),
            });
            setLoading(false);
            return;
        }
        if (!query) return;

        search(query).then((searchResult: SearchResult | null) => {
            setSearchResults(searchResult);
            setLoading(false);
        });
    }, [currentPath, location.pathname, query, search, user]);

    const handleClick = (titleId: number, trackId: number) => () => {
        navigate(`/titles/${titleId}/tracks/${trackId}`);
    };

    const renderContent = () => {
        if (loading || !searchResults) return <Loading />;

        return (
            <section className="mt-8 sm-md:mt-0">
                {
                    <Carousel
                        title={
                            resultType === ResultType.SEARCHED ? `Movie results for "${query}"` : `${resultType} Movies`
                        }
                        showModal={false}
                    >
                        {searchResults.movies.map((track: SimpleTrack, index: number) => {
                            return (
                                <CarouselItem
                                    key={index}
                                    onClick={handleClick(track.titleId!!, track.id)}
                                    track={track}
                                />
                            );
                        })}
                    </Carousel>
                }
                {
                    <div className="mt-4">
                        <Carousel
                            title={
                                resultType === ResultType.SEARCHED
                                    ? `TV Series results for "${query}"`
                                    : `${resultType} TV Series`
                            }
                            showModal={false}
                        >
                            {searchResults.tvSeries.map((track: SimpleTrack, index: number) => {
                                return (
                                    <CarouselItem
                                        key={index}
                                        onClick={handleClick(track.titleId!!, track.id)}
                                        track={track}
                                    />
                                );
                            })}
                        </Carousel>
                    </div>
                }
            </section>
        );
    };

    return <>{renderContent()}</>;
}
