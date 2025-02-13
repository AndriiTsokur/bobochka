'use server';

import { cookies } from 'next/headers';
import { CartItemT } from '@/types';
import { convertToPlainObject, formatError, round2 } from '@/lib/utils';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { cartItemSchema, insertCartSchema } from '@/lib/validators';
import { PRICES } from '@/lib/constants';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

// Calculate cart prices
const calcPrice = (items: CartItemT[]) => {
	const itemsPrice = round2(
		items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
	);
	const shippingPrice = round2(
		itemsPrice > PRICES.freeShipping ? 0 : PRICES.shipping
	);
	const taxPrice = round2(PRICES.tax * itemsPrice);
	const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

	return {
		itemsPrice: itemsPrice.toFixed(2),
		shippingPrice: shippingPrice.toFixed(2),
		taxPrice: taxPrice.toFixed(2),
		totalPrice: totalPrice.toFixed(2),
	};
};

export async function addItemToCart(data: CartItemT) {
	try {
		// Check for the cart cookie
		const sessionCartId = (await cookies()).get('sessionCartId')?.value;
		if (!sessionCartId) throw new Error('Cart session not found');

		// Get session and user ID
		const session = await auth();
		const userId = session?.user?.id ? (session.user.id as string) : undefined;

		// Get cart
		const cart = await getMyCart();

		// Parse and validate item
		const item = cartItemSchema.parse(data);

		// Find product in database
		const product = await prisma.product.findFirst({
			where: { id: item.productId },
		});
		if (!product) throw new Error('Product not found');

		if (!cart) {
			// Create new cart object
			const newCart = insertCartSchema.parse({
				userId,
				items: [item],
				sessionCartId,
				...calcPrice([item]),
			});

			// Add to database
			await prisma.cart.create({
				data: newCart,
			});

			// Revalidate product page
			revalidatePath(`/product/${product.slug}`);

			return {
				success: true,
				message: `${product.name} added to cart`,
			};
		} else {
			// Check if item is already in the cart
			const existItem = (cart.items as CartItemT[]).find(
				(x) => x.productId === item.productId
			);

			if (existItem) {
				// Check stock
				if (product.stock < existItem.qty + 1) {
					throw new Error('Not enough stock');
				}

				// Increase the quantity
				(cart.items as CartItemT[]).find(
					(x) => x.productId === item.productId
				)!.qty = existItem.qty + 1;
			} else {
				// If item does not exist in cart
				// Check stock
				if (product.stock < 1) throw new Error('Out of stock');

				// Add item to the cart.items
				cart.items.push(item);
			}

			// Save to database
			await prisma.cart.update({
				where: { id: cart.id },
				data: {
					items: cart.items as Prisma.CartUpdateitemsInput[],
					...calcPrice(cart.items as CartItemT[]),
				},
			});

			revalidatePath(`/product/${product.slug}`);

			return {
				success: true,
				message: `${product.name} ${
					existItem ? 'updated in' : 'added to'
				} the cart`,
			};
		}
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}

export async function getMyCart() {
	// Check for the cart cookie
	const sessionCartId = (await cookies()).get('sessionCartId')?.value;
	if (!sessionCartId) throw new Error('Cart session not found');

	// Get session and user ID
	const session = await auth();
	const userId = session?.user?.id ? (session.user.id as string) : undefined;

	// Get user cart from database
	const cart = await prisma.cart.findFirst({
		where: userId ? { userId } : { sessionCartId },
	});

	if (!cart) return undefined;

	// Convert decimals and return
	return convertToPlainObject({
		...cart,
		items: cart.items as CartItemT[],
		itemsPrice: cart.itemsPrice.toString(),
		totalPrice: cart.totalPrice.toString(),
		shippingPrice: cart.shippingPrice.toString(),
		taxPrice: cart.taxPrice.toString(),
	});
}

export async function removeItemFromCart(productId: string) {
	try {
		// Check for the cart cookie
		const sessionCartId = (await cookies()).get('sessionCartId')?.value;
		if (!sessionCartId) throw new Error('Cart session not found');

		// Get product
		const product = await prisma.product.findFirst({
			where: { id: productId },
		});
		if (!product) throw new Error('Product not found');

		// Get user cart
		const cart = await getMyCart();
		if (!cart) throw new Error('Cart not found');

		// Check for item
		const exist = (cart.items as CartItemT[]).find(
			(x) => x.productId === productId
		);
		if (!exist) throw new Error('Item not found');

		// Check if only one in qty
		if (exist.qty === 1) {
			// Remove from cart
			cart.items = (cart.items as CartItemT[]).filter(
				(x) => x.productId !== exist.productId
			);
		} else {
			// Decrease qty
			(cart.items as CartItemT[]).find((x) => x.productId === productId)!.qty =
				exist.qty - 1;
		}

		// Update cart in database
		await prisma.cart.update({
			where: { id: cart.id },
			data: {
				items: cart.items as Prisma.CartUpdateitemsInput[],
				...calcPrice(cart.items as CartItemT[]),
			},
		});

		revalidatePath(`/product/${product.slug}`);

		return {
			success: true,
			message: `${product.name} was removed from cart`,
		};
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
}
