import fetch from 'isomorphic-unfetch';
import { NotFoundError } from './errors';

export const get = <T>(url: string, config?: RequestInit): Promise<T> =>
    fetch(url, config).then((response) => {
        if (!response.ok) {
            if (response.status === 404) {
                throw new NotFoundError(`GET ${url} not found`);
            }

            throw new Error(`GET ${url} failed with status ${response.status}`);
        }
        return response.json() as Promise<T>;
    });

export const post = <T>(url: string, body: any): Promise<T> =>
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((response) => {
        if (!response.ok) {
            throw new Error(`POST ${url} failed with status ${response.status}`);
        }
        return response.json() as Promise<T>;
    });
