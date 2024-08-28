export const getPriceFormatter = (currency: Currency, locale: string) => {
    const jsLocale = locale.replace('_', '-');
    return (price: number) => {
        return new Intl.NumberFormat(jsLocale, {
            style: 'currency',
            currency: currency.isoCode,
            maximumFractionDigits: currency.decimalCount,
            minimumFractionDigits: currency.decimalCount,
        }).format(price);
    };
};
