const data = window.data;

// function deleteData(id) {
//   if (confirm("Yakin ingin hapus data ini?")) {
//     fetch("/admin/" + id, { method: "DELETE" })
//       .then((res) => res.text())
//       .then((msg) => {
//         alert(msg);
//         location.reload();
//       })
//       .catch((err) => alert("Error: " + err));
//   }
// }

function deleteData(id) {
  Swal.fire({
    title: "Apakah kamu yakin?",
    text: "Data ini akan dihapus secara permanen!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch("/admin/" + id, { method: "DELETE" })
        .then((res) => {
          if (!res.ok) throw new Error("Gagal menghapus data");
          return res.text();
        })
        .then((msg) => {
          Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: msg,
          }).then(() => {
            location.reload();
          });
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Terjadi kesalahan: " + err.message,
          });
        });
    }
  });
}

// function updateData(id) {
//   const item = data.find((d) => d.id == id);
//   if (!item) {
//     alert("Data tidak ditemukan!");
//     return;
//   }

//   document.getElementById("edit-id").value = item.id;
//   document.getElementById("edit-nama_gb").value = item.nama_gb;
//   document.getElementById("edit-alamat_gb").value = item.alamat_gb;
//   document.getElementById("edit-nomer_hp").value = item.nomer_hp;
//   document.getElementById("edit-harga").value = item.harga;
//   document.getElementById("edit-deskripsi").value = item.deskripsi;
//   document.getElementById("edit-gambar").value = "";
//   document.getElementById("edit-latitude").value = item.latitude;
//   document.getElementById("edit-longitude").value = item.longitude;
//   document.getElementById("edit-gendang").value = item.jm_gendang;
//   document.getElementById("edit-suling").value = item.jm_suling;
//   document.getElementById("edit-cemprang").value = item.jm_cemprang;
//   document.getElementById("edit-reong").value = item.jm_reong;
//   document.getElementById("edit-gong").value = item.jm_gong;
//   document.getElementById("edit-petuq").value = item.jm_petuq;
//   document.getElementById("edit-rencek").value = item.jm_rencek;
//   document.getElementById("edit-map").value = item.map;
//   document.getElementById("edit-fb").value = item.link_fb;
//   document.getElementById("edit-ig").value = item.link_ig;

//   const editModal = new bootstrap.Modal(document.getElementById("editModal"));
//   editModal.show();
// }

// document.getElementById("editForm").addEventListener("submit", function (e) {
//   e.preventDefault();

//   const id = document.getElementById("edit-id").value;
//   const form = document.getElementById("editForm");
//   const formData = new FormData(form);

//   fetch("/admin/" + id, {
//     method: "POST",
//     body: formData,
//   })
//     .then((res) => {
//       if (!res.ok) throw new Error("HTTP status " + res.status);
//       return res.json();
//     })
//     .then((res) => {
//       if (res.status === "success") {
//         Swal.fire({
//           icon: "success",
//           title: "Berhasil!",
//           text: res.message || "Data berhasil diupdate!",
//         }).then(() => location.reload());
//       } else {
//         Swal.fire({
//           icon: "error",
//           title: "Gagal!",
//           text: res.message || "Terjadi kesalahan",
//         });
//       }
//     })
//     .catch((err) => {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Gagal update data: " + err.message,
//       });
//     });
// });

document.addEventListener("DOMContentLoaded", () => {
  const editForm = document.getElementById("editForm");

  if (editForm) {
    editForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const id = document.getElementById("edit-id").value;
      const formData = new FormData(editForm);

      fetch(`/admin/${id}`, {
        method: "PUT", // Gunakan "PUT" kalau route-mu pakai router.put
        body: formData,
      })
        .then((res) => {
          if (!res.ok) throw new Error("HTTP status " + res.status);
          return res.json();
        })
        .then((res) => {
          if (res.status === "success") {
            Swal.fire({
              icon: "success",
              title: "Berhasil!",
              text: res.message || "Data berhasil diupdate!",
            }).then(() => {
              const modal = bootstrap.Modal.getInstance(
                document.getElementById("editModal")
              );
              modal.hide();
              editForm.reset();
              location.reload();
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Gagal!",
              text: res.message || "Terjadi kesalahan",
            });
          }
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Gagal update data: " + err.message,
          });
        });
    });
  }
});

function updateData(id) {
  const item = data.find((d) => d.id == id);
  if (!item) {
    Swal.fire({
      icon: "warning",
      title: "Data tidak ditemukan!",
    });
    return;
  }

  document.getElementById("edit-id").value = item.id;
  document.getElementById("edit-nama_gb").value = item.nama_gb;
  document.getElementById("edit-alamat_gb").value = item.alamat_gb;
  document.getElementById("edit-nomer_hp").value = item.nomer_hp;
  document.getElementById("edit-harga").value = item.harga;
  document.getElementById("edit-deskripsi").value = item.deskripsi;
  document.getElementById("edit-gambar").value = "";
  document.getElementById("edit-latitude").value = item.latitude;
  document.getElementById("edit-longitude").value = item.longitude;
  document.getElementById("edit-gendang").value = item.jm_gendang;
  document.getElementById("edit-suling").value = item.jm_suling;
  document.getElementById("edit-cemprang").value = item.jm_cemprang;
  document.getElementById("edit-reong").value = item.jm_reong;
  document.getElementById("edit-gong").value = item.jm_gong;
  document.getElementById("edit-petuq").value = item.jm_petuq;
  document.getElementById("edit-rencek").value = item.jm_rencek;
  document.getElementById("edit-map").value = item.map;
  document.getElementById("edit-fb").value = item.link_fb;
  document.getElementById("edit-ig").value = item.link_ig;

  const editModal = new bootstrap.Modal(document.getElementById("editModal"));
  editModal.show();
}
