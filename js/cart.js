const cart = function () {
    const cartBtn = document.querySelector('.button-cart');
    const cart = document.getElementById('modal-cart');
    const closeBtn = cart.querySelector('.modal-close');
    const goodsContainer = document.querySelector('.long-goods-list');
    const cartTable = document.querySelector('.cart-table__goods');
    const modalForm = document.querySelector('.modal-form')

    const deleteCartItem = (id) => {
            const cart = JSON.parse(localStorage.getItem('cart'));

            const newCart = cart.filter(good => {
                return good.id !== id
            })

            localStorage.getItem('cart', JSON.stringify(newCart));
            renderCartGoods(JSON.parse(localStorage.getItem('cart')));
    }

    const plusCartItem = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart'));

        const newCart = cart.map(good => {
            if (good.id === id) {
                good.count++
            }
            return good;
        })

        localStorage.getItem('cart', JSON.stringify(newCart));
        renderCartGoods(JSON.parse(localStorage.getItem('cart')));
    }

    const minusCartItem = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart'));

        const newCart = cart.map(good => {
            if (good.id === id) {
                if (good.count > 0){
                    good.count--
                }
            }
            return good;
        })

        localStorage.getItem('cart', JSON.stringify(newCart));
        renderCartGoods(JSON.parse(localStorage.getItem('cart')));
    }

    const addToCart = (id) => {
            const goods = JSON.parse(localStorage.getItem('goods'));
            const clickedGood = goods.find(good => good.id === id);
            const cart = localStorage.getItem('cart') ? 
            JSON.parse(localStorage.getItem('cart')) : [];

            if (cart.some(good => good.id === clickedGood.id)) {
                console.log ('>>>');
                cart.map(good => {
                    if (good.id === clickedGood.id) {
                        good.count++
                    }
                    return good;
                })
            }  else {
                clickedGood.count = 1;
                cart.push(clickedGood)
            }

            localStorage.getItem('cart', JSON.stringify(cart))
        }
    }

    const renderCartGoods = (goods) => {
        cartTable.innerHTML = ''
        goods.forEach(good => {
            const tr = document.createElement('tr');
            tr.innerHTML = `                
				<td>${good.name}</td>
				<td>${good.price}</td>
				<td><button class="cart-btn-minus"">-</button></td>
				<td>${good.count}</td>
				<td><button class=" cart-btn-plus"">+</button></td>
				<td>${+good.price * +good.count}</td>
				<td><button class="cart-btn-delete"">x</button></td>				
            `
            cartTable.append(tr)

            tr.addEventListener('click', (e) => {
                console.log(e.target);
                if(e.target.classList.contains('cart-btn-minus')){
                    minusCartItem(good.id)
                } else if (e.target.classList.contains('cart-btn-plus')) {
                    plusCartItem(good.id)
                } else if (e.target.classList.contains('cart-btn-delete')){
                    deleteCartItem(good.id);
                }
            })
        })
    }


    const sendForm = () => {
        const cartArray = localStorage.getItem('cart') ? 
        JSON.parse(localStorage.getItem('cart')) : [];

        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify({
                cart: cart,
                name: '',
                phone: ''
            })
        }).then(() => {
            cart.style.display = '';
        })
    }

    modalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sendForm();
    })

    cartBtn.addEventListener('click', function() {

        const cartArray = localStorage.getItem('cart') ? 
            JSON.parse(localStorage.getItem('cart')) : [];

        renderCartGoods(cartArray)

        cart.style.display = 'flex';
    });

    closeBtn.addEventListener('click', function(){
        cart.style.display = '';
})

    cart.addEventListener('click', (event) => {
        if (!event.target.closest('.modal') && event.target.classList.contains('overlay')){
            cart.style.display = '';
        }
    })

    window.addEventListener('keydown', (event) => {
        if(e.key === 'Escape') {
            cart.style.display = ''
        }
    })



    if (goodsContainer) {
        goodsContainer.addEventListener('click', (event) => {
            if(event.currentTarget.closest('.add-to-cart')) {
                const buttonToCart = event.currentTarget.closest('.add-to-cart');
                const goodId = buttonToCart.dataset.id;

                addToCart(goodId);
            }
            
        })
   
}

cart()