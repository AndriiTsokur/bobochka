'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';
import { Plus, Minus, Loader } from 'lucide-react';
import { CartItemT, CartT } from '@/types';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';

const AddToCart = ({ cart, item }: { cart?: CartT; item: CartItemT }) => {
	const router = useRouter();
	const { toast } = useToast();

	const [isPending, startTransition] = useTransition();

	const handleAddToCart = async () => {
		startTransition(async () => {
			const res = await addItemToCart(item);

			if (!res.success) {
				toast({
					variant: 'destructive',
					description: res.message,
				});

				return;
			}

			// Handle success add to cart
			toast({
				className: 'bg-green-100',
				description: res.message,
				action: (
					<ToastAction
						className='bg-primary text-white hover:bg-gray-800'
						altText='Go To Cart'
						onClick={() => router.push('/cart')}
					>
						Go To Cart
					</ToastAction>
				),
			});
		});
	};

	// Handle remove from cart
	const handleRemoveFromCart = async () => {
		startTransition(async () => {
			const res = await removeItemFromCart(item.productId);

			toast({
				className: 'bg-green-100',
				variant: res.success ? 'default' : 'destructive',
				description: res.message,
			});

			return;
		});
	};

	// Check if item is in cart
	const existItem =
		cart && cart.items.find((x) => x.productId === item.productId);

	const BtnAddRemoveItem = ({ action }: { action: 'add' | 'remove' }) => {
		return (
			<Button
				type='button'
				variant='outline'
				onClick={action === 'add' ? handleAddToCart : handleRemoveFromCart}
				disabled={isPending}
			>
				{isPending ? (
					<Loader className='w-4 h-4 animate-spin' />
				) : (
					<span className='h-4 w-4'>
						{action === 'add' ? <Plus /> : <Minus />}
					</span>
				)}
			</Button>
		);
	};

	return existItem ? (
		<div>
			<BtnAddRemoveItem action='remove' />
			<span className='px-2'>{existItem.qty}</span>
			<BtnAddRemoveItem action='add' />
		</div>
	) : (
		<Button type='button' onClick={handleAddToCart} className='w-full'>
			{isPending ? (
				<Loader className='w-4 h-4 animate-spin' />
			) : (
				<Plus className='h-4 w-4' />
			)}{' '}
			Add To Cart
		</Button>
	);
};

export default AddToCart;
