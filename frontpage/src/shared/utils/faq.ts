export const FaqArticle = {
    VolumeDiscount: '207863285',
    DesignToolHelp: '360000052513',
    PrintTypes: '207487605',
    SampleOrder: '5226063053970',
    ScreenPrinting: '4402857317266',
};

const sprdLocalePaths: Record<string, string> = {
    us: 'en-us',
};

export const getFaqUrl = (article: string, sprdLocale: string) => {
    const localePath =
        sprdLocalePaths[sprdLocale] || sprdLocalePaths[sprdLocale.split('_')[0]] || 'en-gb';

    return `https://destamerch.com/hc/${localePath}/articles/${article}`;
};
