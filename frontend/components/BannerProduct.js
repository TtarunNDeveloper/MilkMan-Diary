import React, { useEffect, useState } from 'react';
import image1 from '../assets/products/curd/dahi1.jpg';
import image2 from '../assets/products/curd/mangolassi.jpg';
import image3 from '../assets/products/curd/sweetlassi.jpg';
import image4 from '../assets/products/sweets/rasgula.jpg';
import {FaAngleLeft, FaAngleRight} from 'react-icons/fa6';

const BannerProduct = () => {
    const [currentImage, setCurrentImage] = useState(0);
    const desktopImages = [
        image1,
        image2,
        image3,
        image4
    ]

    const mobileImages = [
        image1,
        image2,
        image3,
        image4
    ]

    const nextImage = () => {
        if(desktopImages.length - 1 > currentImage) {
            setCurrentImage(preve => preve + 1);
        }
    }

    const preveImage = () => {
        if(currentImage !== 0) {
            setCurrentImage(preve => preve - 1);
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if(desktopImages.length - 1 > currentImage) {
                nextImage()
            } else {
                setCurrentImage(0)
            }
        },5000)

        return () => clearInterval(interval)
    },[currentImage])

  return (
    <div className='container mx-auto px-12 rounded'> 
        <div className='h-56 md:h-72 w-full bg-slate-300 relative'>
            <div className='absolute z-10 w-full h-full md:flex items-center hidden '>
                <div className='flex justify-between w-full text-2xl' style={{paddingTop:'20px'}}>
                    <button onClick={preveImage} className='bg-white shadow-md rounded-full p-1'><FaAngleLeft /></button>
                    <button onClick={nextImage} className='bg-white shadow-md rounded-full p-1'><FaAngleRight /></button>
                </div>
            </div>
            {/* desktop and tablet version */}
            <div className='hidden md:flex h-[52vh] w-full overflow-hidden'>
                {
                    desktopImages.map((imageURl, index) => {
                        return (
                            <div className='w-full h-full min-w-full min-h-full transition-all' key={imageURl} style={{transform: `translateX(-${currentImage * 100}%)`}}>
                                <img src={imageURl} className='w-full h-[41.4vh] object-contain' />
                            </div>
                        )
                    })
                }
            </div>

            {/* mobile version */}
            <div className='flex h-full w-full overflow-hidden md:hidden'>
                {
                    mobileImages.map((imageURl, index) => {
                        return (
                            <div className='w-full h-full min-w-full min-h-full transition-all' key={imageURl} style={{transform: `translateX(-${currentImage * 100}%)`}}>
                                <img src={imageURl} className='w-full h-full' />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    </div>
  )
}

export default BannerProduct
