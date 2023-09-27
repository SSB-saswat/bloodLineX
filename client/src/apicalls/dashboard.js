import { axiosInstance } from ".";

export const getAllBloodGroupsInventory = () => {
  return axiosInstance("get", "/api/dashboard/blood-groups-data");
};
