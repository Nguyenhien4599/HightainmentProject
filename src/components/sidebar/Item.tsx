import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import React from 'react';
import { toast } from 'react-toastify';
import ReactGA from 'react-ga4';

import iconSidebar1 from '@/assets/images/iconSidebar1.svg';
import iconSidebar2 from '@/assets/images/iconSidebar2.svg';
import ModalConfirm from '@/components/modalConfirm';
import ModalSaveAndRenameAura from '@/components/modalSaveAndRenameAura';
import { ApiContext, IApiContext } from '@/context/ApiContextProvider';
import { DataContext, IDataContext } from '@/context/DataContextProvider';
import { Aura } from '@/types/domain-models';

interface Props {
    auraItem: Aura;
    handleDelete: Function;
    isActiveMobile?: boolean;
    setIsActiveMobile?: Function;
    indexItem: number;
    isOpenDropdown?: boolean;
    setIsOpen: Function;
    closeModal?: Function;
    setIsActive?: Function;
    isActive?: boolean | null;
}

export default function Item({
    auraItem,
    isActiveMobile,
    setIsActiveMobile,
    indexItem,
    isOpenDropdown,
    setIsOpen,
    handleDelete,
    closeModal,
    setIsActive,
    isActive,
}: Props) {
    const [showModal, setShowModal] = React.useState(false);
    const [isOpenModal, setIsOpenModal] = React.useState(false);
    const [nameAura, setNameAura] = React.useState('');
    const { updateAura } = React.useContext<IApiContext>(ApiContext);
    const { auras, setAuras, aura } = React.useContext<IDataContext>(DataContext);
    const elRef = React.useRef<HTMLLIElement | null>(null);
    const navigate = useNavigate();

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (elRef.current && !elRef.current.contains(event.target as Node) && isOpenDropdown) setIsOpen(null)();
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpenDropdown]);

    React.useEffect(() => {
        if (!aura) {
            setIsActive && setIsActive(null);
            setIsActiveMobile && setIsActiveMobile(null);
            closeModal && closeModal(false);
            return;
        }
        if (aura.id === auraItem.id) {
            setIsActive && setIsActive(indexItem);
            setIsActiveMobile && setIsActiveMobile(indexItem);
            closeModal && closeModal(false);
        }
    }, [aura, auraItem.id, closeModal, indexItem, setIsActive, setIsActiveMobile]);

    const handleClick = async () => {
        ReactGA.event({
            category: 'Aura',
            action: 'Clicked',
            label: 'Click aura',
        });
        navigate(`/auras/${auraItem.id}`);
    };
    const handleCancelModal = () => {
        setShowModal(false);
        setIsOpen(null)();
    };
    const handleConfirm = () => {
        setShowModal(false);
        setIsOpen(null)();
        handleDelete(auraItem.id);
    };
    const handleOpenModal = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation();
        setShowModal(true);
    };
    const handleOpenModalEdit = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation();
        setIsOpenModal(true);
        setNameAura(auraItem.name);
    };

    const handleOpenModalAction = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation();
        setIsOpen(indexItem)();
    };

    const handleSubmit = async () => {
        try {
            await updateAura(auraItem.id as number, nameAura);
            setAuras(
                auras.reduce<Aura[]>((acc, cur) => {
                    if (cur.id === auraItem.id) acc.unshift({ ...cur, name: nameAura });
                    else acc.push(cur);
                    return acc;
                }, []),
            );
            toast.success('Updated successfully');
        } catch (error) {
            toast.error(`${error}`);
        }
        setIsOpenModal(false);
    };

    return (
        <>
            <li
                ref={elRef}
                onClick={handleClick}
                className={clsx(
                    'relative h-[100px] cursor-pointer py-2 ps-2 pe-4 grid grid-cols-[42px_1fr_8px] gap-2 items-center',
                    'lg:hover:bg-[#333] sm-md:grid-cols-[1fr_3px] bg-[#111] sm-md:mb-4 sm-md:rounded-lg sm-md:p-2 hover:rounded-lg rounded-xl mt-2',
                    isActiveMobile ? 'sm-md:bg-[#999]' : '',
                    isActive && 'bg-[#333] rounded-lg',
                )}
            >
                <span className="h-[42px] rounded-full bg-[#666666] flex justify-center items-center sm-md:hidden">
                    <img src={iconSidebar1} alt="icon" />
                </span>
                <Link className="text-lg leading-none text-white font-500 self-center" to="/">
                    {auraItem.name}
                </Link>
                <span className="self-center cursor-pointer flex justify-end" onClick={handleOpenModalAction}>
                    <img src={iconSidebar2} alt="icon" />
                </span>
                {isOpenDropdown && (
                    <div className="absolute right-0 z-10 w-[166px] mt-2 top-[88%] bg-[#333] divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1" role="none">
                            <button
                                onClick={handleOpenModalEdit}
                                className="w-full cursor-pointer text-left outline-none border-none px-4 py-2 text-lg leading-none font-medium text-[#D8D8D8] hover:bg-[#535353]"
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleOpenModal}
                                className="w-full cursor-pointer text-left outline-none border-none px-4 py-2 text-lg leading-none font-medium text-[#D8D8D8] hover:bg-[#535353]"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                )}
            </li>
            {showModal && (
                <ModalConfirm message={'Delete Aura?'} onCancel={handleCancelModal} onConfirm={handleConfirm} />
            )}
            {isOpenModal && (
                <ModalSaveAndRenameAura
                    title={'Edit Aura Name'}
                    onClose={setIsOpenModal}
                    setNameAura={setNameAura}
                    nameAura={nameAura}
                    handleSubmit={handleSubmit}
                />
            )}
        </>
    );
}
