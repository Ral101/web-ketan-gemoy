const products = [
  { name: "Original", price: 8000, image: "Original.png" },
  { name: "Mangga Original", price: 10000, image: "Mangga_original.jpg" },
  { name: "Milo", price: 10000, image: "Milo.jpeg" },
  { name: "Mangga Milo", price: 12000, image: "mangga_milo.png" },
  { name: "Tiramisu", price: 10000, image: "tiramisu.jpeg" },
  { name: "Mangga Tiramisu", price: 12000, image: "mangga_tiramisu.png" },
  { name: "Choco Crunchy", price: 10000, image: "Choco_chrunchy.jpeg" },
  { name: "Mangga Choco Crunchy", price: 12000, image: "mangga_chocoCrunchy.png" }
];

const addons = [
  { name: "Keju", price: 1000 },
  { name: "Oreo", price: 1000 }
];

let cart = [];

function renderMenu() {
  const menu = document.getElementById("menu");
  menu.innerHTML = "";

  products.forEach((p, i) => {
    menu.innerHTML += `
      <div class="card">
        <div class="card-top">
          <img src="${p.image}" style="width:100%; height:100%; object-fit:cover;">
        </div>
        <div class="card-body">
          <h4>${p.name}</h4>
          <p class="price">Rp ${p.price}</p>

          <div class="addon">
            ${addons.map((a, idx) => `
            <div 
              class="addon-item" 
              onclick="toggleAddon(${i}, ${idx}, this)"
              data-selected="false"
            >
              + ${a.name}
            </div>
          `).join("")}
          </div>

          <button class="btn" onclick="addToCart(${i})">
            Tambah
          </button>
        </div>
      </div>
    `;
  });
}

function toggleAddon(productIndex, addonIndex, el) {
  let selected = el.getAttribute("data-selected") === "true";

  if (selected) {
    el.setAttribute("data-selected", "false");
    el.classList.remove("active");
  } else {
    el.setAttribute("data-selected", "true");
    el.classList.add("active");
  }
}

function addToCart(i) {
  let selectedAddons = [];

  const addonElements = document.querySelectorAll(
    `.card:nth-child(${i + 1}) .addon-item`
  );

  addonElements.forEach((el, idx) => {
    if (el.getAttribute("data-selected") === "true") {
      selectedAddons.push(addons[idx]);

      // reset setelah masuk cart
      el.setAttribute("data-selected", "false");
      el.classList.remove("active");
    }
  });

  cart.push({
    name: products[i].name,
    price: products[i].price,
    qty: 1,
    addons: selectedAddons
  });

  updateCartNotification();
  renderCart();
}

function updateCartNotification() {
  const notification = document.getElementById("cartNotification");
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  if (totalItems > 0) {
    notification.style.display = "block";
    notification.textContent = totalItems;
  } else {
    notification.style.display = "none";
  }
}

function renderCart() {
  const el = document.getElementById("cartItems");
  el.innerHTML = "";
  let total = 0;

  cart.forEach((item, i) => {
    let addonTotal = item.addons.reduce((sum, a) => sum + a.price, 0);
    let itemTotal = (item.price + addonTotal) * item.qty;

    total += itemTotal;

    el.innerHTML += `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong><br>
          ${item.addons.map(a => `+ ${a.name}`).join("<br>")}
        </div>
        <span>${formatRupiah(itemTotal)}</span>
      </div>
    `;
  });

  document.getElementById("total").innerText = formatRupiah(total);
}

function increaseQuantity(index) {
  cart[index].qty++;
  updateCartNotification();
  renderCart();
}

function decreaseQuantity(index) {
  if (cart[index].qty > 1) {
    cart[index].qty--;
  } else {
    cart.splice(index, 1); // Hapus item jika jumlahnya 0
  }
  updateCartNotification();
  renderCart();
}

function toggleCart() {
  document.getElementById("cart").classList.toggle("active");
}

function checkout() {
  if (cart.length === 0) {
    alert("Keranjang kosong");
    return;
  }
  const modal = document.getElementById("checkoutModal");
  modal.style.display = "flex"; // Tampilkan modal dengan display: flex
}

function closeCheckout() {
  const modal = document.getElementById("checkoutModal");
  modal.style.display = "none"; // Sembunyikan modal
}

let userLocation = " ";


async function getLocation() {
  if (!navigator.geolocation) {
    alert("Browser tidak mendukung GPS");
    return;
  }

  const status = document.getElementById("lokasiText");
  status.innerText = "Mengambil lokasi...";

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      // Simpan link maps
      userLocation = `https://www.google.com/maps?q=${lat},${lng}`;

      try {
        // 🔥 Reverse geocoding (OpenStreetMap)
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await res.json();

        // Ambil alamat
        const alamatLengkap = data.display_name;

        // Isi otomatis ke textarea
        document.getElementById("alamat").value = alamatLengkap;

        status.innerText = "Alamat berhasil diisi otomatis ✅";
      } catch (err) {
        status.innerText = "Lokasi dapat, tapi gagal ambil alamat ❌";
      }
    },
    () => {
      status.innerText = "Gagal mengambil lokasi ❌";
    }
  );
}

/*
function getLocation() {
  if (!navigator.geolocation) {
    alert("Browser tidak mendukung GPS");
    return;
  }

  document.getElementById("lokasiText").innerText = "Mengambil lokasi...";

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      userLocation = `https://www.google.com/maps?q=${lat},${lng}`;

      document.getElementById("lokasiText").innerText =
        "Lokasi berhasil diambil ✅";
    },
    (err) => {
      document.getElementById("lokasiText").innerText =
        "Gagal mengambil lokasi ❌";
    }
  );
}

*/

/*
function submitOrder() {
  const nama = document.getElementById("nama").value;
  const alamat = document.getElementById("alamat").value;
  const wa = document.getElementById("wa").value;

  let pesan = "Halo, saya mau order:%0A";

  cart.forEach(item => {
    pesan += `${item.name} x${item.qty}%0A`;
  });

  pesan += `%0ANama: ${nama}`;
  pesan += `%0AAlamat: ${alamat}`;
  pesan += `%0AWA: ${wa}`;

  if (userLocation) {
    pesan += `%0ALokasi: ${userLocation}`;
  } else {
    pesan += `%0ALokasi: (belum diambil)`;
  }

  pesan += `%0A%0ATolong kirim titik lokasi jika belum sesuai ya 🙏`;

  window.open("https://wa.me/62895372774329?text=" + pesan);
}
*/

function formatRupiah(angka) {
  return "Rp " + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function submitOrder() {
  const nama = document.getElementById("nama").value;
  const alamat = document.getElementById("alamat").value;
  const wa = document.getElementById("wa").value;

  let total = 0;
  let pesan = "Halo, saya mau order:%0A%0A";

  cart.forEach(item => {
    let addonTotal = item.addons.reduce((sum, a) => sum + a.price, 0);
    let subtotal = (item.price + addonTotal) * item.qty;

    total += subtotal;

    // Nama produk + qty
    pesan += `${item.name} x${item.qty}%0A`;

    // List addon
    if (item.addons.length > 0) {
      item.addons.forEach(a => {
        pesan += `  + ${a.name}%0A`;
      });
    }

    // Subtotal per item
    pesan += `= ${formatRupiah(subtotal)}%0A%0A`;
  });

  // Total akhir
  pesan += `------------------------%0A`;
  pesan += `Total: ${formatRupiah(total)}%0A`;
  pesan += `------------------------%0A%0A`;

  // Data user
  pesan += `Nama: ${nama}%0A`;
  pesan += `Alamat: ${alamat}%0A`;
  pesan += `WhatsApp: ${wa}%0A`;

  if (userLocation) {
    pesan += `Lokasi: ${userLocation}%0A`;
  }

  // Buka WhatsApp
  window.open("https://wa.me/62895372774329?text=" + pesan);

  // 🔥 RESET SETELAH CHECKOUT
  cart = [];
  userLocation = "";

  renderCart();
  updateCartNotification();

  document.getElementById("nama").value = "";
  document.getElementById("alamat").value = "";
  document.getElementById("wa").value = "";
  document.getElementById("lokasiText").innerText = "";

  closeCheckout();
}
renderMenu();
