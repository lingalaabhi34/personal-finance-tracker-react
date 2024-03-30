import React, { useEffect, useState } from "react";
import Cards from "../components/Cards/Cards";
import Modal from "antd/es/modal/Modal";
import Header from "../components/Header/Header";
import AddExpenseModal from "../components/Modals/AddExpenseModal";
import moment from "moment";
import AddIncomemodal from "../components/Modals/AddIncomeModal";
import { toast } from "react-toastify";
import {
  Transaction,
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { parse } from "papaparse";
import Transactiontable from "../components/Transactiontable.js/Transactiontable";
import Charts from "../components/Charts/Charts";
import ResetBalance from "../components/Modals/ResetBalance";
import Notransactionsfound from "../Assests/No data-amico.svg";
export default function Dashboard() {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, settotalBalance] = useState(0);

  useEffect(() => {
    fetchtransaction();
  }, [user]);

  const showExpenseModal = () => setIsExpenseModalVisible(true);
  const showIncomeModal = () => setIsIncomeModalVisible(true);
  const handleExpenseCancel = () => setIsExpenseModalVisible(false);
  const handleIncomeCancel = () => setIsIncomeModalVisible(false);

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  };

  async function addTransaction(transaction, many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("docs written with id:", docRef.id);
      if (!many) toast.success("transactions Added");
      let newArr = transactions;
      newArr.push(transaction);
      setTransactions(newArr);
      calculatebalance();
    } catch (e) {
      console.log("error adding document:", e);
      if (!many) toast.error("couldn't add transactions");
    }
  }

  async function fetchtransaction() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionArray = [];
      querySnapshot.forEach((doc) => {
        transactionArray.push(doc.data());
      });
      setTransactions(transactionArray);
    }
    setLoading(false);
  }

  useEffect(() => {
    calculatebalance();
  }, [transactions]);

  const calculatebalance = () => {
    let incometotal = 0;
    let expensetotal = 0;
    transactions.forEach((item) => {
      if (item.type === "income") {
        incometotal += parseInt(item.amount);
      } else {
        expensetotal += parseInt(item.amount);
      }
      setIncome(incometotal);
      setExpense(expensetotal);
      let total = incometotal - expensetotal;
      settotalBalance(total);
    });
  };

  let sortedTransactions = transactions.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  const resetbalance = async () => {
    try {
      // Reset local state
      setIncome(0);
      setExpense(0);
      settotalBalance(0);
      setTransactions([]);

      // Delete data from Firestore collection
      const userTransactionsRef = collection(
        db,
        `users/${user.uid}/transactions`
      );
      const querySnapshot = await getDocs(userTransactionsRef);
      const batch = writeBatch(db);

      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      toast.success(
        "Balance reset successfully and data removed from Firestore."
      );
    } catch (error) {
      console.error("Error resetting balance:", error);
      toast.error("Failed to reset balance.");
    }
  };

  return (
    <div>
      {loading ? (
        <p>loading</p>
      ) : (
        <>
          <Cards
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
            income={income}
            expense={expense}
            totalBalance={totalBalance}
            resetBalance={resetbalance}
          />
          <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncomemodal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />

          {transactions.length > 0 ? (
            <Charts sortedTransactions={sortedTransactions} />
          ) : (
            <img
              src={Notransactionsfound}
              style={{ width: "500px", marginLeft: "450px" }}
            />
          )}
          <Transactiontable
            transactions={transactions}
            fetchtransaction={fetchtransaction}
            addTransaction={addTransaction}
          />
          {/* <ResetBalance resetBalance={resetbalance}/> */}
        </>
      )}
    </div>
  );
}
