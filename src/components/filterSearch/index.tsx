import clsx from 'clsx';
import React from 'react';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactGA from 'react-ga4';

import icon2 from '@/assets/images/icon2.svg';
import icon3 from '@/assets/images/icon3.svg';
import iconSearch from '@/assets/images/icon4.svg';
import iconAdd from '@/assets/images/icon5.svg';
import ModalSaveAndRenameAura from '@/components/modalSaveAndRenameAura';
import { primaryColor } from '@/const/colors';
import { DateFilter, listBtnFilterDate } from '@/const/list';
import { ApiContext, IApiContext } from '@/context/ApiContextProvider';
import { DataContext, IDataContext } from '@/context/DataContextProvider';
import { Aura, Genre, Tag, TitleType } from '@/types/domain-models';
import { IItemOptionFilter } from '@/types/global';
import Title from '@/ui-components/title';
import Button from './Button';
import FilterSearchSelectItem from './FilterSearchSelectItem';
import styles from './styles.module.css';

interface OptionFilter {
    text: string;
    icon: string;
    options: IItemOptionFilter[] | [];
}
interface Props {
    searchTerm?: string;
    closeModalInMobile?: Function;
    handleSearchSubmit?: (e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => void;
}

export default function Index({ closeModalInMobile, handleSearchSubmit, searchTerm }: Props) {
    const {
        genreIdToGenre,
        tagIdToTag,
        watchProviders,
        setAuras,
        auras,
        aura,
        selectedFilter,
        setSelectedFilter,
        setAura,
    } = React.useContext<IDataContext>(DataContext);
    const { addAura } = React.useContext<IApiContext>(ApiContext);
    const [listFilterState, setListFilterState] = React.useState<OptionFilter[]>([]);
    const refEl = React.useRef<HTMLDivElement | null>(null);
    const optionsRef = React.useRef<HTMLDivElement | null>(null);
    const [openOptions, setOpenOptions] = React.useState(false);
    const [startDate, setStartDate] = React.useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = React.useState<Date | undefined>(undefined);
    const [isActiveDate, setActiveDate] = React.useState<number | null>(null);
    const titleTypes = selectedFilter.types;
    const [openOptionsProps, setOpenOptionsProps] = React.useState<number | null>(0);
    const [nameAura, setNameAura] = React.useState('');
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (openOptions && refEl.current && window.matchMedia('(max-width: 768px)').matches)
            refEl.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const handleCloseMenu = (e: MouseEvent) => {
            const target = e.target as Node;
            if (
                !optionsRef.current?.contains(target) &&
                !refEl.current?.contains(target) &&
                openOptions &&
                !(target as Element).classList.contains('react-datepicker__day')
            ) {
                setOpenOptions(false);
            }
        };

        if (refEl.current && !openOptions) refEl.current.previousElementSibling?.classList.remove('border-r-0');
        document.addEventListener('click', handleCloseMenu as EventListener);

        return () => {
            document.removeEventListener('click', handleCloseMenu as EventListener);
        };
    }, [openOptions]);

    React.useEffect(() => {
        setListFilterState([
            // {
            //     text: 'Providers',
            //     icon: icon1,
            //     options: watchProviders,
            // },
            {
                text: 'Genres',
                icon: icon2,
                options: Object.values(genreIdToGenre).sort(
                    (a: Genre, b: Genre) => a.displayPriority - b.displayPriority,
                ),
            },
            {
                text: 'Vibes',
                icon: icon3,
                options: Object.values(tagIdToTag).sort((a: Tag, b: Tag) => a.displayPriority - b.displayPriority),
            },
        ]);
    }, [genreIdToGenre, tagIdToTag, watchProviders, aura]);

    const handleOpenOptions = () => {
        setOpenOptions(!openOptions);
        setOpenOptionsProps(null);
        if (refEl.current) refEl.current.previousElementSibling?.classList.add('border-r-0');
    };

    const handleSelectDate = (type: string) => (val: any | undefined) => {
        if (type === 'start') setStartDate(val);
        else setEndDate(val);
    };

    const handleOpenModal = () => {
        setIsOpen(true);
    };

    //e: React.FormEvent<HTMLFormElement>
    const handleSubmit = async () => {
        // e.preventDefault();
        try {
            const response = await addAura({
                name: nameAura,
                genres: selectedFilter.genres ? selectedFilter.genres : [],
                tags: selectedFilter.tags ? selectedFilter.tags : [],
                minReleaseDate: selectedFilter.minReleaseDate,
                maxReleaseDate: selectedFilter.maxReleaseDate,
                types: titleTypes,
            });
            setNameAura('');
            setAuras([response as Aura, ...auras]);
            setAura(response as Aura);
            toast.success('Added successfully');
            navigate('/');
            closeModalInMobile && closeModalInMobile();
        } catch (error) {
            toast.error(`${error}`);
        }
        setIsOpen(false);
    };

    const handleResetFilter = () => {
        navigate('/');
        if (aura) setAura(null);
        if (Object.values(selectedFilter).some((o) => o)) {
            setSelectedFilter({
                tags: null,
                genres: null,
                minReleaseDate: null,
                maxReleaseDate: null,
                types: null,
                page: 1,
            });
        }
    };

    const handleSearchMobile = (e: React.MouseEvent<HTMLButtonElement>) => {
        navigate('/');
        closeModalInMobile && closeModalInMobile();
    };

    return (
        <section className="flex flex-wrap justify-between gap-6 sm-md:flex-col">
            <div className="grid grid-cols-[71px_1fr_1fr_auto] flex-1 relative sm-md:flex sm-md:flex-col sm-md:gap-6">
                <button
                    onClick={handleResetFilter}
                    className="w-full h-[72px] flex justify-center items-center bg-customColor-primary cursor-pointer rounded-tl-lg rounded-bl-lg sm-md:ms-auto sm-md:w-[103px] sm-md:h-[32px] sm-md:rounded-[52px] sm-md:justify-between sm-md:px-3"
                >
                    <img src={iconSearch} alt="icon" className="sm-md:w-6 sm-md:h-6" />
                    <span className="hidden sm-md:block text-[#EAEAEA] font-bold text-[15px]">Reset</span>
                </button>
                {listFilterState.map((f, i) => (
                    <FilterSearchSelectItem
                        openOptions={openOptions}
                        setOpenOptions={setOpenOptions}
                        placeholderText={f.text}
                        svgTag={f.icon}
                        key={i}
                        openOptionsProps={openOptionsProps === i}
                        setOpenOptionsProps={setOpenOptionsProps}
                        idx={i}
                        options={f.options}
                    />
                ))}

                <div
                    className={clsx(
                        'relative w-60 cursor-pointer px-4  xl:w-20 flex justify-center items-center gap-3 bg-[#333] border-b-0 rounded-tr-lg rounded-br-lg sm-md:w-full sm-md:rounded-[5px] sm-md:h-[82px]',
                        openOptions &&
                            `${styles['custom-item-filter-search']} rounded-br-none border !border-customColor-primary sm-md:rounded-b-none`,
                    )}
                    onClick={handleOpenOptions}
                    ref={refEl}
                >
                    <img src={iconAdd} alt="icon" />
                </div>

                {openOptions && (
                    <div
                        ref={optionsRef}
                        className="w-full absolute top-full p-6 bg-[#333] border border-customColor-primary z-10"
                    >
                        <section>
                            <Title>Date</Title>
                            <div className="grid grid-cols-[1fr_1fr_1fr] grid-rows-[46px_46px] gap-x-[14px] gap-y-[17px] mb-6 sm-md:grid-cols-[1fr] sm-md:grid-rows-[repeat(6,46px)] sm-md:gap-3 sm-md:mb-4">
                                {listBtnFilterDate.map((t: DateFilter, i) => (
                                    <Button
                                        key={i}
                                        isActive={i === isActiveDate}
                                        onClick={() => {
                                            setActiveDate(i);
                                            ReactGA.event({
                                                category: 'Different filters',
                                                action: 'Clicked',
                                                label: 'Different filters clicked',
                                            });
                                            setSelectedFilter({
                                                ...selectedFilter,
                                                minReleaseDate: t.dateRange[0],
                                                maxReleaseDate: t.dateRange[1],
                                            });
                                        }}
                                        classText="w-full rounded-lg bg-[#333] border border-[#999] text-white text-left text-base leading-none font-500 cursor-pointer px-4"
                                    >
                                        {t.title}
                                    </Button>
                                ))}
                            </div>
                            <div className="grid grid-cols-[1fr_12px_1fr] gap-x-3 sm-md:gap-x-1">
                                <DatePicker
                                    selected={startDate}
                                    placeholderText="Start date"
                                    dateFormat="dd/MM/yyyy"
                                    onChange={handleSelectDate('start')}
                                    className="w-full h-full rounded-lg bg-[#222] border border-[#434343] px-4 py-3 outline-none text-white text-base font-500"
                                />

                                <span className="text-xl font-normal text-[#BBB] leading-none tracking-[-0.5px] self-center">
                                    ~
                                </span>

                                <DatePicker
                                    selected={endDate}
                                    placeholderText="End date"
                                    onChange={handleSelectDate('end')}
                                    dateFormat="dd/MM/yyyy"
                                    className="w-full h-full rounded-lg bg-[#222] border border-[#434343] px-4 py-3 outline-none text-white text-base font-bold"
                                />
                            </div>
                        </section>
                        <section className="mt-6">
                            <h2 className="text-white font-bold text-2xl leading-5 ">Movie / TV Series</h2>
                            <div className="mt-6 grid grid-cols-[1fr_1fr] gap-x-[14px] sm-md:grid-cols-[1fr] sm-md:gap-y-6">
                                {Object.values(TitleType).map((t: TitleType, i: number) => (
                                    <Button
                                        key={i}
                                        isActive={titleTypes?.some((item) => item === t) || false}
                                        onClick={() => {
                                            ReactGA.event({
                                                category: 'Different filters',
                                                action: 'Clicked',
                                                label: 'Different filters clicked',
                                            });
                                            if (!titleTypes) {
                                                setSelectedFilter({
                                                    ...selectedFilter,
                                                    types: [t],
                                                });
                                                return;
                                            }

                                            if (titleTypes.some((item) => item === t)) {
                                                setSelectedFilter({
                                                    ...selectedFilter,
                                                    types: titleTypes.filter((item) => item !== t),
                                                });
                                                return;
                                            }
                                            setSelectedFilter({
                                                ...selectedFilter,
                                                types: titleTypes ? [...titleTypes, t] : [t],
                                            });
                                        }}
                                        classText={
                                            'border border-[#999] bg-[#333] rounded-lg text-white text-base leading-none font-bold px-4 py-[14px]'
                                        }
                                    >
                                        {t}
                                    </Button>
                                ))}
                            </div>
                        </section>
                    </div>
                )}
            </div>
            <div className="sm-md:grid sm-md:grid-cols-[1fr_1fr] sm-md:grid-rows-[48px] sm-md:gap-3">
                <button
                    onClick={handleOpenModal}
                    style={{
                        height: '72px',
                        width: '176px',
                        backgroundColor: primaryColor,
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: 20,
                        fontWeight: '400',
                        borderRadius: 16,
                        ...(window.innerWidth >= 1280 && {
                            width: '150px', // for extra-large screens (xl)
                            fontSize: '18px', // equivalent to 'text-lg'
                        }),
                        ...(window.innerWidth < 768 && {
                            width: '100%', // full width for small/medium screens (sm-md)
                            height: '100%', // full height for small/medium screens (sm-md)
                        }),
                    }}
                >
                    Save Aura
                </button>
                <button
                    style={{
                        height: '72px',
                        width: '176px',
                        backgroundColor: primaryColor,
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: 20,
                        fontWeight: '400',
                        borderRadius: 16,
                        ...(window.innerWidth >= 1280 && {
                            width: '150px', // for extra-large screens (xl)
                            fontSize: '18px', // equivalent to 'text-lg'
                        }),
                        ...(window.innerWidth < 768 && {
                            width: '100%', // full width for small/medium screens (sm-md)
                            height: '100%', // full height for small/medium screens (sm-md)
                        }),
                    }}
                    onClick={handleSearchMobile}
                    className=" hidden h-full w-full text-white bg-customColor-primary cursor-pointer text-xl leading-none font-bold rounded-lg sm-md:block"
                >
                    Search Aura
                </button>
            </div>
            {isOpen && (
                <ModalSaveAndRenameAura
                    title={'Save Aura Name'}
                    onClose={setIsOpen}
                    setNameAura={setNameAura}
                    nameAura={nameAura}
                    handleSubmit={handleSubmit}
                />
            )}
        </section>
    );
}
