import React from 'react';
import clsx from 'clsx';

import iconModalBottomToTop from '@/assets/images/iconModalBottomToTop.svg';

interface Props {
    title: string;
    children: React.ReactNode;
    isOpen?: boolean;
    closeModal?: Function;
}

export default function index({ title, children, isOpen, closeModal }: Props) {
    const handleClose = () => {
        if (closeModal) closeModal(false);
    };
    return (
        <section
            className={clsx(
                'hidden z-10 sm-md:block bg-[#222] py-3 rounded-t-lg fixed w-full transition-all duration-[860ms]',
                isOpen ? 'bottom-[78px] opacity-100 visible' : 'bottom-[-100%] invisible opacity-0',
            )}
        >
            <div className="flex justify-between mb-[25px] px-6">
                <h2 className="text-white text-2xl leading-4 font-medium">{title}</h2>
                <span onClick={handleClose}>
                    <img src={iconModalBottomToTop} alt="icon" />
                </span>
            </div>
            <nav className="ps-6 pe-3">
                <ul className="h-[390px] pe-2 overflow-y-scroll scrollbar-custom">{children}</ul>
            </nav>
        </section>
    );
}
