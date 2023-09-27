import { Form, Modal, Radio, Input, message } from "antd";
import React, { useState } from "react";
import { getAntdInputValidation } from "../../../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../redux/loadersSlice";
import { AddInventory } from "../../../apicalls/inventory";

// to add or remove from inventory this InventoryForm will be used
const Inventoryform = ({ open, setOpen, reloadData }) => {
  const { currentUser } = useSelector((state) => state.users);
  const [inventoryType, setInventoryType] = useState("in"); // in means donor is giving the blood to the organization and out means organization is giving bllod to the hospital

  const [form] = Form.useForm(); // this is from antd as we are going to get the onClick from the modal pop up

  const dispatch = useDispatch();

  const onFinish = async (values) => {
    // console.log(values);
    try {
      dispatch(setLoading(true));
      const response = await AddInventory({
        ...values,
        inventoryType,
        organization: currentUser._id,
      });
      dispatch(setLoading(false));
      if (response.success) {
        reloadData();
        message.success("Inventory added successfully");
        setOpen(false);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
      dispatch(setLoading(false));
    }
  };
  return (
    <Modal
      title="ADD INVENTORY"
      open={open}
      onCancel={() => setOpen(false)}
      centered
      onOk={() => {
        form.submit();
      }}
    >
      <Form
        layout="vertical"
        className="flex flex-col gap-3"
        form={form}
        onFinish={onFinish}
      >
        <Form.Item label="Inventory Type">
          <Radio.Group
            value={inventoryType}
            onChange={(e) => setInventoryType(e.target.value)}
          >
            <Radio value="in">In</Radio>
            <Radio value="out">Out</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Blood Group"
          name="bloodGroup"
          rules={getAntdInputValidation()}
        >
          <select name="" id="">
            <option value="a+">A+</option>
            <option value="a-">A-</option>
            <option value="b+">B+</option>
            <option value="b-">B-</option>
            <option value="ab+">AB+</option>
            <option value="ab-">AB-</option>
            <option value="o+">O+</option>
            <option value="o-">O-</option>
          </select>
        </Form.Item>

        {/* Need to verify the email i.e., the person who is donating or taking the blood is a user of this application or not, we need to verify this which is achieved using the email */}
        <Form.Item
          label={inventoryType === "out" ? "Hospital Email" : "Donor Email"}
          name="email"
          rules={getAntdInputValidation()}
        >
          <Input type="email" />
        </Form.Item>

        <Form.Item
          label="Quantity(in ML)"
          name="quantity"
          rules={getAntdInputValidation()}
        >
          <Input type="number" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Inventoryform;
