import React, { useEffect, useState } from 'react'
import Cards from '../components/Cards/Cards'
import Modal from 'antd/es/modal/Modal';
import Header from '../components/Header/Header';
import AddExpenseModal from '../components/Modals/AddExpenseModal';
import moment from 'moment';
import AddIncomemodal from '../components/Modals/AddIncomeModal';
import { toast } from 'react-toastify';
import { Transaction, addDoc, collection, doc, getDocs, query } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { parse } from 'papaparse';
import Transactiontable from '../components/Transactiontable.js/Transactiontable';

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

  const showExpenseModal = () => (
    setIsExpenseModalVisible(true));
  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };
  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };
  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  }

  const onFinish = (values, type) => {
    console.log('Values:', values); // Log values to check the structure
    const newTransaction = {
      type: type,
      Date: values.Date ? values.Date.format("YYYY-MM-DD") : null, // Check if values.Date is defined
      tag: values.tag,
      name: values.name,
      amount: parseFloat(values.amount)
    };
    addTransaction(newTransaction);
  }
  // const onFinish = (values, type) => {
  //   const { Date, tag, name, amount } = values;
  //   const formattedDate = Date ? moment(Date).format("YYYY-MM-DD") : null; // Format date if it exists
  
  //   const newTransaction = {
  //     type: type,
  //     Date: formattedDate,
  //     tag: tag,
  //     name: name,
  //     amount: parseFloat(amount)
  //   };
  //   addTransaction(newTransaction);
  // }

  // 1
  // async function addTransaction(transaction, many) {
  //   try {
  //     const docRef = await addDoc(
  //       collection(db, `users/${user.uid}/transactions`),
  //       transaction
  //     );
  //     console.log("docs written with id:", docRef.id);
  //     if (!many) toast.success("Transaction Added");
  //     // Update state correctly
  //     setTransactions(prevTransactions => [...prevTransactions, transaction]); // Ensure immutability by spreading previous transactions
  //     calculatebalance(); // Recalculate balance
  //   } catch (e) {
  //     console.log("error adding document:", e);
  //     if (!many) toast.error("Couldn't add transaction");
  //   }
  // }
  


  //2
  async function addTransaction(transaction,many){
    try{
      const docRef = await addDoc(
        collection(db,`users/${user.uid}/transactions`),
        transaction
      );
      console.log("docs written with id:",docRef.id);
      if(!many)  toast.success("transactions Added")
      let newArr = transactions;
    newArr.push(transaction);
    setTransactions(newArr);
    calculatebalance();
    }
    catch(e){
      console.log("error adding document:",e);
      if(!many) toast.error("couldn't add transactions")
    }
  }
  // async function addTransaction(transaction, many) {
  //   try {
  //     const docRef = await addDoc(
  //       collection(db, `users/${user.uid}/transactions`),
  //       transaction
  //     );
  //     console.log("docs written with id:", docRef.id);
  //     if (!many) toast.success("Transaction Added");
  
  //     // Create a new array with the updated transaction
  //     const newTransactions = [...transactions, transaction];
  //     setTransactions(newTransactions);
  
  //     // After ensuring state update, calculate balance
  //     calculatebalance(newTransactions);
  //   } catch (e) {
  //     console.log("error adding document:", e);
  //     if (!many) toast.error("Couldn't add transaction");
  //   }
  // }
  
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
      toast.success("transactions fetched....!");
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

      }
      else {
        expensetotal += parseInt(item.amount);

      }
      setIncome(incometotal);
      setExpense(expensetotal);
      let total = incometotal - expensetotal;
      settotalBalance(total);
    });

  };

 
  return (
    <div>
      {loading ? <p>loading</p> :
        <>
          <Cards
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
            income={income}
            expense={expense}
            totalBalance={totalBalance} />
          <AddExpenseModal isExpenseModalVisible={isExpenseModalVisible} handleExpenseCancel={handleExpenseCancel} onFinish={onFinish} />
          <AddIncomemodal isIncomeModalVisible={isIncomeModalVisible} handleIncomeCancel={handleIncomeCancel} onFinish={onFinish} />
        
          <Transactiontable transactions={transactions} fetchtransaction={fetchtransaction} addTransaction={addTransaction} />
        </>
      }
    </div>
  )
}
