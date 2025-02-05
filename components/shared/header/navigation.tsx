import Link from 'next/link';
import { ShoppingCart, UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ModeToggle from './mode-toggle';

const Navigation = () => {
	return (
		<>
			<ModeToggle />

			<Button asChild variant='ghost'>
				<Link href='/cart'>
					<ShoppingCart /> Cart
				</Link>
			</Button>

			<Button asChild>
				<Link href='/sign-in'>
					<UserIcon /> Sign In
				</Link>
			</Button>
		</>
	);
};

export default Navigation;
