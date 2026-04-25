import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import './SearchBar.css';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${query}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="search-bar">
            <input 
                type="text" 
                placeholder="Buscar películas..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit"><Search size={20} /></button>
        </form>
    );
};

export default SearchBar;