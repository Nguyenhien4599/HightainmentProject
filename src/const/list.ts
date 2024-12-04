import i6 from '@/assets/images/c14.png';
import i7 from '@/assets/images/c15.avif';
import i8 from '@/assets/images/c16.avif';
import { getNMonthAgoDate } from '@/common/helper';

const newReleaseMonths = 6;

export interface DateFilter {
    title: string;
    dateRange: Date[];
}

export const listBtnFilterDate: DateFilter[] = [
    {
        title: 'New Releases',
        dateRange: [getNMonthAgoDate(newReleaseMonths), new Date()],
    },
    {
        title: '2020 and onwards',
        dateRange: [new Date('2020-01-01'), getNMonthAgoDate(newReleaseMonths)],
    },
    {
        title: '2010 - 2019',
        dateRange: [new Date('2010-01-01'), new Date('2019-12-31')],
    },
    {
        title: '2000 - 2009',
        dateRange: [new Date('2000-01-01'), new Date('2009-12-31')],
    },
    {
        title: '1990 - 1999',
        dateRange: [new Date('1990-01-01'), new Date('1999-12-31')],
    },
    {
        title: 'Before the 90s',
        dateRange: [getNMonthAgoDate(1200), new Date('1989-12-31')],
    },
];

export const listBtnFilterMovie = ['Movie', 'TV Series'];

export const listValidTypesAvatar = ['image/jpeg', 'image/png', 'image/gif'];

export const listDataCarouselVideo = [
    {
        title: 'Rocketman (2019) - Official Teaser Trailer - Paramount Pictures',
        date: '2018 . 10 . 01',
        img: i6,
    },
    {
        title: 'Rocketman (2019) - Official Teaser Trailer - Paramount Pictures',
        date: '2018 . 10 . 01',
        img: i7,
    },
    {
        title: 'Rocketman (2019) - Official Teaser Trailer - Paramount Pictures',
        date: '2018 . 10 . 01',
        img: i8,
    },
    {
        title: 'Rocketman (2019) - Official Teaser Trailer - Paramount Pictures',
        date: '2018 . 10 . 01',
        img: i6,
    },
    {
        title: 'Rocketman (2019) - Official Teaser Trailer - Paramount Pictures',
        date: '2018 . 10 . 01',
        img: i8,
    },
];
