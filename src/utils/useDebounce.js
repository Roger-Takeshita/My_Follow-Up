import { useState, useEffect } from 'react';

export default function useDebounce(value, delay) {
    const [debounceValue, setDebounceValue] = useState(value);

    useEffect(() => {
        let timer;
        function setTimer() {
            timer = setTimeout(() => {
                setDebounceValue(value);
            }, delay);
        }
        setTimer();
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debounceValue;
}
