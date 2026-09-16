var cart = [];
var curFilter = "all";

function fmt(n) { return "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
function cTotal() { return cart.reduce(function(s,i){ return s + i.price * i.qty; }, 0); }
function cCount() { return cart.reduce(function(s,i){ return s + i.qty; }, 0); }
function genId() {
  var d = new Date(), p = function(n){ return String(n).padStart(2,"0"); };
  return "FAV-" + d.getFullYear() + p(d.getMonth()+1) + p(d.getDate()) + "-" + Math.floor(Math.random()*9000+1000);
}

var STORES = [
  {id:"q", name:"Quality for Living", addr:"Av. Beethoven, Edif. Benedetti PB L4, Bello Monte, Caracas", hrs:"Lun–Vie 8:30am–4pm · Sáb 9am–2pm"},
  {id:"k", name:"K+ Soluciones Decorativas", addr:"Av. Las Fuentes, El Paraíso, Caracas", hrs:"Lun–Sáb 8:30am–5pm"},
  {id:"f", name:"FAVECA — Planta Principal", addr:"Carretera Charallave–Cúa Km. 3, Estado Miranda", hrs:"Lun–Jue 8:30am–3:30pm"}
];

// HAMBURGER
document.getElementById("hamburger").addEventListener("click", function() {
  document.getElementById("navMobile").classList.toggle("open");
});
document.querySelectorAll(".nav-mobile a").forEach(function(a) {
  a.addEventListener("click", function() {
    document.getElementById("navMobile").classList.remove("open");
  });
});

// FILTERS
document.querySelectorAll(".fil").forEach(function(btn) {
  btn.addEventListener("click", function() {
    document.querySelectorAll(".fil").forEach(function(b){ b.classList.remove("active"); });
    btn.classList.add("active");
    curFilter = btn.getAttribute("data-filter");
    renderGrid();
  });
});

// RENDER GRID
function renderGrid() {
  var grid = document.getElementById("pgrid");
  var prods = PRODUCTS.filter(function(p) {
    return curFilter === "all" || p.cat === curFilter;
  });
  var html = "";
  prods.forEach(function(p) {
    var base = p.variants[0].p;
    var multi = p.variants.length > 1;
    html += '<article class="pcard">';
    html += '<div class="pcard-img" onclick="openModal(' + p.id + ')">';
    html += '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy">';
    html += '<div class="pcat-badge">' + p.catL + '</div>';
    html += '</div>';
    html += '<div class="pcard-body" onclick="openModal(' + p.id + ')">';
    html += '<div class="pcard-name">' + p.name + '</div>';
    html += '<div class="pcard-note">' + p.note + '</div>';
    html += '<div class="pcard-price-row">';
    html += '<span class="pcard-price">' + (multi ? "Desde " : "") + fmt(base) + '</span>';
    html += '<span class="pcard-price-sub">USD REF<br>' + (multi ? "Varias medidas" : "IVA incluido") + '</span>';
    html += '</div></div>';
    html += '<div class="pcard-actions">';
    html += '<button class="btn-ol" onclick="openModal(' + p.id + ')">Ver detalles</button>';
    if (multi) {
      html += '<button class="btn-dk" onclick="openModal(' + p.id + ')">Elegir medida</button>';
    } else {
      html += '<button class="btn-dk" onclick="addToCart(' + p.id + ',0)">+ Agregar</button>';
    }
    html += '</div></article>';
  });
  grid.innerHTML = html;
}

// CART
function addToCart(pid, vi) {
  var p = PRODUCTS.find(function(x){ return x.id === pid; });
  var v = p.variants[vi || 0];
  var key = pid + "-" + (vi || 0);
  var ex = cart.find(function(x){ return x.key === key; });
  if (ex) { ex.qty++; }
  else { cart.push({id:p.id, name:p.name, img:p.img, price:v.p, vl:v.l, key:key, qty:1}); }
  updateBadge();
  openCart();
}
function removeItem(key) {
  cart = cart.filter(function(x){ return x.key !== key; });
  renderCartItems();
}
function chgQty(key, d) {
  var i = cart.find(function(x){ return x.key === key; });
  if (!i) return;
  i.qty = Math.max(0, i.qty + d);
  if (i.qty === 0) removeItem(key); else renderCartItems();
}
function updateBadge() {
  document.getElementById("cartCount").textContent = cCount();
}
function renderCartItems() {
  updateBadge();
  var el = document.getElementById("cartItems");
  var ft = document.getElementById("cartFooter");
  if (!cart.length) {
    el.innerHTML = '<div class="cart-empty">Tu carrito está vacío</div>';
    ft.innerHTML = ""; return;
  }
  var html = "";
  cart.forEach(function(i) {
    html += '<div class="cart-item">';
    html += '<div class="cimg"><img src="' + i.img + '" alt="' + i.name + '"></div>';
    html += '<div style="flex:1;min-width:0">';
    html += '<div class="cname">' + i.name + '</div>';
    if (i.vl) html += '<div class="cvlbl">' + i.vl + '</div>';
    html += '<div class="cprice">' + fmt(i.price) + '</div>';
    html += '<div class="cqty">';
    html += '<button class="qbtn" onclick="chgQty(\'' + i.key + '\',-1)">−</button>';
    html += '<span style="font-size:13px;font-weight:600;min-width:20px;text-align:center">' + i.qty + '</span>';
    html += '<button class="qbtn" onclick="chgQty(\'' + i.key + '\',+1)">+</button>';
    html += '<button onclick="removeItem(\'' + i.key + '\')" style="background:none;border:none;font-size:11px;color:#9299A8;cursor:pointer;margin-left:6px">✕ quitar</button>';
    html += '</div></div></div>';
  });
  el.innerHTML = html;
  ft.innerHTML = '<div class="cart-footer-wrap">'
    + '<div class="total-row"><span class="total-lbl">Total</span><span class="total-amt">' + fmt(cTotal()) + '</span></div>'
    + '<p class="total-note">USD · REF · Tasa BCV del día · IVA 16%</p>'
    + '<button class="checkout-btn" onclick="openOrder()">Proceder al pedido →</button>'
    + '</div>';
}
function openCart() {
  document.getElementById("cartPanel").classList.add("open");
  document.getElementById("cartOv").classList.add("open");
  document.body.style.overflow = "hidden";
  renderCartItems();
}
function closeCart() {
  document.getElementById("cartPanel").classList.remove("open");
  document.getElementById("cartOv").classList.remove("open");
  document.body.style.overflow = "";
}
document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("cartClose").addEventListener("click", closeCart);
document.getElementById("cartOv").addEventListener("click", closeCart);

// MODAL
function openModal(id) {
  var p = PRODUCTS.find(function(x){ return x.id === id; });
  var multi = p.variants.length > 1;
  var specs = p.specs.map(function(s){ return '<li><b>—</b> ' + s + '</li>'; }).join("");
  var priceHtml = "";
  if (multi) {
    priceHtml = '<span class="var-label">Selecciona la medida</span><div class="var-options">';
    p.variants.forEach(function(v, i) {
      priceHtml += '<div class="var-row' + (i===0 ? " sel" : "") + '" onclick="selVar(' + id + ',' + i + ',this)">';
      priceHtml += '<div class="var-row-left"><input type="radio" name="vr' + id + '" value="' + i + '"' + (i===0 ? " checked" : "") + ' style="accent-color:#8B7355;width:16px;height:16px"> ' + v.l + '</div>';
      priceHtml += '<span class="var-row-price">' + fmt(v.p) + '</span></div>';
    });
    priceHtml += '</div>';
  } else {
    priceHtml = '<div class="single-price"><span class="single-price-amt">' + fmt(p.variants[0].p) + '</span>'
      + '<div class="single-price-det">Precio en USD · REF<br>Tasa BCV del día<br>IVA (16%) incluido</div></div>';
  }
  var inner = '<div class="modal-img"><img src="' + p.img + '" alt="' + p.name + '"></div>';
  inner += '<div class="modal-body">';
  inner += '<div class="modal-cat">' + p.catL + '</div>';
  inner += '<div class="modal-name">' + p.name + '</div>';
  inner += '<div class="modal-note">' + p.note + '</div>';
  inner += '<div class="modal-desc">' + p.desc + '</div>';
  inner += '<ul class="modal-specs">' + specs + '</ul>';
  inner += priceHtml;
  inner += '<button class="add-btn" onclick="addFromModal(' + id + ',' + multi + ')">Agregar al carrito</button>';
  inner += '</div>';
  document.getElementById("modalInner").innerHTML = inner;
  document.getElementById("modalOv").classList.add("open");
  document.body.style.overflow = "hidden";
}
function selVar(pid, idx, el) {
  document.querySelectorAll(".var-row").forEach(function(v){ v.classList.remove("sel"); });
  el.classList.add("sel");
  el.querySelector("input").checked = true;
}
function addFromModal(pid, multi) {
  var idx = 0;
  if (multi) {
    var checked = document.querySelector('input[name="vr' + pid + '"]:checked');
    idx = checked ? parseInt(checked.value) : 0;
  }
  addToCart(pid, idx);
  closeModal();
}
function closeModal() {
  document.getElementById("modalOv").classList.remove("open");
  document.body.style.overflow = "";
}
document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("modalOv").addEventListener("click", function(e) {
  if (e.target === this) closeModal();
});

// ORDER
function openOrder() {
  if (!cart.length) return;
  closeCart();
  var oid = genId(), tot = cTotal();
  var items = cart.map(function(i) {
    return '<div class="osum-item"><div><div class="osum-name">' + i.name + (i.vl ? " — " + i.vl : "") + '</div>'
      + '<div class="osum-qty">Cant: ' + i.qty + '</div></div>'
      + '<div class="osum-price">' + fmt(i.price * i.qty) + '</div></div>';
  }).join("");
  var stopts = STORES.map(function(s, idx) {
    return '<div class="store-opt' + (idx===2 ? " sel" : "") + '" id="sopt-' + s.id + '" onclick="selStore(\'' + s.id + '\')">'
      + '<input type="radio" name="sto" value="' + s.id + '"' + (idx===2 ? " checked" : "") + '>'
      + '<div><div class="sopt-name">' + s.name + '</div>'
      + '<div class="sopt-addr">' + s.addr + '</div>'
      + '<div class="sopt-hrs">' + s.hrs + '</div></div></div>';
  }).join("");

  var inner = '<div class="order-hdr">'
    + '<div class="order-hdr-left"><img src="assets/img/logo.jpg" alt="FAVECA" style="height:28px;filter:invert(1) brightness(2)"><h2>Confirmar Pedido</h2></div>'
    + '<button class="xbtn" onclick="closeOrder()">✕</button></div>';
  inner += '<div class="order-cols">';
  inner += '<div class="order-col">';
  inner += '<div class="order-sec-title">Tus datos</div>';
  inner += '<div class="fg"><label class="fl">Nombre completo *</label><input class="fi" id="on" type="text" placeholder="Tu nombre y apellido"></div>';
  inner += '<div class="fg"><label class="fl">Cédula / RIF *</label><input class="fi" id="oc" type="text" placeholder="V-12345678"></div>';
  inner += '<div class="fg"><label class="fl">WhatsApp *</label><input class="fi" id="ot" type="tel" placeholder="+58 412 0000000"></div>';
  inner += '<div class="fg"><label class="fl">Correo electrónico *</label><input class="fi" id="oe" type="email" placeholder="tucorreo@email.com"></div>';
  inner += '<div class="fg"><label class="fl">Tienda de retiro (Pick Up) *</label><div class="store-opts">' + stopts + '</div></div>';
  inner += '<div class="fg"><label class="fl">Notas adicionales</label><textarea class="fta" id="onotes" placeholder="Consultas u observaciones..."></textarea></div>';
  inner += '</div>';
  inner += '<div class="order-col right">';
  inner += '<div class="order-sec-title">Tu pedido</div>' + items;
  inner += '<div class="ototal-row"><span class="ototal-lbl">Total</span><span class="ototal-amt">' + fmt(tot) + '</span></div>';
  inner += '<p style="font-size:10px;color:#9299A8;margin-bottom:20px;line-height:1.6">USD · REF · Tasa BCV del día · IVA (16%) incluido</p>';
  inner += '<div class="order-sec-title">Instrucciones de pago</div>';
  inner += '<div class="order-bank"><h5>Banesco — FAVECA CA</h5>';
  inner += '<div class="bank-row"><span class="bank-lbl">Banco</span><span class="bank-val">Banesco</span></div>';
  inner += '<div class="bank-row"><span class="bank-lbl">Beneficiario</span><span class="bank-val">FAVECA CA</span></div>';
  inner += '<div class="bank-row"><span class="bank-lbl">Cuenta corriente</span><span class="bank-val">0134 0215 9321 5101 4898</span></div>';
  inner += '<div class="bank-row"><span class="bank-lbl">RIF</span><span class="bank-val">J-000135614</span></div>';
  inner += '<div class="bank-row"><span class="bank-lbl">Monto (USD REF)</span><span class="bank-val hi">' + fmt(tot) + '</span></div>';
  inner += '<div class="bank-row"><span class="bank-lbl">Concepto</span><span class="bank-val">Nombre del producto</span></div></div>';
  inner += '<div class="order-instr"><strong>Importante:</strong> Transfiere el equivalente en bolívares según la <strong>tasa BCV del día</strong> (<a href="https://bcv.org.ve" target="_blank">bcv.org.ve</a>). Envía el comprobante a <strong>faveca.gestion@gmail.com</strong> o WhatsApp <strong>0412 290 0353</strong> indicando la tienda donde recogerás.</div>';
  inner += '<button class="submit-btn" onclick="submitOrder(\'' + oid + '\')">Confirmar pedido →</button>';
  inner += '</div></div>';

  document.getElementById("orderInner").innerHTML = inner;
  document.getElementById("orderOv").classList.add("open");
  document.body.style.overflow = "hidden";
}
function selStore(id) {
  document.querySelectorAll(".store-opt").forEach(function(o){ o.classList.remove("sel"); });
  document.querySelectorAll("input[name='sto']").forEach(function(i){ i.checked = i.value === id; });
  var el = document.getElementById("sopt-" + id);
  if (el) el.classList.add("sel");
}
function closeOrder() {
  document.getElementById("orderOv").classList.remove("open");
  document.body.style.overflow = "";
}
function submitOrder(oid) {
  var n = document.getElementById("on").value.trim();
  var c = document.getElementById("oc").value.trim();
  var t = document.getElementById("ot").value.trim();
  var e = document.getElementById("oe").value.trim();
  if (!n || !c || !t || !e) { alert("Por favor completa todos los campos obligatorios."); return; }
  var sv = document.querySelector("input[name='sto']:checked");
  var store = sv ? STORES.find(function(s){ return s.id === sv.value; }) : STORES[2];
  store = store || STORES[2];
  var tot = cTotal();
  var inner = '<div class="order-hdr">'
    + '<div class="order-hdr-left"><img src="assets/img/logo.jpg" alt="FAVECA" style="height:28px;filter:invert(1) brightness(2)"><h2>¡Pedido Registrado!</h2></div>'
    + '<button class="xbtn" onclick="closeOrder()">✕</button></div>';
  inner += '<div class="conf-wrap">';
  inner += '<div class="conf-ico"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8B7355" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg></div>';
  inner += '<h2>¡Gracias, ' + n.split(" ")[0] + '!</h2>';
  inner += '<p>Tu pedido fue registrado con el número:</p>';
  inner += '<div class="order-id">' + oid + '</div>';
  inner += '<p>Transfiere <strong>' + fmt(tot) + ' USD</strong> en bolívares (tasa BCV del día) al Banco Banesco — FAVECA CA.</p>';
  inner += '<div class="conf-step"><div class="conf-step-n">1</div><div class="conf-step-t">Consulta la tasa BCV en <strong>bcv.org.ve</strong> y calcula el monto en bolívares para <strong>' + fmt(tot) + '</strong>.</div></div>';
  inner += '<div class="conf-step"><div class="conf-step-n">2</div><div class="conf-step-t">Transfiere al <strong>Banco Banesco</strong>, cuenta corriente <strong>0134 0215 9321 5101 4898</strong> — FAVECA CA — RIF J-000135614.</div></div>';
  inner += '<div class="conf-step"><div class="conf-step-n">3</div><div class="conf-step-t">Envía el comprobante con el N° <strong>' + oid + '</strong> a <strong>faveca.gestion@gmail.com</strong> indicando que recogerás en <strong>' + store.name + '</strong>.</div></div>';
  inner += '<div class="conf-step"><div class="conf-step-n">4</div><div class="conf-step-t">FAVECA te enviará la factura y confirmará cuándo puedes pasar a retirar. Sistema <strong>Pick Up</strong> — retiras en tienda.</div></div>';
  inner += '<button class="wa-btn" onclick="window.open(\'https://wa.me/584122900353\',\'_blank\')">📲 Enviar comprobante por WhatsApp</button>';
  inner += '<button class="back-btn" onclick="closeOrder()">Volver a la tienda</button>';
  inner += '</div>';
  document.getElementById("orderInner").innerHTML = inner;
  cart = [];
  updateBadge();
}

// INIT
window.addEventListener("DOMContentLoaded", function() {
  renderGrid();
});
