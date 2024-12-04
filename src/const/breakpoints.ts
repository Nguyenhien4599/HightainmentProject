interface BreakpointConfig {
    slidesPerView: number | 'auto';
    spaceBetween: number;
}

export const breakPointsCarouselCard: { [breakpoint: number]: BreakpointConfig } = {
    360: {
        slidesPerView: 2,
        spaceBetween: 15,
    },
    768: {
        slidesPerView: 3,
        spaceBetween: 20,
    },
    1024: {
        slidesPerView: 4.5,
        spaceBetween: 30,
    },
};

export const breakPointsCarouselReview: { [breakpoint: number]: BreakpointConfig } = {
    360: {
        slidesPerView: 1,
        spaceBetween: 24,
    },
    768: {
        slidesPerView: 2,
        spaceBetween: 24,
    },
    1024: {
        slidesPerView: 2,
        spaceBetween: 24,
    },
};

export const breakPointsCarouselVideos: { [breakpoint: number]: BreakpointConfig } = {
    360: {
        slidesPerView: 1,
        spaceBetween: 24,
    },
    768: {
        slidesPerView: 2,
        spaceBetween: 24,
    },
    1024: {
        slidesPerView: 'auto',
        spaceBetween: 24,
    },
};
