import { DataContext, IDataContext } from '@/context/DataContextProvider';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useHandleSearch() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const navigate = useNavigate();
    const { setAura } = useContext<IDataContext>(DataContext);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => {
        if ((e as React.FormEvent<HTMLFormElement>).currentTarget instanceof HTMLFormElement) {
            e.preventDefault();
        }
        navigate({
            pathname: '/search',
            search: `?query=${searchTerm}`,
        });
        setSearchTerm('');
        setAura(null);
    };

    return { searchTerm, handleSearchChange, handleSearchSubmit };
}
