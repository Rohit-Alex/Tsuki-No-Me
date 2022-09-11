import { SIDEBAR_LAYOUT_CHANGED } from "../ActionConstants/dashboardActionConstants";

export const changeSidebarState = (currValue: boolean) => ({type: SIDEBAR_LAYOUT_CHANGED, payload: currValue })