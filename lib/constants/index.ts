export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Bobochka';

export const APP_DESCRIPTION =
	process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
	'Discover unique apparel with exclusive designer prints. Shop stylish and high-quality clothing that stands out. Limited editions available!';

export const SERVER_URL =
	process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';

export const LATEST_PRODUCTS_LIMIT =
	Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

export const signInDefaultValues = {
	email: 'admin@example.com',
	password: '123456',
};

export const signUpDefaultValues = {
	name: '',
	email: '',
	password: '',
	confirmPassword: '',
};

export const PRICES = {
	freeShipping: 100,
	shipping: 10,
	tax: 0.15,
};
