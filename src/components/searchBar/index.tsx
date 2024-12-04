import { mainBackgroundColor } from '@/const/colors';
import { ApiContext, IApiContext } from '@/context/ApiContextProvider';
import { SearchResult, SimpleTrack, Track } from '@/types/domain-models';
import React, { useContext, useState } from 'react';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const { search } = useContext<IApiContext>(ApiContext);

    // Mock function to simulate search results (you can replace this with an actual API call)
    const fetchSearchResults = (query: any) => {
        search(query).then((searchResult: SearchResult | null) => {
            setSearchResults(searchResult);
            setDropdownVisible(true);
        });
    };

    const handleInputChange = (event: any) => {
        setSearchTerm(event.target.value);
    };

    const handleKeyPress = (event: any) => {
        if (event.key === 'Enter') {
            fetchSearchResults(searchTerm);
        }
    };

    const handleResultClick = (result: any) => {
        setSearchTerm(result);
        setDropdownVisible(false);
    };

    if (!searchResults) {
        return <div></div>;
    }

    return (
        <div style={{ position: 'relative', width: 400 }}>
            <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                // onKeyPress={handleKeyPress}
                onKeyDown={handleKeyPress}
                placeholder="What movie/show are you looking for?"
                style={{
                    width: '100%',
                    padding: 8,
                    paddingLeft: 20,
                    borderRadius: 20,
                    backgroundColor: mainBackgroundColor,
                    color: 'white',
                }}
            />

            {/* {isDropdownVisible && Object.keys(searchResults).length > 0 && (
                <ul
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: mainBackgroundColor,
                        color: 'white',
                        border: '1px solid #ccc',
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        maxHeight: '150px',
                        overflowY: 'auto',
                    }}
                >
                    {searchResults.map((result, index) => (
                        <li
                            key={index}
                            onClick={() => handleResultClick(result)}
                            style={{ padding: '8px', cursor: 'pointer' }}
                        >
                            <>
                                <img src={result.mainPhotoUrl} style={{ width: 40 }}></img>
                                {result.name}
                            </>
                        </li>
                    ))}
                </ul>
            )} */}
        </div>
    );
};

export default SearchBar;
