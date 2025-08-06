const map = L.map("map").setView([-8.52, 116.1], 10); // Bisa sesuaikan pusat peta

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

dataGB.forEach((item, index) => {
  if (item.latitude && item.longitude) {
    const marker = L.marker([item.latitude, item.longitude]).addTo(map);

    const maxLength = 100;
    const deskripsiPenuh = item.deskripsi || "Tidak ada deskripsi.";
    const deskripsiPendek =
      deskripsiPenuh.length > maxLength
        ? deskripsiPenuh.substring(0, maxLength) + "..."
        : deskripsiPenuh;

    const popupContent = `
      <div class="card shadow-sm" style="width: 18rem;">
        <img src="${item.gambar}" class="card-img-top popup-card-img" alt="${
      item.nama_gb
    }">
    
        <div class="card-body">
          <h5 class="card-title">${item.nama_gb}</h5>
           <p class="card-text"><small class="text-muted">Alamat: ${
             item.alamat_gb
           }</small></p>
          <p id="desc-${index}" class="card-text">${deskripsiPendek}</p>
          ${
            deskripsiPenuh.length > maxLength
              ? `<button class="btn btn-sm btn-link p-0" onclick="toggleDeskripsi(${index}, \`${deskripsiPenuh}\`, \`${deskripsiPendek}\`)">Lihat lebih banyak</button>`
              : ""
          }
          <p class="card-text"><small class="text-muted">Harga: Rp${
            item.harga
          }</small></p>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent);
  }
});

// Fungsi toggle deskripsi
function toggleDeskripsi(index, fullText, shortText) {
  const desc = document.getElementById(`desc-${index}`);
  const button = event.target;

  if (desc.innerText === shortText) {
    desc.innerText = fullText;
    button.innerText = "Lihat lebih sedikit";
  } else {
    desc.innerText = shortText;
    button.innerText = "Lihat lebih banyak";
  }
}
