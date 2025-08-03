const socket = io();

const parcelForm = document.getElementById('parcel-form');
const parcelList = document.getElementById('parcel-list');
const recipientGrid = document.getElementById('recipient-grid');

// Just going to use array for the moment.
// Can upgrade to a database later when everything is working.
const parcels = [];

parcelForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const recipient = document.getElementById('recipient').value;
  const destination = document.getElementById('destination').value;

  const res = await fetch('/parcel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recipient, destination })
  });

  const parcel = await res.json();
  parcels.push(parcel);

  addParcelCard(parcel);
  addRecipientCard(parcel);
  parcelForm.reset();
});

function addParcelCard(parcel) {
  const div = document.createElement('div');
  div.className = 'parcel-card';
  div.dataset.id = parcel.id;

  div.innerHTML = `
    <p><strong>ID:</strong> ${parcel.id}</p>
    <p><strong>Recipient:</strong> ${parcel.recipient}</p>
    <p><strong>To:</strong> ${parcel.destination}</p>
    <p><strong>Status:</strong> <span class="status-text">${parcel.status}</span></p>
    <select class="status-dropdown">
      <option value="ready_for_shipping">Ready for Shipping</option>
      <option value="picked_up_by_courier">Picked up by Courier</option>
      <option value="arrived_at_hub">Arrived at Hub</option>
      <option value="out_for_delivery">Out for Delivery</option>
      <option value="delivered">Delivered</option>
      <option value="delivery_failed">Delivery Failed</option>
    </select>
  `;

  const dropdown = div.querySelector('.status-dropdown');
  dropdown.value = parcel.status;
  dropdown.addEventListener('change', async () => {
    const newStatus = dropdown.value;

    const res = await fetch(`/parcel/${parcel.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    const updated = await res.json();

    div.querySelector('.status-text').innerText = updated.status;

  });

  parcelList.prepend(div);
}

function addRecipientCard(parcel) {
  const div = document.createElement('div');
  div.className = 'recipient-card';
  div.dataset.parcelId = parcel.id;

  div.innerHTML = `
    <h4>${parcel.recipient} (Parcel ID: ${parcel.id})</h4>
    <div class="status-log"></div>
  `;

  recipientGrid.prepend(div);
}

function addMessageToRecipientCard(parcelId, message) {

}





// WebSocket
socket.on('push-message', (data) => {
  const parcelId = data.parcelId;
  const message = data.message;
  addMessageToRecipientCard(parcelId, message);
});
