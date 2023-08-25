import { DashboardDataDTO } from "@enterslash/enterus/types";
import $api from "../client";

export const get_dashboard_data = (): Promise<DashboardDataDTO> => {
  return $api.get('/admin/dashboard');
}
