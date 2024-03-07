import { Link } from 'react-router-dom'
import Bin from "../../multimedia/png/bin.png"
import { deleteData } from "../../Services/CRUD"

const ProductCard = ({data, role}) => {

    const handleDelete = async (id) => {
        await deleteData("products", id)
    }

    return (
        <div className='flex justify-evenly mx-2 my-4 border'>
        <Link className='w-full' to={`/product/${data.id}`}>
            <div className='flex flex-row w-full text-center'>
                <p className='m-2 mx-4 w-1/3'>{data.name}</p>
                <p className='m-2 mx-4 w-1/4'>{data.size}</p>
                <p className='m-2 mx-4 w-1/6'>${data.price}</p>
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

export default ProductCard