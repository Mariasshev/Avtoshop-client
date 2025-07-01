import React from 'react';
// function getPhotoUrl(listing.PhotoUrl) {
//   console.log('Исходный photoUrl:', photoUrl);

//   if (!photoUrl) {
//     console.log('Фото отсутствует');
//     return ''; // нет фото
//   }

//   if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
//     console.log('Фото уже полный URL:', photoUrl);
//     return photoUrl;
//   }

//   const fullUrl = `${process.env.REACT_APP_API_URL}${photoUrl}`;
//   console.log('Относительный путь, полный URL:', fullUrl);
//   return fullUrl;
// }

export function MyListingItem({ listing, onEdit, onDelete }) {
    console.log('Исходный photoUrl:', `http://localhost:7141${listing.photo}`);
  return (
    <>
      {/* Desktop view */}
      <tr className="d-none d-md-table-row">
        <td>
            {listing.updatedAt 
                ? new Date(new Date(listing.updatedAt).getTime() + 3 * 60 * 60 * 1000).toLocaleString('ru-RU', { 
                    year: 'numeric', 
                    month: '2-digit', 
                    day: '2-digit', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                }) 
            : '—'}
        </td>



        <td>
          <img 
            src={`https://localhost:7141${listing.photo}`} 
            alt={`${listing.brand} ${listing.model}`} 
            className="img-fluid rounded" 
            style={{ maxWidth: '80px' }} 
          />
        </td>
        <td>{`${listing.brand} ${listing.model}`}</td>
        <td>{`$${listing.price}`}</td>
        <td>
        <span className={`badge ${listing.status === 'Approved' ? 'bg-success' : 'bg-success'}`}>
            {listing.status === 'Approved' ? 'Approved' : 'Approved'}
        </span>
        </td>

        <td>
          <button className="btn btn-sm btn-outline-primary me-1" onClick={() => onEdit(listing.id)}>
            <i className="bi bi-pencil"></i>
          </button>
          <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(listing.id)}>
            <i className="bi bi-trash"></i>
          </button>
        </td>
      </tr>

      {/* Mobile view */}
      <div className="card mb-3 d-md-none">
        <div className="card-body">
          <div className="mb-2"><strong>Updated:</strong> {listing.updatedAt}</div>
          <div className="mb-2">
            <img src={listing.photoUrl} alt={listing.title} className="img-fluid rounded" />
          </div>
          <div className="mb-2"><strong>Title:</strong> {listing.title}</div>
          <div className="mb-2"><strong>Price:</strong> {listing.price}</div>
          <div className="mb-2">
            <strong>Status:</strong>{' '}
            <span className={`badge ${listing.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
              {listing.status}
            </span>
          </div>
          <div>
            <button className="btn btn-sm btn-outline-primary me-1" onClick={() => onEdit(listing.id)}>
              <i className="bi bi-pencil"></i>
            </button>
            <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(listing.id)}>
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
