import { SimpleTrack, Track } from '@/types/domain-models';

import start from '@/assets/images/start.svg';

interface ItemProps {
    onClick: () => void;
    track: SimpleTrack | Track;
}

export default function CarouselItem({ onClick, track }: ItemProps) {
    return (
        <div
            onClick={onClick}
            style={{ width: window.innerWidth < 768 ? 160 : 300 }}
            className="cursor-pointer mr-5 grid grid-cols-[1fr] grid-rows-[1fr_100px] gap-y-[19px] sm-md:grid-cols-[160px] sm-md:grid-rows-[298px_1fr] md-lg:grid-cols-[205px] h-full"
        >
            <img src={track.mainPhotoUrl} alt="img" className="rounded-[20px] h-full w-full " />
            <div className="row-auto">
                <p className="text-customColor-primary text-xl h-[38px] leading-none font-medium line-clamp-2">
                    {track.season === null ? track.name : `${track.name} (Season ${track.season})`}
                </p>
                <div className="flex gap-[3px] items-center mt-[10px]">
                    <img src={start} alt="icon" />
                    <span className="text-lg leading-none font-medium text-[#FFB798]">
                        {track.userScore} ({track.userScoreCount})
                    </span>
                </div>
            </div>
        </div>
    );
}
