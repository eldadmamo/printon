interface ProductTypeWithDefaultValues {
    defaultValues: ProductType['defaultValues'];
}

export const getDefaultViewId = (productType: ProductTypeWithDefaultValues) =>
    productType.defaultValues.defaultView.id;
