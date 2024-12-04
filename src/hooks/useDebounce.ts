import React from 'react';

const useDebounce = (callback: Function, delay: number) => {
    const timerRef = React.useRef<NodeJS.Timeout | null>(null);

    React.useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const debouncedCallback = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            callback();
        }, delay);
    };

    return debouncedCallback;
};

export default useDebounce;
