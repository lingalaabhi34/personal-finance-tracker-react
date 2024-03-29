import { Card, Row } from "antd";
import React, { useState } from "react";
import Button from "../Button/Button";
function Cards({
  showExpenseModal,
  showIncomeModal,
  handleExpenseCancel,
  handleIncomeCancel,
  income,
  expense,
  totalBalance
}) {
  // console.log(income,expense,totalBalance);
  return (
    <div>
      <Row>
        <Card >
          <p> current Balance</p>
          <p>{totalBalance}</p>
          <Button text="Reset Balance" />
        </Card>
        <Card >
          <p>Income</p>
          <p> {income}</p>
          <Button text="Add Income" onClick={showIncomeModal} />
        </Card>
        <Card >
          <p>Expenses</p>
          <p> {expense}</p>
          <Button text="Add Expense" onClick={showExpenseModal} />
        </Card>
      </Row>
    </div>
  );
}

export default Cards;
