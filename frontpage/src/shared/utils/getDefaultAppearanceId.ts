interface ProductTypeWithDefaultValues {
    defaultValues: ProductType['defaultValues'];
}

export const getDefaultAppearanceId = (productType: ProductTypeWithDefaultValues) =>
    productType.defaultValues.defaultAppearance.id;
