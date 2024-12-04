import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';

import logo from '@/assets/images/logo.png';
import iconHeader1 from '@/assets/images/iconHeader1.svg';
import iconHeader2 from '@/assets/images/iconHeader2.svg';
import ModalFilterSearchMobile from '@/components/modalFIlterSearchMobile';
import { IUserContext, UserContext } from '@/context/UserContextProvider';
import useHandleSearch from '@/hooks/useHandleSearch';
import { avatarUrl } from '@/const/links';
import { DataContext, IDataContext } from '@/context/DataContextProvider';

export default function Index() {
    const { searchTerm, handleSearchChange, handleSearchSubmit } = useHandleSearch();
    const [openDropdown, setOpenDropdown] = React.useState(false);
    const { authUser } = useContext<IUserContext>(UserContext);
    const { isOpenAuraInMobile, setIsOpenAuraInMobile } = useContext<IDataContext>(DataContext);
    const { signOut } = useAuthenticator();
    const modalRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) setOpenDropdown(false);
        };
        document.addEventListener('click', handleClickOutside as EventListener);

        return () => {
            document.removeEventListener('click', handleClickOutside as EventListener);
        };
    }, []);

    const toggleDropdown = () => {
        setOpenDropdown(!openDropdown);
    };

    return (
        <header className="flex w-full sm-md:flex-wrap sticky top-0 bg-customColor-bg z-50">
            <div className="pt-6 px-6 bg-color-black min-w-[384px] sm-md:min-w-full sm-md:pt-4 sm-md:ps-4 flex items-center gap-3">
                <Link to="/" className="inline-block mr-auto">
                    <img src={logo} alt="logo" loading="lazy" width={36} height={36} />
                </Link>
                <div className="hidden w-6 sm-md:block"></div>
                <form onSubmit={handleSearchSubmit} className="flex-1 hidden py-2 border-b border-b-[#666] sm-md:flex">
                    <input
                        value={searchTerm}
                        onChange={handleSearchChange}
                        type="text"
                        placeholder="Search"
                        className="w-full bg-transparent outline-none border-none text-white text-l leading-none"
                    />
                    <button className="ps-1" type="submit">
                        <img src={iconHeader1} alt="icon" />
                    </button>
                </form>
                {/* <button
                    className="h-10 w-72 hidden sm-md:flex sm-md:justify-center sm-md:items-center sm-md:gap-2 py-2 px-4 outline-none border border-customColor-primary rounded-lg"
                    onClick={toggleModal}
                >
                    <img src={iconHeader1} alt="icon" />
                    <span className="text-xl leading-none text-[#999] font-500">Curate your list</span>
                </button> */}
            </div>
            <div className="bg-color-black relative sm-md:bg-customColor-bg sm-md:py-1 sm-md:px-4 py-1 px-[24px] w-full flex justify-end items-center">
                <form
                    onSubmit={handleSearchSubmit}
                    className="flex py-2 px-4 me-9 border-b border-b-[#666] sm-md:hidden"
                >
                    <button className="me-3" type="submit">
                        <img src={iconHeader1} alt="icon" />
                    </button>
                    <input
                        value={searchTerm}
                        onChange={handleSearchChange}
                        type="text"
                        placeholder="Search"
                        className="w-full bg-transparent outline-none border-none text-white text-l leading-none"
                    />
                </form>
                <div ref={modalRef} className="flex items-center" onClick={toggleDropdown}>
                    <img src={avatarUrl} alt="avatar" className="w-[34px] h-[34px] rounded-full sm-md:hidden" />
                    <p className="text-[#EAEAEA] text-[15px] ms-[10px] me-1 sm-md:hidden cursor-pointer">
                        {authUser?.username}
                    </p>

                    <img className="sm-md:hidden cursor-pointer" src={iconHeader2} alt="icon" />
                </div>
                {openDropdown && (
                    <div className="absolute right-2 z-10 w-[166px] mt-2 top-[52%] bg-[#333] divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1" role="none">
                            <Link
                                className="block px-4 py-2 text-lg leading-none text-[#D8D8D8] hover:bg-[#535353]"
                                to="/profile"
                                onClick={toggleDropdown}
                            >
                                My page
                            </Link>
                            <button
                                className="block w-full text-left px-4 py-2 text-lg leading-none text-[#D8D8D8] hover:bg-[#535353]"
                                onClick={signOut}
                            >
                                LogOut
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <ModalFilterSearchMobile isOpen={isOpenAuraInMobile} closeModal={setIsOpenAuraInMobile} />
        </header>
    );
}
