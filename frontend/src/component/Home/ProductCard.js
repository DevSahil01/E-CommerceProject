import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Rating } from "@material-ui/lab";

const ProductCard = ({ product,Comp }) => {
  const DiscountPercent='-'+Math.floor((((product.MRP-product.price)/product.MRP)*100))+"%";
  const options = {
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
  };
  const redirectURL=Comp==='cart'?`/product/${product.product}`:`/product/${product._id}`
  return (
    <Link className="productCard" to={redirectURL}>
      <img src={Comp==='cart'?product.image : product.images[0].url} alt={product.name} />
      
      <p>{product.name}</p>
      {Comp==='cart'?
      <div className="priceBlock">
      <span>{DiscountPercent+' off'}</span>
      <span>{`₹${product.price}`}</span>
      </div>
      :
      <Fragment>
        
      <div>
        <Rating {...options} size="small" />{" "}
        <span className="productCardSpan">
          {" "}
          ({product.numOfReviews} Reviews)
        </span>
      </div>
      <div className="priceBlock">
      <span>{DiscountPercent+' off'}</span>
      <span>{`₹${product.price}`}</span>
      </div>
      <span className="productMRP">M.R.P:<span>{product.MRP}</span></span>
      <div className="lastSection">

      <button>Add to cart</button>
      </div>
      </Fragment>

      }
      
    </Link>
  );
};

export default ProductCard;
