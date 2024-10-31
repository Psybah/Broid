import { useState, useEffect } from 'react';
import Perks from '../Perks';
import PhotosUploader from '../PhotosUploader';
import axios from 'axios';
import AccountNav from '../AccountNav';
import { Navigate, useParams } from 'react-router-dom';

export default function BroidsFormPage() {
	const {id} = useParams();
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [perks, setPerks] = useState([]);
	const [addedPhotos, setAddedPhotos] = useState([]);
	const [extraInfo, setExtraInfo] = useState('');
	const [price, setPrice] = useState('');
	const [packs, setPacks] = useState('');
	const [orderDate, setOrderDate] = useState('');
	const [deliveryDate, setDeliveryDate] = useState('');
	const [redirect, setRedirect] = useState(false);
	useEffect(() => {
		if (!id) {
			return;
		}
		axios.get(`/embroidery-by-id/${id}`).then(response => {
			const {data} = response;
			setName(data.name);
			setDescription(data.description);
			setPerks(data.perks);
			setAddedPhotos(data.photos);
			setExtraInfo(data.extraInfo);
			setPrice(data.price);
			setPacks(data.packs);
			setOrderDate(data.orderDate);
			setDeliveryDate(data.deliveryDate);
		});
	}, [id]);
	function inputHeader(text) {
		return <h2 className="text-2xl mt-4">{text}</h2>;
	}

	function inputDescription(text) {
		return <p className="text-gray-500 text-sm">{text}</p>;
	}

	function preInput(header, description) {
		return (
			<>
				{inputHeader(header)}
				{inputDescription(description)}
			</>
		);
	}

	async function saveBroids(ev) {
		ev.preventDefault();
		const broidData = {
			name, description, perks,
				addedPhotos, extraInfo, price,
				packs, orderDate, deliveryDate
		};
		if (id) {
			//update
			await axios.put('/update-embroidery', {
				id,
				...broidData
			});
			setRedirect(true);
		} else {
			//new broids
			await axios.post('/embroidery', broidData);
			setRedirect(true);
		}
		
	}

	if (redirect) {
		return <Navigate to={'/account/broids'} />;
	}

	return (
		<div>
			<AccountNav	/>
			<form className="text-left" onSubmit={saveBroids}>
				{preInput('Name', 'Enter the name of your Embroidery')}
				<input
					type="text"
					value={name}
					onChange={(ev) => setName(ev.target.value)}
					placeholder="Name, for example: Caftan Neck Embroidery"
				/>

				{preInput('Description', 'Give a description of your embroidery')}
				<textarea
					type="text"
					value={description}
					onChange={(ev) => setDescription(ev.target.value)}
					placeholder="Describe your embroidery"
				/>

				{preInput('Photos', 'The more the better')}
				<PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

				{preInput('Perks', 'Select perks of your embroidery')}
				<div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
					<Perks selected={perks} onChange={setPerks} />
				</div>

				{preInput('Extra info', 'Policies, Manufacturers, etc')}
				<textarea
					value={extraInfo}
					onChange={(ev) => setExtraInfo(ev.target.value)}
				/>

				{preInput('Price, Order & Delivery date', 'Add the price, packs, order & delivery date')}
				<div className="grid gap-2 sm:grid-cols-2">
					<div>
						<h3 className="mt-2 -mb-1">Price</h3>
						<input
							type="text"
							value={price}
							onChange={(ev) => setPrice(ev.target.value)}
							placeholder="₦0.00"
						/>
					</div>
					<div>
						<h3 className="mt-2 -mb-1">Packs</h3>
						<input
							type="text"
							value={packs}
							onChange={(ev) => setPacks(ev.target.value)}
							placeholder="1"
						/>
					</div>
					<div>
						<h3 className="mt-2 -mb-1">Order date</h3>
						<input
							type="text"
							value={orderDate}
							onChange={(ev) => setOrderDate(ev.target.value)}
							placeholder="dd/mm/yyyy"
						/>
					</div>
					<div>
						<h3 className="mt-2 -mb-1">Delivery date</h3>
						<input
							type="text"
							value={deliveryDate}
							onChange={(ev) => setDeliveryDate(ev.target.value)}
							placeholder="dd/mm/yyyy"
						/>
					</div>
				</div>

				<button className="primary my-4">Save</button>
			</form>
		</div>
	);
}
