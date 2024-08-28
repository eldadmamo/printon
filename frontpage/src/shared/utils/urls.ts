export interface ImageParams {
    version?: number;
    width?: number;
    height?: number;
    colors?: string[];
    defaultImageOnError?: boolean;
    backgroundColor?: string;
    modelId?: string;
    crop?: string;
    [key: string]: number | boolean | string | string[];
}

const stringify = (params: ImageParams, delimiter = ',') => {
    if (!params) {
        return '';
    }
    const query = Object.entries(params)
        .map(([key, value]) => {
            if (!key || !value) {
                return undefined;
            }
            if (Array.isArray(value)) {
                return value.map((v, i) => `${key}[${i}]=${encodeURIComponent(v)}`).join(delimiter);
            }
            return `${encodeURIComponent(key)}=${encodeURIComponent(value.toString())}`;
        })
        .filter((v) => v)
        .join(delimiter);
    if (query && query.length) {
        return `${delimiter === '&' ? '?' : ','}${query}`;
    }
    return '';
};

export const productTypeImageUrl = (
    imageServerBase: string,
    productTypeId: string,
    viewId: string,
    appearanceId: string,
    params: ImageParams,
    type = 'png'
) => {
    if (productTypeId && viewId && appearanceId) {
        return `${imageServerBase}/image-server/v1/productTypes/${productTypeId}/views/${viewId}/appearances/${appearanceId}${stringify(
            params
        )}.${type}`;
    }
    return null;
};

export const queryParamsFromSearchString = (search: string) => {
    if (!search) {
        return {};
    }

    return search
        .slice(1)
        .split('&')
        .reduce((result, param) => {
            const [key, value] = param.split('=');
            result[key] = value;
            return result;
        }, {});
};

export const getProductTypeDetailUrl = (
    productTypeDetailRoute: string,
    productType: ProductType | AssortmentListProductType,
    appearanceId: string,
    quantity?: number
) => {
    const name = encodeURIComponent(transformToUrl(productType.name.toLowerCase())).replace(
        '%2B',
        '+',
    ); //

    return `${productTypeDetailRoute}/${name}-PT${productType.id}?appearance=${appearanceId}${
        quantity ? `&quantity=${quantity}` : ''
    }`;
};

export const getDesignUrlWithParams = (designerRoute: string, params: DesignerParams) => {
    const parameters = new URLSearchParams(params).toString();

    return `${designerRoute}${parameters.length > 0 ? `?${parameters}` : ''}`;
};

// transform a string to an url that follows random MP rules
export const transformToUrl = (value: string) =>
    value
        .replace(/\s*[&+]\s*/g, '+') // transform &/+ with surrounding spaces to `+`
        .replace(/[\s/\\]+/g, '-') // transform spaces and slashes to `-`
        .replace(/["'’%()]/g, ''); // remove special characters
