import { useState } from "react";
import axios from "axios";

export default function PhotosUploader({addedPhotos, onChange}) {
  const [photoLink, setPhotoLink] = useState('');
  async function addPhotoByLink(ev) {
    ev.preventDefault();
    const {data:filename} = await axios.post('/upload-using-link', {link: photoLink});
    onChange(prev => {
      return [...prev, filename];
    });
    setPhotoLink('');
  }
  function uploadPhoto(ev) {
    const files = ev.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append('photos', files[i]);
    }

    axios.post('/images', data, {
      headers: {'Content-Type':'multipart/form-data'}
    }).then(response => {
      const {data:filenames} = response;
      onChange(prev => {
        return [...prev, ...filenames];
      });
    })
  }
  return (
    <>
      <div className="flex gap-2">
              <input type="text" 
                      value={photoLink} 
                      onChange={ev => setPhotoLink(ev.target.value)} placeholder={'Add using a link ...jpg'} />
              <button onClick={addPhotoByLink} className="bg-gray-200 px-4 rounded-2xl">Add&nbsp;photo</button>
            </div>
            
            <div className=" mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {/* eslint-disable-next-line react/prop-types*/}
                {addedPhotos.length > 0 && addedPhotos.map(link => (
                  <div key={link} className="h-32 flex" >
                    <img className="rounded-2xl w-full h-auto object-cover position-center" src={`http://localhost:4000/images/`+link} />
                  </div>
                ))} 
              <label className="cursor-pointer flex items-center gap-1 justify-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-600">
              <input type="file" className="hidden" onChange={uploadPhoto} />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                </svg>
                Upload
              </label>
            </div>
    </>
  );
}