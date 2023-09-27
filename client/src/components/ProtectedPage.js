import { message } from "antd";
import React, { useEffect } from "react";

import { GetCurrentUser } from "../apicalls/users";
import { useNavigate } from "react-router-dom";
import { getLogginUserName } from "../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { SetCurrentUser } from "../redux/usersSlice";
import { setLoading } from "../redux/loadersSlice";

// Whatever logic we write in the protectedPage that will be executed for all the pages which are wrapped with the ProtectedPage tag.
// children here is basically the information of page that we will recieve here
const ProtectedPage = ({ children }) => {
  // const [currentUser, setCurrentUser] = useState(null);
  const { currentUser } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getCurrentUser = async () => {
    try {
      dispatch(setLoading(true));
      const response = await GetCurrentUser();
      dispatch(setLoading(false));
      if (response.success) {
        message.success(response.message);
        // setCurrentUser(response.data);
        dispatch(SetCurrentUser(response.data));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getCurrentUser();
    } else {
      navigate("/login");
    }
  }, []);

  return (
    currentUser && (
      <div>
        {/* header */}
        <div className="flex justify-between items-center bg-primary text-white px-5 py-3 rounded-b-md">
          <div onClick={() => navigate("/")} className="cursor-pointer">
            <h1 className="text-2xl">BloodLineX</h1>
            <span className="text-xs">
              {currentUser.userType.toUpperCase()}{" "}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <i class="ri-shield-user-fill"></i>
            <div className="flex flex-col">
              <span
                className="mr-5 text-md cursor-pointer"
                onClick={() => navigate("/profile")}
              >
                {getLogginUserName(currentUser).toUpperCase()}{" "}
              </span>
            </div>

            <i
              className="ri-logout-circle-r-line ml-5 cursor-pointer"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            ></i>
          </div>
        </div>

        {/* body or content */}
        <div className="px-5 py-5">{children}</div>
      </div>
    )
  );
};

export default ProtectedPage;
