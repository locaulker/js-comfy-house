// Declare Cart Variables
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");

// The Cart
let cart = [];

// buttons
let buttonsDOM = [];

// Get Products
class Products {
  async getProducts() {
    try {
      let result = await fetch('../data/products.json');
      let data = await result.json();

      let products = data.items;
      products = products.map(item => {
        const {title, price} = item.fields;
        const {id} = item.sys;
        const image = item.fields.image.fields.file.url;
        return {title, price, id, image};
      })
      return products;

    } catch (error) {
      console.log(error);
    }  
  }
}

// Display All Products
class UI {

  // Display Products in Main Area
  displayProducts(products) {
    // console.log(products);
    let result = '';
    products.forEach(product => {
      result += `
      <article class="product">
        <div class="img-container">
          <img src="${product.image}" alt="${product.title}" class="product-img">
          <button class="bag-btn" data-id="${product.id}">
            <i class="fad fa-shopping-cart"></i>
            add to cart
          </button>
        </div>
        <h3>${product.title}</h3>
        <h4>$${product.price}</h4>
      </article>
      `
    });
    productsDOM.innerHTML = result;
  }

  // Get Hover Buttons
  getBagButtons() {
    const buttons = [...document.querySelectorAll('.bag-btn')];
    buttonsDOM = buttons;
    
    buttons.forEach((button) => {
      let id = button.dataset.id;
      let inCart = cart.find(item => item.id === id);

      if(inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      }
      button.addEventListener('click', (e) => {
        e.target.innerText = "In Cart";
        e.target.disabled = true;

        // get product from products
        let cartItem = {...Storage.getProduct(id), amount: 1};

        // add product to the cart
        cart = [...cart, cartItem];

        // save cart to local storage
        Storage.saveCart(cart);

        // set current cart value(s)
        this.setCartValue(cart);

        // display cart item
        this.addCartItem(cartItem);

        // show cart when item is added


      });
    });
  }
  setCartValue(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;

    cart.map(item => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    })
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  }

  addCartItem(item) {
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <div>
        <h4>${item.title}</h4>
        <h5>$${item.price}</h5>
        <span class="remove-item" data-id="${item.id}">remove</span>
      </div>
      <div>
        <i class="fal fa-chevron-up" data-id="c"></i>
        <p class="item-amount">data-id="${item.amount}"</p>
        <i class="fal fa-chevron-down" data-id="${item.id}"></i>
      </div>`;
    cartContent.appendChild(div);

    console.log(cartContent);
  }

  

}

// Local Storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem('products'));
    return products.find(product => product.id === id);
  }

  static saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
}

// Event Listener
document.addEventListener("DOMContentLoaded", () => {

  const products = new Products();
  const ui = new UI();

  // get all products
  products.getProducts().then(products => {
    ui.displayProducts(products);
    Storage.saveProducts(products);
  }).then(() => {
    ui.getBagButtons();
  });

});