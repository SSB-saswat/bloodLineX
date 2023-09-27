import { axiosInstance } from ".";

export const LoginUser = async (payload) => {
  const response = await axiosInstance("post", "/api/users/login", payload);
  return response;
};

export const RegisterUser = async (payload) => {
  const response = await axiosInstance("post", "/api/users/register", payload);
  return response;
};

// get-current-user is the endpoint
export const GetCurrentUser = async () => {
  const response = await axiosInstance("get", "/api/users/get-current-user");

  return response;
};

export const getAllDonorsOfOrganization = () => {
  return axiosInstance("get", `/api/users/get-all-donors`);
};

export const getAllHospitalsOfOrganization = () => {
  return axiosInstance("get", `/api/users/get-all-hospitals`);
};

export const getAllOrganizationsOfDonor = () => {
  return axiosInstance("get", "/api/users/get-all-organizations-of-a-donor");
};

export const getAllOrganizationsOfHospital = () => {
  return axiosInstance("get", "/api/users/get-all-organizations-of-a-hospital");
};
