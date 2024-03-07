import { Link } from 'react-router-dom'
import Bin from "../../multimedia/png/bin.png"
import { deleteData } from "../../Services/CRUD"

const TicketCard = ({data, role}) => {

    const handleDelete = async (id) => {
        await deleteData("tickets", id)
    }

    return (
        <div className='flex justify-evenly mx-2 my-4 border'>
        <Link className='w-full' to={`/ticket/${data.id}`}>
            <div className='flex flex-row w-full text-center'>
                <p className='m-2 mx-4 w-1/4 text-sm sm:text-lg'>{data.ticketNumber}</p>
                <p className='m-2 mx-4 w-1/4 text-sm sm:text-lg '>{data.clientName}</p>
                <p className='m-2 mx-4 w-1/4 text-sm sm:text-lg '>${data.amount}</p>
                <p className='m-2 mx-4 w-1/4 text-sm sm:text-lg'>{data.date}</p>
                <p className='m-2 mx-4 w-1/4 text-sm sm:text-lg'>{data.estatus}</p>
            </div>
        </Link>
        {role === 'admin' && (
            <button onClick={() => handleDelete(data.id)} className="w-12">
                <img src={Bin} alt="delete icon" className="h-7 mx-auto" />
            </button>
                    )}
        </div>
    )
}

export default TicketCard