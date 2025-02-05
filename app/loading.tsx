import Image from 'next/image';
import loader from '@/assets/loader.gif';

const LoadingPage = () => {
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				width: '100vw',
				height: '100vh',
			}}
		>
			<Image src={loader} width={150} alt='Loading...' unoptimized={true} />
		</div>
	);
};

export default LoadingPage;
