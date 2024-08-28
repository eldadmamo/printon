import {transformToUrl} from "../../utils/urls";

export const getPdpPath = (
    urlPrefix: string,
    productTypeName: string,
    productTypeId: string,
    appearanceId?: string
) => {
    return `${urlPrefix}/${transformToUrl(productTypeName).toLowerCase()}-PT${productTypeId}${
        appearanceId ? `?appearance=${appearanceId}` : ''
    }`;
};