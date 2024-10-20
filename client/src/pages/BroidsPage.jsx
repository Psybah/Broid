import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import Perks from '../Perks';
import axios from 'axios';

export default function BroidsPage() {
	const { action } = useParams();
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [addedPhotos, setAddedPhotos] = useState([]);
	const [photoLink, setPhotoLink] = useState('');
	const [perks, setPerks] = useState([]);
	const [extraInfo, setExtraInfo] = useState('');
	const [price, setPrice] = useState('');
	const [packs, setPacks] = useState('');
	const [orderDate, setOrderDate] = useState('');
	const [deliveryDate, setDeliveryDate] = useState('');
	function inputHeader(text) {
		return <h2 className='text-2xl mt-4'>{text}</h2>;
	}
	function inputDescription(text) {
		return <p className='text-gray-500 text-sm'>{text}</p>;
	}
	function preInput(header, description) {
		return (
			<>
				{inputHeader(header)}
				{inputDescription(description)}
			</>
		);
	}
	async function addPhotoByLink(ev) {
		ev.preventDefault();
		const { data: filename } = await axios.post('/upload-using-link', {
			link: photoLink,
		});
		setAddedPhotos((prev) => {
			return [...prev, filename];
		});
		setPhotoLink('');
	}

	// uplod system photo
	async function uploadPhoto(ev) {
		console.log(ev.target.files);
		const data = new FormData();
		const files = ev.target.files;
		for (const file of files) {
			data.append('file', file);
		}

		console.log(data);
		axios.post('/upload', data).then((response) => {
			console.log(response.data.photos);
			setAddedPhotos(response.data.photos);
		});
	}

	return (
		<div>
			{action !== 'new' && (
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
				</div>
			)}
			{action === 'new' && (
				<div>
					<form className='text-left'>
						{preInput('Name', 'Enter the name of your Embroidery')}
						<input
							type='text'
							value={name}
							onChange={(ev) => setName(ev.target.value)}
							placeholder='Name, for example: Caftan Neck Embroidery'
						/>

						{preInput('Description', 'Give a description of your embroidery')}
						<textarea
							type='text'
							value={description}
							onChange={(ev) => setDescription(ev.target.value)}
							placeholder='Describe your embroidery'
						/>

						{preInput('Photos', 'The more the better')}
						<div className='flex gap-2'>
							<input
								type='text'
								value={photoLink}
								onChange={(ev) => setPhotoLink(ev.target.value)}
								placeholder={'Add using a link ...jpg'}
							/>
							<button
								onClick={addPhotoByLink}
								className='bg-gray-200 px-4 rounded-2xl'>
								Add&nbsp;photo
							</button>
						</div>
						<div className=' mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
							{addedPhotos.length > 0 &&
								addedPhotos.map((link) => {
									console.log(link);
									return (
										<div className='h-32 flex relative' key={link}>
											<img
												className='rounded-2xl w-full object-cover'
												src={'http://localhost:4000/uploads/' + link}
												alt=''
											/>
										</div>
									);
								})}
							<label className=' flex items-center gap-1 justify-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-600'>
								<input
									type='file'
									name='file'
									id=''
									multiple
									className='hidden'
									onChange={uploadPhoto}
								/>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
									strokeWidth={1.5}
									stroke='currentColor'
									className='size-8'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										d='M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z'
									/>
								</svg>
								Upload
							</label>
						</div>

						{preInput('Perks', 'Select perks of your embroidery')}
						<div className='grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6'>
							<Perks selected={perks} onChange={setPerks} />
						</div>

						{preInput('Extra info', 'Policies, Manufacturers, etc')}
						<textarea
							value={extraInfo}
							onChange={(ev) => setExtraInfo(ev.target.value)}
						/>

						{preInput(
							'Price, Order & Delivery date',
							'Add the price, packs, order & delivery date'
						)}
						<div className='grid gap-2 sm:grid-cols-2'>
							<div>
								<h3 className='mt-2 -mb-1'>Price</h3>
								<input
									type='text'
									value={price}
									onChange={(ev) => setPrice(ev.target.value)}
									placeholder='₦0.00'
								/>
							</div>
							<div>
								<h3 className='mt-2 -mb-1'>Packs</h3>
								<input
									type='text'
									value={packs}
									onChange={(ev) => setPacks(ev.target.value)}
									placeholder='1'
								/>
							</div>
							<div>
								<h3 className='mt-2 -mb-1'>Order date</h3>
								<input
									type='text'
									value={orderDate}
									onChange={(ev) => setOrderDate(ev.target.value)}
									placeholder='dd/mm/yyy'
								/>
							</div>
							<div>
								<h3 className='mt-2 -mb-1'>Delivery date</h3>
								<input
									type='text'
									value={deliveryDate}
									onChange={(ev) => setDeliveryDate(ev.target.value)}
									placeholder='dd/mm/yyy'
								/>
							</div>
						</div>

						<button className='primary my-4'>Save</button>
					</form>
				</div>
			)}
		</div>
	);
}