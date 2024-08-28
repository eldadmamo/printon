import { loadClientData } from '@/shared/utils/loadClientData';
import { LoadPdpData } from './loadData';

export const loadData: LoadPdpData = async (_, referrer, locale, host) =>
    loadClientData(host, locale, referrer);
