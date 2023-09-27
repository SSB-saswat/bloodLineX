import { axiosInstance } from ".";

export const AddInventory = (data) => {
  return axiosInstance("post", "/api/inventory/add", data);
};

// we do not need to send to anything, everything we are going to get from the db only
export const GetInventory = () => {
  return axiosInstance("get", "/api/inventory/get");
};

export const GetInventoryWithFilters = (filters, limit) => {
  return axiosInstance("post", "/api/inventory/filter", { filters, limit });
};
