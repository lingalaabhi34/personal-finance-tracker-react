import React from "react";
import { Button, Modal, Form, Input, DatePicker, Select } from "antd";
import moment from "moment"; // Import moment library
import Title from "antd/es/skeleton/Title";

function AddIncomemodal({
  isIncomeModalVisible,
  handleIncomeCancel,
  onFinish,
}) {
  const [form] = Form.useForm();

  return (
    <Modal
      title="Add Income"
      visible={isIncomeModalVisible}
      onCancel={handleIncomeCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          // Convert date to moment object
          values.date = moment(values.date).format("YYYY-MM-DD");
          onFinish(values, "income");
          form.resetFields();
        }}
      >
        <Form.Item
          label="name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input the name of the transaction..!",
            },
          ]}
        >
          <Input type="text" />
        </Form.Item>
        <Form.Item
          label="Amount"
          name="amount"
          rules={[
            {
              required: true,
              message: "Please input the expenses Amount!",
            },
          ]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          label="Date"
          name="date"
          rules={[
            {
              required: true,
              message: "Please select the expense date!",
            },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          label="Tag"
          name="tag"
          rules={[{ required: true, message: "please select a tag" }]}
        >
          <Select>
            <Select.Option value="Salary">Salary</Select.Option>
            <Select.Option value="Freelance">Freelance</Select.Option>
            <Select.Option value="Expense">Investment</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            AddIncome
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddIncomemodal;
