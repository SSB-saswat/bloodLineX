import React, { useEffect, useState } from "react";
import Inventoryform from "./Inventoryform";
import { Button, message, Table } from "antd";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../redux/loadersSlice";
import { GetInventory } from "../../../apicalls/inventory";
import { getDateFormat } from "../../../utils/helpers";

const Inventory = () => {
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
        if (record.inventoryType === "in") {
          return record.donor.name;
        } else {
          return record.hospital.hospitalName;
        }
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (text) => getDateFormat(text),
    },
  ];

  const getData = async () => {
    try {
      dispatch(setLoading(true));
      const response = await GetInventory();
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

  return (
    <div>
      <div className="flex justify-end">
        <Button type="default" onClick={() => setOpen(true)}>
          Add Inventory
        </Button>
      </div>

      <Table columns={columns} dataSource={data} className="mt-3" />

      {open && (
        <Inventoryform open={open} setOpen={setOpen} reloadData={getData} />
      )}
    </div>
  );
};

export default Inventory;
