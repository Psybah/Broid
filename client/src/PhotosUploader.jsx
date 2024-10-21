import { useState } from "react";
import axios from 'axios';

export default function PhotosUploader() {
  const [addedPhotos, setAddedPhotos] = useState([]);
	const [photoLink, setPhotoLink] = useState('');
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

	// upload system photo
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
    <>
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
							<label className=' cursor-pointer flex items-center gap-1 justify-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-600'>
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
    </>
  );
}