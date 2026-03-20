/**
 * SMOKING WITH NOAH - VERSIÓN GITHUB PAGES (RUTAS CORREGIDAS PARA IMÁGENES EN MINÚSCULAS)
 */
const SUPABASE_URL = 'https://knvintmdemilxwtpvczh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_EN51SMdK4XdlV4IgcwFhwA_l6vIbiei';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let productosDB = [];

window.onload = () => {
    // Control de edad
    if (!localStorage.getItem('isAdult')) {
        const modalEdad = document.getElementById('ageModal');
        if (modalEdad) modalEdad.style.display = 'flex';
    }
    cargarProductos();
    iniciarContadorEspectadores();
};

async function cargarProductos() {
    try {
        // Pedimos todos los datos de la tabla 'productos'
        const { data, error } = await _supabase.from('productos').select('*');
        if (error) throw error;
        productosDB = data;
        dibujarTienda(data);
    } catch (err) {
        console.error("Error cargando productos:", err.message);
    }
}

function dibujarTienda(lista) {
    const mainGrid = document.getElementById('mainGrid');
    const homePromoGrid = document.getElementById('homePromoGrid');

    if (mainGrid) mainGrid.innerHTML = "";
    if (homePromoGrid) homePromoGrid.innerHTML = "";

    lista.forEach(p => {
        // CORRECCIÓN DE RUTA PARA GITHUB PAGES:
        // Tus imágenes están en una carpeta 'IMAGENES' (mayúsculas) 
        // pero los nombres de archivo son 'lost.png' (minúsculas).
        // Forzamos la carpeta a mayúsculas y usamos p.imagen tal cual sale de Supabase.
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
        
        // Insertar en el catálogo principal
        if (mainGrid) mainGrid.innerHTML += cardHTML;

        // Insertar en promociones si corresponde
        if (p.promo === true || p.promo === "TRUE") {
            if (homePromoGrid) homePromoGrid.innerHTML += cardHTML;
        }
    });
}

function verDetalle(id) {
    const p = productosDB.find(x => x.id === id);
    if (!p) return;

    // Convertimos sabores (separados por coma) a una lista desplegable
    const listaSabores = p.sabores ? p.sabores.split(',').map(s => s.trim()) : ['Único sabor'];
    
    const modal = document.getElementById('productModal');
    const modalData = document.getElementById('modalData');

    if (modal && modalData) {
        modalData.innerHTML = `
            <div style="position:relative; max-height: 90vh; overflow-y: auto; padding: 20px; background: #1a1a1a; border-radius: 20px; border: 1px solid #ffbe0b;">
                <button onclick="cerrarDetalle()" style="position:absolute; top:10px; right:10px; background:none; border:none; color:white; font-size:25px; cursor:pointer; z-index:10;">✕</button>
                
                <div style="text-align:center;">
                    <img src="IMAGENES/${p.imagen}" style="width:100%; max-width: 250px; height: auto; border-radius: 15px; margin-bottom: 15px;" onerror="this.src='IMAGENES/smoking.jpg'">
                </div>

                <h2 style="color:#ffbe0b; margin: 10px 0; font-size: 1.5rem;">${p.Nombre}</h2>
                <p style="font-size:1.4rem; font-weight:bold; color: white;">$${p.precio.toLocaleString()}</p>
                
                <p style="margin-top:15px; color: #ccc;">Selecciona tu sabor:</p>
                <select id="saborElegido" style="width:100%; padding:12px; border-radius:8px; margin-bottom:20px; background:#333; color:white; border:1px solid #ffbe0b; font-size: 1rem;">
                    ${listaSabores.map(s => `<option value="${s}">${s}</option>`).join('')}
                </select>

                <button class="btn-buy" style="width:100%; padding: 15px; font-weight: bold; cursor:pointer;" onclick="pedirPorWhatsApp('${p.Nombre}', ${p.precio})">
                    PEDIR POR WHATSAPP 📲
                </button>
            </div>
        `;
        modal.style.display = 'flex';
        // Aseguramos que el modal se vea por encima de todo
        modal.style.zIndex = "9999";
    }
}

function cerrarDetalle() {
    document.getElementById('productModal').style.display = 'none';
}

function pedirPorWhatsApp(nombre, precio) {
    const sabor = document.getElementById('saborElegido').value;
    const texto = encodeURIComponent(
        `¡Hola Smoking with Noah! 👋\n\n` +
        `Quiero comprar este producto:\n` +
        `💨 *Vape:* ${nombre}\n` +
        `🍓 *Sabor:* ${sabor}\n` +
        `💰 *Precio:* $${precio.toLocaleString()}\n\n` +
        `¿Tienen domicilios en Bucaramanga ahora mismo?`
    );
    window.open(`https://wa.me/573186986559?text=${texto}`);
}

/**
 * 5. FUNCIONES DE INTERFAZ Y NAVEGACIÓN
 */
function confirmAge() {
    localStorage.setItem('isAdult', 'true');
    document.getElementById('ageModal').style.display = 'none';
}

function toggleMenu() {
    const menu = document.getElementById('sideMenu');
    if (menu) menu.classList.toggle('open');
}

function showSection(id) {
    // Ocultar todas las secciones
    document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
    // Mostrar la sección destino
    const destino = document.getElementById('sec-' + id);
    if (destino) destino.classList.add('active');
    
    // Cerrar el menú lateral si está abierto
    const menu = document.getElementById('sideMenu');
    if (menu) menu.classList.remove('open');
    
    window.scrollTo(0, 0);
}

function iniciarContadorEspectadores() {
    const el = document.getElementById('viewer-count');
    if (!el) return;
    setInterval(() => {
        const num = Math.floor(Math.random() * (25 - 12 + 1)) + 12;
        el.innerText = `${num} personas viendo la tienda ahora`;
    }, 5000);
}

// Cerrar el modal si se hace clic fuera del contenido
window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    if (event.target == modal) {
        cerrarDetalle();
    }
}
