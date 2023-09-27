import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../redux/loadersSlice";
import {
  getAllOrganizationsOfDonor,
  getAllOrganizationsOfHospital,
} from "../../../apicalls/users";
import { Modal, Table, message } from "antd";
import { getDateFormat } from "../../../utils/helpers";
import InventoryTable from "../../../components/InventoryTable";

const Organizations = ({ userType }) => {
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const { currentUser } = useSelector((state) => state.users);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const getData = async () => {
    try {
      dispatch(setLoading(true));
      let response = null;
      if (userType === "hospital") {
        response = await getAllOrganizationsOfHospital();
      } else {
        response = await getAllOrganizationsOfDonor();
      }
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
      title: "Organization Name",
      dataIndex: "organizationName",
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
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <span
          className="underline text-md cursor-pointer"
          onClick={() => {
            setSelectedOrganization(record);
            setShowHistoryModal(true);
          }}
        >
          History
        </span>
      ),
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <Table columns={columns} dataSource={data} />
      {showHistoryModal && (
        <Modal
          title={`${
            userType === "donor" ? "Donations History" : "Consumption History"
          } in ${selectedOrganization.organizationName}`}
          centered
          open={showHistoryModal}
          width={1000}
          onClose={() => setShowHistoryModal(false)}
          onCancel={() => setShowHistoryModal(false)}
        >
          <InventoryTable
            filters={{
              organization: selectedOrganization._id,
              [userType]: currentUser._id,
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default Organizations;
