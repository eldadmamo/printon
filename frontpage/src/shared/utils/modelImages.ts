export const hasModelImage = (viewId: string, modelImages: ModelImageAppearanceResult | null) =>
    modelImages && modelImages.views[viewId] && modelImages.views[viewId].length;

export const getModelImageDetailCropId = (
    viewId: string,
    modelImages: ModelImageAppearanceResult | null
) => {
    if (hasModelImage(viewId, modelImages)) {
        return modelImages.views[viewId].filter((m) => m.crops.includes('detail'));
    }
};

export const getModelImageForList = (
    viewId: string,
    modelImages: ModelImageAppearanceResult | null
) => {
    if (hasModelImage(viewId, modelImages)) {
        return modelImages.views[viewId].filter(
            (m) => m.crops.includes('list') || m.crops.length === 0
        );
    }
};

export const getMoodModelImageIds = (
    viewId: string,
    defaultViewModelId: string,
    modelImages: ModelImageAppearanceResult
) => {
    if (hasModelImage(viewId, modelImages)) {
        return modelImages.views[viewId]
            .sort((m1, m2) => m2.priority - m1.priority)
            .filter(
                (m) =>
                    m.modelId !== defaultViewModelId &&
                    !m.productTypeSizeId &&
                    (!m.crops || m.crops.length === 0)
            )
            .map((m) => m.modelId);
    }
};
