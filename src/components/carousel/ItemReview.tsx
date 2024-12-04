import React, { useContext } from 'react';
import clsx from 'clsx';

import iconStart from '@/assets/images/start.svg';
import { Review, Track } from '@/types/domain-models';
import { formatDateToYyyyMmDd } from '@/common/helper';
import { avatarUrl } from '@/const/links';
import AddReviewModal from '@/pages/MovieDetails/AddReviewModal';
import { ApiContext, IApiContext } from '@/context/ApiContextProvider';
import { PenFill } from 'react-bootstrap-icons';
import { DataContext, IDataContext } from '@/context/DataContextProvider';

interface Props {
    showTrackName: boolean;
    showText?: string;
    useFont?: boolean;
    review: Review;
    putTitle?: boolean;
    track?: Track;
}

export default function ItemReview({ showTrackName, showText, review: propReview, track: propTrack }: Props) {
    const hiddenBtnMore = 138;
    const { getTrack } = useContext<IApiContext>(ApiContext);
    const { user } = useContext<IDataContext>(DataContext);
    const [isMore, setIsMore] = React.useState(true);
    const [showEditModal, setShowEditModal] = React.useState(false);
    const [track, setTrack] = React.useState<Track | null>(propTrack || null);
    const [review, setReview] = React.useState<Review>(propReview);

    const handleMoreClicked = () => {
        setIsMore(!isMore);
    };

    const onReviewClicked = () => {
        if (!track) {
            getTrack(review.trackID).then((t: Track | null) => {
                setTrack(t);
                setShowEditModal(true);
            });
        } else {
            setShowEditModal(true);
        }
    };

    return (
        <div
            style={{ width: window.innerWidth < 768 ? 'calc(100vw - 34px)' : '600px' }}
            className={clsx('group px-[25px] py-4 bg-[#222]  rounded-lg  duration-300 transition-all  me-3 mb-4')}
        >
            {track ? (
                <AddReviewModal
                    open={track !== null && showEditModal}
                    setOpen={setShowEditModal}
                    track={track}
                    onSave={(r: Review) => setReview(r)}
                    previousReview={review}
                ></AddReviewModal>
            ) : (
                <></>
            )}
            <div className="grid grid-cols-[34px_1fr_20px] gap-3 mb-[9px]">
                {showTrackName ? (
                    <div>
                        <img src={review.track?.mainPhotoUrl} alt="img" className="w-full h-[34px] rounded-full" />
                    </div>
                ) : (
                    <div>
                        <img src={avatarUrl} alt="img" className="w-full h-[34px] rounded-full" />
                    </div>
                )}
                <p className="text-2xl leading-none text-[#999] font-semibold self-center duration-300 transition-all ">
                    {showTrackName ? review.track?.name : review.user.username}
                </p>
                <span
                    className={clsx(
                        'justify-self-end',
                        showText && 'text-customColor-primary font-Anton text-2xl leading-none font-normal',
                    )}
                    onClick={onReviewClicked}
                >
                    {user?.id === review.user.id ? <PenFill style={{ cursor: 'pointer', color: 'white' }} /> : <></>}
                    {showText}
                </span>
            </div>
            <span className="text-sm leading-none font-normal text-[#666] duration-300 transition-all">
                {formatDateToYyyyMmDd(review.createdAt)}
            </span>
            <p
                className={clsx(
                    'mt-[19px] text-sm leading-none font-normal mb-1 text-[#999] duration-300 transition-all',
                    isMore && 'line-clamp-3',
                )}
            >
                {review.content}
            </p>
            {review.content.length > hiddenBtnMore && (
                <span
                    onClick={handleMoreClicked}
                    className="text-customColor-primary text-sm leading-none font-Anton cursor-pointer"
                >
                    {isMore ? 'more' : 'less'}
                </span>
            )}

            <div className="mt-[19px] flex gap-4 flex-wrap ">
                <div className="flex items-center gap-1">
                    <img src={iconStart} alt="icon" className="w-5 h-5" />
                    <span className="text-customColor-primary text-base leading-none font-medium">{review.rating}</span>
                </div>

                {review.tagRatings?.map((h, i) => (
                    <div key={i} className="flex items-center gap-1 py-1 px-3 rounded-[52px] bg-[#333]">
                        <span className="text-[#EAEAEA] text-[15px] font-normal leading-none">{h.tagName}</span>
                        <span className="text-base leading-none text-white">{h.tagRating}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
