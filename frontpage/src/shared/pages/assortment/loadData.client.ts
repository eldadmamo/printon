import { loadClientData } from '@/shared/utils/loadClientData';
import { LoadAssortmentData } from './loadData';

export const loadData: LoadAssortmentData = async (_, referrer, locale, host) =>
    loadClientData(host, locale, referrer);
