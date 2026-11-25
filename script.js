/* ========== Dados dos produtos (fictícios) ========== */
// img = foto principal, alt = foto exibida no hover
const produtos = [
  { id: 1, nome: 'Camiseta Boxy Algodão', cat: 'masculino',  preco: 189,
    fbImg: 'images/p1.svg', fbAlt: 'images/p1b.svg',
    img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80',
    alt: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=700&q=80' },
  { id: 2, nome: 'Jaqueta Utilitária',    cat: 'masculino',  preco: 549,
    fbImg: 'images/p2.svg', fbAlt: 'images/p2b.svg',
    img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=700&q=80',
    alt: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=700&q=80' },
  { id: 3, nome: 'Vestido Linho Fluido',  cat: 'feminino',   preco: 459,
    fbImg: 'images/p3.svg', fbAlt: 'images/p3b.svg',
    img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=80',
    alt: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80' },
  { id: 4, nome: 'Blazer Alfaiataria',    cat: 'feminino',   preco: 629,
    fbImg: 'images/p4.svg', fbAlt: 'images/p4b.svg',
    img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=700&q=80',
    alt: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=80' },
  { id: 5, nome: 'Bolsa Couro Estruturada', cat: 'acessorios', preco: 389,
    fbImg: 'images/p5.svg', fbAlt: 'images/p5b.svg',
    img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80',
    alt: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80' },
  { id: 6, nome: 'Suéter Lã Merino',      cat: 'feminino',   preco: 349,
    fbImg: 'images/p6.svg', fbAlt: 'images/p6b.svg',
    img: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=700&q=80',
    alt: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=700&q=80' }
];
const nomesCat = { masculino: 'Masculino', feminino: 'Feminino', acessorios: 'Acessórios' };
const brl = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/* ========== Renderiza a vitrine ========== */
const grid = document.getElementById('grid');
grid.innerHTML = produtos.map(p => `
  <article class="card reveal" data-cat="${p.cat}">
    <div class="card-img">
      <img src="${p.img}" data-fallback="${p.fbImg}" alt="${p.nome}" loading="lazy">
      <img class="alt" src="${p.alt}" data-fallback="${p.fbAlt}" alt="${p.nome} — detalhe" loading="lazy">
      <button class="add" data-id="${p.id}">Adicionar à sacola</button>
    </div>
    <div class="card-info">
      <div>${p.nome}<small>${nomesCat[p.cat]}</small></div>
      <div>${brl(p.preco)}</div>
    </div>
  </article>`).join('');

/* ========== Configurações da loja ========== */
// Número do WhatsApp da loja: só dígitos, com DDI + DDD (ex.: 55 + 11 + número). TROQUE PELO SEU.
const WHATSAPP = '5511999999999';
const FRETE_GRATIS = 299;

/* ========== Sacola (carrinho) ========== */
// carrinho = [{ id, qtd }]  —  salvo no localStorage para não perder ao recarregar
let carrinho = [];
try {
  carrinho = JSON.parse(localStorage.getItem('vertice-sacola')) || [];
} catch (e) {
  carrinho = []; // se o armazenamento falhar, começa com a sacola vazia
}

const contador = document.getElementById('bagCount');
const listaEl  = document.getElementById('cartItems');
const totalEl  = document.getElementById('cartTotal');
const btnFinal = document.getElementById('checkout');
const toast = document.getElementById('toast');
let toastTimer;

function avisar(texto) {
  toast.textContent = texto;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

const achar = id => produtos.find(p => p.id === id);
const subtotal = () => carrinho.reduce((s, i) => s + achar(i.id).preco * i.qtd, 0);
const totalItens = () => carrinho.reduce((s, i) => s + i.qtd, 0);

// Atualiza contador, lista, subtotal e barra de frete
function renderSacola() {
  const n = totalItens(), total = subtotal();
  contador.textContent = n;
  totalEl.textContent = brl(total);
  btnFinal.disabled = n === 0;

  // Barra de frete grátis
  const falta = FRETE_GRATIS - total;
  document.getElementById('shipMsg').textContent = n === 0 ? `Frete grátis acima de ${brl(FRETE_GRATIS)}`
    : falta > 0 ? `Faltam ${brl(falta)} para você ganhar frete grátis` : 'Você ganhou frete grátis ✓';
  document.getElementById('shipBar').style.width = Math.min(100, (total / FRETE_GRATIS) * 100) + '%';

  // Lista de itens
  listaEl.innerHTML = n === 0
    ? '<div class="empty"><h4>Sua sacola está vazia</h4><p>Escolha uma peça da coleção para começar.</p></div>'
    : carrinho.map(i => {
        const p = achar(i.id);
        return `<div class="item">
          <div class="item-img"><img src="${p.img}" data-fallback="${p.fbImg}" alt="${p.nome}"></div>
          <div class="item-body">
            <div class="item-top"><div>${p.nome}<small>${nomesCat[p.cat]}</small></div><div>${brl(p.preco * i.qtd)}</div></div>
            <div class="item-bottom">
              <div class="qty">
                <button data-act="menos" data-id="${p.id}" aria-label="Diminuir">−</button>
                <span>${i.qtd}</span>
                <button data-act="mais" data-id="${p.id}" aria-label="Aumentar">+</button>
              </div>
              <button class="remove" data-act="remover" data-id="${p.id}">Remover</button>
            </div>
          </div>
        </div>`;
      }).join('');

  try {
    localStorage.setItem('vertice-sacola', JSON.stringify(carrinho));
  } catch (e) {
    // sem armazenamento disponível: a sacola só dura até recarregar
  }
}

function adicionar(id) {
  const item = carrinho.find(i => i.id === id);
  item ? item.qtd++ : carrinho.push({ id, qtd: 1 });
  renderSacola();
  contador.classList.add('bump');                       // animação no contador
  setTimeout(() => contador.classList.remove('bump'), 300);
}

// Clique em "Adicionar à sacola" na vitrine
grid.addEventListener('click', e => {
  const btn = e.target.closest('.add');
  if (!btn) return;
  const p = achar(+btn.dataset.id);
  adicionar(p.id);
  avisar(`“${p.nome}” adicionado à sacola`);
});

// Botões dentro da sacola: + / − / remover
listaEl.addEventListener('click', e => {
  const b = e.target.closest('[data-act]');
  if (!b) return;
  const id = +b.dataset.id, item = carrinho.find(i => i.id === id);
  if (b.dataset.act === 'mais') item.qtd++;
  if (b.dataset.act === 'menos') item.qtd--;
  if (b.dataset.act === 'remover' || item.qtd <= 0) carrinho = carrinho.filter(i => i.id !== id);
  renderSacola();
});

/* ========== Abrir / fechar a sacola ========== */
function abrirSacola(abrir) {
  document.body.classList.toggle('bag-open', abrir);
  document.getElementById('drawer').setAttribute('aria-hidden', !abrir);
}
document.getElementById('bagBtn').addEventListener('click', () => abrirSacola(true));
document.getElementById('closeBag').addEventListener('click', () => abrirSacola(false));
document.getElementById('overlay').addEventListener('click', () => abrirSacola(false));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') abrirSacola(false);
});

/* ========== Finalizar pelo WhatsApp (mensagem pronta) ========== */
btnFinal.addEventListener('click', () => {
  const linhas = carrinho.map(i => {
    const p = achar(i.id);
    return `▪ ${i.qtd}x ${p.nome} — ${brl(p.preco * i.qtd)}`;
  });
  const total = subtotal();
  const frete = total >= FRETE_GRATIS ? 'Frete grátis ✓' : 'Frete a calcular';
  const mensagem = [
    'Olá, VÉRTICE! ',
    'Vi as peças abaixo no site e gostaria de finalizar meu pedido:',
    '',
    ...linhas,
    '',
    `*Subtotal:* ${brl(total)}`,
    frete,
    '',
    'Podem me confirmar disponibilidade, tamanhos e formas de pagamento? Obrigado(a)!'
  ].join('\n');
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}`, '_blank', 'noopener');
});

renderSacola();   // desenha a sacola ao carregar a página

/* ========== Filtro de categorias ========== */
function filtrar(cat) {
  document.querySelectorAll('#filters button').forEach(b => b.classList.toggle('active', b.dataset.filter === cat));
  document.querySelectorAll('.card').forEach(c => c.classList.toggle('hide', cat !== 'todos' && c.dataset.cat !== cat));
}
document.getElementById('filters').addEventListener('click', e => {
  if (e.target.dataset.filter) filtrar(e.target.dataset.filter);
});
// Clicar numa categoria em destaque já filtra a vitrine
document.querySelectorAll('.cat').forEach(c => c.addEventListener('click', () => filtrar(c.dataset.filter)));

/* ========== Menu mobile ========== */
const menuList = document.getElementById('menuList');
document.getElementById('menuBtn').addEventListener('click', () => menuList.classList.toggle('open'));
menuList.addEventListener('click', () => menuList.classList.remove('open'));

/* ========== Animações ao rolar (Intersection Observer) ========== */
const observer = new IntersectionObserver(entradas => {
  entradas.forEach(en => {
    if (en.isIntersecting) {
      en.target.classList.add('in');
      observer.unobserve(en.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i % 3) * 0.1 + 's';       // entrada escalonada
  observer.observe(el);
});

/* ========== Newsletter fictícia ========== */
document.getElementById('newsForm').addEventListener('submit', e => {
  e.preventDefault();
  document.getElementById('msg').textContent = 'Obrigado! Você está na lista VÉRTICE.';
  e.target.reset();
});

/* ========== Imagens: se a foto online falhar, usa a imagem local da pasta /images ========== */
// O evento "error" não borbulha, por isso usamos a fase de captura no document
document.addEventListener('error', e => {
  const img = e.target;
  if (img.tagName === 'IMG' && img.dataset.fallback && !img.dataset.usedFallback) {
    img.dataset.usedFallback = '1';
    img.src = img.dataset.fallback;
  }
}, true);
