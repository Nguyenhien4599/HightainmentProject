import React from 'react';
import { toast } from 'react-toastify';

import Item from './Item';
import { DataContext, IDataContext } from '@/context/DataContextProvider';
import { ApiContext, IApiContext } from '@/context/ApiContextProvider';

export default function AuraSidebar() {
    const [isOpen, setIsOpen] = React.useState<number | null>(null);
    const { auras, setAuras, aura, selectedFilter, setAura } = React.useContext<IDataContext>(DataContext);
    const { deleteAura } = React.useContext<IApiContext>(ApiContext);
    const [isActive, setIsActive] = React.useState<number | null>(null);

    React.useEffect(() => {
        if (!aura) setIsActive(null);
        if (Object.values(selectedFilter).every((o) => !o)) {
            setIsActive(null);
            setAura(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFilter]);

    const handleToggleOpen = (number: number) => () => {
        setIsOpen(isOpen === number ? null : number);
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
        <div className="overflow-y-auto scrollbar-custom">
            <h2
                style={{
                    fontWeight: '400',
                    fontSize: 24,
                    lineHeight: '1', // equivalent to 'leading-none'
                    color: 'white', // assuming you use CSS variables
                    paddingTop: '8px',
                    paddingBottom: '8px', // 'py-2' equals 8px padding on top and bottom
                }}
            >
                Auras
            </h2>
            <nav className="overflow-y-auto scrollbar-custom">
                <ul className="mt-2 pe-3">
                    {auras.map((a, index) => (
                        <Item
                            auraItem={a}
                            handleDelete={handleDeleteAura}
                            key={index}
                            isOpenDropdown={isOpen === index}
                            indexItem={index}
                            setIsOpen={handleToggleOpen}
                            isActive={isActive === index}
                            setIsActive={setIsActive}
                        />
                    ))}
                </ul>
            </nav>
        </div>
    );
}
