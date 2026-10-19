const WHATSAPP_NUMBER = "1473XXXXXXXX"; // Replace with your WhatsApp number, e.g. 14735551234

const products = [
  {id:1,name:"Bottled Water",category:"water",label:"WATER",price:45},
  {id:2,name:"Juices",category:"water",label:"JUICE",price:75},
  {id:3,name:"Busta",category:"malt",label:"BUSTA",price:85},
  {id:4,name:"Guinness",category:"beer",label:"GUINNESS",price:110},
  {id:5,name:"Malt",category:"malt",label:"MALT",price:95},
  {id:6,name:"Mackeson",category:"malt",label:"MACKESON",price:105},
  {id:7,name:"Carib",category:"beer",label:"CARIB",price:100},
  {id:8,name:"Stag",category:"beer",label:"STAG",price:100},
  {id:9,name:"Heineken",category:"beer",label:"HEINEKEN",price:120},
  {id:10,name:"Rude Boy",category:"malt",label:"RUDE BOY",price:90},
  {id:11,name:"Kool Kids",category:"kids",label:"KOOL KIDS",price:80},
  {id:12,name:"Caprison",category:"kids",label:"CAPRISON",price:80}
];

let cart = [];

const grid = document.getElementById("productGrid");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

function productVisual(p){
  const caseStyle = p.category === "water" || p.category === "kids";
  return `<div class="product-image"><div class="${caseStyle ? "case" : "can"}">${p.label}</div></div>`;
}

function renderProducts(filter="all"){
  grid.innerHTML = products.filter(p => filter==="all" || p.category===filter).map(p => `
    <article class="product-card">
      ${productVisual(p)}
      <div class="product-info">
        <span class="category">${p.category}</span>
        <h3>${p.name}</h3>
        <div class="price">EC$${p.price.toFixed(2)} / case*</div>
        <button class="add-btn" onclick="addToCart(${p.id})">+ Add to order</button>
      </div>
    </article>`).join("");
}

function addToCart(id){
  const existing = cart.find(i=>i.id===id);
  if(existing) existing.qty++;
  else cart.push({id,qty:1});
  renderCart();
  document.getElementById("order").scrollIntoView({behavior:"smooth",block:"start"});
}

function changeQty(id, amount){
  const item=cart.find(i=>i.id===id);
  if(!item) return;
  item.qty += amount;
  if(item.qty<=0) cart=cart.filter(i=>i.id!==id);
  renderCart();
}

function removeItem(id){
  cart=cart.filter(i=>i.id!==id);
  renderCart();
}

function renderCart(){
  const total=cart.reduce((sum,item)=>{
    const p=products.find(x=>x.id===item.id); return sum+p.price*item.qty;
  },0);
  const count=cart.reduce((sum,item)=>sum+item.qty,0);
  cartCount.textContent=`${count} item${count===1?"":"s"}`;
  cartTotal.textContent=`EC$${total.toFixed(2)}`;

  if(!cart.length){
    cartItems.innerHTML=`<div class="empty-cart">Your order is empty.<br>Add products above.</div>`;
    return;
  }
  cartItems.innerHTML=cart.map(item=>{
    const p=products.find(x=>x.id===item.id);
    return `<div class="cart-item">
      <div class="cart-item-info"><b>${p.name}</b><small>EC$${p.price.toFixed(2)} / case</small></div>
      <div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><span>${item.qty}</span><button onclick="changeQty(${p.id},1)">+</button></div>
      <button class="remove" onclick="removeItem(${p.id})">×</button>
    </div>`;
  }).join("");
}

document.querySelectorAll(".filter").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    renderProducts(btn.dataset.filter);
  });
});

document.getElementById("clearCart").addEventListener("click",()=>{cart=[];renderCart()});

document.getElementById("orderForm").addEventListener("submit",(e)=>{
  e.preventDefault();
  if(!cart.length){alert("Please add at least one product to your order.");return;}
  if(WHATSAPP_NUMBER.includes("X")){
    alert("Please open script.js and replace WHATSAPP_NUMBER with your real WhatsApp number first.");
    return;
  }
  const name=document.getElementById("customerName").value.trim();
  const phone=document.getElementById("customerPhone").value.trim();
  const type=document.getElementById("orderType").value;
  const fulfillment=document.getElementById("fulfillment").value;
  const notes=document.getElementById("orderNotes").value.trim();
  const lines=cart.map(i=>{
    const p=products.find(x=>x.id===i.id);
    return `• ${p.name} — ${i.qty} case${i.qty>1?"s":""}`;
  }).join("\n");
  const total=cart.reduce((s,i)=>s+products.find(p=>p.id===i.id).price*i.qty,0);
  const message=`Hello K L's Wholesale Enterprise!%0A%0AI would like to place an order.%0A%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AOrder type: ${encodeURIComponent(type)}%0APickup/Delivery: ${encodeURIComponent(fulfillment)}%0A%0AProducts:%0A${encodeURIComponent(lines)}%0A%0AEstimated total: EC$${total.toFixed(2)}%0ANotes: ${encodeURIComponent(notes || "None")}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,"_blank");
});

document.getElementById("contactWhatsapp").href=`https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20K%20L's%20Wholesale%20Enterprise!%20I%20would%20like%20to%20ask%20about%20your%20products.`;

document.querySelector(".menu-toggle").addEventListener("click",()=>document.getElementById("navLinks").classList.toggle("open"));
document.querySelectorAll("#navLinks a").forEach(a=>a.addEventListener("click",()=>document.getElementById("navLinks").classList.remove("open")));

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add("visible")});
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

document.getElementById("year").textContent=new Date().getFullYear();
renderProducts();
renderCart();
