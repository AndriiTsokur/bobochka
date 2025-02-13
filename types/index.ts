import { z } from 'zod';
import {
	insertProductSchema,
	insertCartSchema,
	cartItemSchema,
} from '@/lib/validators';

export type ProductT = z.infer<typeof insertProductSchema> & {
	id: string;
	rating: string;
	createdAt: Date;
};

export type CartT = z.infer<typeof insertCartSchema>;
export type CartItemT = z.infer<typeof cartItemSchema>;
