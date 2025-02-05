import Image from 'next/image';
import Link from 'next/link';
import { ProductT } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import ProductPrice from './product-price';

interface ProductCardPropsT {
	product: ProductT;
}

const ProductCard = ({ product }: ProductCardPropsT) => {
	return (
		<Card className='w-full max-w-sm hover:scale-[101%] hover:shadow-md transition rounded-xl overflow-hidden'>
			<Link href={`/product/${product.slug}`}>
				<CardHeader className='p-0 items-center'>
					<Image
						src={product.images[0]}
						width={300}
						height={300}
						alt={product.name}
						priority={true}
						crossOrigin='anonymous'
					/>
				</CardHeader>
				<CardContent className='p-4 grid gap-4'>
					<div className='text-xs'>{product.brand}</div>
					<h2 className='text-sm font-medium'>{product.name}</h2>

					<div className='flex-between gap-4'>
						<p>{product.rating} Stars</p>
						{product.stock > 0 ? (
							<ProductPrice value={Number(product.price)} />
						) : (
							<p className='text-destructive'>Out Of Stock</p>
						)}
					</div>
				</CardContent>
			</Link>
		</Card>
	);
};

export default ProductCard;
