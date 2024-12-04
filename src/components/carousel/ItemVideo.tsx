import React from 'react';

import playIcon from '@/assets/images/playIcon.svg';

interface Props {
    title: string;
    urlImg: string;
    date: string;
}

export default function ItemVideo({ title, urlImg, date }: Props) {
    return (
        <div className="grid grid-cols-[365px] relative sm-md:grid-cols-1">
            <img src={urlImg} alt="alt" className="rounded-lg w-full object-cover max-h-[200px]" />
            <span className="absolute top-[62%] left-[6%] cursor-pointer w-6 h-6 rounded-full border border-[#FFF] flex justify-center items-center">
                <img src={playIcon} alt="icon" />
            </span>

            <p className="show-ellipsis text-lg leading-none text-customColor-primary font-bold mt-4">{title}</p>
            <span className="font-normal text-[#EAEAEA] text-xs leading-none ">{date}</span>
        </div>
    );
}
