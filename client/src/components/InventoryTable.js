import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getDateFormat } from "../utils/helpers";
import { setLoading } from "../redux/loadersSlice";
import { GetInventoryWithFilters } from "../apicalls/inventory";
import { Table, message } from "antd";

const InventoryTable = ({ filters, userType, limit }) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const columns = [
    {
      title: "Inventory Type",
      dataIndex: "inventoryType", //this dataIndex property must match with mongodb model as per the antd structure
      render: (text) => text.toUpperCase(),
    },
    {
      title: "Blood Group",
      dataIndex: "bloodGroup",
      render: (text) => text.toUpperCase(),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      render: (text) => text + " ML",
    },
    {
      title: "Reference",
      dataIndex: "reference",
      render: (text, record) => {
        if (userType === "organization") {
          return record.inventoryType === "in"
            ? record.donor?.name
            : record.hospital?.hospitalName;
        } else {
          return record.organization.organizationName;
        }
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (text) => getDateFormat(text),
    },
  ];

  // change columns for hospital
  if (userType === "hospital") {
    // remove "Inventory Type" column
    columns.splice(0, 1);

    // Change reference column to organization
    columns[2].title = "Organization Name";

    // Date column should be renamed to consumed date
    columns[3].title = "Consumed Date";
  }

  // change columns for donor
  if (userType === "donor") {
    // remove "Inventory Type" column
    columns.splice(0, 1);

    // Change reference column to organization
    columns[2].title = "Organization Name";

    // Date column should be renamed to donation date
    columns[3].title = "Donation Date";
  }

  const getData = async () => {
    try {
      dispatch(setLoading(true));
      const response = await GetInventoryWithFilters(filters, limit);
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

  useEffect(() => {
    getData();
  }, []);
  return <Table columns={columns} dataSource={data} className="mt-3"></Table>;
};

export default InventoryTable;
