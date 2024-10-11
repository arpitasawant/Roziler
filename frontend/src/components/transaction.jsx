// import React, { useState, useEffect } from 'react';

// const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// function Transaction() {
//     const [transactions, setTransactions] = useState([]);
//     const [searchText, setSearchText] = useState("");
//     const [selectedMonth, setSelectedMonth] = useState("Mar");
//     const [page, setPage] = useState(1);

//     useEffect(() => {
//         fetchTransactions();
//     }, [selectedMonth, page]);

//     const fetchTransactions = async () => {
//         const response = await fetch(`https://api.example.com/transactions?month=${selectedMonth}&page=${page}`);
//         const data = await response.json();
//         setTransactions(data);
//     };

//     const handleSearch = async (e) => {
//         setSearchText(e.target.value);
//         if (e.target.value === "") {
//             fetchTransactions();
//         } else {
//             const response = await fetch(`https://api.example.com/transactions?month=${selectedMonth}&search=${e.target.value}`);
//             const data = await response.json();
//             setTransactions(data);
//         }
//     };

//     const handleNext = () => {
//         setPage(page + 1);
//     };

//     const handlePrevious = () => {
//         if (page > 1) {
//             setPage(page - 1);
//         }
//     };

//     return (
//         <div className="flex flex-col items-center p-8">
//             <div className="bg-white rounded-full p-8 mb-8 shadow-lg">
//                 <h1 className="text-2xl font-bold">Transaction Dashboard</h1>
//             </div>
//             <div className="flex space-x-4 mb-8">
//                 <input
//                     type="text"
//                     placeholder="Search transaction"
//                     value={searchText}
//                     onChange={handleSearch}
//                     className="bg-yellow-400 rounded-full px-4 py-2"
//                 />
//                 <select
//                     value={selectedMonth}
//                     onChange={(e) => setSelectedMonth(e.target.value)}
//                     className="bg-yellow-400 rounded-full px-4 py-2"
//                 >
//                     {months.map((month) => (
//                         <option key={month} value={month}>
//                             {month}
//                         </option>
//                     ))}
//                 </select>
//             </div>
//             <table className="table-auto border-collapse w-full">
//                 <thead>
//                     <tr className="bg-yellow-400">
//                         <th className="px-4 py-2 border">ID</th>
//                         <th className="px-4 py-2 border">Title</th>
//                         <th className="px-4 py-2 border">Description</th>
//                         <th className="px-4 py-2 border">Price</th>
//                         <th className="px-4 py-2 border">Category</th>
//                         <th className="px-4 py-2 border">Sold</th>
//                         <th className="px-4 py-2 border">Image</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {transactions.map((transaction) => (
//                         <tr key={transaction.id}>
//                             <td className="px-4 py-2 border">{transaction.id}</td>
//                             <td className="px-4 py-2 border">{transaction.title}</td>
//                             <td className="px-4 py-2 border">{transaction.description}</td>
//                             <td className="px-4 py-2 border">{transaction.price}</td>
//                             <td className="px-4 py-2 border">{transaction.category}</td>
//                             <td className="px-4 py-2 border">{transaction.sold.toString()}</td>
//                             <td className="px-4 py-2 border">
//                                 <img src={transaction.image} alt={`Image of ${transaction.title}`} className="w-20 h-20" />
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//             <div className="flex justify-between w-full mt-4">
//                 <span>Page No: {page}</span>
//                 <div>
//                     <button onClick={handleNext} className="mr-4 bg-blue-500 text-white px-4 py-2 rounded">Next</button>
//                     <button onClick={handlePrevious} className="bg-blue-500 text-white px-4 py-2 rounded">Previous</button>
//                 </div>
//                 <span>Per Page: 10</span>
//             </div>
//         </div>
//     );
// }

// export default Transaction;


import React, { useState, useEffect } from 'react';

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function Transaction() {
    const [transactions, setTransactions] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("Mar");
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchTransactions();
    }, [selectedMonth, page]);

    // Fetches transactions based on selected month and page
    const fetchTransactions = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/transactions?month=${selectedMonth}&page=${page}`);
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    // Handles search for transactions based on user input
    const handleSearch = async (e) => {
        setSearchText(e.target.value);
        if (e.target.value === "") {
            fetchTransactions();
        } else {
            try {
                const response = await fetch(`http://localhost:3000/api/transactions?month=${selectedMonth}&search=${e.target.value}`);
                const data = await response.json();
                setTransactions(data);
            } catch (error) {
                console.error("Error fetching transactions with search:", error);
            }
        }
    };

    // Handle pagination: Next page
    const handleNext = () => {
        setPage(page + 1);
    };

    // Handle pagination: Previous page
    const handlePrevious = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    // Inside the Transaction component
return (
    <div className="flex flex-col items-center p-8">
        <div className="bg-white rounded-full p-8 mb-8 shadow-lg">
            <h1 className="text-2xl font-bold">Transaction Dashboard</h1>
        </div>
        <div className="flex space-x-4 mb-8">
            <input
                type="text"
                placeholder="Search transaction"
                value={searchText}
                onChange={handleSearch}
                className="bg-yellow-400 rounded-full px-4 py-2"
            />
            <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-yellow-400 rounded-full px-4 py-2"
            >
                {months.map((month) => (
                    <option key={month} value={month}>
                        {month}
                    </option>
                ))}
            </select>
        </div>
        <table className="table-auto border-collapse w-full">
            <thead>
                <tr className="bg-yellow-400">
                    <th className="px-4 py-2 border">ID</th>
                    <th className="px-4 py-2 border">Title</th>
                    <th className="px-4 py-2 border">Description</th>
                    <th className="px-4 py-2 border">Price</th>
                    <th className="px-4 py-2 border">Category</th>
                    <th className="px-4 py-2 border">Sold</th>
                    <th className="px-4 py-2 border">Image</th>
                </tr>
            </thead>
            <tbody>
                {Array.isArray(transactions) && transactions.length > 0 ? (
                    transactions.map((transaction) => (
                        <tr key={transaction.id}>
                            <td className="px-4 py-2 border">{transaction.id}</td>
                            <td className="px-4 py-2 border">{transaction.title}</td>
                            <td className="px-4 py-2 border">{transaction.description}</td>
                            <td className="px-4 py-2 border">{transaction.price}</td>
                            <td className="px-4 py-2 border">{transaction.category}</td>
                            <td className="px-4 py-2 border">{transaction.sold.toString()}</td>
                            <td className="px-4 py-2 border">
                                <img src={transaction.image} alt={`Image of ${transaction.title}`} className="w-20 h-20" />
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="7" className="text-center p-4">No transactions found</td>
                    </tr>
                )}
            </tbody>
        </table>
        <div className="flex justify-between w-full mt-4">
            <span>Page No: {page}</span>
            <div>
                <button onClick={handleNext} className="mr-4 bg-blue-500 text-white px-4 py-2 rounded">Next</button>
                <button onClick={handlePrevious} className="bg-blue-500 text-white px-4 py-2 rounded">Previous</button>
            </div>
            <span>Per Page: 10</span>
        </div>
    </div>
);

}

export default Transaction;
