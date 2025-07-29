// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const collectionId = urlParams.get('id');

// DOM Elements
const collectionTitle = document.getElementById('collectionTitle');
const collectionDescription = document.getElementById('collectionDescription');
const categoriesList = document.getElementById('categoriesList');
const productsGrid = document.getElementById('productsGrid');
const modal = document.getElementById('productModal');
const closeModal = document.querySelector('.close-modal');
const modalProductImage = document.getElementById('modalProductImage');
const modalProductTitle = document.getElementById('modalProductTitle');
const modalProductDescription = document.getElementById('modalProductDescription');
const sizeSelect = document.getElementById('sizeSelect');
const modalProductPrice = document.getElementById('modalProductPrice');
const shopeeBtn = document.getElementById('shopeeBtn');
const tokopediaBtn = document.getElementById('tokopediaBtn');
const tiktokBtn = document.getElementById('tiktokBtn');

// Current product data
let currentProduct = null;
let currentCategoryIndex = 0;

// Collection data mapping
const collectionDataMap = {
    'spring-collections': springCollectionData[0],
    'autumn-collection': autumnCollectionData[0],
    'winter-collection': winterCollectionData[0],
    'shaggy-collection': shaggyCollectionData[0],
    'sajadah-collection': sajadahCollectionData[0],
    'others': othersCollectionData[0]
};

// Format price to IDR
function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(price);
}

// Load collection data
function loadCollectionData() {
    const collectionData = collectionDataMap[collectionId];
    
    if (!collectionData) {
        collectionTitle.textContent = 'Collection Not Found';
        collectionDescription.textContent = 'The requested collection could not be found.';
        return;
    }
    
    // Find the collection in catalogData to get description and image
    const catalogInfo = catalogData.find(item => item.slug === collectionId);
    
    // Set collection info
    collectionTitle.textContent = collectionData.collection;
    
    // Set collection description from catalog data if available, otherwise use default
    if (catalogInfo && catalogInfo.description) {
        collectionDescription.textContent = catalogInfo.description;
    }
    
    // Set hero background image if available
    const heroSection = document.querySelector('.collection-hero');
    if (catalogInfo && catalogInfo.image && heroSection) {
        heroSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${catalogInfo.image}')`;
    }
    
    // Render categories
    renderCategories(collectionData.categories);
    
    // Render products for first category by default
    if (collectionData.categories.length > 0) {
        renderProducts(collectionData.categories[0].products);
    }
}

// Render categories navigation
function renderCategories(categories) {
    if (!categories || categories.length <= 1) return;
    
    categoriesList.innerHTML = categories.map((category, index) => `
        <li>
            <a href="#" class="${index === 0 ? 'active' : ''}" data-category="${index}">
                ${category.title}
            </a>
        </li>
    `).join('');
    
    // Add event listeners to category links
    document.querySelectorAll('[data-category]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const categoryIndex = parseInt(link.dataset.category);
            currentCategoryIndex = categoryIndex;
            
            // Update active state
            document.querySelectorAll('[data-category]').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Render products for selected category
            const collectionData = collectionDataMap[collectionId];
            renderProducts(collectionData.categories[categoryIndex].products);
            
            // Scroll to products
            productsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

// Render products grid
function renderProducts(products) {
    if (!products || products.length === 0) {
        productsGrid.innerHTML = '<p class="no-products">No products available in this category.</p>';
        return;
    }
    
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}" loading="lazy">
            </div>
            <div class="product-info">
                <h3>${product.title}</h3>
                <p>${product.description}</p>
                <div class="product-price">
                    ${formatPrice(product.sizes[0].price)}
                    ${product.sizes.length > 1 ? `<span class="size-variants">+${product.sizes.length - 1} more sizes</span>` : ''}
                </div>
            </div>
        </div>
    `).join('');
    
    // Add click event to product cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
            const productId = card.dataset.productId;
            const collectionData = collectionDataMap[collectionId];
            const category = collectionData.categories[currentCategoryIndex];
            const product = category.products.find(p => p.id === productId);
            
            if (product) {
                openProductModal(product);
            }
        });
    });
}

// Open product modal
function openProductModal(product) {
    currentProduct = product;
    
    // Set modal content
    modalProductImage.src = product.image;
    modalProductImage.alt = product.title;
    modalProductTitle.textContent = product.title;
    modalProductDescription.textContent = product.description;
    
    // Populate size selector
    sizeSelect.innerHTML = product.sizes.map((size, index) => `
        <option value="${index}">
            ${size.size} - ${formatPrice(size.price)}
        </option>
    `).join('');
    
    // Set initial price and links
    updateSizeSelection(0);
    
    // Add event listener for size changes
    sizeSelect.addEventListener('change', (e) => {
        updateSizeSelection(parseInt(e.target.value));
    });
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Update size selection in modal
function updateSizeSelection(sizeIndex) {
    if (!currentProduct) return;
    
    const size = currentProduct.sizes[sizeIndex];
    
    // Update price
    modalProductPrice.textContent = formatPrice(size.price);
    
    // Update links
    shopeeBtn.href = size.shopee;
    tokopediaBtn.href = size.tokopedia;
    tiktokBtn.href = size.tiktok;
}

// Close modal
function closeProductModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Event Listeners
closeModal.addEventListener('click', closeProductModal);

// Close modal when clicking outside content
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeProductModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProductModal();
    }
});

// Initialize the page
if (collectionId) {
    loadCollectionData();
} else {
    collectionTitle.textContent = 'Invalid Collection';
    collectionDescription.textContent = 'No collection ID specified.';
}
