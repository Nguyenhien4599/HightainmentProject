import clsx from 'clsx';
import React from 'react';
import Button from 'react-bootstrap/Button';
import ReactGA from 'react-ga4';
import { toast } from 'react-toastify';

import favoriteIcon from '@/assets/images/favoriteIcon.svg';
import shareIcon from '@/assets/images/shareIcon.svg';
import startIcon from '@/assets/images/start.svg';
import watchIcon from '@/assets/images/watchIcon.svg';
import Carousel from '@/components/carousel';

import ItemReview from '@/components/carousel/ItemReview';
import Loading from '@/components/Loading';
import { mainBackgroundColor, primaryColor, primaryTextColor, secondaryTextColor } from '@/const/colors';
import { typeResult } from '@/const/text';
import { ApiContext, IApiContext } from '@/context/ApiContextProvider';
import { DataContext, IDataContext } from '@/context/DataContextProvider';
import { IUserContext, UserContext } from '@/context/UserContextProvider';
import {
    Genre,
    Recommendations,
    Review,
    SimpleTrack,
    Tag,
    TitleType,
    Track,
    User,
    WatchProvider,
} from '@/types/domain-models';
import { useParams } from 'react-router-dom';
import AddReviewModal from './AddReviewModal';
import { Toast } from 'react-toastify/dist/components';
import { copyCurrentUrlToClipboard } from '@/common/helper';

export default function MovieDetails() {
    const params: any = useParams();
    const [track, setTrack] = React.useState<Track>();
    const [reviews, setReviews] = React.useState<Review[]>([]);
    const [reviewModalOpen, setReviewModalOpen] = React.useState(false);
    const {
        getTrack,
        getReviews,
        addToWatched,
        addToWatchLater,
        deleteFromWatched,
        deleteFromWatchLater,
        getRecommendations,
        getUser,
    } = React.useContext<IApiContext>(ApiContext);
    const { authUser } = React.useContext<IUserContext>(UserContext);
    const [userRatedReview, setUserRatedReview] = React.useState<Review | undefined>(undefined);
    const { user, setUser, recommendations, setRecommendations } = React.useContext<IDataContext>(DataContext);
    const [typeActive, setTypeActive] = React.useState<string | null>('');
    const [mode, setMode] = React.useState('');

    React.useEffect(() => {
        if (mode === 'close') {
            ReactGA.event({
                category: 'Review',
                action: 'Clicked close',
                label: 'Clicked button in modal review',
            });
        }
    }, [mode]);

    React.useEffect(() => {
        const fetchData = async () => {
            const [fetchTrack, fetchReviews] = await Promise.all([
                getTrack(params.trackId),
                getReviews(params.titleId, params.trackId),
            ]);
            setTrack(fetchTrack as Track);
            setReviews(fetchReviews ?? []);
            const userReview = fetchReviews?.find((review: Review) => review.user.id === authUser?.userId);
            if (userReview) setUserRatedReview(userReview);
        };
        fetchData();
        if (user) {
            const arrayWatchedTracks = [...user.watchedTracks];
            const arrayWatchedTracksLater = [...user.watchLaterTracks];
            for (let index = 0; index < arrayWatchedTracks.length; index++) {
                const element = arrayWatchedTracks[index];
                if (element.id === +params.trackId) {
                    setTypeActive(typeResult.WATCHED);
                    break;
                }
            }
            for (let index = 0; index < arrayWatchedTracksLater.length; index++) {
                const element = arrayWatchedTracksLater[index];
                if (element.id === +params.trackId) {
                    setTypeActive(typeResult.WATCH_LATER);
                    break;
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getReviews, getTrack, params.titleId, params.trackId]);

    if (!track) return <Loading />;

    const groupedWatchProviders = track.watchProviders.reduce(
        (acc: { [key: string]: WatchProvider[] }, watchProvider: WatchProvider) => {
            const key = watchProvider.watchProviderType;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(watchProvider);
            return acc;
        },
        {},
    );

    const handleActiveType = (type: string) => async () => {
        try {
            if (typeActive) {
                if (type === typeActive) {
                    (await typeActive) === typeResult.WATCHED
                        ? deleteFromWatched(params.titleId, params.trackId)
                        : deleteFromWatchLater(params.titleId, params.trackId);
                    setTypeActive(null);
                    for (const key in user) {
                        if (key === 'watchedTracks' || key === 'watchLaterTracks') {
                            const newArr = [...user[key]].filter((item) => item.id !== +params.trackId);
                            setUser({
                                ...user,
                                [key]: newArr,
                            });
                            if (newArr.length < user[key].length) {
                                await getRecommendations([], [], [], null, null, [], 1);
                                break;
                            }
                        }
                    }
                    toast.success(
                        `Removed from the ${
                            typeResult.WATCHED === typeActive
                                ? typeResult.WATCHED.toLowerCase()
                                : typeResult.WATCH_LATER.toLowerCase()
                        } list`,
                    );
                } else {
                    (await typeActive) === typeResult.WATCHED
                        ? deleteFromWatched(params.titleId, params.trackId)
                        : deleteFromWatchLater(params.titleId, params.trackId);
                    (await typeActive) === typeResult.WATCHED
                        ? addToWatchLater(params.titleId, params.trackId)
                        : addToWatched(params.titleId, params.trackId);
                    const user = await getUser(authUser?.userId || '');
                    setUser(user as User);
                    setTypeActive(type);
                    toast.success(
                        `Added to ${
                            typeActive === typeResult.WATCHED
                                ? typeResult.WATCH_LATER.toLowerCase()
                                : typeResult.WATCHED.toLowerCase()
                        } Successfully`,
                    );
                }
            } else {
                const updateRecommendationsMovie: Track[][] = [...(recommendations?.recommendations || [])];

                if (type === typeResult.WATCHED) {
                    const results = await addToWatched(params.titleId, params.trackId);
                    user &&
                        setUser({ ...user, watchedTracks: [...(user.watchedTracks || []), results as SimpleTrack] });
                    for (let index = 0; index < updateRecommendationsMovie.length; index++) {
                        const el = updateRecommendationsMovie[index].filter((e: Track) => e.id !== +params.trackId);
                        if (el.length !== updateRecommendationsMovie[index].length) {
                            updateRecommendationsMovie[index] = el;
                            break;
                        }
                    }
                    setRecommendations({
                        ...recommendations,
                        recommendations: updateRecommendationsMovie,
                    } as Recommendations);
                    setTypeActive(typeResult.WATCHED);
                    toast.success('Added to Watched Successfully');
                } else if (type === typeResult.WATCH_LATER) {
                    const results = await addToWatchLater(params.titleId, params.trackId);
                    user &&
                        setUser({
                            ...user,
                            watchLaterTracks: [...(user.watchLaterTracks || []), results as SimpleTrack],
                        });
                    for (let index = 0; index < updateRecommendationsMovie.length; index++) {
                        const el = updateRecommendationsMovie[index].filter((e: Track) => e.id !== +params.trackId);
                        if (el.length !== updateRecommendationsMovie[index].length) {
                            updateRecommendationsMovie[index] = el;
                            break;
                        }
                    }
                    setRecommendations({
                        ...recommendations,
                        recommendations: updateRecommendationsMovie,
                    } as Recommendations);
                    setTypeActive(typeResult.WATCH_LATER);
                    toast.success('Added to Watch Later Successfully');
                } else {
                    toast.error('Invalid Watch Provider Type');
                    return;
                }
            }
        } catch (err) {
            toast.error(`${err}`);
        }
    };

    return (
        <>
            <section className="grid grid-cols-[333px_1fr] grid-rows-[minmax(538px,_1fr)] gap-x-9 relative sm-md:grid-cols-[1fr]">
                <AddReviewModal
                    setMode={setMode}
                    open={reviewModalOpen}
                    setOpen={setReviewModalOpen}
                    track={track}
                    onSave={(review: Review) => setReviews([review, ...reviews])}
                    previousReview={userRatedReview}
                />
                <div className="absolute top-[-60px] bottom-[-20px] left-[-72px] right-[-72px] z-0 overflow-hidden sm-md:hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-80"></div>
                    <img src={track.backdropPhotoUrl} alt="banner" />
                </div>
                <img
                    src={track.mainPhotoUrl}
                    alt="movie"
                    className="rounded-[20px] object-center object-cover h-full w-full relative z-10"
                />
                <div className="self-end pb-9 z-10">
                    <ul className="flex flex-wrap gap-6 mb-6 sm-md:mt-4 sm-md:gap-3 sm-md:grid sm-md:grid-cols-2">
                        <li
                            onClick={handleActiveType(typeResult.WATCHED)}
                            className={clsx(
                                'cursor-pointer py-2 px-[18px] border border-[#EAEAEA] rounded-[52px] flex justify-between items-center gap-4 sm-md:px-[10px] sm-md:!gap-2 sm-md:justify-start',
                                typeActive === typeResult.WATCHED ? 'bg-customColor-primary' : 'transparent',
                            )}
                        >
                            <img src={watchIcon} alt="icon" />
                            <span className="text-[#EAEAEA] text-2xl sm-md:text-xl  leading-none font-normal">
                                Watched
                            </span>
                        </li>
                        <li
                            onClick={handleActiveType(typeResult.WATCH_LATER)}
                            className={clsx(
                                'cursor-pointer py-2 px-[18px] border border-[#EAEAEA] rounded-[52px] flex justify-between items-center gap-4 sm-md:px-[10px] sm-md:!gap-2 sm-md:justify-start',
                                typeActive === typeResult.WATCH_LATER ? 'bg-customColor-primary' : 'transparent',
                            )}
                        >
                            <img src={favoriteIcon} alt="icon" />
                            <span className="text-[#EAEAEA] text-2xl sm-md:text-xl leading-none font-normal">
                                Watch Later
                            </span>
                        </li>
                        <li
                            onClick={() => {
                                copyCurrentUrlToClipboard();
                                toast.success('Link copied');
                            }}
                            className="cursor-pointer py-2 px-[18px] border border-[#EAEAEA] rounded-[52px] flex justify-between items-center gap-4 sm-md:px-[10px] sm-md:!gap-2 sm-md:justify-start"
                        >
                            <img src={shareIcon} alt="icon" />
                            <span className="text-[#EAEAEA] text-2xl sm-md:text-xl leading-none font-normal">
                                Share
                            </span>
                        </li>
                    </ul>
                    <div className="flex items-center gap-[3px]">
                        <img src={startIcon} alt="icon" className="w-9 h-9 sm-md:w-8 sm-md:h-8" />
                        <span className="text-customColor-primary text-[32px] sm-md:text-2xl font-medium">
                            {track.userScore} ({track.userScoreCount})
                        </span>
                    </div>
                    <p className="text-white text-[56px] sm-md:text-5xl sm-md:leading-relaxed font-normal font-Anton leading-normal">
                        {track.title.type === TitleType.MOVIE
                            ? track.title.englishName
                            : `${track.title.englishName} (Season ${track.season})`}
                    </p>
                    <span className="text-white text-2xl sm-md:text-xl leading-none font-semibold">
                        {track.releaseDate.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })}
                    </span>
                    <div className="mt-6 flex flex-wrap gap-8 sm-md:gap-4">
                        {groupedWatchProviders['SUBSCRIPTION'] &&
                            groupedWatchProviders['SUBSCRIPTION'].map((watchProvider: WatchProvider) => {
                                return (
                                    <span
                                        key={watchProvider.id}
                                        className="w-12 h-12 px-1  rounded-full bg-white flex justify-center items-center"
                                    >
                                        <img
                                            src={watchProvider.watchProviderLogoUrl}
                                            alt="logo"
                                            className="w-full h-full object-cover rounded-full"
                                            onClick={() =>
                                                watchProvider.watchProviderLink
                                                    ? window.open(
                                                          watchProvider.watchProviderLink,
                                                          '_blank',
                                                          'noopener,noreferrer',
                                                      )
                                                    : ''
                                            }
                                        />
                                    </span>
                                );
                            })}
                    </div>
                    <ul className="mt-6 flex flex-wrap gap-4 sm-md:gap-3">
                        {track.genres.map((genre: Genre, index) => (
                            <li
                                key={index}
                                className="text-[#EAEAEA] text-[15px] font-normal px-3 py-1 bg-[#222] rounded-[52px]"
                            >
                                {genre.name}
                            </li>
                        ))}
                    </ul>
                    <ul className="mt-6 flex flex-wrap gap-4">
                        {track.tags
                            .sort((a: Tag, b: Tag) => b.averageRating - a.averageRating)
                            .map((tag: Tag, index) => (
                                <li key={index} className="flex gap-2">
                                    <span className="text-[#EAEAEA] text-[15px] font-normal"># {tag.name}</span>
                                    <span className="text-white text-base leading-none font-semibold">
                                        {tag.averageRating || 0}
                                    </span>
                                </li>
                            ))}
                    </ul>
                    <p
                        style={{
                            marginTop: 20,
                            backgroundColor: mainBackgroundColor,
                            color: primaryTextColor,
                            padding: 8,
                            borderRadius: 8,
                        }}
                    >
                        {track.summary}
                    </p>
                </div>
            </section>

            <section className="mt-[100px] sm-md:mt-[10px]">
                <Button
                    onClick={() => {
                        setReviewModalOpen(true);
                        setMode('open');
                    }}
                    style={{
                        color: secondaryTextColor,
                        margin: '0 auto',
                        fontWeight: 'normal',
                        fontSize: '1.5rem',
                        width: 200,
                        height: 60,
                        border: 0,
                        backgroundColor: primaryColor,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 52,
                    }}
                >
                    {userRatedReview ? 'Edit Review' : 'Add Review'}
                </Button>
            </section>

            <section className="mt-[100px]">
                {reviews.length && (
                    <Carousel title={'Reviews'} useFont showModal={false}>
                        {reviews.map((r, index) => (
                            <ItemReview showTrackName={false} key={index} useFont review={r} track={track} />
                        ))}
                    </Carousel>
                )}
            </section>
        </>
    );
}
