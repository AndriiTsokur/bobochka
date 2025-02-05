'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProductImagesPropsT {
	images: string[];
}

const ProductImages = ({ images }: ProductImagesPropsT) => {
	const [current, setCurrent] = useState(0);

	return (
		<div className='space-y-4'>
			<Image
				src={images[current]}
				className='min-h-[300px] object-cover object-center'
				width={1000}
				height={1000}
				alt='Product image'
			/>

			<ul className='flex gap-2'>
				{images.map((image, idx) => (
					<li
						key={image}
						onClick={() => setCurrent(idx)}
						className={cn(
							'border rounded-md cursor-pointer hover:border-orange-600 transition-colors overflow-hidden',
							current === idx && 'border-orange-300'
						)}
					>
						<Image src={image} width={100} height={100} alt='Image' />
					</li>
				))}
			</ul>
		</div>
	);
};

export default ProductImages;
