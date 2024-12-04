export const formatDateToYyyyMmDd = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add 1 because months are zero-based
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const getNMonthAgoDate = (numMonthsLookback: number): Date => {
    const currentDate = new Date();
    const nMonthsAgo = new Date();
    nMonthsAgo.setMonth(currentDate.getMonth() - numMonthsLookback);
    return nMonthsAgo;
};

export const copyCurrentUrlToClipboard = () => {
    const currentUrl = window.location.href; // Get the current URL
    navigator.clipboard.writeText(currentUrl).catch((err) => {
        alert('Failed to copy the URL.');
    });
};

export const RATING_SCALE = 0.5;
