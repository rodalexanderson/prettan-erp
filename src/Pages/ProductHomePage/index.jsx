import { useEffect, useState} from "react";
import { onSnapshot } from "firebase/firestore";
import { getCollectionRef } from "../../Services/CRUD";
import ProductCard from "../../Components/ProductCard";
import { useNavigate } from "react-router-dom";

const ProductHomePage = ({role}) => {
  const [listaProductos, setListaProductos] = useState([]);
  const [sharedProduct, setSharedProduct] = useState("nutricionales"); // Corregido el nombre de la variable
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate()

  useEffect(() => {
    const unSubscribe = onSnapshot(getCollectionRef("products"), (data) => {
      setListaProductos(
        data.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        })
      );
    });

    return () => {
      unSubscribe();
    };
  }, []);

  
  const filteredProducts = listaProductos.filter((data) => {
    if (sharedProduct === "nutricionales") {
      return data.category === sharedProduct && data.name.toLowerCase().includes(searchText.toLowerCase());
    } else if (sharedProduct === "cosmeticos") {
      return data.category === sharedProduct && data.name.toLowerCase().includes(searchText.toLowerCase());
    } else {
      return data.category === sharedProduct && data.name.toLowerCase().includes(searchText.toLowerCase());
    }
  });


  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-4">Lista de Productos</h1>
          {/* AGREGAR MOVIMIENTO BTN */}
          <div className="mx-auto flex my-4">
              <button className="font-bold border rounded-md text-md w-48 h-12 bg-yellow-500 mx-auto" onClick={() => navigate('/product')}> Agregar Producto </button>
          </div>
            {/* FILTRO DE ESTADO */}
            <div className="font-style: italic w-full flex sm:flex-row flex-col lg:px-6 justify-evenly align-middle items-center border-b-2 border-amber-200 pb-4 ">
                <button className={`border rounded-md h-12 m-2 w-4/5 ${sharedProduct === "nutricionales" ? "bg-yellow-500 shadow-lg" : "bg-gray-300"}`} onClick={() => setSharedProduct("nutricionales")}> Nutricionales </button>
                <button className={`border rounded-md h-12 m-2 w-4/5 ${sharedProduct === "cosmeticos" ? "bg-yellow-500 shadow-lg" : "bg-gray-300"}`} onClick={() => setSharedProduct("cosmeticos")}> Cosmeticos </button>
                <button className={`border rounded-md h-12 m-2 w-4/5 ${sharedProduct === "otros" ? "bg-yellow-500 shadow-lg" : "bg-gray-300"}`} onClick={() => setSharedProduct("otros")}> Otros </button>
               
            </div>
            <div className="w-full flex justify-center items-center mt-4">
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="border rounded-md h-10 px-4"
              />
            </div>
            {/* RESULTADOS */}
            <div className="flex sm:flex-row flex-col min-h-80 pt-8">
                <div className="w-full min-h-36">
                <div className='flex flex-row flex-evenly w-1/2 border text-center'>
                    <p className='m-2 mx-4 w-1/2'>Nombre</p>
                    <p className='m-2 mx-4 w-1/4'>Presentacion</p>
                    <p className='m-2 mx-4 w-1/4'>$ Monto</p>
                    <p className='m-2 mx-4 w-1/6'></p>
                </div>
                  <div className="w-full sm:w-1/2">
                    {filteredProducts.map((filteredProduct) => (
                      <ProductCard key={filteredProduct.id} data={filteredProduct} role={role} />
                      ))}
                  </div>
                </div>
            </div>
      </div>
    )
  }
  
  export default ProductHomePage