import React from "react";
import { Card, Row } from "antd";
import Button from "../Button/Button";
import cardStyles from "./card.module.css";

const Cards = ({
  showExpenseModal,
  showIncomeModal,
  income,
  expense,
  totalBalance,
  resetBalance,
}) => {
  return (
    <div>
      <Row className={cardStyles.main}>
        <Card className={cardStyles.card}>
          <h1>Current Balance</h1>
          <h3>₹ {totalBalance}</h3>
          <Button text="Reset Balance" onClick={resetBalance} />
        </Card>
        <Card className={cardStyles.card}>
          <h1>Income</h1>
          <h3>₹ {income}</h3>
          <Button text="Add Income" onClick={showIncomeModal} />
        </Card>
        <Card className={cardStyles.card}>
          <h1>Expenses</h1>
          <h3>₹ {expense}</h3>
          <Button text="Add Expense" onClick={showExpenseModal} />
        </Card>
      </Row>
    </div>
  );
};

export default Cards;
