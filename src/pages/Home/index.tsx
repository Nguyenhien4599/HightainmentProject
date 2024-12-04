import clsx from 'clsx';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import iconHeader1 from '@/assets/images/iconHeader1.svg';
import Carousel from '@/components/carousel';
import CarouselItem from '@/components/carousel/CarouselItem';
import FilterSearch from '@/components/filterSearch';
import Loading from '@/components/Loading';
import { DataContext, defaultDataContext, IDataContext } from '@/context/DataContextProvider';
import { Aura, RecommendationType, Track } from '@/types/domain-models';
import EditUserWatchProviderModal from '../Profile/EditUserWatchProviderModal';

const WATCH_PROVIDER_PROMPT_COUNT_KEY = 'watchProviderPromptCount';

export default function Index() {
    const navigate = useNavigate();
    const {
        genreIdToGenre,
        tagIdToTag,
        recommendations,
        setAura,
        auras,
        aura,
        setSelectedFilter,
        loading,
        setIsOpenAuraInMobile,
        user,
    } = useContext<IDataContext>(DataContext);
    const params: any = useParams();
    const [showEditModal, setShowEditModal] = useState(false);
    const [watchProviderPromptCount, setWatchProviderPromptCount] = useState(0);

    useEffect(() => {
        const storedCount = localStorage.getItem(WATCH_PROVIDER_PROMPT_COUNT_KEY);
        if (storedCount) {
            setWatchProviderPromptCount(Number(storedCount));
        }
    }, []);

    useEffect(() => {
        if (!user) return;

        if (user.watchProviders.length === 0) {
            const newCount = watchProviderPromptCount + 1;
            setWatchProviderPromptCount(newCount);
            localStorage.setItem(WATCH_PROVIDER_PROMPT_COUNT_KEY, newCount.toString());
            if (watchProviderPromptCount % 10 === 0) {
                setShowEditModal(true);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
        if (params.auraId) {
            const passedInAura = auras.find((aura: Aura) => aura.id === Number(params.auraId));
            if (passedInAura) {
                setAura(passedInAura);
            }
        } else {
            if (aura) setSelectedFilter(defaultDataContext.selectedFilter);

            setAura(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params, auras]);

    const handleClick = (titleId: number, trackId: number) => () => {
        navigate(`/titles/${titleId}/tracks/${trackId}`);
    };

    const handleClickOpenFilterAura = () => {
        setIsOpenAuraInMobile(true);
    };

    const renderContent = () => {
        if (recommendations && !loading) {
            return recommendations.headers.map((headerID: number, idx: number) => {
                let header = 'Recommendations';
                if (recommendations.type === RecommendationType.GENRES) {
                    header = genreIdToGenre[headerID]?.name;
                } else if (recommendations.type === RecommendationType.TAGS) {
                    header = tagIdToTag[headerID]?.name;
                }
                return (
                    <section className={clsx(idx ? 'mt-4' : 'mt-6 sm-md:mt-0', 'relative')} key={idx}>
                        <Carousel title={header} mode>
                            {recommendations.recommendations[idx].map((track: Track, index: number) => {
                                return (
                                    <CarouselItem
                                        key={index}
                                        onClick={handleClick(track.title.id, track.id)}
                                        track={track}
                                    />
                                );
                            })}
                        </Carousel>
                    </section>
                );
            });
        } else return <Loading />;
    };

    return (
        <>
            <EditUserWatchProviderModal
                open={showEditModal}
                setOpen={setShowEditModal}
                title="Add your streaming providers for customized experience"
                footer="You can also add later in your user profile!"
            ></EditUserWatchProviderModal>
            <section className="sm-md:hidden">
                <FilterSearch />
            </section>
            <button
                onClick={handleClickOpenFilterAura}
                className="h-10 w-full hidden sm-md:flex sm-md:mb-6 sm-md:justify-center sm-md:items-center sm-md:gap-2 py-2 px-4 outline-none border border-customColor-primary rounded-lg"
            >
                <img src={iconHeader1} alt="icon" />
                <span className="text-xl leading-none text-[#999] font-500">Curate your list</span>
            </button>
            {renderContent()}
        </>
    );
}
