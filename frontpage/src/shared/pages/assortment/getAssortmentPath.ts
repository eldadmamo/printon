import { AssortmentPageParams } from '@/shared/pages/assortment/types';
import { getActiveFilters, getSeoUrlPart } from '@/shared/utils/assortment';

const safeString = (value: string) => value || '';

export const getAssortmentPath = (
    urlPrefix: string,
    params: AssortmentPageParams,
    filter: AssortmentListFilter,
    platform: GlobalData['platform']
) => {
    const queryParams = [];

    if (params.brand) {
        queryParams.push(`brand=${encodeURIComponent(params.brand)}`);
    }

    if (params.refinement) {
        queryParams.push(`refinement=${encodeURIComponent(params.refinement)}`);
    }

    if (params.sort) {
        queryParams.push(`sort=${params.sort}`);
    }

    if (params.materials) {
        queryParams.push(`materials=${encodeURIComponent(params.materials)}`);
    }

    if (params.fit) {
        queryParams.push(`fit=${encodeURIComponent(params.fit)}`);
    }

    if (params.style) {
        queryParams.push(`style=${encodeURIComponent(params.style)}`);
    }

    if (params.neckline) {
        queryParams.push(`neckline=${encodeURIComponent(params.neckline)}`);
    }

    if (params.sleeve) {
        queryParams.push(`sleeve=${encodeURIComponent(params.sleeve)}`);
    }

    if (parseInt(params.quantity) > 0) {
        queryParams.push(`quantity=${params.quantity}`);
    }

    if (params.maxPrice) {
        queryParams.push(`maxPrice=${params.maxPrice}`);
    }

    const activeFilters = getActiveFilters(params, filter, platform);

    const seoPart = getSeoUrlPart(activeFilters);
    const assortmentParams =
        (activeFilters.department ? safeString(params.department) : '') +
        (activeFilters.category ? safeString(params.category) : '') +
        (activeFilters.feature ? safeString(params.feature) : '') +
        (activeFilters.appearance ? safeString(params.appearance) : '') +
        (activeFilters.size ? safeString(params.size) : '');

    const seoString = seoPart ? `${seoPart}-` : '';
    const filterPath = seoString || assortmentParams ? `/${seoString}${assortmentParams}` : '';
    const queryString = `${queryParams.length ? `?${queryParams.join('&')}` : ''}`;

    return `${urlPrefix}${filterPath}${queryString}`;
};
