import React, { useContext, useState } from 'react';
import ReactGA from 'react-ga4';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Select, { components, StylesConfig } from 'react-select';

import Loading from '@/components/Loading';
import { mainBackgroundColor, primaryColor, primaryTextColor } from '@/const/colors';
import { ApiContext, IApiContext } from '@/context/ApiContextProvider';
import { DataContext, IDataContext } from '@/context/DataContextProvider';
import { User, WatchProvider } from '@/types/domain-models';

interface ReviewModalProps {
    open: boolean;
    setOpen: (b: boolean) => void;
    title?: string;
    footer?: string;
}

function EditUserWatchProviderModal({ open, setOpen, title, footer }: ReviewModalProps) {
    const { user, setUser, watchProviders } = useContext<IDataContext>(DataContext);
    const { addWatchProviderToUser, deleteWatchProviderFromUser } = useContext<IApiContext>(ApiContext);
    const wrapItemRef = React.useRef<HTMLDivElement | null>(null);
    const selectRef = React.useRef(null);
    const [toggleOpen, setToggleOpen] = React.useState(false);
    const [selectedVal, setSelectedVal] = React.useState<WatchProvider | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const customStyles: StylesConfig<WatchProvider, false> = {
        control: (base: any, state: { isFocused: any }) => ({
            ...base,
            backgroundColor: '#333',
            border: state.isFocused ? `2px solid ${primaryColor}` : '1px solid #666',
            boxShadow: state.isFocused ? primaryColor : 'none',
            color: '#fff',
            textColor: '#fff',
            '&:hover': {
                border: `2px solid ${primaryColor}`,
                color: '#fff',
            },
        }),
        input: (base: any) => ({
            ...base,
            color: '#fff', // Change input text color to white
        }),
        menu: (base: any) => ({
            ...base,
            backgroundColor: '#444',
            borderRadius: 4,
            marginTop: 0,
            zIndex: 9999,
        }),
        menuList: (base: any) => ({
            ...base,
            padding: 0,
        }),
        option: (base: any, state: { isSelected: any; isFocused: any }) => ({
            ...base,
            backgroundColor: state.isSelected ? '#4CAF50' : state.isFocused ? '#555' : '#444',
            color: '#fff',
            padding: 10,
            '&:hover': {
                backgroundColor: primaryColor,
                color: '#fff',
            },
        }),
        singleValue: (base: any) => ({
            ...base,
            color: '#fff',
        }),
    };

    const handleChange = async (val: any) => {
        if (!user) return;
        setIsLoading(true);
        await addWatchProviderToUser(user.id, val.id).then((u: User | null) => {
            setIsLoading(false);
            if (!u) return;
            setUser(u);
        });
        ReactGA.event({
            category: 'My Providers',
            action: 'Selected',
            label: 'Change Selected',
        });
    };

    const onDelete = (watchProvider: WatchProvider) => {
        if (!user) return;
        setIsLoading(true);
        deleteWatchProviderFromUser(user?.id, watchProvider.id).then(() => {
            setIsLoading(false);
            setUser({
                ...user,
                watchProviders: user.watchProviders.filter((wp: WatchProvider) => wp.id !== watchProvider.id),
            });
        });
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
    return (
        <Modal centered style={{ alignSelf: 'center' }} show={open} onHide={() => setOpen(false)}>
            {isLoading && (
                <div className="absolute top-0 bottom-0 w-full bg-black z-50 opacity-80 rounded-2xl">
                    <Loading />
                </div>
            )}
            <Modal.Header style={{ backgroundColor: mainBackgroundColor, color: 'white', borderRadius: 0 }} closeButton>
                <Modal.Title>{title ? title : 'Manage Streaming Providers'}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: mainBackgroundColor, color: 'white', fontSize: 20 }}>
                <Select
                    menuPortalTarget={wrapItemRef.current}
                    value={selectedVal}
                    ref={selectRef}
                    options={watchProviders}
                    styles={customStyles}
                    onMenuOpen={() => setToggleOpen(true)}
                    onMenuClose={() => setToggleOpen(false)}
                    className="flex-1 h-full"
                    placeholder="Add your streaming provider..."
                    components={{
                        IndicatorSeparator: () => null,
                        DropdownIndicator: CustomDropdownIndicator,
                    }}
                    getOptionLabel={(option: WatchProvider) => option.name}
                    getOptionValue={(option: WatchProvider) => option.id.toString()}
                    onChange={handleChange}
                />
                {user?.watchProviders.map((watchProvider: WatchProvider, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', marginTop: 20 }}>
                        <img style={{ height: 70, marginLeft: 20 }} src={watchProvider.watchProviderLogoUrl} />
                        <p style={{ marginLeft: 20 }}>{watchProvider.name}</p>
                        <Button
                            style={{
                                marginLeft: 'auto',
                                borderColor: 'red',
                                backgroundColor: 'transparent',
                                color: 'red',
                            }}
                            onClick={() => onDelete(watchProvider)}
                        >
                            Delete
                        </Button>
                    </div>
                ))}
            </Modal.Body>
            {footer ? (
                <Modal.Footer
                    style={{ backgroundColor: mainBackgroundColor, color: 'white', fontSize: 20, borderRadius: 0 }}
                >
                    <p style={{ color: primaryTextColor }}>{footer}</p>
                </Modal.Footer>
            ) : (
                <></>
            )}
        </Modal>
    );
}

export default EditUserWatchProviderModal;
