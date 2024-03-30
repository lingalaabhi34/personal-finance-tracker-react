import React from "react";
import { Line, Pie } from "@ant-design/charts";
import charts from "./charts.module.css";

function Charts({ sortedTransactions }) {
  const data = sortedTransactions.map((transaction) => ({
    date: transaction.date,
    amount: transaction.amount,
  }));

  const spendingdata = sortedTransactions.filter((transaction) => {
    if (transaction.type == "expenses") {
      return { tag: transaction.tag, amount: transaction.amount };
    }
  });

  const newspendings = spendingdata.reduce((acc, obj) => {
    let key = obj.tag;
    if (!acc[key]) {
      acc[key] = { tag: obj.tag, amount: obj.amount };
    } else {
      acc[key].amount += obj.amount;
    }
    return acc;
  }, {});

  // Configuration for Line chart
  const Chartconfig = {
    data: data,
    autofit: true,
    xField: "date",
    yField: "amount",
  };

  // Configuration for Pie chart
  const spendingConfig = {
    // data: newspendings,
    data: Object.values(newspendings),
    angleField: "amount",
    colorField: "tag",
  };

  return (
    <div className={charts.main}>
      <div className={charts.chart}>
        <h2>Your Analytics</h2>
        <Line {...Chartconfig} />
      </div>
      <div className={charts.pie}>
        <h2>Your Spendings</h2>
        <Pie {...spendingConfig} />
      </div>
    </div>
  );
}

export default Charts;
