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
    </select>`


parcelList.prepend(div);

  const statusDropdown = div.querySelector('.status-dropdown');
};

function addRecipientCard(parcel) {


};

socket.on('push-message', (data) => {
  const parcelId = data.parcelId;
  const message = data.message;
  addMessageToRecipientCard(parcelId, message);
});
