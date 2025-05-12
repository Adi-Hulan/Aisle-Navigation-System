import React from 'react'

function Product(props) {
    const {_id,pr_name, description, cat_id, barcode, unit_price, supplier_id, exp_date} = props.product;


  return (
    <div style={{ border: "1px solid #ccc",width: "40%", padding: "20px", margin: "10px",marginLeft:"450px", borderRadius: "5px", background: "white" }}>
      
        <h1>Id:{_id} </h1>
        <h1>Product:{pr_name} </h1>
        <h1>Description: {description}</h1>
        <h1>Category:{cat_id} </h1>
        <h1>Barcode:{barcode} </h1>
        <h1>Price:{unit_price} </h1>
        <h1>Expire date:{exp_date} </h1>
        <br></br>
        <br></br><br></br>

    </div>
  )
}

export default Product
