import {useGlobalData} from "../../globalData";

export function useAbTest(abTestName: string) {
    return useGlobalData().abTest.includes(abTestName);
}