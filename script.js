// Al inicio del archivo con las demás variables
let MIS_OPERACIONES = JSON.parse(localStorage.getItem('operaciones')) || [];
// --- 1. CONFIGURACIÓN Y DATOS INICIALES ---
let EDITANDO_INDEX = -1; 
const SUPER_ADMIN_EMAIL = "admin@erp-manugantt.com"; // Usa uno genérico para el demo
const SUPER_ADMIN_PASS = "admin123"; // Usa una clave de prueba

// Carga de usuarios registrados o lista vacía
let USUARIOS_SISTEMA = JSON.parse(localStorage.getItem('usuarios_erp')) || [];

const ROLES_SISTEMA = [
    { n: "Super Admin", d: "Rol administrador total" },
    { n: "Administrador de seguridad", d: "Gestiona e inactiva los accesos de los usuarios" },
    { n: "Analista de Soporte TI", d: "Administración técnica del aplicativo" },
    { n: "Auditor Seguridad", d: "Encargado de la auditoría del aplicativo" },
    { n: "Consultor Producción", d: "Consulta estados de OP en proceso" },
    { n: "Consultor Producto", d: "Funciones de verificación o consulta" },
    { n: "Control talleres", d: "Registro de avance de OPs en talleres" },
    { n: "Despachador", d: "Encargado de realizar órdenes subcontratadas" },
    { n: "Dueño de la Informacion", d: "Responde por la información del sistema" },
    { n: "Produccion", d: "Control de OPs del ciclo interno" },
    { n: "Programador", d: "Asignación y programación de OPs a talleres" }
];

let MIS_TABLEROS = JSON.parse(localStorage.getItem('tableros')) || [
    { t: "Tablero 1: Plano Cali", i: "📊" },
    { t: "Tablero 2: Palmira y Cerrito", i: "📊" },
    { t: "Tablero 3: Indigo", i: "📊" }
];

let MIS_TEJIDOS = JSON.parse(localStorage.getItem('tejidos')) || [
    { id: 1, n: "Índigo 12oz", t: "Pesado" },
    { id: 2, n: "Drill Licrado", t: "Liviano" },
    { id: 3, n: "Knit Circular", t: "Punto" }
];

let MIS_CANALES = JSON.parse(localStorage.getItem('canales')) || [
    { id: 1, n: "Tiendas Propias STF" },
    { id: 2, n: "E-Commerce" }
];

let MIS_TALLERES = JSON.parse(localStorage.getItem('talleres')) || [];

let NOMBRE_USUARIO_LOGUEADO = "";
let ROL_USUARIO_LOGUEADO = "";

// --- 2. ELEMENTOS DEL DOM ---
const container = document.getElementById('login-container');
const btnIngresar = document.getElementById('btnIngresar');
const btnRegistrar = document.getElementById('btnRegistrar'); // Botón nuevo
const erpDashboard = document.getElementById('erp-dashboard');

// --- 3. MANEJO DE LOGIN Y REGISTRO (INTERFAZ) ---

// Toggle para mover el panel azul (Deslizar a Registro)
if (document.getElementById('signUp')) {
    document.getElementById('signUp').addEventListener('click', () => {
        container.classList.add("right-panel-active");
    });
}

// Toggle para mover el panel azul (Deslizar a Login)
if (document.getElementById('signIn')) {
    document.getElementById('signIn').addEventListener('click', () => {
        container.classList.remove("right-panel-active");
    });
}

// LÓGICA DE REGISTRO DE NUEVO USUARIO
if (btnRegistrar) {
    btnRegistrar.addEventListener('click', () => {
        const nombre = document.getElementById('regNombre').value;
        const cargo = document.getElementById('regCargo').value;
        const email = document.getElementById('regEmail').value;
        const pass = document.getElementById('regPass').value;

        if (!nombre || !email || !pass) {
            alert("Por favor completa los campos obligatorios.");
            return;
        }

        // Crear objeto y guardar
        const nuevoUsuario = { 
            nombre: nombre.trim(),
            cargo: cargo || "Consultor", 
            email: email.toLowerCase(), 
            pass: pass,
            estado: "Activo"
        };

        USUARIOS_SISTEMA.push(nuevoUsuario);
        localStorage.setItem('usuarios_erp', JSON.stringify(USUARIOS_SISTEMA));

        alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
        container.classList.remove("right-panel-active"); // Volver al login automáticamente
    });
}

// LÓGICA DE INICIO DE SESIÓN
// LÓGICA DE INICIO DE SESIÓN CORREGIDA
if (btnIngresar) {
    btnIngresar.addEventListener('click', () => {
        const emailInput = document.getElementById('loginEmail').value.toLowerCase().trim();
        const passInput = document.getElementById('loginPass').value;
        
        btnIngresar.innerText = "VERIFICANDO...";
        
        setTimeout(() => {
            let usuarioValido = null;

            if (emailInput === SUPER_ADMIN_EMAIL && passInput === SUPER_ADMIN_PASS) {
                usuarioValido = { nombre: "JUAN SANTACRUZ", cargo: "Super Admin" };
                const navAdmin = document.getElementById('nav-menu-admin'); 
                if (navAdmin) navAdmin.style.display = 'block';
            } else {
                usuarioValido = USUARIOS_SISTEMA.find(u => u.email === emailInput && u.pass === passInput);
                const navAdmin = document.getElementById('nav-menu-admin');
                if (navAdmin) navAdmin.style.display = 'none';
            }

            if (usuarioValido) {
                // ESTAS LÍNEAS DEBEN IR AQUÍ ADENTRO:
                NOMBRE_USUARIO_LOGUEADO = usuarioValido.nombre;
                ROL_USUARIO_LOGUEADO = usuarioValido.cargo;

                container.style.display = 'none';
                erpDashboard.style.display = 'grid';
                document.body.style.background = '#f1f5f9';
                
                document.getElementById('header-user-name').innerText = NOMBRE_USUARIO_LOGUEADO;
                irAInicio(); 
            } else {
                alert("Credenciales incorrectas o usuario no registrado.");
                btnIngresar.innerText = "ENTRAR";
            }
        }, 1000);
    });
}   
                NOMBRE_USUARIO_LOGUEADO = usuarioValido.nombre;
                ROL_USUARIO_LOGUEADO = usuarioValido.cargo;
           

// --- 4. NAVEGACIÓN MODULAR ---
function cambiarModulo(mod) {
    const content = document.getElementById('content-area');
    const title = document.getElementById('module-title');
    
    document.querySelectorAll('.menu li').forEach(li => li.classList.remove('active'));
    
    const activeNav = document.getElementById('nav-' + mod);
    if (activeNav) activeNav.classList.add('active');

    if (mod === 'inicio') {
        irAInicio();
    } 
    else if (mod === 'menu-ops') {
        title.innerText = "Gestión de Ordenes de Producción";
        const ops = [
            { t: "Búsqueda OP", i: "🔎" }, 
            { t: "Asignación OP", i: "📝" },
            { t: "Lista para Despacho", i: "📦" }, 
            { t: "Eliminar OPs", i: "❌" },
            { t: "OPS Ciclo Interno", i: "🔄" }, 
            { t: "Quitar Asignaciones", i: "🔓" }
        ];
        renderGrid(ops, content, "➕ GESTIONAR");
    } 
    else if (mod === 'menu-tableros') {
        title.innerText = "Visualización de Tableros Gantt";
        renderGrid(MIS_TABLEROS, content, "👁️ VER TABLERO");
    } 
    else if (mod === 'menu-registro') {
        title.innerText = "Configuración y Registro";
        const registros = [
            { t: "Crear Tablero", i: "📋", f: "vistaCrearTablero()" },
            { t: "Ver Tableros", i: "👁️", f: "vistaVerTableros()" },
            { t: "Crear Tejido", i: "🧶", f: "vistaCrearTejido()" },
            { t: "Ver Tejidos", i: "👁️", f: "vistaVerTejidos()" },
            { t: "Crear Canal", i: "🚀", f: "vistaCrearCanal()" },
            { t: "Ver Canales", i: "👁️", f: "vistaVerCanales()" },
            { t: "Crear Taller", i: "🏭", f: "vistaCrearTaller()" },
            { t: "Ver Talleres", i: "👁️", f: "vistaVerTalleres()" },
            { t: "Crear Operación", i: "⚙️", f: "vistaCrearOperacion()" },
            { t: "Ver Operaciones", i: "👁️", f: "vistaVerOperaciones()" },
        ];
        renderGrid(registros, content, "GESTIONAR");
        
        let subView = document.getElementById('registro-sub-view');
        if (!subView) {
            const div = document.createElement('div');
            div.id = 'registro-sub-view';
            div.style.marginTop = "30px";
            div.style.width = "100%";
            content.appendChild(div);
        } else {
            subView.innerHTML = "";
        }
    } 
    else if (mod === 'menu-admin') {
        title.innerText = "Panel de Control Admin";
        const admins = [
            { t: "Gestión de Usuarios", i: "👥", f: "gestionarUsuarios()" },
            { t: "Roles de Sistema", i: "🛡️", f: "gestionarRoles()" }
        ];
        renderGrid(admins, content, "CONFIGURAR");
        
        let adminSubView = document.getElementById('admin-sub-view');
        if (!adminSubView) {
            const div = document.createElement('div');
            div.id = 'admin-sub-view';
            div.style.marginTop = "30px";
            div.style.width = "100%";
            content.appendChild(div);
        } else {
            adminSubView.innerHTML = "";
        }
    }
}

// --- 5. FUNCIONES ADMIN (ACTUALIZADO) ---

function gestionarUsuarios() {
    const subView = document.getElementById('admin-sub-view') || document.getElementById('content-area');
    document.getElementById('module-title').innerText = "Control de Usuarios";
    
    let html = `
        <div class="welcome-card" style="flex-direction: column; align-items: flex-start; border-left: 5px solid #003366; width:100%;">
            <h4 style="margin-bottom: 20px;">👥 Usuarios en el Sistema</h4>
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Cargo/Rol</th>
                        <th>Estado</th>
                        <th style="text-align:center;">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Fila fija para el Super Admin -->
                    <tr>
                        <td><b>JUAN SANTACRUZ</b></td>
                        <td>${SUPER_ADMIN_EMAIL}</td>
                        <td><span class="status-pill" style="background:#003366; color:white;">Super Admin</span></td>
                        <td><span class="status-pill">Principal</span></td>
                        <td style="text-align:center;">-</td>
                    </tr>`;
    
    // Filas para usuarios registrados
    USUARIOS_SISTEMA.forEach((u, index) => {
        const colorEstado = u.estado === "Activo" ? "#10b981" : "#ef4444";
        html += `
            <tr>
                <td>${u.nombre}</td>
                <td>${u.email}</td>
                <td><b style="font-size:11px; color:#1e293b;">${u.cargo}</b></td>
                <td><span class="status-pill" style="background:${colorEstado};">${u.estado}</span></td>
                <td style="text-align:center;">
                    <button onclick="asignarRolesAdmin(${index})" class="btn-edit">ASIGNAR ROL</button>
                    <button onclick="eliminarUsuarioAdmin(${index})" class="btn-delete">X</button>
                </td>
            </tr>`;
    });

    html += `
                </tbody>
            </table>
            <button onclick="cambiarModulo('menu-admin')" style="margin-top:20px; background:#64748b; color:white; border:none; padding:8px 15px; border-radius:5px; cursor:pointer;">⬅ VOLVER</button>
        </div>`;
    
    subView.innerHTML = html;
}

// FUNCIÓN PARA ASIGNAR ROLES Y CAMBIAR ESTADO (CON FORMULARIO)
function asignarRolesAdmin(index) {
    const u = USUARIOS_SISTEMA[index];
    const subView = document.getElementById('admin-sub-view') || document.getElementById('content-area');
    
    let opcionesRoles = "";
    ROLES_SISTEMA.forEach(r => opcionesRoles += `<option value="${r.n}">`);

    subView.innerHTML = `
        <div class="welcome-card" style="border-left: 5px solid #f59e0b;">
            <h4>Edición de Permisos: ${u.nombre}</h4>
            <div style="display: grid; gap: 10px; margin: 15px 0;">
                <label>Asignar Rol (Escribe o selecciona de la lista):</label>
                <input type="text" id="editRol" value="${u.cargo}" list="listaRoles" style="padding:10px; width:100%;">
                <datalist id="listaRoles">${opcionesRoles}</datalist>
                
                <label>Estado de la Cuenta:</label>
                <select id="editEstado" style="padding:10px; width:100%;">
                    <option value="Activo" ${u.estado === 'Activo' ? 'selected' : ''}>Activo</option>
                    <option value="Inactivo" ${u.estado === 'Inactivo' ? 'selected' : ''}>Inactivo</option>
                </select>
            </div>
            <button onclick="guardarEdicionUsuario(${index})" style="background:#f59e0b;">GUARDAR CAMBIOS</button>
            <button onclick="gestionarUsuarios()" style="background:#e2e8f0; color:black;">CANCELAR</button>
        </div>`;
}

function guardarEdicionUsuario(index) {
    USUARIOS_SISTEMA[index].cargo = document.getElementById('editRol').value;
    USUARIOS_SISTEMA[index].estado = document.getElementById('editEstado').value;
    localStorage.setItem('usuarios_erp', JSON.stringify(USUARIOS_SISTEMA));
    alert("Usuario actualizado correctamente.");
    gestionarUsuarios();
}

function gestionarRoles() {
    const subView = document.getElementById('admin-sub-view') || document.getElementById('content-area');
    document.getElementById('module-title').innerText = "Gestión de Roles";
    
    let html = `
        <div class="welcome-card" style="flex-direction: column; align-items: flex-start; width:100%;">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Rol</th>
                        <th>Descripción</th>
                    </tr>
                </thead>
                <tbody>`;
    
    ROLES_SISTEMA.forEach(r => { 
        html += `<tr><td><b>${r.n}</b></td><td>${r.d}</td></tr>`; 
    });
    
    html += `</tbody></table>
            <button onclick="cambiarModulo('menu-admin')" style="margin-top:20px; background:#64748b;">⬅ VOLVER</button>
        </div>`;
    
    subView.innerHTML = html;
}

// --- 6. VISTAS Y BIENVENIDA ---
function irAInicio() {
    const content = document.getElementById('content-area');
    document.getElementById('module-title').innerText = "Panel Administrativo";
    
    const talleresActivos = MIS_TALLERES.filter(t => t.estado === "Activo").length;

    content.innerHTML = `
        <div class="welcome-card" style="padding: 30px; border-radius: 15px;">
            <div>
                <h2 style="font-size: 24px; color: #003366;">¡Bienvenido, ${NOMBRE_USUARIO_LOGUEADO}! 👋</h2>
                <p style="color: #64748b;">Cargo: <b>${ROL_USUARIO_LOGUEADO}</b> | Monitoreo de producción.</p>
            </div>
            <div class="quick-stats" style="display: flex; gap: 15px; margin-top:15px; flex-wrap: wrap;">
                <div class="stat-item"><span>Estado</span><strong>CONECTADO</strong></div>
                <div class="stat-item"><span>Fecha</span><strong>${new Date().toLocaleDateString()}</strong></div>
                <div class="stat-item" style="border-left: 4px solid #ef4444; background: #fff5f5;">
                    <span style="color: #ef4444;">Talleres Activos</span>
                    <strong style="font-size: 20px;">${talleresActivos}</strong>
                </div>
            </div>
        </div>`;
}

// --- 7. GESTIÓN DE TABLEROS ---
function vistaCrearTablero(index = -1) {
    EDITANDO_INDEX = index;
    const datos = index !== -1 ? MIS_TABLEROS[index] : { t: "" };
    const titulo = index !== -1 ? "✏️ Editar Tablero" : "🛠️ Nuevo Tablero";
    const txtBoton = index !== -1 ? "GUARDAR CAMBIOS" : "REGISTRAR";

    const subView = document.getElementById('registro-sub-view');
    subView.innerHTML = `
        <div class="welcome-card" style="display: block; border-left: 5px solid #003366;">
            <h4>${titulo}</h4>
            <input type="text" id="nombreTablero" value="${datos.t}" placeholder="Nombre del tablero" style="width:100%; padding:10px; margin:10px 0;">
            <button onclick="guardarTablero()">${txtBoton}</button>
            <button onclick="${index !== -1 ? 'vistaVerTableros()' : "document.getElementById('registro-sub-view').innerHTML=''"} " style="background:#e2e8f0; color:black;">CANCELAR</button>
        </div>`;
}

function guardarTablero() {
    const nombre = document.getElementById('nombreTablero').value.trim();
    if (!nombre) return alert("Ingrese un nombre");

    if (EDITANDO_INDEX === -1) {
        MIS_TABLEROS.push({ t: nombre, i: "📊" });
    } else {
        MIS_TABLEROS[EDITANDO_INDEX].t = nombre;
    }
    
    localStorage.setItem('tableros', JSON.stringify(MIS_TABLEROS));
    alert("✅ Tablero guardado.");
    vistaVerTableros();
}

function vistaVerTableros() {
    const subView = document.getElementById('registro-sub-view');
    let html = `<div class="welcome-card" style="display: block; border-left: 5px solid #003366;">
                <h4 style="margin-bottom:15px;">📊 Gestión de Tableros</h4>
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ICONO</th>
                            <th>NOMBRE</th>
                            <th style="text-align:center;">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>`;

    MIS_TABLEROS.forEach((tab, index) => {
        html += `
            <tr>
                <td style="text-align:center; width: 60px;">${tab.i || "📊"}</td>
                <td style="text-transform: uppercase;"><b>${tab.t}</b></td>
                <td style="text-align:center; white-space: nowrap; width: 150px;">
                    <button onclick="vistaCrearTablero(${index})" class="btn-edit">EDITAR</button>
                    <button onclick="ejecutarEliminacionTablero(${index})" class="btn-delete">X</button>
                </td>
            </tr>`;
    });

    html += `
                </tbody>
            </table>
            <button onclick="this.parentElement.innerHTML=''" style="margin-top:20px; background:#64748b; color:white; border:none; padding:10px 20px; border-radius:5px; cursor:pointer;">CERRAR</button>
        </div>`;
    
    subView.innerHTML = html;
}

function ejecutarEliminacionTablero(index) {
    if (confirm("¿Eliminar tablero?")) { MIS_TABLEROS.splice(index, 1); localStorage.setItem('tableros', JSON.stringify(MIS_TABLEROS)); vistaVerTableros(); }
}

// --- 8. GESTIÓN DE TEJIDOS ---
function vistaCrearTejido(index = -1) {
    EDITANDO_INDEX = index;
    const datos = index !== -1 ? MIS_TEJIDOS[index] : { n: "", t: "Plano" };
    const titulo = index !== -1 ? "✏️ Editar Tejido" : "🧶 Nuevo Tejido";
    const txtBoton = index !== -1 ? "GUARDAR CAMBIOS" : "REGISTRAR";

    const subView = document.getElementById('registro-sub-view');
    subView.innerHTML = `
        <div class="welcome-card" style="display: block; border-left: 5px solid #8b5cf6;">
            <h4>${titulo}</h4>
            <input type="text" id="nomTejido" value="${datos.n || datos.nombre || ''}" placeholder="Ej: Denim 10oz" style="width:100%; padding:10px; margin:10px 0;">
            <select id="tipoTejido" style="width:100%; padding:10px; margin-bottom:10px;">
                <option value="Plano" ${datos.t === 'Plano' ? 'selected' : ''}>Plano</option>
                <option value="Punto" ${datos.t === 'Punto' ? 'selected' : ''}>Punto</option>
                <option value="Pesado" ${datos.t === 'Pesado' ? 'selected' : ''}>Pesado</option>
            </select>
            <button onclick="guardarTejido()" style="background:#8b5cf6;">${txtBoton}</button>
            <button onclick="${index !== -1 ? 'vistaVerTejidos()' : "document.getElementById('registro-sub-view').innerHTML=''"} " style="background:#e2e8f0; color:black;">CANCELAR</button>
        </div>`;
}

function guardarTejido() {
    const n = document.getElementById('nomTejido').value.trim();
    const t = document.getElementById('tipoTejido').value;
    if (!n) return alert("Falta nombre");

    if (EDITANDO_INDEX === -1) {
        MIS_TEJIDOS.push({ id: Date.now(), n, t });
    } else {
        MIS_TEJIDOS[EDITANDO_INDEX].n = n;
        MIS_TEJIDOS[EDITANDO_INDEX].nombre = n;
        MIS_TEJIDOS[EDITANDO_INDEX].t = t;
    }
    
    localStorage.setItem('tejidos', JSON.stringify(MIS_TEJIDOS));
    vistaVerTejidos();
}

function vistaVerTejidos() {
    const subView = document.getElementById('registro-sub-view');
    
    let html = `
        <div class="welcome-card" style="display:block; border-left: 5px solid #8b5cf6; width: 100%;">
            <h4 style="margin-bottom:15px;">🧶 Catálogo de Tejidos</h4>
            <table class="admin-table" style="width: 100%;">
                <thead>
                    <tr style="font-size: 11px; background: #f8fafc; text-align: left;">
                        <th style="padding:10px;">NOMBRE DEL TEJIDO</th>
                        <th>TIPO / PESO</th>
                        <th style="text-align:center;">ACCIONES</th>
                    </tr>
                </thead>
                <tbody>`;
    
    MIS_TEJIDOS.forEach((tej, i) => {
        // Formatear el nombre para que siempre se vea bien
        const nombreMostrar = (tej.n || tej.nombre || "Sin nombre").toUpperCase();
        
        html += `
            <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding:12px;"><b>${nombreMostrar}</b></td>
                <td>
                    <span style="background: #f3e8ff; color: #8b5cf6; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: bold;">
                        ${(tej.t || "Plano").toUpperCase()}
                    </span>
                </td>
                <td style="text-align:center; white-space: nowrap;">
                    <button onclick="vistaCrearTejido(${i})" class="btn-edit">EDITAR</button>
                    <button onclick="eliminarTejido(${i})" class="btn-delete">X</button>
                </td>
            </tr>`;
    });

    html += `
                </tbody>
            </table>
            <div style="margin-top: 20px; display: flex; gap: 10px;">
                <button onclick="vistaCrearTejido()" style="background: #8b5cf6; color: white; border:none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">+ NUEVO TEJIDO</button>
                <button onclick="this.parentElement.parentElement.innerHTML=''" style="background: #64748b; color: white; border:none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">CERRAR</button>
            </div>
        </div>`;
    
    subView.innerHTML = html;
}

function eliminarTejido(i) { if (confirm("¿Eliminar?")) { MIS_TEJIDOS.splice(i, 1); localStorage.setItem('tejidos', JSON.stringify(MIS_TEJIDOS)); vistaVerTejidos(); } }

// --- 9. MOTOR RENDER GRID ---
function renderGrid(items, contenedor, subtext = "➕ GESTIONAR") {
    let html = `<div class="grid-menu">`;
    items.forEach(i => {
        const ejecutar = i.f ? i.f : `alert('${i.t}')`;
        html += `<div class="card-option" onclick="${ejecutar}"><i>${i.i || "📊"}</i><h4>${i.t}</h4><span class="eye-btn">${subtext}</span></div>`;
    });
    contenedor.innerHTML = html + `</div>`;
}

// --- 10. GESTIÓN DE CANALES ---
function vistaCrearCanal(index = -1) {
    EDITANDO_INDEX = index;
    const datos = index !== -1 ? MIS_CANALES[index] : { n: "" };
    const titulo = index !== -1 ? "✏️ Editar Canal" : "🚀 Nuevo Canal";
    const txtBoton = index !== -1 ? "GUARDAR CAMBIOS" : "REGISTRAR";

    const subView = document.getElementById('registro-sub-view');
    subView.innerHTML = `<div class="welcome-card" style="display: block; border-left: 5px solid #10b981;">
            <h4>${titulo}</h4>
            <input type="text" id="nomCanal" value="${datos.n || datos.nombre || ''}" placeholder="Ej: E-Commerce" style="width:100%; padding:10px; margin:10px 0;">
            <button onclick="guardarCanal()" style="background:#10b981;">${txtBoton}</button>
            <button onclick="${index !== -1 ? 'vistaVerCanales()' : "document.getElementById('registro-sub-view').innerHTML=''"} " style="background:#e2e8f0; color:black;">CANCELAR</button></div>`;
}

function guardarCanal() {
    const n = document.getElementById('nomCanal').value.trim();
    if (!n) return alert("Ingrese nombre");

    if (EDITANDO_INDEX === -1) {
        MIS_CANALES.push({ id: Date.now(), n: n });
    } else {
        // Actualizamos de forma consistente
        MIS_CANALES[EDITANDO_INDEX].n = n;
    }
    
    localStorage.setItem('canales', JSON.stringify(MIS_CANALES));
    vistaVerCanales();
}

function vistaVerCanales() {
    const subView = document.getElementById('registro-sub-view');
    let html = `<div class="welcome-card" style="display:block; border-left: 5px solid #8b5cf6;">
                <h4>Lista de Canales</h4>
                <table class="admin-table">
                    <thead><tr><th>Nombre</th><th style="text-align:center;">Acciones</th></tr></thead>
                    <tbody>`;
    
    MIS_CANALES.forEach((can, i) => {
        // Usamos can.n con un fallback por si hay datos viejos
        const nombreMostrar = can.n || can.nombre || "Sin nombre";
        html += `<tr>
                    <td style="text-transform: capitalize;">${nombreMostrar.toLowerCase()}</td>
                    <td style="text-align:center;">
                        <button onclick="vistaCrearCanal(${i})" class="btn-edit">EDITAR</button>
                        <button onclick="eliminarCanal(${i})" class="btn-delete">X</button>
                    </td>
                </tr>`;
    });
    subView.innerHTML = html + `</tbody></table></div>`;
}

function eliminarCanal(i) { if (confirm("¿Eliminar?")) { MIS_CANALES.splice(i, 1); localStorage.setItem('canales', JSON.stringify(MIS_CANALES)); vistaVerCanales(); } }

// --- 11. GESTIÓN DE TALLERES ---
function vistaCrearTaller(index = -1) {
    EDITANDO_INDEX = index;
    const datos = index !== -1 ? MIS_TALLERES[index] : { 
        nit: "", nombre: "", telefono: "", capacidad: "", tablero: "", canal: "", tejido: "", estado: "Activo", coordinador: "",
        repLegal: "", ciudad: "", tiempoSTF: "", espSuperior: "", espInferior: "", personas: "", modulos: "", calidad: "" 
    };
    
    const titulo = index !== -1 ? "✏️ Perfil del Taller: " + datos.nombre : "🏭 Registro de Nuevo Taller";
    const subView = document.getElementById('registro-sub-view');
    
    let tablerosOpts = MIS_TABLEROS.map(t => `<option value="${t.t}" ${datos.tablero === t.t ? 'selected' : ''}>${t.t}</option>`).join('');
    let canalesOpts = MIS_CANALES.map(c => `<option value="${c.n}" ${datos.canal === c.n ? 'selected' : ''}>${c.n}</option>`).join('');
    let tejidosOpts = MIS_TEJIDOS.map(te => `<option value="${te.n}" ${datos.tejido === te.n ? 'selected' : ''}>${te.n}</option>`).join('');

    subView.innerHTML = `
        <div class="welcome-card" style="display: block; border-left: 5px solid #ef4444; max-width: 900px;">
            <h4 style="margin-bottom:20px;">${titulo}</h4>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                
                <!-- COLUMNA 1: DATOS OPERATIVOS -->
                <div style="background: #f8fafc; padding: 15px; border-radius: 10px; border: 1px solid #e2e8f0;">
                    <p style="font-weight: bold; font-size: 12px; color: #ef4444; margin-bottom: 10px; border-bottom: 1px solid #cbd5e1;">DATOS OPERATIVOS</p>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        <div><label style="font-size:10px;">NIT</label><input type="text" id="tallerNit" value="${datos.nit}" style="width:100%; padding:8px;"></div>
                        <div><label style="font-size:10px;">Nombre</label><input type="text" id="tallerNombre" value="${datos.nombre}" style="width:100%; padding:8px;"></div>
                        <div><label style="font-size:10px;">Tablero</label><select id="tallerTablero" style="width:100%; padding:8px;">${tablerosOpts}</select></div>
                        <div><label style="font-size:10px;">Canal</label><select id="tallerCanal" style="width:100%; padding:8px;">${canalesOpts}</select></div>
                        <div><label style="font-size:10px;">Coordinador</label>
                            <select id="tallerCoordinador" style="width:100%; padding:8px;">
                                <option value="COORDINADOR 1" ${datos.coordinador === 'COORDINADOR 1' ? 'selected' : ''}>COORD 1</option>
                                <option value="COORDINADOR 2" ${datos.coordinador === 'COORDINADOR 2' ? 'selected' : ''}>COORD 2</option>
                            </select>
                        </div>
                        <div><label style="font-size:10px;">Capacidad Min</label><input type="number" id="tallerCapacidad" value="${datos.capacidad}" style="width:100%; padding:8px;"></div>
                    </div>
                </div>

                <!-- COLUMNA 2: PERFIL LEGAL Y ESPECIALIDAD -->
                <div style="background: #f8fafc; padding: 15px; border-radius: 10px; border: 1px solid #e2e8f0;">
                    <p style="font-weight: bold; font-size: 12px; color: #ef4444; margin-bottom: 10px; border-bottom: 1px solid #cbd5e1;">PERFIL Y ESPECIALIDAD</p>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        <div style="grid-column: span 2;"><label style="font-size:10px;">Representante Legal</label><input type="text" id="tallerRep" value="${datos.repLegal || ''}" style="width:100%; padding:8px;"></div>
                        <div><label style="font-size:10px;">Ciudad</label><input type="text" id="tallerCiudad" value="${datos.ciudad || ''}" style="width:100%; padding:8px;"></div>
                        <div><label style="font-size:10px;">Antigüedad STF</label><input type="text" id="tallerTiempo" value="${datos.tiempoSTF || ''}" placeholder="Ej: 5 años" style="width:100%; padding:8px;"></div>
                        <div><label style="font-size:10px;">Esp. Superior</label><input type="text" id="tallerEspSup" value="${datos.espSuperior || ''}" placeholder="Blusas, etc" style="width:100%; padding:8px;"></div>
                        <div><label style="font-size:10px;">Esp. Inferior</label><input type="text" id="tallerEspInf" value="${datos.espInferior || ''}" placeholder="Jeans, etc" style="width:100%; padding:8px;"></div>
                    </div>
                </div>

                <!-- FILA INFERIOR: INFRAESTRUCTURA -->
                <div style="background: #f8fafc; padding: 15px; border-radius: 10px; border: 1px solid #e2e8f0; grid-column: span 2;">
                    <p style="font-weight: bold; font-size: 12px; color: #ef4444; margin-bottom: 10px; border-bottom: 1px solid #cbd5e1;">INFRAESTRUCTURA Y CALIDAD</p>
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
                        <div><label style="font-size:10px;">Personas en Máquina</label><input type="number" id="tallerPers" value="${datos.personas || ''}" style="width:100%; padding:8px;"></div>
                        <div><label style="font-size:10px;">Módulos</label><input type="number" id="tallerMod" value="${datos.modulos || ''}" style="width:100%; padding:8px;"></div>
                        <div><label style="font-size:10px;">Calidad</label><input type="text" id="tallerCal" value="${datos.calidad || ''}" placeholder="Puntaje/Estado" style="width:100%; padding:8px;"></div>
                        <div><label style="font-size:10px;">Estado</label>
                            <select id="tallerEstado" style="width:100%; padding:8px;">
                                <option value="Activo" ${datos.estado === 'Activo' ? 'selected' : ''}>Activo</option>
                                <option value="Inactivo" ${datos.estado === 'Inactivo' ? 'selected' : ''}>Inactivo</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div style="margin-top: 20px;">
                <button onclick="guardarTaller()" style="background:#ef4444; padding: 10px 25px;">${index !== -1 ? 'ACTUALIZAR PERFIL' : 'REGISTRAR TALLER'}</button>
                <button onclick="document.getElementById('registro-sub-view').innerHTML=''" style="background:#e2e8f0; color:black; margin-left:10px;">CANCELAR</button>
            </div>
        </div>`;
}

function guardarTaller() {
    const nit = document.getElementById('tallerNit').value.trim();
    const nombre = document.getElementById('tallerNombre').value.trim();
    if (!nit || !nombre) return alert("Complete los datos básicos (NIT y Nombre)");

    const datos = {
        id: EDITANDO_INDEX === -1 ? Date.now() : MIS_TALLERES[EDITANDO_INDEX].id,
        nit,
        nombre,
        telefono: document.getElementById('tallerTelefono')?.value || "", // Por si acaso
        capacidad: document.getElementById('tallerCapacidad').value,
        tablero: document.getElementById('tallerTablero').value,
        canal: document.getElementById('tallerCanal').value,
        coordinador: document.getElementById('tallerCoordinador').value,
        estado: document.getElementById('tallerEstado').value,
        // NUEVOS CAMPOS DEL PERFIL
        repLegal: document.getElementById('tallerRep').value,
        ciudad: document.getElementById('tallerCiudad').value,
        tiempoSTF: document.getElementById('tallerTiempo').value,
        espSuperior: document.getElementById('tallerEspSup').value,
        espInferior: document.getElementById('tallerEspInf').value,
        personas: document.getElementById('tallerPers').value,
        modulos: document.getElementById('tallerMod').value,
        calidad: document.getElementById('tallerCal').value
    };

    if (EDITANDO_INDEX === -1) {
        MIS_TALLERES.push(datos);
    } else {
        MIS_TALLERES[EDITANDO_INDEX] = datos;
    }

    localStorage.setItem('talleres', JSON.stringify(MIS_TALLERES));
    alert("¡Perfil de taller guardado correctamente!");
    vistaVerTalleres(); // Regresa a la tabla principal
}

function vistaVerTalleres() {
    const subView = document.getElementById('registro-sub-view');
    // Si usas otro contenedor principal, asegúrate de cambiar 'registro-sub-view'
    
    if (!subView) return;

    subView.innerHTML = `
        <div style="padding: 20px;">
            <h2 style="color: #1e293b; margin-bottom: 25px; border-bottom: 2px solid #ef4444; padding-bottom: 10px;">
                🏢 Gestión de Maestro de Talleres
            </h2>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
                
                <!-- TARJETA: CREAR NUEVO -->
                <div onclick="vistaCrearTaller()" style="cursor:pointer; background:white; border-radius:12px; padding:25px; text-align:center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border-top: 5px solid #ef4444;">
                    <div style="font-size: 40px;">➕</div>
                    <h3 style="margin: 15px 0 5px 0;">NUEVO TALLER</h3>
                    <p style="color:#64748b; font-size:13px;">Registrar datos, capacidad e infraestructura.</p>
                </div>

                <!-- TARJETA: LISTA RESUMIDA -->
                <div onclick="renderizarTablaResumen()" style="cursor:pointer; background:white; border-radius:12px; padding:25px; text-align:center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border-top: 5px solid #3b82f6;">
                    <div style="font-size: 40px;">📋</div>
                    <h3 style="margin: 15px 0 5px 0;">LISTA RÁPIDA</h3>
                    <p style="color:#64748b; font-size:13px;">Ver NIT, Nombre, Tablero y Estado.</p>
                </div>

                <!-- TARJETA: PERFIL COMPLETO (LA QUE QUERÍAS) -->
                <div onclick="verPerfilCompleto()" style="cursor:pointer; background:white; border-radius:12px; padding:25px; text-align:center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border-top: 5px solid #10b981;">
                    <div style="font-size: 40px;">🔍</div>
                    <h3 style="margin: 15px 0 5px 0;">PERFIL DETALLADO</h3>
                    <p style="color:#64748b; font-size:13px;">Ficha técnica: Maquinaria, Ciudad y Rep. Legal.</p>
                </div>

            </div>

            <!-- Aquí es donde se cargarán las tablas cuando hagas clic en las tarjetas -->
            <div id="contenedor-tablas-talleres" style="margin-top: 30px;"></div>
        </div>
    `;
}
function verPerfilCompleto() {
    const zona = document.getElementById('contenedor-tablas-talleres');
    if (!zona) return;

    let filas = MIS_TALLERES.map((t, index) => `
        <tr style="font-size: 11px; border-bottom: 1px solid #e2e8f0;">
            <td style="padding:12px;"><b>${t.nombre}</b></td>
            <td>${t.nit}</td>
            <td>${t.ciudad || 'N/A'}</td>
            <td>${t.repLegal || '-'}</td>
            <td>${t.tablero}</td>
            <td style="text-align:center; font-weight:bold; color:#ef4444;">${t.capacidad || 0}</td>
            <td style="text-align:center;">${t.personas || 0}</td>
            <td style="text-align:center;">${t.modulos || 0}</td>
            <td style="text-align:center;">${t.calidad || '-'}</td>
            <td style="text-align:center;">
                <button onclick="vistaCrearTaller(${index})" style="border:none; background:none; cursor:pointer;">✏️</button>
            </td>
        </tr>
    `).join('');

    zona.innerHTML = `
        <div style="background:white; border-radius:8px; padding:20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <div style="display:flex; justify-content:space-between; margin-bottom:15px; align-items:center;">
                <h3 style="margin:0; color:#0f172a;">🔍 Ficha Técnica Detallada</h3>
                <button onclick="document.getElementById('contenedor-tablas-talleres').innerHTML=''" style="background:#64748b; color:white; border:none; padding:5px 12px; border-radius:4px; cursor:pointer;">Cerrar Vista</button>
            </div>
            <div style="overflow-x:auto;">
                <table style="width:100%; border-collapse:collapse; min-width:1000px;">
                    <thead style="background:#f8fafc; text-align:left; font-size:12px;">
                        <tr>
                            <th style="padding:12px;">TALLER</th>
                            <th>NIT</th>
                            <th>CIUDAD</th>
                            <th>REP. LEGAL</th>
                            <th>TABLERO</th>
                            <th>CAPACIDAD</th>
                            <th>OPERARIOS</th>
                            <th>MÓDULOS</th>
                            <th>CALIDAD</th>
                            <th>ACC.</th>
                        </tr>
                    </thead>
                    <tbody>${filas}</tbody>
                </table>
            </div>
        </div>
    `;
}
function renderizarTablaResumen() {
    const zona = document.getElementById('contenedor-tablas-talleres');
    if (!zona) return;

    // --- CÁLCULO DE KPIs EN TIEMPO REAL ---
    const totalTalleres = MIS_TALLERES.length;
    const activos = MIS_TALLERES.filter(t => t.estado === 'Activo').length;
    const capacidadTotal = MIS_TALLERES.reduce((acc, t) => acc + (parseInt(t.capacidad) || 0), 0);

    // --- GENERACIÓN DE FILAS ---
    let filas = MIS_TALLERES.map((t, index) => `
        <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding:12px;">
                <div style="font-weight:bold; color:#1e293b;">${t.nombre}</div>
                <div style="font-size:10px; color:#64748b;">NIT: ${t.nit}</div>
            </td>
            <td style="text-align:center;"><span class="status-pill" style="background:#f1f5f9; color:#475569; padding:4px 8px; border-radius:4px; font-size:11px;">${t.tablero}</span></td>
            <td style="text-align:center; font-weight:bold; color:#0f172a;">${t.capacidad || 0}</td>
            <td style="text-align:center;">
                <span style="padding:4px 12px; border-radius:20px; font-size:11px; font-weight:bold; 
                    background:${t.estado === 'Activo' ? '#dcfce7' : '#fee2e2'}; 
                    color:${t.estado === 'Activo' ? '#166534' : '#991b1b'};">
                    ${t.estado.toUpperCase()}
                </span>
            </td>
            <td style="text-align:center;">
                <button onclick="vistaCrearTaller(${index})" style="background:#3b82f6; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; font-size:11px;">GESTIONAR</button>
            </td>
        </tr>
    `).join('');

    // --- RENDERIZADO FINAL CON KPIs ---
    zona.innerHTML = `
        <div style="background:white; border-radius:12px; padding:20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 25px;">
                <div style="background:#f8fafc; padding:15px; border-radius:8px; border-left:4px solid #3b82f6;">
                    <div style="font-size:11px; color:#64748b; font-weight:bold;">TOTAL TALLERES</div>
                    <div style="font-size:20px; font-weight:bold; color:#1e293b;">${totalTalleres}</div>
                </div>
                <div style="background:#f8fafc; padding:15px; border-radius:8px; border-left:4px solid #10b981;">
                    <div style="font-size:11px; color:#64748b; font-weight:bold;">ACTIVOS</div>
                    <div style="font-size:20px; font-weight:bold; color:#166534;">${activos}</div>
                </div>
                <div style="background:#f8fafc; padding:15px; border-radius:8px; border-left:4px solid #ef4444;">
                    <div style="font-size:11px; color:#64748b; font-weight:bold;">CAPACIDAD TOTAL</div>
                    <div style="font-size:20px; font-weight:bold; color:#991b1b;">${capacidadTotal.toLocaleString()} <small style="font-size:10px;">unds</small></div>
                </div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h3 style="margin:0; font-size:16px; color:#1e293b;">📋 Lista Operativa de Talleres</h3>
                <button onclick="document.getElementById('contenedor-tablas-talleres').innerHTML=''" style="background:none; border:none; color:#64748b; cursor:pointer; font-weight:bold;">✖ Cerrar</button>
            </div>

            <div style="overflow-x:auto;">
                <table style="width:100%; border-collapse:collapse; text-align:left;">
                    <thead style="background:#f1f5f9;">
                        <tr style="font-size:12px; color:#475569;">
                            <th style="padding:12px;">TALLER / NIT</th>
                            <th style="text-align:center;">TABLERO</th>
                            <th style="text-align:center;">CAPACIDAD</th>
                            <th style="text-align:center;">ESTADO</th>
                            <th style="text-align:center;">ACCIÓN</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filas.length > 0 ? filas : '<tr><td colspan="5" style="text-align:center; padding:30px; color:#94a3b8;">No hay datos para mostrar</td></tr>'}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function eliminarTaller(i) { if (confirm("¿Eliminar?")) { MIS_TALLERES.splice(i, 1); localStorage.setItem('talleres', JSON.stringify(MIS_TALLERES)); vistaVerTalleres(); } }
// Dentro de la función donde validas el login:

// --- 13. GESTIÓN DE OPERACIONES (ÓRDENES DE PRODUCCIÓN) ---

function vistaCrearOperacion(index = -1) {
    EDITANDO_INDEX = index;
    const datos = index !== -1 ? MIS_OPERACIONES[index] : { nombre: "", tipo: "Interna" };
    const titulo = index !== -1 ? "✏️ Editar Operación" : "⚙️ Registrar Nueva Operación";
    const txtBoton = index !== -1 ? "GUARDAR CAMBIOS" : "GUARDAR";

    const subView = document.getElementById('registro-sub-view');
    subView.innerHTML = `
        <div class="welcome-card" style="background:white; padding:20px; border-radius:10px; border-left:5px solid #6366f1;">
            <h4 style="margin-bottom:15px;">${titulo}</h4>
            <div style="display:flex; gap:10px;">
                <input type="text" id="nomOperacion" value="${datos.nombre}" placeholder="Nombre de la operación (Ej: Fileteado)" style="flex:2; padding:10px;">
                <select id="tipoOperacion" style="flex:1; padding:10px;">
                    <option value="Interna" ${datos.tipo === 'Interna' ? 'selected' : ''}>Interna</option>
                    <option value="Externa" ${datos.tipo === 'Externa' ? 'selected' : ''}>Externa (Taller)</option>
                </select>
                <button onclick="guardarOperacionManual()" style="background:#6366f1; color:white; border:none; padding:10px 20px; border-radius:5px; cursor:pointer;">${txtBoton}</button>
                ${index !== -1 ? `<button onclick="vistaVerOperaciones()" style="background:#e2e8f0; color:black; border:none; padding:10px 20px; border-radius:5px; cursor:pointer;">CANCELAR</button>` : ''}
            </div>
        </div>`;
}

function guardarOperacionManual() {
    const nombre = document.getElementById('nomOperacion').value.trim();
    const tipo = document.getElementById('tipoOperacion').value;

    if (!nombre) return alert("Escribe el nombre de la operación");

    if (EDITANDO_INDEX === -1) {
        MIS_OPERACIONES.push({ id: Date.now(), nombre, tipo });
    } else {
        MIS_OPERACIONES[EDITANDO_INDEX].nombre = nombre;
        MIS_OPERACIONES[EDITANDO_INDEX].tipo = tipo;
    }

    localStorage.setItem('operaciones', JSON.stringify(MIS_OPERACIONES));
    vistaVerOperaciones(); 
}

function vistaVerOperaciones() {
    const subView = document.getElementById('registro-sub-view');
    if (MIS_OPERACIONES.length === 0) {
        subView.innerHTML = `<p style="padding:20px; color:#64748b;">No hay operaciones registradas.</p>`;
        return;
    }

    let html = `
        <div class="welcome-card" style="display:block; border-left: 5px solid #6366f1; margin-top:20px;">
            <h4 style="margin-bottom:15px;">⚙️ Catálogo de Operaciones</h4>
            <table class="admin-table" style="width:100%;">
                <thead>
                    <tr style="font-size: 11px; background: #f8fafc; text-align: left;">
                        <th style="padding:10px;">NOMBRE DE LA OPERACIÓN</th>
                        <th>TIPO DE FLUJO</th>
                        <th style="text-align:center;">ACCIONES</th>
                    </tr>
                </thead>
                <tbody>`;

    MIS_OPERACIONES.forEach((op, index) => {
        // Estilo según tipo
        const esInterna = op.tipo === "Interna";
        const colorTipo = esInterna ? "#6366f1" : "#f59e0b";
        const bgTipo = esInterna ? "#eef2ff" : "#fffbeb";

        html += `
            <tr style="border-bottom:1px solid #f8fafc;">
                <td style="padding:12px; text-transform: uppercase;"><b>${op.nombre}</b></td>
                <td>
                    <span style="background: ${bgTipo}; color: ${colorTipo}; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: bold; border: 1px solid ${colorTipo}33;">
                        ${esInterna ? '🏠 INTERNA' : '🏭 EXTERNA'}
                    </span>
                </td>
                <td style="text-align:center; white-space: nowrap;">
                    <button onclick="vistaCrearOperacion(${index})" class="btn-edit">EDITAR</button>
                    <button onclick="eliminarOperacionManual(${index})" class="btn-delete">X</button>
                </td>
            </tr>`;
    });

    html += `</tbody></table>
            <button onclick="vistaCrearOperacion()" style="margin-top:20px; background:#6366f1; color:white; border:none; padding:8px 15px; border-radius:5px; cursor:pointer;">+ NUEVA OPERACIÓN</button>
        </div>`;
    
    subView.innerHTML = html;
}

function eliminarOperacionManual(index) {
    if (confirm("¿Deseas eliminar esta operación?")) {
        MIS_OPERACIONES.splice(index, 1);
        localStorage.setItem('operaciones', JSON.stringify(MIS_OPERACIONES));
        vistaVerOperaciones(); // Refresca la tabla
    }
}
function eliminarUsuarioAdmin(index) {
    if (confirm(`¿Seguro que deseas eliminar al usuario ${USUARIOS_SISTEMA[index].nombre}?`)) {
        USUARIOS_SISTEMA.splice(index, 1);
        localStorage.setItem('usuarios_erp', JSON.stringify(USUARIOS_SISTEMA));
        gestionarUsuarios(); // Recarga la tabla
    }
}
function editarUsuarioAdmin(index) {
    const u = USUARIOS_SISTEMA[index];
    const nuevoNombre = prompt("Nombre del usuario:", u.nombre);
    if (nuevoNombre === null) return;

    // Crear lista de cargos para que el admin sepa qué escribir
    const listaCargos = ROLES_SISTEMA.map(r => r.n).join(", ");
    const nuevoCargo = prompt("Nuevo Cargo (" + listaCargos + "):", u.cargo);
    if (nuevoCargo === null) return;

    USUARIOS_SISTEMA[index].nombre = nuevoNombre.trim();
    USUARIOS_SISTEMA[index].cargo = nuevoCargo.trim();

    localStorage.setItem('usuarios_erp', JSON.stringify(USUARIOS_SISTEMA));
    gestionarUsuarios();
}
function filtrarTabla(idInput, idBody) {
    const input = document.getElementById(idInput);
    const filter = input.value.toLowerCase();
    const tbody = document.getElementById(idBody);
    const tr = tbody.getElementsByTagName("tr");

    for (let i = 0; i < tr.length; i++) {
        let textoFila = tr[i].textContent.toLowerCase();
        if (textoFila.indexOf(filter) > -1) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
}
// --- FUNCIONES DE SOPORTE PARA TABLAS ---

// 1. Filtrado dinámico por columnas
function filtrarColumnas() {
    const fTablero = document.getElementById('f-tablero').value.toUpperCase();
    const fEstado = document.getElementById('f-estado').value.toUpperCase();
    const filas = document.querySelectorAll('#bodyTalleres tr');

    filas.forEach(fila => {
        const valTablero = fila.getAttribute('data-tablero').toUpperCase();
        const valEstado = fila.getAttribute('data-estado').toUpperCase();

        const coincideTablero = fTablero === "" || valTablero === fTablero;
        const coincideEstado = fEstado === "" || valEstado === fEstado;

        fila.style.display = (coincideTablero && coincideEstado) ? "" : "none";
    });
}

// 2. Exportación a Excel (CSV compatible)
function exportarTalleresExcel() {
    const fecha = new Date().toISOString().slice(0, 10);
    const filename = `Reporte_Talleres_${fecha}.xls`;

    // 1. Crear el encabezado del archivo XML compatible con Excel
    let excelTemplate = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
            <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
            <x:Name>Talleres</x:Name>
            <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorkbook></xml><![endif]-->
            <style>
                .encabezado { background-color: #ef4444; color: #ffffff; font-weight: bold; }
                .celda { border: 0.5pt solid #cbd5e1; }
                .nit { mso-number-format: "\@"; } /* Fuerza a que el NIT sea texto y no pierda ceros */
            </style>
        </head>
        <body>
            <table>
                <tr>
                    <th class="encabezado">NIT</th>
                    <th class="encabezado">NOMBRE TALLER</th>
                    <th class="encabezado">TABLERO</th>
                    <th class="encabezado">CANAL</th>
                    <th class="encabezado">TEJIDO</th>
                    <th class="encabezado">TELEFONO</th>
                    <th class="encabezado">CAPACIDAD</th>
                    <th class="encabezado">ESTADO</th>
                </tr>`;

    // 2. Agregar los datos de MIS_TALLERES
    MIS_TALLERES.forEach(tal => {
        excelTemplate += `
            <tr>
                <td class="celda nit">${tal.nit || ''}</td>
                <td class="celda">${(tal.nombre || '').toUpperCase()}</td>
                <td class="celda">${tal.tablero || 'SIN ASIGNAR'}</td>
                <td class="celda">${tal.canal || 'N/A'}</td>
                <td class="celda">${tal.tejido || 'N/A'}</td>
                <td class="celda">${tal.telefono || ''}</td>
                <td class="celda">${tal.capacidad || 0}</td>
                <td class="celda">${(tal.estado || 'Activo').toUpperCase()}</td>
            </tr>`;
    });

    excelTemplate += `</table></body></html>`;

    // 3. Crear el enlace de descarga
    const blob = new Blob([excelTemplate], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
function multiFiltroTalleres() {
    const texto = document.getElementById('inputBusqueda').value.toLowerCase();
    const tablero = document.getElementById('selectTablero').value.toUpperCase();
    const estado = document.getElementById('selectEstado').value.toUpperCase();
    const filas = document.querySelectorAll('#bodyTalleres tr');

    filas.forEach(fila => {
        const valSearch = (fila.getAttribute('data-search') || "").toLowerCase();
        const valTablero = (fila.getAttribute('data-tablero') || "").toUpperCase();
        const valEstado = (fila.getAttribute('data-estado') || "").toUpperCase();

        const coincideTexto = valSearch.includes(texto);
        const coincideTablero = tablero === "" || valTablero === tablero;
        // Cambiamos la lógica para que coincida aunque sea ACTIVO vs Activo
        const coincideEstado = estado === "" || valEstado === estado;

        fila.style.display = (coincideTexto && coincideTablero && coincideEstado) ? "" : "none";
    });
} 