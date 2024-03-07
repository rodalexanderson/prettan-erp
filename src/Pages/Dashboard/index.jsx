import { useEffect, useState } from "react";
import { onSnapshot } from "firebase/firestore";
import { getCollectionRef } from "../../Services/CRUD";
import TicketCard from "../../Components/TicketCard";
import IncomeCard from "../../Components/IncomeCard";
// import FinanceCard from "../../Components/FinanceCard";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ role }) => {
  const [listaTickets, setListaTickets] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sharedTicket, setSharedTicket] = useState("nutricionales"); // Corregido el nombre de la variable
  const [clientNameFilter, setClientNameFilter] = useState("");
  const [ticketNumberFilter, setTicketNumberFilter] = useState("");

  const navigate = useNavigate()

  useEffect(() => {
    const getData = onSnapshot(getCollectionRef("tickets"), (data) => {
      setListaTickets(
        data.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        })
      );
    });

    return () => {
      getData();
    };
  }, []);

  

  // Obtener los tickets filtrados por los criterios seleccionados
  // Obtener los tickets filtrados por los criterios seleccionados
    const filteredExpenses = listaTickets.filter((data) => {
      return (
        data.type === "expense" &&
        data.category === sharedTicket &&
        (fromDate && toDate ? (data.date >= fromDate && data.date <= toDate) : data.date) &&
        (clientNameFilter ? data.clientName.toLowerCase().includes(clientNameFilter.toLowerCase()) : true) &&
        (ticketNumberFilter ? data.ticketNumber.toLowerCase().includes(ticketNumberFilter.toLowerCase()) : true)
      );
    });

    const filteredIncome = listaTickets.filter((data) => {
      return (
        data.type === "income" &&
        (fromDate && toDate ? (data.date >= fromDate && data.date <= toDate) : data.date) &&
        (clientNameFilter ? data.clientName.toLowerCase().includes(clientNameFilter.toLowerCase()) : true) &&
        (ticketNumberFilter ? data.ticketNumber.toLowerCase().includes(ticketNumberFilter.toLowerCase()) : true)
      );
    });

  // THIS PART WILL CHANGE INCOME TICKET AMOUNT ARRAY STRING TO INTERGER

  const incomeTypeTicketsAmount = []

  const incomeTypeTickets = listaTickets.filter(data => (data.type === 'income' && data.date >= fromDate && data.date <= toDate))
  const incomeTypeTicketsString = incomeTypeTickets.map(data => data.amount)
  
  incomeTypeTicketsString.forEach( str=> {
    incomeTypeTicketsAmount.push(Number(str))
  })

  
    // THIS PART WILL CHANGE INCOME TICKET AMOUNT ARRAY STRING TO INTERGER

    const expenseTypeTicketsAmount = []

    const expenseTypeTickets = listaTickets.filter(data => (data.type === 'expense' && data.date >= fromDate && data.date <= toDate))
    const expenseTypeTicketsString = expenseTypeTickets.map(data => data.amount)
    
    expenseTypeTicketsString.forEach( str=> {
      expenseTypeTicketsAmount.push(Number(str))
    })
  
    const filterReset = () => {
      setFromDate("");
      setToDate("");
      setClientNameFilter("");
      setTicketNumberFilter("");
    };



  return (
    <div className="sm:w-8/12 mx-auto">
      <h1 className="text-3xl font-bold text-center my-4">Remisiones</h1>
          {/* AGREGAR MOVIMIENTO BTN */}
          <div className="mx-auto flex flex-col sm:flex-row justify-center align-center items-center my-4">
            <div className="w-full sm:w-1/2 m-auto">
            <div className="mx-auto flex my-4">
              <button className="font-bold border rounded-md text-md w-48 h-12 bg-yellow-500 mx-auto" onClick={() => navigate('/ticket')}> Agregar Remision </button>
              </div>
            </div>
            <div className="w-full sm:w-1/2 m-auto">
              {role === 'admin' && (
                <div className="mx-auto flex my-4">
                    <button className="font-bold border rounded-md text-md w-48 h-12 bg-yellow-500 mx-auto" onClick={() => navigate('/income')}> Agregar Pago </button>
                </div>
              )}
            </div>
          </div>
          {/* FILTER SEARCH */}
          <div className="border-t-2 border-amber-200 pt-4">
            <h2 className="text-center text-2xl font-bold sm:text-3xl mb-2">Filtros</h2>
            <div className="flex flex-col w-full lg:flex-row justify-evenly mt-0 border-yellow-300 ">
            <div className="flex w-full lg:w-3/4 justify-around">
              <div className="flex flex-col justify-center">
                <label htmlFor="fromDate" className="block text-gray-700 font-bold mb-2 text-2xl">Desde</label>
                <input 
                  id="fromDate"
                  name="fromDate"
                  type="date"
                  onChange={e => setFromDate(e.target.value)}
                  value={fromDate}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="flex flex-col justify-center">
                  <label htmlFor="toDate" className="block text-gray-700 font-bold mb-2 text-2xl">Hasta</label>
                                    <input 
                                    id="toDate"
                                    name="toDate"
                                    type="date"
                                    onChange={e => setToDate(e.target.value)}
                                    value={toDate}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
              </div>
              </div>
            </div>
            
            <div className="flex flex-col  sm:justify-evenly sm:flex-row mb-8 px-8">
              <div className="flex flex-col justify-center my-4">
                <label htmlFor="clientNameFilter" className="block text-gray-700 font-bold mb-2 text-xl">Cliente</label>
                <input 
                  id="clientNameFilter"
                  name="clientNameFilter"
                  type="text"
                  onChange={e => setClientNameFilter(e.target.value)}
                  value={clientNameFilter}
                  placeholder="Filtrar por nombre"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="flex flex-col justify-center my-4">
                <label htmlFor="ticketNumberFilter" className="block text-gray-700 font-bold mb-2 text-xl">Número de Remision</label>
                <input 
                  id="ticketNumberFilter"
                  name="ticketNumberFilter"
                  type="text"
                  onChange={e => setTicketNumberFilter(e.target.value)}
                  value={ticketNumberFilter}
                  placeholder="Filtrar por número de ticket"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
            <div className="flex justify-center">
              <button onClick={() => filterReset()} className="bg-yellow-500 text-black font-semibold px-4 rounded shadow-lg h-12 w-3/4 lg:w-48 mx-auto lg:mx-12 mb-8 ">Borrar Filtros</button>
            </div>
          </div>
            {/* FILTRO DE ESTADO */}
            <div className="font-style: italic w-full flex sm:flex-row flex-col lg:px-6 justify-evenly align-middle items-center border-b-2 border-amber-200 pb-4 ">
                <button className={`border rounded-md h-12 m-2 w-4/5 ${sharedTicket === "nutricionales" ? "bg-yellow-500 shadow-lg" : "bg-gray-300"}`} onClick={() => setSharedTicket("nutricionales")}> Nutricionales </button>
                <button className={`border rounded-md h-12 m-2 w-4/5 ${sharedTicket === "cosmeticos" ? "bg-yellow-500 shadow-lg" : "bg-gray-300"}`} onClick={() => setSharedTicket("cosmeticos")}> Cosmeticos </button>
                <button className={`border rounded-md h-12 m-2 w-4/5 ${sharedTicket === "otros" ? "bg-yellow-500 shadow-lg" : "bg-gray-300"}`} onClick={() => setSharedTicket("otros")}> Otros </button>
               
            </div>
            {/* RESULTADOS */}
            
                <div className="w-full min-h-36 my-8">
                  <h1 className="font-bold text-2xl text-center text-yellow-500 mb-4">Remisiones</h1>
                  <div className="">
                  <div className='flex flex-row w-full text-center border pr-12 bg-yellow-100'>
                    <p className='m-2 mx-4 w-1/4 text-sm sm:text-lg'>Remision</p>
                    <p className='m-2 mx-4 w-1/4 text-sm sm:text-lg '>Cliente</p>
                    <p className='m-2 mx-4 w-1/4 text-sm sm:text-lg '>$ Monto</p>
                    <p className='m-2 mx-4 w-1/4 text-sm sm:text-lg'>Fecha</p>
                    <p className='m-2 mx-4 w-1/4 text-sm sm:text-lg'>Estatus</p>
                </div>
                    {filteredExpenses.map((filteredTicket) => (
                      <TicketCard key={filteredTicket.id} data={filteredTicket} role={role} />
                      ))}
                  </div>
                </div>
                <div>
                  {role === 'admin' && (
                    <div className="w-full min-h-36 mt-8">
                      <h1 className="font-bold text-2xl text-center text-yellow-500 mb-4">
                        Pagos
                      </h1>
                      <div className='flex flex-row w-full text-center border pr-12 bg-yellow-100'>
                          <p className='m-2 mx-4 w-1/4 text-sm sm:text-lg'>Pago</p>
                          <p className='m-2 mx-4 w-1/4 text-sm sm:text-lg '>Cliente</p>
                          <p className='m-2 mx-4 w-1/4 text-sm sm:text-lg '>$ Monto</p>
                          <p className='m-2 mx-4 w-1/4 text-sm sm:text-lg'>Fecha de depósito</p>
                          
                      </div>
                      <div>
                        {filteredIncome.map((filteredTicket) => (
                            <IncomeCard key={filteredTicket.id} data={filteredTicket} role={role} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
           
            {/* FINANCE CARD */}
            {/* <div>
              <FinanceCard
                totalExpenses={totalExpenses}
                totalIncome={totalIncome}
                balance={balance}
              />
            </div> */}
      </div>
    )
  }
  
  export default Dashboard