import React from 'react';
import laptop from '../../images/laptop.jpg';
import footwear from '../../images/footwear.jpg';
import bottom from '../../images/bottom.jpg';
import tops from '../../images/Tops.jpeg';
import camera from '../../images/camera.jpg';
import smartphone from '../../images/smartphone.jpg';

const Categories = ({history}) => {
  const handleClick=(name)=>{
        history.push(`/products?cat=${name}`)
  }
  const categoryData=[{
    name:'Laptop',
    image:laptop
  },{name:'Footwear',image:footwear},{name:'Bottom',image:bottom},
{name:'Tops',image:tops},{name:'Camera',image:camera},{name:'Smartphone',image:smartphone}]
  return (
    <div className='categoriesContainer'>
        {categoryData.map((category)=>{
            const {name,image}=category;
            console.log(image)
            return (
                <div className='category' onClick={()=>handleClick(name)}>
                    <img src={image}/>
                    <p>{name}</p>
                </div>
            )
        })}
    </div>
  )
}

export default Categories
