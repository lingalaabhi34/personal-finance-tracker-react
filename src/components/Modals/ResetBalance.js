import React from "react";
import { Button, Modal } from "antd";

const ResetBalance = ({ resetBalance }) => {
  const handleReset = () => {
    Modal.confirm({
      title: "Reset Balance",
      content: "Are you sure you want to reset your balance?",
      onOk: resetBalance,
    });
  };

  return (
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      <Button type="danger" onClick={handleReset}>
        Reset Balance
      </Button>
    </div>
  );
};

export default ResetBalance;
