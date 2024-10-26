import { Link } from 'react-router-dom';
import AccountNav from '../AccountNav';
import { useEffect, useState } from 'react';
import axios from 'axios';


export default function BroidsPage() {
	const [broids, setBroids] = useState([]);
	useEffect(() => {
		axios.get('/broids').then(({data}) => {
			setBroids(data);
		});
	}, []);
	return (
		<div>
			<AccountNav />
				<div className='text-center'>
					<Link
						className=' inline-flex gap-1 bg-blue text-white py-2 px-6 rounded-full'
						to={'/account/broids/new'}>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 24 24'
							fill='currentColor'
							className='size-6'>
							<path
								fillRule='evenodd'
								d='M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z'
								clipRule='evenodd'
							/>
						</svg>
						Add new Embroidery
					</Link>

					<div className='mt-4'>
						{broids.length > 0 && broids.map((broid) => (
							<div key={broid._id} className='bg-gray-200 p-4 rounded-2xl'>
								{broid.name}
							</div>
						))}
					</div>
				</div>
		</div>
	);
}