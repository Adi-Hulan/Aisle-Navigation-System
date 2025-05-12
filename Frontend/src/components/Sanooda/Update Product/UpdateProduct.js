import React, {useEffect,useState} from 'react'
import axios from 'axios'
import { useParams } from 'react-router'
import { useNavigate } from 'react-router'

function UpdateProduct() {

    const [inputs, setInputs] = useState({});
    const history = useNavigate();
    const id = useParams().id;

useEffect(()=>{
const fetchHandler = async ()=>{
    await axios
    .get(`http://localhost:8070/product/${id}`)
    .then((res)=> res.data)
    .then((data)=> setInputs(data.user));
};
fetchHandler();
},[id]);

const sendRequest =async ()=>{
    await axios
    .put(`http://localhost:8070/product/${id}` ,{
       ProductName: (inputs.ProductName),
       quantity:(inputs.quantity) ,
       price: (inputs.Price),
    })

    .then((res) => res.data);
};

const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs);
    sendRequest().then(()=>
    history("/ProductDetails"));
  };
    
  return (

    <div>
      <h1>Update Product</h1>
      <form onSubmit={handleSubmit}>
        <label>Product Name</label>
        <br />
        <input
          type="text"
          name="Product_name"
          onChange={handleChange}
          value={inputs.Product_name}
          required
        />
        <br /><br />

        <label>Quantity</label>
        <br />
        <input
          type="number"
          name="quantity"
          onChange={handleChange}
          value={inputs.quantity}
          required
          min="1"
        />
        <br /><br />

        <label>Price</label>
        <br />
        <input
          type="number"
          name="price"
          onChange={handleChange}
          value={inputs.price}
          required
          min="0"
          step="0.01"
        />
        <br /><br />

       

        <button type="submit">Submit</button>
      </form>
    </div>
  );
    
}

export default UpdateProduct