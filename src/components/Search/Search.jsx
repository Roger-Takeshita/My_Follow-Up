import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import apiService from '../../utils/apiService';

export default function Search() {
    const [search, setSearch] = useState({ searchValue: '' });
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const loading = open && options.length === 0;

    useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            const results = await apiService.getData(`/api/applications/search`, { search: search.searchValue });

            console.log(results);
            if (active) {
                // setOptions(Object.keys(results).map((key) => results[key]));
            }
        })();

        return () => {
            active = false;
        };
    }, [loading, search]);

    useEffect(() => {
        if (!open) {
            setOptions([]);
            setSearch({ searchValue: '' });
        }
    }, [open]);

    const handleChange = ({ target: { name, value } }) => {
        setSearch({ [name]: value });
    };

    const onKeyPress = async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setOpen(true);
        }
    };

    return (
        <Autocomplete
            className="search-input"
            open={open}
            onClose={() => {
                setOpen(false);
            }}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => option.name}
            options={options}
            loading={loading}
            freeSolo
            onKeyPress={onKeyPress}
            renderInput={(params) => (
                <TextField
                    {...params}
                    name="searchValue"
                    onChange={handleChange}
                    placeholder={loading ? '' : 'Search'}
                    InputProps={{
                        startAdornment: (
                            <>
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : ''}
                                {params.InputProps.endAdornment}
                            </>
                        )
                    }}
                />
            )}
        />
    );
}
