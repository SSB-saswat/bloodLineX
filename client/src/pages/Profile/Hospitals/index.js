import { Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../redux/loadersSlice";
import { getAllHospitalsOfOrganization } from "../../../apicalls/users";
import { getDateFormat } from "../../../utils/helpers";

const Hospitals = () => {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const getData = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getAllHospitalsOfOrganization();
      dispatch(setLoading(false));

      if (response.success) {
        setData(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
      dispatch(setLoading(false));
    }
  };

  const columns = [
    {
      title: "Hospital Name",
      dataIndex: "hospitalName",
    },
    {
      title: "Email ID",
      dataIndex: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (text) => getDateFormat(text),
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return <Table columns={columns} dataSource={data} />;
};

export default Hospitals;
