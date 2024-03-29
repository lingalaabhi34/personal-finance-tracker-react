import React,{useEffect, useState} from 'react'
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
import { fetchSignInMethodsForEmail } from 'firebase/auth';
import Transactiontable from '../components/Transactiontable.js/Transactiontable';



export default function Dashboard() {
const [user]= useAuthState(auth);  
const [loading,setLoading] = useState(false);
const [transactions,setTransactions] =useState([]);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, settotalBalance] = useState(0);
  
  useEffect(()=>{
    fetchtransaction();

  },[]);
 
  const showExpenseModal = () =>(
  setIsExpenseModalVisible (true));
  const showIncomeModal = () =>{
  setIsIncomeModalVisible(true);
  };
  const handleExpenseCancel = () => {
  setIsExpenseModalVisible(false);
  };
  const handleIncomeCancel = () => {
  setIsIncomeModalVisible(false);
  }
  const onFinish=(values,type)=>{
    // event.preventDefault();
const newTransaction={
  type:type,
  Date:moment(values.dae).format("YYYY-MM-DD"),
  tag:values.tag,
  name:values.name,
  amount:values.amount
}
console.log("onFinish", values,type);
 addTransaction(newTransaction);
  }

  async function addTransaction(transaction){
    try {
      const docRef = await addDoc(collection(db, `users/${user.uid}/transaction`), transaction);

      setTransactions(prevTransactions => [...prevTransactions, transaction]);

      calculatebalance();
  
      console.log("Document fetched with id:", docRef.id);
      toast.success("Transaction added!");
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast.error("Failed to add transaction.");
    }
  }
  
 async function fetchtransaction() {
  setLoading(true);
  if (user) {
    const q = query(collection(db, `users/${user.uid}/transaction`));
    const querySnapshot = await getDocs(q);
    let transactionArray = [];
    querySnapshot.forEach((doc) => {
      transactionArray.push(doc.data());
    });
    setTransactions(transactionArray);
    console.log(transactions);
    console.log("transactionArray", transactionArray);
    toast.success("transactions fetched....!");
  }
  setLoading(false);
}
useEffect(()=>{
  calculatebalance();
},[transactions]);
  const calculatebalance = () => {
   let incometotal =0;
   let expensetotal = 0;
   transactions.forEach((item)=>{
    if(item.type === "income"){
      incometotal += parseInt(item.amount);
      
    }
    else{
      expensetotal += parseInt(item.amount);
      
    }
    setIncome(incometotal);
    setExpense(expensetotal);
    let total =incometotal - expensetotal;
   settotalBalance(total);
   });
   
  };


  
  return (
    <div>
     {loading ? <p>loading</p> :
     <><Cards 
     showExpenseModal={showExpenseModal}
     showIncomeModal={showIncomeModal}
    
     income={income}
     expense={expense}
     totalBalance={totalBalance}/>
    
        <AddExpenseModal isExpenseModalVisible={isExpenseModalVisible} handleExpenseCancel={handleExpenseCancel} onFinish={onFinish} />
        <AddIncomemodal isIncomeModalVisible={isIncomeModalVisible} handleIncomeCancel={handleIncomeCancel} onFinish={onFinish}/>
        <Transactiontable transactions={transactions}/>

        </>  }
        
    </div>
  )
}


