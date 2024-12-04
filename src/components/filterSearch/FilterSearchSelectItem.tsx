import React from 'react';
import Select, { components } from 'react-select';
import clsx from 'clsx';
import ReactGA from 'react-ga4';

import { IItemOptionFilter } from '@/types/global';
import { WatchProvider, Genre, Tag } from '@/types/domain-models';
import styles from './styles.module.css';
import { DataContext, IDataContext } from '@/context/DataContextProvider';
import { primaryColor } from '@/const/colors';

const customStyles = {
    placeholder: (provided: any) => ({
        ...provided,
        color: '#999',
        fontSize: window.innerWidth > 1439 ? 16 : 14,
        fontWeight: '400',
    }),
    control: (provided: any, state: any) => ({
        ...provided,
        height: '100%',
        border: 'none', // Ẩn viền mặc định
        boxShadow: 'none', // Ẩn shadow khi chọn
        backgroundColor: '#333',
        borderRadius: '0',
        overflowY: 'auto',
        width: '100%',
    }),
    input: (provided: any) => ({
        ...provided,
        color: '#fff',
        cursor: 'pointer',
    }),
    valueContainer: (provided: any) => ({
        ...provided,
        maxHeight: '68px', // Đặt chiều cao tối đa cho vùng chứa giá trị (chips)
        overflowY: 'auto', // Kích hoạt thanh cuộn dọc khi có nhiều chips
        scrollbarWidth: 'thin', // Dùng cho Firefox
        scrollbarColor: '#444444 transparent',
        '::-webkit-scrollbar': {
            width: '4px',
        },
        '::-webkit-scrollbar-thumb': {
            backgroundColor: '#444444',
            borderRadius: '4px',
        },
    }),
    menu: (provided: any, state: any) => ({
        ...provided,
        width: 'auto',
        left: '0',
        right: '0',
        top: '0',
        backgroundColor: '#111',
        borderColor: primaryColor,
        borderWidth: 1,
        borderRadius: 0,
        zIndex: '10',
        margin: '0',
        padding: window.innerWidth < 768 ? '24px 18px' : '24px 28px 12px 28px',
    }),
    menuList: (provided: any) => ({
        ...provided,
        maxWidth: '100%',
        maxHeight: '200px',
        paddingRight: '24px',
        overflowY: 'auto',
        '::-webkit-scrollbar': {
            width: '4px',
        },
        '::-webkit-scrollbar-thumb': {
            backgroundColor: '#333',
            borderRadius: '7px',
        },
    }),
    option: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#999' : '#333', // Màu nền của option khi được chọn
        color: '#ffffff', // Màu chữ khi option được chọn
        marginBottom: '12px',
        borderRadius: '8px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'normal', // Cho phép xuống dòng
        wordBreak: 'break-word',
        '&:hover': {
            backgroundColor: '#999',
        },
    }),
    multiValue: (provided: any) => ({
        ...provided,
        backgroundColor: '#222', // Màu nền của chip
        borderRadius: '52px', // Bo tròn các góc của chip
        padding: '4px 12px', // Padding bên trong chip
        maxWidth: '150px',
    }),
    multiValueLabel: (provided: any) => ({
        ...provided,
        color: '#EAEAEA', // Màu chữ của chip
        fontWeight: '700px', // Đậm chữ
    }),
    multiValueRemove: (provided: any) => ({
        ...provided,
        color: '#fff', // Màu của nút xóa
        ':hover': {
            backgroundColor: '#222', // Màu nền khi hover
            color: 'white', // Màu chữ khi hover
        },
    }),
    clearIndicator: () => ({
        display: 'none', // Ẩn icon 'x' xóa
    }),
    dropdownIndicator: (provided: any) => ({
        ...provided,
        padding: '0',
        cursor: 'pointer',
    }),
};

const CustomDropdownIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
                d="M5.00032 7.75C4.85208 7.75013 4.7072 7.79419 4.58399 7.87661C4.46077 7.95903 4.36474 8.07611 4.30803 8.21308C4.25132 8.35004 4.23647 8.50074 4.26535 8.64614C4.29424 8.79154 4.36556 8.92511 4.47032 9.03L11.4703 16.03C11.6109 16.1705 11.8016 16.2493 12.0003 16.2493C12.1991 16.2493 12.3897 16.1705 12.5303 16.03L19.5303 9.03C19.6351 8.92511 19.7064 8.79154 19.7353 8.64614C19.7642 8.50074 19.7493 8.35004 19.6926 8.21308C19.6359 8.07611 19.5399 7.95903 19.4166 7.87661C19.2934 7.79419 19.1486 7.75013 19.0003 7.75L5.00032 7.75Z"
                fill="#666666"
            />
        </svg>
    </svg>
);

const CustomDropdownIndicator = (props: any) => {
    return (
        <components.DropdownIndicator {...props}>
            <CustomDropdownIcon />
        </components.DropdownIndicator>
    );
};

interface Props {
    placeholderText: string;
    svgTag: string;
    openOptions: boolean;
    setOpenOptions: Function;
    openOptionsProps: boolean;
    setOpenOptionsProps: Function;
    idx: number;
    options: IItemOptionFilter[] | [];
}

export default function FilterSearchSelectItem({
    placeholderText,
    svgTag,
    openOptions,
    setOpenOptions,
    openOptionsProps,
    setOpenOptionsProps,
    idx,
    options,
}: Props) {
    const wrapItemRef = React.useRef<HTMLDivElement | null>(null);
    const refEl = React.useRef<HTMLDivElement | null>(null);
    const selectRef = React.useRef(null);
    const [toggleOpen, setToggleOpen] = React.useState(false);
    const [selectedVal, setSelectedVal] = React.useState<Tag[] | Genre[] | WatchProvider[] | null>(null);
    const { selectedFilter, setSelectedFilter, setPage } = React.useContext<IDataContext>(DataContext);

    React.useEffect(() => {
        const handleCloseMenu = (e: MouseEvent) => {
            if (!refEl.current?.contains(e.target as Node) && selectRef.current) (selectRef.current as any).blur();
        };
        document.addEventListener('click', handleCloseMenu as EventListener);
        return () => {
            document.removeEventListener('click', handleCloseMenu as EventListener);
        };
    }, []);

    React.useEffect(() => {
        if (window.matchMedia('(max-width: 768px)').matches && toggleOpen)
            wrapItemRef.current && wrapItemRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [toggleOpen]);

    React.useEffect(() => {
        switch (idx) {
            case 0:
                setSelectedVal(selectedFilter.genres);
                break;
            case 1:
                setSelectedVal(selectedFilter.tags);
                break;
            default:
                break;
        }
    }, [idx, selectedFilter]);

    const handleToggleMenu = (type: string) => () => {
        if (openOptions) setOpenOptions(false);
        setToggleOpen(type === 'open' ? true : false);
        if (refEl.current) {
            const tagName = (refEl.current as HTMLElement).previousElementSibling?.tagName;
            if (tagName !== 'BUTTON') {
                if (type === 'open') refEl.current.previousElementSibling?.classList.add('border-r-0');
                else refEl.current.previousElementSibling?.classList.remove('border-r-0');
            }
        }
    };

    // const handleClickItemSearch = () => {
    //     if (selectRef.current) {
    //         console.log('🚀 ~ handleClickItemSearch ~ openOptionsProps:', openOptionsProps);
    //         if (openOptionsProps) {
    //             (selectRef.current as any).blur();
    //             setOpenOptionsProps(null);
    //         } else {
    //             (selectRef.current as any).focus();
    //             (selectRef.current as any).openMenu();
    //             setOpenOptionsProps(idx);
    //         }
    //     }
    // };

    const handleChange = (val: any) => {
        console.log('run change');
        ReactGA.event({
            category: 'Different filters',
            action: 'Clicked',
            label: 'Different filters clicked',
        });
        if (selectedFilter.page !== 1) setPage(1);
        setSelectedVal(val);
        switch (idx) {
            case 0:
                setSelectedFilter({ ...selectedFilter, genres: val.length ? [...val] : null });
                break;
            case 1:
                setSelectedFilter({ ...selectedFilter, tags: val.length ? [...val] : null });
                break;
            default:
                break;
        }
    };

    return (
        <div ref={wrapItemRef} className={clsx('relative', styles['wrap-item'])}>
            <div
                ref={refEl}
                className={clsx(
                    'overflow-x-hidden px-4 w-full xl:w-[280x]] h-full flex justify-center items-center gap-3 bg-[#333] border-b-0 cursor-pointer sm-md:w-full sm-md:rounded-[5px] sm-md:h-[82px]',
                    toggleOpen
                        ? 'border !border-customColor-primary sm-md:rounded-b-none'
                        : 'border-r border-r-[#666] sm-md:border-r-transparent',
                )}
            >
                <img src={svgTag} alt="icon" />
                <Select
                    menuPortalTarget={wrapItemRef.current}
                    value={selectedVal}
                    ref={selectRef}
                    isMulti
                    options={options}
                    styles={customStyles}
                    onMenuOpen={handleToggleMenu('open')}
                    onMenuClose={handleToggleMenu('close')}
                    className="flex-1 h-full"
                    placeholder={placeholderText}
                    components={{
                        IndicatorSeparator: () => null,
                        DropdownIndicator: CustomDropdownIndicator,
                    }}
                    getOptionLabel={(option: IItemOptionFilter) => option.name}
                    getOptionValue={(option: IItemOptionFilter) => option.id.toString()}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
}
