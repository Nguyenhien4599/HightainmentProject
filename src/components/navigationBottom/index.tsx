import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import ModalBottomToTop from '../modalBottomToTop';
import Item from '../sidebar/Item';
import icon1 from '@/assets/images/iconNavBottom1.svg';
import icon2 from '@/assets/images/iconNavBottom2.svg';
import icon3 from '@/assets/images/iconNavBottom3.svg';
import { DataContext, IDataContext } from '@/context/DataContextProvider';
import { ApiContext, IApiContext } from '@/context/ApiContextProvider';

export default function Index() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isOpenDropdown, setIsOpenDropdown] = React.useState<number | null>(null);
    const [isActiveMobile, setIsActiveMobile] = React.useState<number | null>(null);
    const { auras, setAuras } = React.useContext<IDataContext>(DataContext);
    const { deleteAura } = React.useContext<IApiContext>(ApiContext);

    const handleCLick = () => {
        setIsOpen(!isOpen);
    };
    const handleToggleOpen = (number: number) => () => {
        setIsOpenDropdown(isOpenDropdown === number ? null : number);
    };
    const handleDeleteAura = async (id: number) => {
        if (id) {
            try {
                await deleteAura(id);
                toast.success('Delete successful');
                setAuras(auras.filter((a) => a.id !== id));
            } catch (error) {
                toast.error(`${error}`);
            }
        } else {
            toast.error('Please select an Aura to delete');
        }
    };

    return (
        <>
            <section className="hidden fixed bottom-0 z-20 w-full bg-[#222] py-4 sm-md:block md-lg:block">
                <nav className="grid grid-cols-[1fr_1fr_1fr]">
                    <Link to="/" className="flex flex-col justify-center items-center">
                        <span>
                            <img src={icon1} alt="icon" />
                        </span>
                        <span className="text-[#999] text-xs font-medium uppercase inline-block mt-[10px]">home</span>
                    </Link>
                    <button
                        onClick={handleCLick}
                        className="flex flex-col justify-center items-center outline-none border-none"
                    >
                        <span>
                            <img src={icon2} alt="icon" />
                        </span>
                        <span className="text-[#999] text-xs font-medium inline-block mt-[10px]">My Auras</span>
                    </button>
                    <Link to="/profile" className="flex flex-col justify-center items-center">
                        <span>
                            <img src={icon3} alt="icon" />
                        </span>
                        <span className="text-[#999] text-xs font-medium inline-block mt-[10px]">MY page</span>
                    </Link>
                </nav>
            </section>
            <ModalBottomToTop title={'My Auras'} isOpen={isOpen} closeModal={setIsOpen}>
                {auras.map((a, index) => (
                    <Item
                        handleDelete={handleDeleteAura}
                        auraItem={a}
                        key={index}
                        indexItem={index}
                        isActiveMobile={index === isActiveMobile}
                        setIsActiveMobile={setIsActiveMobile}
                        isOpenDropdown={isOpenDropdown === index}
                        setIsOpen={handleToggleOpen}
                        closeModal={setIsOpen}
                    />
                ))}
            </ModalBottomToTop>
        </>
    );
}
