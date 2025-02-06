import Link from 'next/link';
import { ShoppingCart, UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ModeToggle from './mode-toggle';
import UserButton from './user-button';

const Navigation = () => {
	return (
		<>
			<ModeToggle />

			<Button asChild variant='ghost'>
				<Link href='/cart'>
					<ShoppingCart /> Cart
				</Link>
			</Button>

			<UserButton />
		</>
	);
};

export default Navigation;
