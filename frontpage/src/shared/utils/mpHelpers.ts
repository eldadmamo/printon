import { getLocalePath } from '@/shared/utils/getLocalePath';

export const urlToToken = (url: string) => {
    // pathname + query params without leading slash
    const { host } = window.location;
    let token = url.substr(url.indexOf(host) + host.length + 1);

    // if the language is encoded in the path the marketplace does not consider this
    // part as path of its canonical, hence we need to remove it from the history entries
    const localePath = getLocalePath(window.core_data.locale.id);
    if (localePath) {
        token = token.slice(localePath.length + 1);
    }

    return token;
};

export const tokenToUrl = (token: string) => {
    const localePath = getLocalePath(window.core_data.locale.id);
    if (localePath) {
        const localePathWithSlash = `${localePath}/`;
        if (!token.startsWith(localePathWithSlash)) {
            return `/${localePathWithSlash}${token}`;
        }
    }

    return `/${token}`;
};
