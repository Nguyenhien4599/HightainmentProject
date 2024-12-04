import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import Carousel from '@/components/carousel';
import ItemReview from '@/components/carousel/ItemReview';
import { Review, WatchProvider } from '@/types/domain-models';
import { avatarUrl } from '@/const/links';
import { DataContext, IDataContext } from '@/context/DataContextProvider';
import CarouselItem from '@/components/carousel/CarouselItem';
import clsx from 'clsx';
import { PenFill } from 'react-bootstrap-icons';
import EditUserWatchProviderModal from './EditUserWatchProviderModal';

export default function Index() {
    const { user } = useContext<IDataContext>(DataContext);
    const [showEditModal, setShowEditModal] = React.useState(false);

    return (
        <>
            <EditUserWatchProviderModal open={showEditModal} setOpen={setShowEditModal} />
            <header className="flex items-end gap-6 sm-md:gap-3">
                <div className="w-[200px] h-[200px] sm-md:w-[100px] sm-md:h-[100px] flex justify-center items-center">
                    <img
                        src={avatarUrl}
                        alt="avatar"
                        className="w-[180px] h-[180px] sm-md:w-[80px] sm-md:h-[80px] rounded-full"
                    />
                </div>
                <div>
                    <p className="text-white font-normal text-[56px] sm-md:text-2xl leading-none">{user?.username}</p>
                    <p className="text-white font-normal text-[56px] sm-md:text-2xl leading-none">{user?.email}</p>
                    <Link
                        to="/profile/edit"
                        className="text-customColor-primary text-2xl sm-md:text-lg leading-none font-normal"
                    >
                        Manage Account
                    </Link>
                </div>
            </header>
            <section className="mt-[72px]">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                    <span className={clsx('text-[28px] sm-md:text-l font-semi-bold leading-none', 'text-white')}>
                        My Providers
                    </span>
                    <PenFill
                        onClick={() => setShowEditModal(true)}
                        size={20}
                        style={{ cursor: 'pointer', color: 'white' }}
                    />
                </div>
                <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                    {user?.watchProviders.map((watchProvider: WatchProvider) => (
                        <img
                            key={watchProvider.id}
                            src={watchProvider.watchProviderLogoUrl}
                            alt="avatar"
                            className="w-[60px] h-[60px] sm-md:w-[50px] sm-md:h-[50px] rounded-full"
                        />
                    ))}
                </div>
            </section>

            <section className="mt-[32px]">
                <Carousel title={'My Reviews'} showModal={false}>
                    {user?.reviews.map((review: Review, index) => (
                        // TODO: Fill in Review
                        <ItemReview key={index} showTrackName={true} review={review} />
                    ))}
                </Carousel>
            </section>

            <section className="mt-[65px]">
                <Carousel title={'Watched'} showModal={false}>
                    {user?.watchedTracks.map((track, index) => (
                        <CarouselItem key={index} track={track} onClick={() => {}} />
                    ))}
                </Carousel>
            </section>
            <section className="mt-[65px]">
                <Carousel title={'Watch Later'} showModal={false}>
                    {user?.watchLaterTracks.map((track, index) => (
                        <CarouselItem key={index} track={track} onClick={() => {}} />
                    ))}
                </Carousel>
            </section>
        </>
    );
}
