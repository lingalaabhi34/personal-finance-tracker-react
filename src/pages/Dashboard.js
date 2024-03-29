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



export default function Dashboard() {
const [user]= useAuthState(auth);  
const [loading,setLoading] = useState(false);
const [transaction,setTransaction] =useState([]);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, settotalBalance] = useState(0);
  
  useEffect(()=>{
    fetchtransaction();

  },[]);
  useEffect(()=>{
    calculatebalance();
  },[transaction]);
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
  try{
    const docRef = await addDoc(
    collection(db,`users/${user.uid}/transaction`),transaction
      );
      calculatebalance();
      console.log("documnet fetched with id :",docRef.id);
      toast.success("transaction added...!");
  }
  catch(e){
    console.log(e);
  }
 }

 async function fetchtransaction() {
  setLoading(true);
  if (user) {
    const q = query(collection(db, `users/${user.uid}/transaction`)); // corrected collection path
    const querySnapshot = await getDocs(q);
    let transactionArray = [];
    querySnapshot.forEach((doc) => {
      transactionArray.push(doc.data());
    });
    setTransaction(transactionArray);
    console.log("transactionArray", transactionArray);
    // toast.success("transactions fetched....!");
  }
  setLoading(false);
}

  const calculatebalance = () => {
   let incometotal =0;
   let incomeexpense = 0;
   transaction.forEach((item)=>{
    if(item.type === "income"){
      incometotal += parseInt(item.amount);
      setIncome(incometotal);
    }
    else{
      incomeexpense += parseInt(item.amount);
      setExpense(incomeexpense);
    }
   });
   let total =incometotal - incomeexpense
   settotalBalance(total);
  };

  // const calculatebalance = () => {
  //   let total = 0;
  //   transaction.forEach((item) => {
  //     if (item.type === "income") {
  //       total += parseInt(item.amount);
  //       setIncome(total);
  //     } else {
  //       total -= parseInt(item.amount);
  //       setExpense((total)); // use Math.abs to ensure the expense is never negative
  //     }
  //   });
  //   settotalBalance(total);
  // };
  
  return (
    <div>
     {loading ? <p>loading</p> :
     <><Cards 
     showExpenseModal={showExpenseModal}
     showIncomeModal={showIncomeModal}
     handleExpenseCancel={handleExpenseCancel}
     handleIncomeCancel={handleIncomeCancel}
     income={income}
     expense={expense}
     totalBalance={totalBalance}/>
    
        <AddExpenseModal isExpenseModalVisible={isExpenseModalVisible} handleExpenseCancel={handleExpenseCancel} onFinish={onFinish} />
        <AddIncomemodal isIncomeModalVisible={isIncomeModalVisible} handleIncomeCancel={handleIncomeCancel} onFinish={onFinish}/>
        </>  }
    </div>
  )
}



// import React, { useEffect, useState } from 'react';
// import Cards from '../components/Cards/Cards';
// import Modal from 'antd/es/modal/Modal';
// import Header from '../components/Header/Header';
// import AddExpenseModal from '../components/Modals/AddExpenseModal';
// import moment from 'moment';
// import AddIncomemodal from '../components/Modals/AddIncomeModal';
// import { toast } from 'react-toastify';
// import { Transaction, addDoc, collection, doc, getDocs, query } from 'firebase/firestore';
// import { auth, db } from '../firebase';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { fetchSignInMethodsForEmail } from 'firebase/auth';

// export default function Dashboard() {
//   const [user] = useAuthState(auth);  
//   const [loading, setLoading] = useState(false);
//   const [transaction, setTransaction] =useState([]);
//   const [totalIncome, setTotalIncome] = useState(0);
//   const [totalExpense, setTotalExpense] = useState(0);
//   const [totalBalance, setTotalBalance] = useState(0);
//   const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
//   const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);

//   useEffect(() => {
//     fetchtransaction();
//   }, []);

//   const showExpenseModal = () => {
//     setIsExpenseModalVisible(true);
//   };

//   const showIncomeModal = () => {
//     setIsIncomeModalVisible(true);
//   };

//   const handleExpenseCancel = () => {
//     setIsExpenseModalVisible(false);
//   };

//   const handleIncomeCancel = () => {
//     setIsIncomeModalVisible(false);
//   }

//   const onFinish = (values, type) => {
//     const newTransaction = {
//       type: type,
//       date: moment(values.date).format("YYYY-MM-DD"),
//       tag: values.tag,
//       name: values.name,
//       amount: values.amount
//     }
//     addTransaction(newTransaction, type);
//   }

//   async function addTransaction(transaction, type) {
//     try {
//       const docRef = await addDoc(
//         collection(db, `users/${user.uid}/transaction`), transaction
//       );
//       calculateBalance();
//       toast.success("transaction added...!");
//     }
//     catch (e) {
//       console.log(e);
//     }
//   }

//   async function fetchtransaction() {
//     setLoading(true);
//     if (user) {
//       const q = query(collection(db, `users/${user.uid}/transaction`));
//       const querySnapshot = await getDocs(q);
//       let transactionArray = [];
//       querySnapshot.forEach((doc) => {
//         transactionArray.push(doc.data());
//       });
//       setTransaction(transactionArray);
//       console.log("transactionArray", transactionArray);
//       // toast.success("transactions fetched....!");
//     }
//     setLoading(false);
//   }

//   useEffect(() => {
//     let income = 0;
//     let expense = 0;
//     transaction.forEach((item) => {
//       if (item.type === "income") {
//         income += parseInt(item.amount);
//       }
//       else {
//         expense += parseInt(item.amount);
//       }
//     });
//     setTotalIncome(income);
//     setTotalExpense(expense);
//     setTotalBalance(totalIncome - totalExpense);
//   }, [transaction]);

//   return (
//     <div>
//       {loading ? <p>loading</p> :
//         <>
//           <Cards
//             key={transaction.length}
//             showExpenseModal={showExpenseModal}
//             showIncomeModal={showIncomeModal}
//             handleExpenseCancel={handleExpenseCancel}
//             handleIncomeCancel={handleIncomeCancel}
//             income={totalIncome}
//             expense={totalExpense}
//             totalBalance={totalBalance}
//           />
//           <AddExpenseModal
//             isExpenseModalVisible={isExpenseModalVisible}
//             handleExpenseCancel={handleExpenseCancel}
//             onFinish={onFinish}
//           />
//           <AddIncomemodal
//             isIncomeModalVisible={isIncomeModalVisible}
//             handleIncomeCancel={handleIncomeCancel}
//             onFinish={onFinish}
//           />
//         </>
//       }
//     </div>
//   )
// }