import React from 'react';

import iconModalBottomToTop from '@/assets/images/iconModalBottomToTop.svg';
import { Button } from 'react-bootstrap';
import { primaryColor } from '@/const/colors';

interface Props {
    onClose: Function;
    title: string;
    setNameAura: Function;
    nameAura?: string;
    handleSubmit: () => void;
}

const MAX_CHARACTERS = 30;
const MIN_CHARACTERS = 1;
export default function Index({ onClose, title, setNameAura, handleSubmit, nameAura }: Props) {
    const [number, setNumber] = React.useState(0);

    React.useEffect(() => {
        if (nameAura) setNumber(nameAura.length);
    }, [nameAura]);

    const handleClose = () => {
        onClose(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length <= MAX_CHARACTERS) {
            setNumber(value.length);
            setNameAura(value);
        }
    };

    return (
        <div className="fixed w-full left-0 top-0 bottom-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
            <div className="bg-customColor-bgSideBar rounded-lg shadow-lg py-4 px-9 w-[420px]  border border-customColor-primary">
                <header className="flex justify-between items-center">
                    <h3 className="text-2xl leading-none font-semibold text-customColor-primary">{title}</h3>
                    <img src={iconModalBottomToTop} alt="icon" className="cursor-pointer" onClick={handleClose} />
                </header>
                <form onSubmit={handleSubmit}>
                    <div className="my-9 pe-4 flex justify-between items-center border border-[#434343] bg-[#222] rounded-lg">
                        <input
                            value={nameAura}
                            maxLength={MAX_CHARACTERS}
                            minLength={MIN_CHARACTERS}
                            type="text"
                            placeholder="Aura Name"
                            className="w-full text-white outline-none  bg-transparent  py-3 px-4"
                            onChange={handleChange}
                        />
                        <span className="text-[#BBB] text-lg leading-none font-normal tracking-[-0.5px] font-notoSansKr">
                            {number}/{MAX_CHARACTERS}
                        </span>
                    </div>
                    <div className="flex justify-end text-white">
                        <Button
                            onClick={handleSubmit}
                            disabled={nameAura ? nameAura.length < MIN_CHARACTERS : true}
                            style={{ backgroundColor: primaryColor, borderWidth: 0 }}
                        >
                            Save
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
