import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import apiService from '../../utils/apiService';

export default function Search({ history }) {
    const [search, setSearch] = useState({ searchValue: '' });
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const loading = open && options.length === 0;

    useEffect(() => {
        if (!loading) return undefined;
        let active = true;

        (async () => {
            const results = await apiService.getData(`/api/applications/search`, {
                search: search.searchValue
            });
            if (active) {
                if (results.length > 0) {
                    setOptions(results);
                } else {
                    setOptions([{ title: 'No results were found', company: '' }]);
                }
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

    const onKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (search.searchValue.length > 2) {
                history.push(`/search?what=${search.searchValue}`);
                // setOpen(true);
            } else {
                // setOpen(false);
            }
        }
    };

    return (
        <Autocomplete
            className="search-input"
            open={open}
            onClose={() => {
                setOpen(false);
            }}
            getOptionSelected={(option, value) => option.title === value.title}
            getOptionLabel={(option) => option.title}
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
                        ...params.InputProps,
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
