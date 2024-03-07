import { Link } from 'react-router-dom'
import Bin from "../../multimedia/png/bin.png"
import { deleteData } from "../../Services/CRUD"

const ClientCard = ({data, role}) => {

    const handleDelete = async (id) => {
        await deleteData("clientes", id)
    }

    return (
        <div className='flex justify-evenly mx-2 my-4 border'>
        <Link className='w-full' to={`/client/${data.id}`}>
            <div className='flex flex-row w-full text-center'>
                <p className='w-1/2 m-auto text-lg sm:m-2 sm:mx-4 sm:w-1/5'>{data.name}</p>
                <p className='w-1/2 m-auto sm:m-2 sm:mx-4 sm:w-1/5 text-md sm:text-sm'>{data.direction}</p>
                <p className='invisible w-0 sm:visible sm:m-2 sm:mx-4 sm:w-1/5 '>{data.phone}</p>
                <p className='invisible w-0 sm:visible sm:m-2 sm:mx-4 sm:w-6 '>{data.brand}</p>
                <p className='invisible w-0 sm:visible sm:m-2 sm:mx-4 sm:w-6 '>{data.invoice}</p>
                <p className='invisible w-0 sm:visible sm:m-2 sm:mx-4 sm:w-1/5 text-sm pl-3 '>{data.notes}</p>
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

export default ClientCard