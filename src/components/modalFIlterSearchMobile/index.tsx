import clsx from 'clsx';

import iconBack from '@/assets/images/iconModalSearch.svg';
import FilterSearch from '@/components/filterSearch';
import useHandleSearch from '@/hooks/useHandleSearch';

interface Props {
    isOpen: boolean;
    closeModal: Function;
}

export default function Index({ isOpen, closeModal }: Props) {
    const { searchTerm, handleSearchSubmit } = useHandleSearch();

    const handleCloseModal = () => {
        closeModal(false);
    };
    // const onSubmitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    //     handleSearchSubmit(e);
    //     handleCloseModal();
    // };

    return (
        <section
            className={clsx(
                'fixed scroll-smooth bottom-0 z-30 w-full bg-customColor-bg px-6 pt-3 pb-[38px] transition-all duration-[860ms] overflow-auto',
                isOpen ? 'top-0 opacity-100 visible' : 'top-full opacity-0 invisible',
            )}
        >
            <span className="inline-block mb-5" onClick={handleCloseModal}>
                <img src={iconBack} alt="icon" />
            </span>
            {/* <form onSubmit={onSubmitSearch} className="flex py-2 border-b border-b-[#666] mb-6">
                <button className="me-3">
                    <img src={iconHeader1} alt="icon" />
                </button>
                <input
                    value={searchTerm}
                    onChange={handleSearchChange}
                    type="text"
                    placeholder="Search"
                    className="w-full bg-transparent outline-none border-none text-[#999] text-xl leading-none font-bold"
                />
            </form> */}
            <FilterSearch
                closeModalInMobile={closeModal}
                handleSearchSubmit={handleSearchSubmit}
                searchTerm={searchTerm}
            />
        </section>
    );
}
