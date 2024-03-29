import React, { useState } from 'react';
import { Radio, Select, Table } from 'antd';
import { Option } from 'antd/es/mentions';

function Transactiontable({ transactions }) {
    const [search, setSearch] = useState("");
    const [typefilter, setTypefilter] = useState("");
    const [sortkey, setSortkey] = useState("");

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Tag',
            dataIndex: 'tag',
            key: 'tag',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Date',
            dataIndex: 'Date',
            key: 'date',
        }
    ];

    const filteredTransactions = transactions.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()) && item.type.includes(typefilter));

    let sortedTransactions = [...filteredTransactions];
    if (sortkey === "date") {
        sortedTransactions = sortedTransactions.sort((a, b) => new Date(a.Date) - new Date(b.Date));
    } else if (sortkey === "amount") {
        sortedTransactions = sortedTransactions.sort((a, b) => a.amount - b.amount);
    }

    return (
        <div>
            <input value={search} onChange={(e) => { setSearch(e.target.value) }} placeholder='Search by name' />
            <Radio.Group onChange={(e) => setSortkey(e.target.value)} value={sortkey}>
                <Radio.Button value="">Default</Radio.Button>
                <Radio.Button value="date">Sort by Date</Radio.Button>
                <Radio.Button value="amount">Sort by Amount</Radio.Button> {/* Corrected the value */}
            </Radio.Group>
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
            <Table dataSource={sortedTransactions} columns={columns} />
        </div>
    );
}

export default Transactiontable;
