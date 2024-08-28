export const getMaterialViewId = (productType: DesignerApiProductType) =>
    productType.views.find((view) => view.perspective === null)?.id;
