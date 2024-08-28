import { LoadGiftFinderData } from '@/shared/pages/giftFinder/loadData';
import { loadClientData } from '@/shared/utils/loadClientData';

export const loadData: LoadGiftFinderData = async (_, referrer, locale, host) =>
    loadClientData(host, locale, referrer);
