function showToast(message, type) {
    var container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    var isSuccess = type === 'success';
    var icon = isSuccess ? '\u2713' : '\u2717';
    var title = isSuccess ? 'Success' : 'Error';
    var toast = document.createElement('div');
    toast.className = 'toast ' + (isSuccess ? 'success' : 'error');
    
    var toastHTML = '<span class="toast-icon ' + (isSuccess ? 'success' : 'error') + '">' + icon + '</span>';
    toastHTML += '<div class="toast-content">';
    toastHTML += '<div class="toast-title">' + title + '</div>';
    toastHTML += '<div class="toast-message">' + message + '</div>';
    toastHTML += '</div>';
    toastHTML += '<button class="toast-close">&times;</button>';
    toast.innerHTML = toastHTML;
    
    toast.querySelector('.toast-close').addEventListener('click', function() {
        removeToast(toast);
    });
    container.appendChild(toast);
    requestAnimationFrame(function() {
        toast.classList.add('show');
    });
    var autoDismiss = setTimeout(function() {
        removeToast(toast);
    }, 4000);
    toast._autoDismiss = autoDismiss;
}

function removeToast(toast) {
    if (toast._autoDismiss) {
        clearTimeout(toast._autoDismiss);
    }
    toast.classList.remove('show');
    toast.classList.add('hiding');
    setTimeout(function() {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

function validatePassword(password) {
    var symbolPattern = /[@!\/]/;
    var capitalPattern = /[A-Z]/;
    var errors = [];
    if (!password || password.trim() === '') {
        return ['Password is required'];
    }
    if (password.length > 15) {
        errors.push('Must not exceed 15 characters');
    }
    if (!symbolPattern.test(password)) {
        errors.push('Must contain at least 1 symbol (@, !, /)');
    }
    if (!capitalPattern.test(password)) {
        errors.push('Must contain at least 1 capital letter (A-Z)');
    }
    return errors;
}

function getPasswordValidationMessage(password) {
    var errors = validatePassword(password);
    if (errors.length === 0) return '';
    return 'Password Requirements:\n\u2022 ' + errors.join('\n\u2022 ');
}

function validateEmail(email) {
    if (!email || email.trim() === '') {
        return 'Email is required';
    }
    if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
        return 'Please enter a valid email address';
    }
    return '';
}

function validatePhone(phone) {
    if (!phone || phone.trim() === '') {
        return 'Phone number is required';
    }
    var phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
        return 'Phone number must be exactly 10 digits';
    }
    return '';
}

function showError(inputId, message) {
    var input = document.getElementById(inputId);
    if (!input) return;
    var parent = input.parentNode;
    if (!parent) return;
    var existingError = parent.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    if (message) {
        var errorSpan = document.createElement('span');
        errorSpan.className = 'error-message';
        errorSpan.textContent = message;
        parent.insertBefore(errorSpan, input.nextSibling);
        input.style.borderColor = '#e53935';
        input.classList.add('input-error');
        input.classList.remove('input-success');
    } else {
        input.style.borderColor = '#2e7d32';
        input.classList.remove('input-error');
        input.classList.add('input-success');
    }
}

function clearErrors(formId) {
    var form = document.getElementById(formId);
    if (form) {
        var errors = form.querySelectorAll('.error-message');
        for (var i = 0; i < errors.length; i++) {
            errors[i].remove();
        }
        var fields = form.querySelectorAll('input, select, textarea');
        for (var j = 0; j < fields.length; j++) {
            fields[j].style.borderColor = '#ccc';
            fields[j].classList.remove('input-error', 'input-success');
        }
    }
}

function updateCartCount() {
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    var count = 0;
    for (var i = 0; i < cart.length; i++) {
        count += cart[i].quantity;
    }
    var badge = document.getElementById('cartCount');
    if (badge) badge.textContent = count;
}

var loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        clearErrors('loginForm');
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        var emailError = validateEmail(email);
        var passwordError = '';
        if (!password || password.trim() === '') {
            passwordError = 'Password is required';
        }
        showError('email', emailError);
        showError('password', passwordError);
        if (emailError || passwordError) return;
        var pwErrors = validatePassword(password);
        if (pwErrors.length > 0) {
            showToast(getPasswordValidationMessage(password), 'error');
            return;
        }
        fetch('login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        })
        .then(function(res) { return res.json(); })
        .then(function(data) {
            if (data.success) {
                localStorage.setItem('name', data.name);
                localStorage.setItem('email', data.email);
                showToast(data.message, 'success');
                setTimeout(function() {
                    window.location.href = 'home2.html';
                }, 1200);
            } else {
                showToast(data.message, 'error');
            }
        })
        .catch(function() {
            showToast('Unable to connect to server. Make sure Apache & MySQL are running.', 'error');
        });
    });
}

var signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        clearErrors('signupForm');
        var name = document.getElementById('name').value;
        var email = document.getElementById('signupEmail').value;
        var phone = document.getElementById('phone').value;
        var password = document.getElementById('signupPassword').value;
        var confirm = document.getElementById('confirmPassword').value;
        var nameError = (name && name.trim() !== '') ? '' : 'Full name is required';
        var emailError = validateEmail(email);
        var phoneError = validatePhone(phone);
        var pwErrors = validatePassword(password);
        var confirmError = (confirm && confirm.trim() !== '') ? '' : 'Please confirm your password';
        showError('name', nameError);
        showError('signupEmail', emailError);
        showError('phone', phoneError);
        showError('confirmPassword', confirmError);
        if (pwErrors.length > 0) {
            showToast(getPasswordValidationMessage(password), 'error');
            return;
        }
        if (nameError || emailError || phoneError || confirmError) return;
        if (password !== confirm) {
            showToast('Passwords do not match. Please re-enter.', 'error');
            showError('confirmPassword', 'Passwords do not match');
            return;
        }
        fetch('register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name,
                email: email,
                phone: phone,
                password: password
            })
        })
        .then(function(res) { return res.json(); })
        .then(function(data) {
            if (data.success) {
                localStorage.setItem('name', data.name);
                localStorage.setItem('email', data.email);
                showToast(data.message, 'success');
                setTimeout(function() {
                    window.location.href = 'login2.html';
                }, 1500);
            } else {
                showToast(data.message, 'error');
            }
        })
        .catch(function() {
            showToast('Unable to connect to server. Make sure Apache & MySQL are running.', 'error');
        });
    });
}

var productImages = {
    "Fresh Apples": "https://tse2.mm.bing.net/th/id/OIP.3_BosVmdfve7m7g_XIJy9AHaHa?r=0&pid=Api&h=220&P=0",
    "Bananas": "https://tse1.mm.bing.net/th/id/OIP.pGEt--hBA6xKPN5qxASI8gAAAA?r=0&pid=Api&h=220&P=0",
    "Fresh Tomatoes": "https://tse3.mm.bing.net/th/id/OIP._VvJKJaEsGfCo7pU2j9ZDQHaHa?r=0&pid=Api&h=220&P=0",
    "Fresh Potatoes": "https://tse2.mm.bing.net/th/id/OIP.WMHwVWKKTLV3NyyWoU_1xwHaHa?r=0&pid=Api&h=220&P=0",
    "Amul Milk": "https://tse2.mm.bing.net/th/id/OIP.NAOJRhik1jHK3UJSzy0gWwHaHa?r=0&pid=Api&h=220&P=0",
    "India Gate Basmati Rice": "https://tse1.mm.bing.net/th/id/OIP.N3yXu26rjs9i9cnrSgguQQHaHa?r=0&pid=Api&h=220&P=0",
    "Farm Eggs": "https://tse1.mm.bing.net/th/id/OIP.0-tlwhqfN-26DYxYGGW0pQHaHa?r=0&pid=Api&h=220&P=0",
    "Whole Wheat Bread": "https://tse2.mm.bing.net/th/id/OIP.NDrxVC3ztUVAe_5scAwh1QHaHa?r=0&pid=Api&h=220&P=0",
    "Chocolate Cookies": "https://tse1.mm.bing.net/th/id/OIP.7FTXezKPW-2C_YEAsz_tyQHaHa?r=0&pid=Api&h=220&P=0",
    "Diet Coke": "https://tse1.mm.bing.net/th/id/OIP.36tNcIG3wD0cEem-U0lwtAHaHa?r=0&pid=Api&h=220&P=0",
    "Oranges": "https://tse1.mm.bing.net/th/id/OIP.zOuBzn-zZAuW_4xFiyaZ6gHaG3?r=0&pid=Api&h=220&P=0",
    "Grapes": "https://tse4.mm.bing.net/th/id/OIP.cFVllGbc7WQCBXvsDyCIQgHaHa?r=0&pid=Api&h=220&P=0",
    "Mangoes": "https://tse2.mm.bing.net/th/id/OIP.-hWHu_UlU39eWkXkq2B-BAHaHa?r=0&pid=Api&h=220&P=0",
    "Fresh Onions": "https://tse3.mm.bing.net/th/id/OIP.7zoV3hFW0N434hLj9Qux3AAAAA?r=0&pid=Api&h=220&P=0",
    "Fresh Carrots": "https://tse3.mm.bing.net/th/id/OIP.-nWRaFOsAKk0UXsvrWs7BwHaHa?r=0&pid=Api&h=220&P=0",
    "Fresh Cabbage": "https://tse1.mm.bing.net/th/id/OIP.pRKJcZfLFIo6wvVVtqvWnAHaHa?r=0&pid=Api&h=220&P=0",
    "Green Chilli": "https://tse2.mm.bing.net/th/id/OIP.xyQyh00Yy-k9mcZ5GezQfgHaHa?r=0&pid=Api&h=220&P=0",
    "Fresh Ginger": "https://tse3.mm.bing.net/th/id/OIP.yPDtqxfNKSsn-hB-Ky9QFwHaHa?r=0&pid=Api&h=220&P=0",
    "Fresh Garlic": "https://static.vecteezy.com/system/resources/previews/027/216/058/original/garlic-garlic-garlic-transparent-background-ai-generated-free-png.png",
    "Amul Cheese": "https://tse2.mm.bing.net/th/id/OIP.RU4YRp1WE4DxoqWpxv26pAHaHa?r=0&pid=Api&h=220&P=0",
    "Amul Butter": "https://tse3.mm.bing.net/th/id/OIP.9C-YbsGUkwnZduVAdvl0xwHaHa?r=0&pid=Api&h=220&P=0",
    "Amul Paneer": "https://tse1.mm.bing.net/th/id/OIP.qB3J2W2x3GBGXv-kwOqfVAHaHa?r=0&pid=Api&h=220&P=0",
    "Amul Masti Dahi": "https://tse4.mm.bing.net/th/id/OIP.EdN9A6E1YOrYujzhF3v9OwHaHa?r=0&pid=Api&h=220&P=0",
    "Chocolate Cake": "https://tse3.mm.bing.net/th/id/OIP.Z8yZNCq_OkkRvPycpL4EIQHaHa?r=0&pid=Api&h=220&P=0",
    "Milk Bikis": "https://tse4.mm.bing.net/th/id/OIP.z-t5NDJgyWYsEfl7mWxOXwHaHa?r=0&pid=Api&h=220&P=0",
    "Chocolate Donut": "https://tse4.mm.bing.net/th/id/OIP.SQIicSkz8_C3NLoZiwnBkQHaHa?r=0&pid=Api&h=220&P=0",
    "Tropicana Orange Juice": "https://tse3.mm.bing.net/th/id/OIP.hzAexfaEVddew-OWPWSmsQHaHa?r=0&pid=Api&h=220&P=0",
    "Pepsi": "https://tse3.mm.bing.net/th/id/OIP.1sb-hqzkyxQyFBwEg_lruwHaHa?r=0&pid=Api&h=220&P=0",
    "Sprite": "https://tse2.mm.bing.net/th/id/OIP.UFkOHlN1jFFzMZrYOQTppwHaHa?r=0&pid=Api&h=220&P=0",
    "Maaza": "https://tse4.mm.bing.net/th/id/OIP.MGOStm0orsIpGUSpZ07QagHaHa?r=0&pid=Api&h=220&P=0",
    "Uncle Chips": "https://tse2.mm.bing.net/th/id/OIP.nsYZ-OnB2M9v9HlHqOavngHaHa?r=0&pid=Api&h=220&P=0",
    "Dairy Milk Chocolate": "https://tse4.mm.bing.net/th/id/OIP.xj9xeMNXw9TmIKWffLCccQHaHa?r=0&pid=Api&h=220&P=0",
    "Maggi": "https://tse3.mm.bing.net/th/id/OIP.9iKopH0hipspm7R1FO7Z4QAAAA?r=0&pid=Api&h=220&P=0",
    "ACT II Popcorn": "https://tse1.mm.bing.net/th/id/OIP.RJ-glp6s6uxPb8INtuJdMQHaHa?r=0&pid=Api&h=220&P=0",
    "Bikaji Aloo Bhujia": "https://tse4.mm.bing.net/th/id/OIP.KleRjrdRNOas7fe7kiYGRgHaHa?r=0&pid=Api&h=220&P=0",
    "Kurkure Masala Munch": "https://tse2.mm.bing.net/th/id/OIP.KHMw_c_92Oin3Q4CFCvJQQHaHa?r=0&pid=Api&h=220&P=0",
    "KitKat": "https://tse3.mm.bing.net/th/id/OIP.AoPdYHmiI8tpe7ca41s3HwHaHa?r=0&pid=Api&h=220&P=0",
    "Bikaji Nut Cracker": "https://tse2.mm.bing.net/th/id/OIP.2Rxmat7lv7wBGgb1Nbe9dgAAAA?r=0&pid=Api&h=220&P=0"
};

function addToCart(name, price, imageUrl) {
    if (!name || name.trim() === '') {
        showToast('Cannot add to cart: Product name is missing.', 'error');
        return;
    }
    if (price === undefined || price === null || isNaN(price) || price <= 0) {
        showToast('Cannot add to cart: Invalid product price.', 'error');
        return;
    }
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    var found = null;
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].name === name) {
            found = cart[i];
            break;
        }
    }
    if (found) {
        found.quantity++;
    } else {
        var image = imageUrl || productImages[name] || '';
        cart.push({
            name: name,
            price: price,
            quantity: 1,
            image: image
        });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast(name + ' added to cart! \uD83D\uDED2', 'success');
}

function searchProduct() {
    var input = document.getElementById('searchInput').value.toUpperCase();
    var products = document.getElementsByClassName('product-card');
    for (var i = 0; i < products.length; i++) {
        var title = products[i].getElementsByTagName('h3')[0];
        var value = title.textContent || title.innerText;
        if (value.toUpperCase().indexOf(input) > -1) {
            products[i].style.display = 'block';
        } else {
            products[i].style.display = 'none';
        }
    }
}

function displayCart() {
    updateCartCount();
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    var table = document.getElementById('cartBody');
    var summaryContainer = document.getElementById('orderSummary');
    var totalPriceEl = document.getElementById('totalPrice');
    var couponInput = document.getElementById('coupon');
    
    var appliedCouponCode = localStorage.getItem('appliedCoupon');
    if (appliedCouponCode && couponInput) {
        couponInput.disabled = true;
        var couponBtn = document.querySelector('.coupon-box button');
        if (couponBtn) {
            couponBtn.textContent = 'Applied \u2713';
            couponBtn.style.background = '#1b5e20';
        }
    }

    if (table) {
        table.innerHTML = '';
        var subtotal = 0;
        for (var i = 0; i < cart.length; i++) {
            var item = cart[i];
            var itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            var imgSrc = item.image || productImages[item.name] || 'https://via.placeholder.com/80';
            var row = document.createElement('tr');
            row.className = 'cart-item-row';
            row.innerHTML = '<td class="cart-product-cell"><img src="' + imgSrc + '" alt="' + item.name + '" class="cart-thumb" onerror="this.src=\'https://via.placeholder.com/80\'"><span class="cart-product-name">' + item.name + '</span></td><td>\u20B9' + item.price + '</td><td><div class="quantity"><button onclick="decreaseQty(' + i + ')">-</button><span>' + item.quantity + '</span><button onclick="increaseQty(' + i + ')">+</button></div></td><td>\u20B9' + itemTotal + '</td><td><button class="remove-btn" onclick="removeItem(' + i + ')"><i class="fa-solid fa-trash-can"></i> Remove</button></td>';
            table.appendChild(row);
        }
    }

    var subtotal = 0;
    for (var k = 0; k < cart.length; k++) {
        subtotal += cart[k].price * cart[k].quantity;
    }
    var discountAmount = 0;
    var shipping = 0;
    var appliedCoupon = localStorage.getItem('appliedCoupon') || '';
    var couponDiscount = parseFloat(localStorage.getItem('couponDiscount')) || 0;
    var freeShipping = localStorage.getItem('freeShipping') === 'true';

    if (appliedCoupon) {
        discountAmount = Math.round(subtotal * (couponDiscount / 100));
    }
    if (subtotal > 0 && !freeShipping) {
        shipping = subtotal >= 200 ? 0 : 40;
    }
    var grandTotal = subtotal - discountAmount + shipping;
    if (grandTotal < 0) grandTotal = 0;

    if (totalPriceEl) {
        totalPriceEl.innerHTML = 'Grand Total: \u20B9' + grandTotal;
    }

    if (summaryContainer) {
        var summaryHTML = '<h3>Order Summary</h3>';
        summaryHTML += '<div class="summary-row"><span>Items (' + cart.length + ')</span><span>\u20B9' + subtotal + '</span></div>';
        if (discountAmount > 0) {
            summaryHTML += '<div class="summary-row discount-row"><span>Discount (' + appliedCoupon + ')</span><span>-\u20B9' + discountAmount + '</span></div>';
        }
        summaryHTML += '<div class="summary-row"><span>Shipping</span><span>';
        if (shipping === 0 && subtotal > 0) {
            summaryHTML += '<span class="free-shipping">FREE</span>';
        } else {
            summaryHTML += '\u20B9' + shipping;
        }
        summaryHTML += '</span></div>';
        summaryHTML += '<div class="summary-divider"></div>';
        summaryHTML += '<div class="summary-row summary-total"><span>Grand Total</span><span>\u20B9' + grandTotal + '</span></div>';
        if (cart.length === 0) {
            summaryHTML += '<p class="empty-cart-msg">Your cart is empty!</p>';
        }
        summaryContainer.innerHTML = summaryHTML;
    }
}

function removeItem(index) {
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

function increaseQty(index) {
    var cart = JSON.parse(localStorage.getItem('cart'));
    if (cart && cart[index]) {
        cart[index].quantity++;
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
    }
}

function decreaseQty(index) {
    var cart = JSON.parse(localStorage.getItem('cart'));
    if (cart && cart[index]) {
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
        } else {
            cart.splice(index, 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
    }
}

var couponCodes = {
    'VEGI20': { discount: 20, label: '20% OFF' },
    'FRESH15': { discount: 15, label: '15% OFF' },
    'WELCOME10': { discount: 10, label: '10% OFF' },
    'FREESHIP': { discount: 0, label: 'Free Shipping', freeShipping: true }
};

function applyCoupon() {
    var code = document.getElementById('coupon').value.trim().toUpperCase();
    var couponBtn = document.querySelector('.coupon-box button');
    if (!code) {
        showToast('Please enter a coupon code.', 'error');
        return;
    }
    var coupon = couponCodes[code];
    if (coupon) {
        localStorage.setItem('appliedCoupon', code);
        localStorage.setItem('couponDiscount', coupon.discount);
        localStorage.setItem('freeShipping', coupon.freeShipping || false);
        if (coupon.freeShipping) {
            showToast('FREE SHIPPING applied! \uD83D\uDE9A', 'success');
        } else {
            showToast(coupon.label + ' applied successfully! \uD83C\uDF89', 'success');
        }
        if (couponBtn) {
            couponBtn.textContent = 'Applied \u2713';
            couponBtn.style.background = '#1b5e20';
        }
        document.getElementById('coupon').disabled = true;
        displayCart();
    } else {
        showToast('Invalid coupon code. Try: VEGI20, FRESH15, WELCOME10, FREESHIP', 'error');
    }
}

function validateAddressField(fieldId, errorMsg) {
    var field = document.getElementById(fieldId);
    if (!field) return 'Field not found';
    var value = field.value.trim();
    var error = '';
    if (!value) {
        error = errorMsg + ' is required';
    }
    showError(fieldId, error);
    return error;
}

function validatePincode(pincode) {
    if (!/^\d{6}$/.test(pincode)) {
        return 'Pincode must be exactly 6 digits';
    }
    return '';
}

function placeOrder(e) {
    e.preventDefault();
    clearErrors('checkoutForm');

    var valid = true;

    var nameErr = validateAddressField('fullName', 'Full Name');
    if (nameErr) valid = false;

    var phoneVal = document.getElementById('phoneNumber') ? document.getElementById('phoneNumber').value.trim() : '';
    var phoneErr = validatePhone(phoneVal);
    showError('phoneNumber', phoneErr);
    if (phoneErr) valid = false;

    var emailVal = document.getElementById('emailAddress') ? document.getElementById('emailAddress').value.trim() : '';
    var emailErr = validateEmail(emailVal);
    showError('emailAddress', emailErr);
    if (emailErr) valid = false;

    var houseErr = validateAddressField('houseNo', 'House / Building');
    if (houseErr) valid = false;

    var streetErr = validateAddressField('street', 'Street / Locality');
    if (streetErr) valid = false;

    var cityErr = validateAddressField('city', 'City');
    if (cityErr) valid = false;

    var districtErr = validateAddressField('district', 'District');
    if (districtErr) valid = false;

    var stateEl = document.getElementById('state');
    var stateVal = stateEl ? stateEl.value : '';
    if (!stateVal) {
        showError('state', 'Please select a state');
        valid = false;
    } else {
        showError('state', '');
    }

    var pincodeVal = document.getElementById('pincode') ? document.getElementById('pincode').value.trim() : '';
    var pincodeErr = validatePincode(pincodeVal);
    showError('pincode', pincodeErr);
    if (pincodeErr) valid = false;

    var paymentEl = document.getElementById('paymentMethod');
    var paymentVal = paymentEl ? paymentEl.value : '';
    if (!paymentVal) {
        showError('paymentMethod', 'Please select a payment method');
        valid = false;
    } else {
        showError('paymentMethod', '');
    }

    if (!valid) {
        showToast('Please fix all errors before placing the order.', 'error');
        return;
    }

    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        showToast('Your cart is empty! Add items before ordering.', 'error');
        return;
    }

    var orderId = 'VK' + Date.now().toString().slice(-8);
    var deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    var dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var dateStr = deliveryDate.toLocaleDateString('en-IN', dateOptions);

    var houseVal = document.getElementById('houseNo').value.trim();
    var streetVal = document.getElementById('street').value.trim();
    var landmarkEl = document.getElementById('landmark');
    var landmarkVal = landmarkEl ? landmarkEl.value.trim() : '';
    var cityVal = document.getElementById('city').value.trim();
    var districtVal = document.getElementById('district').value.trim();
    var stateVal2 = document.getElementById('state').value;
    var pincodeVal2 = document.getElementById('pincode').value.trim();

    var addressStr = houseVal + ', ' + streetVal;
    if (landmarkVal) addressStr += ', near ' + landmarkVal;
    addressStr += ', ' + cityVal + ', ' + districtVal + ', ' + stateVal2 + ' - ' + pincodeVal2;

    var customerName = document.getElementById('fullName').value.trim();

    showOrderSuccessPopup(orderId, dateStr, addressStr, customerName);

    localStorage.removeItem('cart');
    localStorage.removeItem('appliedCoupon');
    localStorage.removeItem('couponDiscount');
    localStorage.removeItem('freeShipping');
    updateCartCount();
    displayCart();
}

function showOrderSuccessPopup(orderId, deliveryDate, address, customerName) {
    var existing = document.querySelector('.order-popup-overlay');
    if (existing) existing.remove();

    var overlay = document.createElement('div');
    overlay.className = 'order-popup-overlay';
    
    var overlayHTML = '';
    overlayHTML += '<div class="order-popup">';
    overlayHTML += '<div class="popup-checkmark"><div class="checkmark-circle"><i class="fa-solid fa-check"></i></div>';
    overlayHTML += '<h2>Order Placed Successfully! \uD83C\uDF89</h2>';
    overlayHTML += '<p class="popup-thanks">Thank you, <strong>' + customerName + '</strong>!</p>';
    overlayHTML += '<div class="popup-details">';
    overlayHTML += '<div class="popup-row"><span class="popup-label">Order ID</span><span class="popup-value order-id">' + orderId + '</span></div>';
    overlayHTML += '<div class="popup-row"><span class="popup-label">Delivery Date</span><span class="popup-value">' + deliveryDate + '</span></div>';
    overlayHTML += '<div class="popup-row"><span class="popup-label">Delivery Address</span><span class="popup-value">' + address + '</span></div>';
    overlayHTML += '<div class="popup-row"><span class="popup-label">Payment</span><span class="popup-value">Cash on Delivery</span></div>';
    overlayHTML += '</div>';
    overlayHTML += '<div class="popup-actions">';
    overlayHTML += '<button class="popup-btn popup-btn-primary" onclick="closeOrderPopup()">Continue Shopping</button>';
    overlayHTML += '<button class="popup-btn popup-btn-secondary" onclick="closeOrderPopup()">View Orders</button>';
    overlayHTML += '</div>';
    overlayHTML += '</div>';

    overlay.innerHTML = overlayHTML;
    document.body.appendChild(overlay);

    setTimeout(function() {
        overlay.classList.add('show');
    }, 100);
}

function closeOrderPopup() {
    var overlay = document.querySelector('.order-popup-overlay');
    if (overlay) {
        overlay.classList.remove('show');
        setTimeout(function() {
            overlay.remove();
            window.location.href = 'home2.html';
        }, 400);
    } else {
        window.location.href = 'home2.html';
    }
}

