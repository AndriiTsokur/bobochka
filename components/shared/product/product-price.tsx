import { cn, formatNumberWithDecimal } from '@/lib/utils';

interface ProductPricePropsT {
	value: number;
	className?: string;
}

const ProductPrice = ({ value, className }: ProductPricePropsT) => {
	const [int, float] = formatNumberWithDecimal(value).split('.');

	return (
		<p className={cn('text-2xl', className)}>
			<span className='text-xs align-super'>$</span>
			{int}
			<span className='text-xs align-super'>{float}</span>
		</p>
	);
};

export default ProductPrice;
