'use server';

import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { hashSync } from 'bcrypt-ts-edge';
import { signInFormSchema, signUpFormSchema } from '@/lib/validators';
import { signIn, signOut } from '@/auth';
import { prisma } from '@/db/prisma';
import { formatError } from '@/lib/utils';

// Sign in the user with credentials
export async function signInWithCredentials(
	prevState: unknown,
	formData: FormData
) {
	try {
		const user = signInFormSchema.parse({
			email: formData.get('email'),
			password: formData.get('password'),
		});

		await signIn('credentials', user);

		return { sucess: true, message: 'Signed in successfully' };
	} catch (error) {
		if (isRedirectError(error)) {
			throw error;
		}

		return { success: false, message: 'Invalid email or password' };
	}
}

// Sign user out
export async function signOutUser() {
	await signOut();
}

// Sign up user
export async function signUpUser(prevState: unknown, formData: FormData) {
	try {
		const validatedFields = signUpFormSchema.safeParse({
			name: formData.get('name'),
			email: formData.get('email'),
			password: formData.get('password'),
			confirmPassword: formData.get('confirmPassword'),
		});

		if (!validatedFields.success) {
			return {
				sucess: false,
				message: formatError(validatedFields.error),
				formData: Object.fromEntries(formData),
			};
		}

		const user = validatedFields.data;
		const plainPassword = user.password;
		user.password = hashSync(user.password, 10);

		await prisma.user.create({
			data: {
				name: user.name,
				email: user.email,
				password: user.password,
			},
		});

		await signIn('credentials', {
			email: user.email,
			password: plainPassword,
		});

		return { success: true, message: 'User registered successfully' };
	} catch (error) {
		if (isRedirectError(error)) {
			throw error;
		}

		return {
			success: false,
			message: formatError(error),
			formData: Object.fromEntries(formData),
		};
	}
}
