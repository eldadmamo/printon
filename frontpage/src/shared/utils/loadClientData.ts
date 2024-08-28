import fetch from 'isomorphic-unfetch';

export const loadClientData = async <T>(host: string, locale: string, referrer: string) => {
    const response = await fetch(
        `${host ? `//${host}` : ''}/api/pageData?fragment=${encodeURIComponent(
            `${window.location.pathname}${window.location.search}`
        )}&locale=${locale}`,
        {
            referrer,
        }
    );

    const data = await response.json();

    return data as T;
};
