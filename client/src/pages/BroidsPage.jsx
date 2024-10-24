import { Link, Navigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import Perks from '../Perks';
import PhotosUploader from '../PhotosUploader';
import axios from 'axios';


export default function BroidsPage() {
	const { action } = useParams();
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [perks, setPerks] = useState([]);
	const [addedPhotos, setAddedPhotos] = useState([]);
	const [extraInfo, setExtraInfo] = useState('');
	const [price, setPrice] = useState('');
	const [packs, setPacks] = useState('');
	const [orderDate, setOrderDate] = useState('');
	const [deliveryDate, setDeliveryDate] = useState('');
	const [redirect, setRedirect] = useState('');
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

	async function addNewEmbroidery(ev) {
		ev.preventDefault();
		await axios.post('/embroidery', {
			name, description, perks,
				addedPhotos, extraInfo, price, packs,
				orderDate, deliveryDate
			});
		console.log(addedPhotos);
		setRedirect('/account/embroidery');
	}

	if (redirect) {
		return <Navigate to={redirect} />
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
					<form className='text-left' onSubmit={addNewEmbroidery}>
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
						<PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

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
									placeholder='dd/mm/yyyy'
								/>
							</div>
							<div>
								<h3 className='mt-2 -mb-1'>Delivery date</h3>
								<input
									type='text'
									value={deliveryDate}
									onChange={(ev) => setDeliveryDate(ev.target.value)}
									placeholder='dd/mm/yyyy'
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