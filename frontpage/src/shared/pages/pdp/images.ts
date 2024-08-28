import { getDefaultViewId } from '@/shared/utils/getDefaultViewId';
import { getModelImageDetailCropId, getMoodModelImageIds } from '@/shared/utils/modelImages';
import { productTypeImageUrl } from '@/shared/utils/urls';

export const SMALL_IMAGE_SIZE = 120;
export const IMAGE_SIZE_800 = 800;
export const DEFAULT_IMAGE_WIDTH = 650;
const DEFAULT_IMAGE_SIZE: [number, number] = [DEFAULT_IMAGE_WIDTH, IMAGE_SIZE_800];
const IMAGE_SIZE_1200 = 1200;
const OPEN_GRAPH_IMAGE_SIZE = IMAGE_SIZE_1200;
export const DEFAULT_ZOOM_IMAGE_SIZE = IMAGE_SIZE_1200;

const MAX_1023 = '(max-width: 1023px)';
const MAX_1023_IMAGE_SIZE = 550;
const MAX_1023_ZOOM_IMAGE_SIZE = IMAGE_SIZE_800;

const MIN_1600 = '(min-width: 1600px)';
const MIN_1600_IMAGE_SIZE = IMAGE_SIZE_800;

export interface PdpImageData {
    smallUrl: string;
    defaultUrl: string;
    responsiveImages: Record<typeof MAX_1023 | typeof MIN_1600, string>;
    defaultZoomUrl: string;
    zoomImages: Record<typeof MAX_1023, string>;
    openGraph?: string;
}

export const getAllImageUrls = (
    imageServerBase: string,
    productType: DesignerApiProductType,
    appearanceId: string,
    modelImages: ModelImageProductTypeResult | null
) => {
    const defaultViewId = getDefaultViewId(productType);

    const getImageUrl = (
        size: number | [number, number],
        viewId?: string,
        modelId?: string,
        type?: string
    ) => {
        const isSizeArray = Array.isArray(size);
        const width = isSizeArray ? size[0] : size;
        const height = isSizeArray ? size[1] : size;

        return productTypeImageUrl(
            imageServerBase,
            productType.id,
            viewId || defaultViewId,
            appearanceId,
            {
                width,
                height,
                backgroundColor: 'f2f2f2',
                ...(modelId ? { modelId, crop: 'detail' } : {}),
            },
            type
        );
    };

    const modelImagesForAppearance = modelImages?.appearances[appearanceId];
    const detailModelImages = getModelImageDetailCropId(defaultViewId, modelImagesForAppearance);
    const defaultModelId = detailModelImages?.[0]?.modelId;

    const getPdpImage = ({
                             viewId = defaultViewId,
                             modelId,
                             withOpenGraph,
                         }: { viewId?: string; modelId?: string; withOpenGraph?: boolean } = {}): PdpImageData => {
        return {
            defaultUrl: getImageUrl(DEFAULT_IMAGE_SIZE, viewId, modelId),
            smallUrl: getImageUrl(SMALL_IMAGE_SIZE, viewId, modelId),
            openGraph: withOpenGraph
                ? getImageUrl(OPEN_GRAPH_IMAGE_SIZE, viewId, modelId, 'jpg')
                : undefined,
            responsiveImages: {
                [MAX_1023]: getImageUrl(MAX_1023_IMAGE_SIZE, viewId, modelId),
                [MIN_1600]: getImageUrl(MIN_1600_IMAGE_SIZE, viewId, modelId),
            },
            defaultZoomUrl: getImageUrl(DEFAULT_ZOOM_IMAGE_SIZE, viewId, modelId),
            zoomImages: {
                [MAX_1023]: getImageUrl(MAX_1023_ZOOM_IMAGE_SIZE, viewId, modelId),
            },
        };
    };

    const result: PdpImageData[] = [];

    if (detailModelImages && detailModelImages.length) {
        detailModelImages.forEach((modelImage) => {
            result.push(getPdpImage({ modelId: modelImage.modelId, withOpenGraph: true }));
        });
    }

    result.push(getPdpImage({ withOpenGraph: true }));

    //back view
    //we ignore sleeves / hoods and other stuff as MP does this too
    const backView = productType.views.find((v) => v.perspective === 'back');

    if (backView) {
        const modelImagesForView = getModelImageDetailCropId(backView.id, modelImagesForAppearance);

        if (modelImagesForView && modelImagesForView.length) {
            modelImagesForView.forEach((modelImage) => {
                result.push(getPdpImage({ viewId: backView.id, modelId: modelImage.modelId }));
            });
        }

        result.push(getPdpImage({ viewId: backView.id }));
    }

    //mood image, only checking default view for now
    const moodModelIds = getMoodModelImageIds(
        defaultViewId,
        defaultModelId,
        modelImagesForAppearance
    );
    if (moodModelIds && moodModelIds.length) {
        moodModelIds.forEach((moodModelId) => {
            result.push(getPdpImage({ modelId: moodModelId }));
        });
    }

    return result;
};
