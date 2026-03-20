/**
 * SMOKING WITH NOAH - VERSIÓN GITHUB PAGES
 */
const SUPABASE_URL = 'https://knvintmdemilxwtpvczh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_EN51SMdK4XdlV4IgcwFhwA_l6vIbiei';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let productosDB = [];

window.onload = () => {
    if (!localStorage.getItem('isAdult')) {
        const modalEdad = document.getElementById('ageModal');
        if (modalEdad) modalEdad.style.display = 'flex';
    }
    cargarProductos();
    iniciarContadorEspectadores();
};

async function cargarProductos() {
    try {
        const { data, error } = await _supabase.from('productos').select('*');
        if (error) throw error;
        productosDB = data;
        dibujarTienda(data);
    } catch (err) {
        console.error("Error:", err.message);
    }
}

function dibujarTienda(lista) {
    const mainGrid = document.getElementById('mainGrid');
    const homePromoGrid = document.getElementById('homePromoGrid');

    if (mainGrid) mainGrid.innerHTML = "";
    if (homePromoGrid) homePromoGrid.innerHTML = "";

    lista.forEach(p => {
        // CORRECCIÓN PARA GITHUB: Quitamos el "../" 
        const rutaImagen = `IMAGENES/${p.imagen}`;

        const cardHTML = `
            <div class="card" onclick="verDetalle(${p.id})">
                <span class="badge">${p.badge || 'NUEVO'}</span>
                <img src="${rutaImagen}" alt="${p.Nombre}" onerror="this.src='IMAGENES/smoking.jpg'">
                <div class="card-info">
                    <h3>${p.Nombre}</h3>
                    <p class="price">$${p.precio.toLocaleString()}</p>
                </div>
            </div>
        `;
        if (mainGrid) mainGrid.innerHTML += cardHTML;
        if (p.promo) {
            if (homePromoGrid) homePromoGrid.innerHTML += cardHTML;
        }
    });
}

function verDetalle(id) {
    const p = productosDB.find(x => x.id === id);
    if (!p) return;

    const listaSabores = p.sabores ? p.sabores.split(',').map(s => s.trim()) : ['Único sabor'];
    const modal = document.getElementById('productModal');
    const modalData = document.getElementById('modalData');

    if (modal && modalData) {
        modalData.innerHTML = `
            <div style="position:relative; max-height: 90vh; overflow-y: auto; padding: 20px; background: #1a1a1a; border-radius: 20px; border: 1px solid #ffbe0b;">
                <button onclick="cerrarDetalle()" style="position:absolute; top:10px; right:10px; background:none; border:none; color:white; font-size:25px; cursor:pointer;">✕</button>
                
                <div style="text-align:center;">
                    <img src="IMAGENES/${p.imagen}" style="width:100%; max-width: 250px; height: auto; border-radius: 15px;" onerror="this.src='IMAGENES/smoking.jpg'">
                </div>

                <h2 style="color:#ffbe0b; margin: 15px 0;">${p.Nombre}</h2>
                <p style="font-size:1.4rem; font-weight:bold; color: white;">$${p.precio.toLocaleString()}</p>
                
                <p style="margin-top:15px; color: #ccc;">Sabor:</p>
                <select id="saborElegido" style="width:100%; padding:12px; border-radius:8px; margin-bottom:20px; background:#333; color:white; border:1px solid #ffbe0b;">
                    ${listaSabores.map(s => `<option value="${s}">${s}</option>`).join('')}
                </select>

                <button class="btn-buy" style="width:100%; padding: 15px;" onclick="pedirPorWhatsApp('${p.Nombre}', ${p.precio})">
                    PEDIR POR WHATSAPP 📲
                </button>
            </div>
        `;
        modal.style.display = 'flex';
    }
}

function cerrarDetalle() {
    document.getElementById('productModal').style.display = 'none';
}

function pedirPorWhatsApp(nombre, precio) {
    const sabor = document.getElementById('saborElegido').value;
    const texto = encodeURIComponent(`¡Hola Smoking with Noah! 👋\nQuiero el *${nombre}* (${sabor}) por $${precio.toLocaleString()}. ¿Tienen domicilio?`);
    window.open(`https://wa.me/573186986559?text=${texto}`);
}

function confirmAge() {
    localStorage.setItem('isAdult', 'true');
    document.getElementById('ageModal').style.display = 'none';
}

function toggleMenu() {
    const menu = document.getElementById('sideMenu');
    if (menu) menu.classList.toggle('open');
}

function showSection(id) {
    document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
    document.getElementById('sec-' + id).classList.add('active');
    const menu = document.getElementById('sideMenu');
    if (menu) menu.classList.remove('open');
}

function iniciarContadorEspectadores() {
    const el = document.getElementById('viewer-count');
    if (!el) return;
    setInterval(() => {
        const num = Math.floor(Math.random() * (25 - 12 + 1)) + 12;
        el.innerText = `${num} personas viendo la tienda ahora`;
    }, 5000);
}
