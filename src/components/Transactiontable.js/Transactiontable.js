import React, { useState } from "react";
import { Radio, Select, Table } from "antd";
import { Option } from "antd/es/mentions";
import tansactiontable from "./transactiontable.css";
import searchimg from "../../Assests/icons8-search.svg";
import { parse, unparse } from "papaparse";
import { toast } from "react-toastify";
import moment from 'moment'; // Import moment for date formatting

function Transactiontable({ transactions, fetchtransaction, addTransaction }) {
  const [search, setSearch] = useState("");
  const [typefilter, setTypefilter] = useState("");
  const [sortkey, setSortkey] = useState("");

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
        title: "Date",
        dataIndex: "date",
        key: "date",
       
    },
  ];

  const filteredTransactions = transactions.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      item.type.includes(typefilter)
  );

  let sortedTransactions = [...filteredTransactions];
  if (sortkey === "date") {
    sortedTransactions = sortedTransactions.sort(
      (a, b) => moment(a.date) - moment(b.date) // Sort dates using moment
    );
  } else if (sortkey === "amount") {
    sortedTransactions = sortedTransactions.sort((a, b) => a.amount - b.amount);
  }
  const exporttocsv = () => {
    const csv = unparse(
      sortedTransactions.map((transaction) => ({
        name: transaction.name,
        type: transaction.type,
        tag: transaction.tag,
        date: transaction.date, // Ensure date field is correctly formatted
        
        amount: transaction.amount,
      }))
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importfromcsv = (event) => {
    event.preventDefault();
    try {
      parse(event.target.files[0], {
        header: true,
        complete: async function (results) {
          for (const transactions of results.data) {
            console.log("transactions", transactions);
            const newTransactions = {
                // name: transactions.name,
                // type: transactions.type,
                // tag: transactions.tag,
                // date: transactions.date, // Ensure date field is correctly formatted
                // amount: transactions.amount,
                ...transactions,
              amount: parseFloat(transactions.amount),
            };
            await addTransaction(newTransactions, true);
          }
        },
      });
      toast.success("All transactions are added...!");
      fetchtransaction();
      event.target.files = null;
    } catch (e) {
      toast.error(e.message);
    }
  };



  return (
    <div>
      <div className="input-flex">
        <img src={searchimg} style={{ width: "16px" }} />
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          placeholder="Search by name"
        />
        <Select
          onChange={(value) => setTypefilter(value)}
          value={typefilter}
          placeholder="Filter"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
      </div>
      <div>
        <h2>My Transactions</h2>
        <Radio.Group
          onChange={(e) => setSortkey(e.target.value)}
          value={sortkey}
        >
          <Radio.Button value="">Default</Radio.Button>
          <Radio.Button value="date">Sort by Date</Radio.Button>
          <Radio.Button value="amount">Sort by Amount</Radio.Button>{" "}
          {/* Corrected the value */}
        </Radio.Group>
        <button onClick={exporttocsv}>Export to CSV</button>
        {/* <button onClick={importfromcsv}>Import from CSV</button> */}
        <label htmlFor="file-csv">Import from CSV</label>
        <input
          id="file-csv"
          type="file"
          accept=".csv"
          required
          style={{ display: "none" }}
          onChange={importfromcsv} // Add onChange handler
        />
      </div>
      <Table dataSource={sortedTransactions} columns={columns} />
    </div>
  );
}

export default Transactiontable;
