// Doi sang dinh dang tien VND
function vnd(price) {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

// Close popup 
const body = document.querySelector("body");
let modalContainer = document.querySelectorAll('.modal');
let modalBox = document.querySelectorAll('.mdl-cnt');
let formLogSign = document.querySelector('.forms');

// Click vùng ngoài sẽ tắt Popup
modalContainer.forEach(item => {
    item.addEventListener('click', closeModal);
});

modalBox.forEach(item => {
    item.addEventListener('click', function (event) {
        event.stopPropagation();
    })
});

function closeModal() {
    modalContainer.forEach(item => {
        item.classList.remove('open');
    });
    console.log(modalContainer)
    body.style.overflow = "auto";
}

function increasingNumber(e) {
    let qty = e.parentNode.querySelector('.input-qty');
    if (parseInt(qty.value) < qty.max) {
        qty.value = parseInt(qty.value) + 1;
    } else {
        qty.value = qty.max;
    }
}

function decreasingNumber(e) {
    let qty = e.parentNode.querySelector('.input-qty');
    if (qty.value > qty.min) {
        qty.value = parseInt(qty.value) - 1;
    } else {
        qty.value = qty.min;
    }
}

//Xem chi tiet san pham
function detailProduct(index) {
    let modal = document.querySelector('.modal.product-detail');
    let products = JSON.parse(localStorage.getItem('products'));
    event.preventDefault();
    let infoProduct = products.find(sp => {
        return sp.id === index;
    })

    let modalHtml = `<div class="modal-header">
    <img class="product-image" src="${infoProduct.img}" alt="">
    </div>
    <div class="modal-body">
        <h2 class="product-title">${infoProduct.title}</h2>
        <div class="product-control">
            <div class="priceBox">
                <span class="current-price">${vnd(infoProduct.price)}</span>
            </div>
            <div class="buttons_added">
                <input class="minus is-form" type="button" value="-" onclick="decreasingNumber(this)">
                <input class="input-qty" max="100" min="1" name="" type="number" value="1">
                <input class="plus is-form" type="button" value="+" onclick="increasingNumber(this)">
            </div>
        </div>
        <p class="product-description">${infoProduct.desc}</p>
    </div>
    <div class="notebox">
            <p class="notebox-title">Ghi chú</p>
            <textarea class="text-note" id="popup-detail-note" placeholder="Nhập thông tin cần lưu ý..."></textarea>
    </div>
    <div class="modal-footer">
        <div class="price-total">
            <span class="thanhtien">Thành tiền</span>
            <span class="price">${vnd(infoProduct.price)}</span>
        </div>
        <div class="modal-footer-control">
            <button class="button-dathangngay" data-product="${infoProduct.id}">Đặt hàng ngay</button>
            <button class="button-dat" id="add-cart" onclick="animationCart()"><i class="fa-light fa-basket-shopping"></i></button>
        </div>
    </div>`;
    document.querySelector('#product-detail-content').innerHTML = modalHtml;
    modal.classList.add('open');
    body.style.overflow = "hidden";

    //Cap nhat gia tien khi tang so luong san pham
    let tgbtn = document.querySelectorAll('.is-form');
    let qty = document.querySelector('.product-control .input-qty');
    let priceText = document.querySelector('.price');
    tgbtn.forEach(element => {
        element.addEventListener('click', () => {
            let price = infoProduct.price * parseInt(qty.value);
            priceText.innerHTML = vnd(price);
        });
    });
    // Them san pham vao gio hang
    let productbtn = document.querySelector('.button-dat');
    productbtn.addEventListener('click', (e) => {
        if (localStorage.getItem('currentuser')) {
            addCart(infoProduct.id);
        } else {
            toast({ title: 'Warning', message: 'Chưa đăng nhập tài khoản !', type: 'warning', duration: 3000 });
        }

    })
    // Mua ngay san pham
    dathangngay();
}


function animationCart() {
    document.querySelector(".count-product-cart").style.animation = "slidein ease 1s"
    setTimeout(()=>{
        document.querySelector(".count-product-cart").style.animation = "none"
    },1000)
}

// Them SP vao gio hang
function addCart(index) {
    let currentuser = localStorage.getItem('currentuser') ? JSON.parse(localStorage.getItem('currentuser')) : [];
    let soluong = document.querySelector('.input-qty').value;
    let popupDetailNote = document.querySelector('#popup-detail-note').value;
    let note = popupDetailNote == "" ? "Không có ghi chú" : popupDetailNote;
    let productcart = {
        id: index,
        soluong: parseInt(soluong),
        note: note
    }
    let vitri = currentuser.cart.findIndex(item => item.id == productcart.id);
    if (vitri == -1) {
        currentuser.cart.push(productcart);
    } else {
        currentuser.cart[vitri].soluong = parseInt(currentuser.cart[vitri].soluong) + parseInt(productcart.soluong);
    }
    localStorage.setItem('currentuser', JSON.stringify(currentuser));
    updateAmount();
    closeModal();
    // toast({ title: 'Success', message: 'Thêm thành công sản phẩm vào giỏ hàng', type: 'success', duration: 3000 });
}

//Show gio hang
function showCart() {
    if (localStorage.getItem('currentuser') != null) {
        let currentuser = JSON.parse(localStorage.getItem('currentuser'));
        if (currentuser.cart.length != 0) {
            document.querySelector('.gio-hang-trong').style.display = 'none';
            document.querySelector('button.thanh-toan').classList.remove('disabled');
            let productcarthtml = '';
            currentuser.cart.forEach(item => {
                let product = getProduct(item);
                productcarthtml += `<li class="cart-item" data-id="${product.id}">
                <div class="cart-item-info">
                    <p class="cart-item-title">
                        ${product.title}
                    </p>
                    <span class="cart-item-price price" data-price="${product.price}">
                    ${vnd(parseInt(product.price))}
                    </span>
                </div>
                <p class="product-note"><i class="fa-light fa-pencil"></i><span>${product.note}</span></p>
                <div class="cart-item-control">
                    <button class="cart-item-delete" onclick="deleteCartItem(${product.id},this)">Xóa</button>
                    <div class="buttons_added">
                        <input class="minus is-form" type="button" value="-" onclick="decreasingNumber(this)">
                        <input class="input-qty" max="100" min="1" name="" type="number" value="${product.soluong}">
                        <input class="plus is-form" type="button" value="+" onclick="increasingNumber(this)">
                    </div>
                </div>
            </li>`
            });
            document.querySelector('.cart-list').innerHTML = productcarthtml;
            updateCartTotal();
            saveAmountCart();
        } else {
            document.querySelector('.gio-hang-trong').style.display = 'flex'
        }
    }
    let modalCart = document.querySelector('.modal-cart');
    let containerCart = document.querySelector('.cart-container');
    let themmon = document.querySelector('.them-mon');
    modalCart.onclick = function () {
        closeCart();
    }
    themmon.onclick = function () {
        closeCart();
    }
    containerCart.addEventListener('click', (e) => {
        e.stopPropagation();
    })
}

// Delete cart item
function deleteCartItem(id, el) {
    let cartParent = el.parentNode.parentNode;
    cartParent.remove();
    let currentUser = JSON.parse(localStorage.getItem('currentuser'));
    let vitri = currentUser.cart.findIndex(item => item.id = id)
    currentUser.cart.splice(vitri, 1);

    // Nếu trống thì hiển thị giỏ hàng trống
    if (currentUser.cart.length == 0) {
        document.querySelector('.gio-hang-trong').style.display = 'flex';
        document.querySelector('button.thanh-toan').classList.add('disabled');
    }
    localStorage.setItem('currentuser', JSON.stringify(currentUser));
    updateCartTotal();
}

//Update cart total
function updateCartTotal() {
    document.querySelector('.text-price').innerText = vnd(getCartTotal());
}

// Lay tong tien don hang
function getCartTotal() {
    let currentUser = JSON.parse(localStorage.getItem('currentuser'));
    let tongtien = 0;
    if (currentUser != null) {
        currentUser.cart.forEach(item => {
            let product = getProduct(item);
            tongtien += (parseInt(product.soluong) * parseInt(product.price));
        });
    }
    return tongtien;
}

// Get Product 
function getProduct(item) {
    let products = JSON.parse(localStorage.getItem('products'));
    let infoProductCart = products.find(sp => item.id == sp.id)
    let product = {
        ...infoProductCart,
        ...item
    }
    return product;
}

window.onload = updateAmount();
window.onload = updateCartTotal();

// Lay so luong hang

function getAmountCart() {
    let currentuser = JSON.parse(localStorage.getItem('currentuser'))
    let amount = 0;
    currentuser.cart.forEach(element => {
        amount += parseInt(element.soluong);
    });
    return amount;
}

//Update Amount Cart 
function updateAmount() {
    if (localStorage.getItem('currentuser') != null) {
        let amount = getAmountCart();
        document.querySelector('.count-product-cart').innerText = amount;
    }
}

// Save Cart Info
function saveAmountCart() {
    let cartAmountbtn = document.querySelectorAll(".cart-item-control .is-form");
    let listProduct = document.querySelectorAll('.cart-item');
    let currentUser = JSON.parse(localStorage.getItem('currentuser'));
    cartAmountbtn.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            let id = listProduct[parseInt(index / 2)].getAttribute("data-id");
            let productId = currentUser.cart.find(item => {
                return item.id == id;
            });
            productId.soluong = parseInt(listProduct[parseInt(index / 2)].querySelector(".input-qty").value);
            localStorage.setItem('currentuser', JSON.stringify(currentUser));
            updateCartTotal();
        })
    });
}

// Open & Close Cart
function openCart() {
    showCart();
    document.querySelector('.modal-cart').classList.add('open');
    body.style.overflow = "hidden";
}

function closeCart() {
    document.querySelector('.modal-cart').classList.remove('open');
    body.style.overflow = "auto";
    updateAmount();
}

// Open Search Advanced
document.querySelector(".filter-btn").addEventListener("click",(e) => {
    e.preventDefault();
    document.querySelector(".advanced-search").classList.toggle("open");
    document.getElementById("home-service").scrollIntoView();
})

document.querySelector(".form-search-input").addEventListener("click",(e) => {
    e.preventDefault();
    document.getElementById("home-service").scrollIntoView();
})

function closeSearchAdvanced() {
    document.querySelector(".advanced-search").classList.toggle("open");
}

//Open Search Mobile 
function openSearchMb() {
    document.querySelector(".header-middle-left").style.display = "none";
    document.querySelector(".header-middle-center").style.display = "block";
    document.querySelector(".header-middle-right-item.close").style.display = "block";
    let liItem = document.querySelectorAll(".header-middle-right-item.open");
    for(let i = 0; i < liItem.length; i++) {
        liItem[i].style.setProperty("display", "none", "important")
    }
}

//Close Search Mobile 
function closeSearchMb() {
    document.querySelector(".header-middle-left").style.display = "block";
    document.querySelector(".header-middle-center").style.display = "none";
    document.querySelector(".header-middle-right-item.close").style.display = "none";
    let liItem = document.querySelectorAll(".header-middle-right-item.open");
    for(let i = 0; i < liItem.length; i++) {
        liItem[i].style.setProperty("display", "block", "important")
    }
}

//Signup && Login Form

// Chuyen doi qua lai SignUp & Login 
let signup = document.querySelector('.signup-link');
let login = document.querySelector('.login-link');
let container = document.querySelector('.signup-login .modal-container');
login.addEventListener('click', () => {
    container.classList.add('active');
})

signup.addEventListener('click', () => {
    container.classList.remove('active');
})

let signupbtn = document.getElementById('signup');
let loginbtn = document.getElementById('login');
let formsg = document.querySelector('.modal.signup-login')
signupbtn.addEventListener('click', () => {
    formsg.classList.add('open');
    container.classList.remove('active');
    body.style.overflow = "hidden";
})

loginbtn.addEventListener('click', () => {
    document.querySelector('.form-message-check-login').innerHTML = '';
    formsg.classList.add('open');
    container.classList.add('active');
    body.style.overflow = "hidden";
})

// Dang nhap & Dang ky

// Chức năng đăng ký
let signupButton = document.getElementById('signup-button');
let loginButton = document.getElementById('login-button');
signupButton.addEventListener('click', () => {
    event.preventDefault();
    let fullNameUser = document.getElementById('fullname').value;
    let phoneUser = document.getElementById('phone').value;
    let passwordUser = document.getElementById('password').value;
    let passwordConfirmation = document.getElementById('password_confirmation').value;
    let checkSignup = document.getElementById('checkbox-signup').checked;
    // Check validate
    if (fullNameUser.length == 0) {
        document.querySelector('.form-message-name').innerHTML = 'Vui lòng nhập họ vâ tên';
        document.getElementById('fullname').focus();
    } else if (fullNameUser.length < 3) {
        document.getElementById('fullname').value = '';
        document.querySelector('.form-message-name').innerHTML = 'Vui lòng nhập họ và tên lớn hơn 3 kí tự';
    } else {
        document.querySelector('.form-message-name').innerHTML = '';
    }
    if (phoneUser.length == 0) {
        document.querySelector('.form-message-phone').innerHTML = 'Vui lòng nhập vào số điện thoại';
    } else if (phoneUser.length != 10) {
        document.querySelector('.form-message-phone').innerHTML = 'Vui lòng nhập vào số điện thoại 10 số';
        document.getElementById('phone').value = '';
    } else {
        document.querySelector('.form-message-phone').innerHTML = '';
    }
    if (passwordUser.length == 0) {
        document.querySelector('.form-message-password').innerHTML = 'Vui lòng nhập mật khẩu';
    } else if (passwordUser.length < 6) {
        document.querySelector('.form-message-password').innerHTML = 'Vui lòng nhập mật khẩu lớn hơn 6 kí tự';
        document.getElementById('password').value = '';
    } else {
        document.querySelector('.form-message-password').innerHTML = '';
    }
    if (passwordConfirmation.length == 0) {
        document.querySelector('.form-message-password-confi').innerHTML = 'Vui lòng nhập lại mật khẩu';
    } else if (passwordConfirmation !== passwordUser) {
        document.querySelector('.form-message-password-confi').innerHTML = 'Mật khẩu không khớp';
        document.getElementById('password_confirmation').value = '';
    } else {
        document.querySelector('.form-message-password-confi').innerHTML = '';
    }
    if (checkSignup != true) {
        document.querySelector('.form-message-checkbox').innerHTML = 'Vui lòng check đăng ký';
    } else {
        document.querySelector('.form-message-checkbox').innerHTML = '';
    }

    if (fullNameUser && phoneUser && passwordUser && passwordConfirmation && checkSignup) {
        if (passwordConfirmation == passwordUser) {
            let user = {
                fullname: fullNameUser,
                phone: phoneUser,
                password: passwordUser,
                address: '',
                email: '',
                status: 1,
                join: new Date(),
                cart: [],
                userType: 0
            }
            let accounts = localStorage.getItem('accounts') ? JSON.parse(localStorage.getItem('accounts')) : [];
            let checkloop = accounts.some(account => {
                return account.phone == user.phone;
            })
            if (!checkloop) {
                accounts.push(user);
                localStorage.setItem('accounts', JSON.stringify(accounts));
                localStorage.setItem('currentuser', JSON.stringify(user));
                toast({ title: 'Thành công', message: 'Tạo thành công tài khoản !', type: 'success', duration: 3000 });
                closeModal();
                kiemtradangnhap();
                updateAmount();
            } else {
                toast({ title: 'Thất bại', message: 'Tài khoản đã tồn tại !', type: 'error', duration: 3000 });
            }
        } else {
            toast({ title: 'Thất bại', message: 'Sai mật khẩu !', type: 'error', duration: 3000 });
        }
    }
}
)

// Dang nhap
loginButton.addEventListener('click', () => {
    event.preventDefault();
    let phonelog = document.getElementById('phone-login').value;
    let passlog = document.getElementById('password-login').value;
    let accounts = JSON.parse(localStorage.getItem('accounts'));

    if (phonelog.length == 0) {
        document.querySelector('.form-message.phonelog').innerHTML = 'Vui lòng nhập vào số điện thoại';
    } else if (phonelog.length != 10) {
        document.querySelector('.form-message.phonelog').innerHTML = 'Vui lòng nhập vào số điện thoại 10 số';
        document.getElementById('phone-login').value = '';
    } else {
        document.querySelector('.form-message.phonelog').innerHTML = '';
    }

    if (passlog.length == 0) {
        document.querySelector('.form-message-check-login').innerHTML = 'Vui lòng nhập mật khẩu';
    } else if (passlog.length < 6) {
        document.querySelector('.form-message-check-login').innerHTML = 'Vui lòng nhập mật khẩu lớn hơn 6 kí tự';
        document.getElementById('passwordlogin').value = '';
    } else {
        document.querySelector('.form-message-check-login').innerHTML = '';
    }

    if (phonelog && passlog) {
        let vitri = accounts.findIndex(item => item.phone == phonelog);
        if (vitri == -1) {
            toast({ title: 'Error', message: 'Tài khoản của bạn không tồn tại', type: 'error', duration: 3000 });
        } else if (accounts[vitri].password == passlog) {
            if(accounts[vitri].status == 0) {
                toast({ title: 'Warning', message: 'Tài khoản của bạn đã bị khóa', type: 'warning', duration: 3000 });
            } else {
                localStorage.setItem('currentuser', JSON.stringify(accounts[vitri]));
                toast({ title: 'Success', message: 'Đăng nhập thành công', type: 'success', duration: 3000 });
                closeModal();
                kiemtradangnhap();
                checkAdmin();
                updateAmount();
            }
        } else {
            toast({ title: 'Warning', message: 'Sai mật khẩu', type: 'warning', duration: 3000 });
        }
    }
})

function kiemtradangnhap() {
    let currentUser = localStorage.getItem('currentuser');
    if (currentUser != null) {
        let user = JSON.parse(currentUser);
        
        // Kiểm tra nếu user.coins chưa được khởi tạo thì khởi tạo với giá trị 0
        if (user.coins === undefined) {
            user.coins = 0;
            localStorage.setItem('currentuser', JSON.stringify(user));
        }
        
        document.querySelector('.auth-container').innerHTML = `<span class="text-dndk">Tài khoản</span>
            <span class="text-tk">${user.fullname} <i class="fa-sharp fa-solid fa-caret-down"></span>`
        document.querySelector('.header-middle-right-menu').innerHTML = `<li><a href="javascript:;" onclick="myAccount()"><i class="fa-light fa-circle-user"></i> Tài khoản của tôi</a></li>
            <li><a href="javascript:;" onclick="orderHistory()"><i class="fa-regular fa-bags-shopping"></i> Đơn hàng đã mua</a></li>
            <li class="coins-section">
        <p>Số dư xu : <span id="coin-balance">0</span></p>
        <button id="watch-ad-btn">Xem quảng cáo để nhận xu</button>
        </li>
            <li class="border"><a id="logout" href="javascript:;"><i class="fa-light fa-right-from-bracket"></i> Thoát tài khoản</a></li>`
        document.querySelector('#logout').addEventListener('click', logOut);
        
        // Cập nhật số xu ngay khi đăng nhập
        updateCoinBalance();
        document.getElementById('watch-ad-btn').addEventListener('click', watchAd);
    }
}



function logOut() {
    let accounts = JSON.parse(localStorage.getItem('accounts'));
    user = JSON.parse(localStorage.getItem('currentuser'));
    let vitri = accounts.findIndex(item => item.phone == user.phone)
    accounts[vitri].cart.length = 0;
    for (let i = 0; i < user.cart.length; i++) {
        accounts[vitri].cart[i] = user.cart[i];
    }
    localStorage.setItem('accounts', JSON.stringify(accounts));
    localStorage.removeItem('currentuser');
    window.location = "/";
}

function checkAdmin() {
    let user = JSON.parse(localStorage.getItem('currentuser'));
    if(user && user.userType == 1) {
        let node = document.createElement(`li`);
        node.innerHTML = `<a href="./admin.html"><i class="fa-light fa-gear"></i> Quản lý cửa hàng</a>`
        document.querySelector('.header-middle-right-menu').prepend(node);
    } 
}

window.onload = kiemtradangnhap();
window.onload = checkAdmin();

// Chuyển đổi trang chủ và trang thông tin tài khoản
function myAccount() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('trangchu').classList.add('hide');
    document.getElementById('order-history').classList.remove('open');
    document.getElementById('account-user').classList.add('open');
    userInfo();
}

// Chuyển đổi trang chủ và trang xem lịch sử đặt hàng 
function orderHistory() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('account-user').classList.remove('open');
    document.getElementById('trangchu').classList.add('hide');
    document.getElementById('order-history').classList.add('open');
    renderOrderProduct();
}

function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function userInfo() {
    let user = JSON.parse(localStorage.getItem('currentuser'));
    document.getElementById('infoname').value = user.fullname;
    document.getElementById('infophone').value = user.phone;
    document.getElementById('infoemail').value = user.email;
    document.getElementById('infoaddress').value = user.address;
    if (user.email == undefined) {
        infoemail.value = '';
    }
    if (user.address == undefined) {
        infoaddress.value = '';
    }
}

// Thay doi thong tin
function changeInformation() {
    let accounts = JSON.parse(localStorage.getItem('accounts'));
    let user = JSON.parse(localStorage.getItem('currentuser'));
    let infoname = document.getElementById('infoname');
    let infoemail = document.getElementById('infoemail');
    let infoaddress = document.getElementById('infoaddress');

    user.fullname = infoname.value;
    if (infoemail.value.length > 0) {
        if (!emailIsValid(infoemail.value)) {
            document.querySelector('.inforemail-error').innerHTML = 'Vui lòng nhập lại email!';
            infoemail.value = '';
        } else {
            user.email = infoemail.value;
        }
    }

    if (infoaddress.value.length > 0) {
        user.address = infoaddress.value;
    }

    let vitri = accounts.findIndex(item => item.phone == user.phone)

    accounts[vitri].fullname = user.fullname;
    accounts[vitri].email = user.email;
    accounts[vitri].address = user.address;
    localStorage.setItem('currentuser', JSON.stringify(user));
    localStorage.setItem('accounts', JSON.stringify(accounts));
    kiemtradangnhap();
    toast({ title: 'Success', message: 'Cập nhật thông tin thành công !', type: 'success', duration: 3000 });
}

// Đổi mật khẩu 
function changePassword() {
    let currentUser = JSON.parse(localStorage.getItem("currentuser"));
    let passwordCur = document.getElementById('password-cur-info');
    let passwordAfter = document.getElementById('password-after-info');
    let passwordConfirm = document.getElementById('password-comfirm-info');
    let check = true;
    if (passwordCur.value.length == 0) {
        document.querySelector('.password-cur-info-error').innerHTML = 'Vui lòng nhập mật khẩu hiện tại';
        check = false;
    } else {
        document.querySelector('.password-cur-info-error').innerHTML = '';
    }

    if (passwordAfter.value.length == 0) {
        document.querySelector('.password-after-info-error').innerHTML = 'Vui lòn nhập mật khẩu mới';
        check = false;
    } else {
        document.querySelector('.password-after-info-error').innerHTML = '';
    }

    if (passwordConfirm.value.length == 0) {
        document.querySelector('.password-after-comfirm-error').innerHTML = 'Vui lòng nhập mật khẩu xác nhận';
        check = false;
    } else {
        document.querySelector('.password-after-comfirm-error').innerHTML = '';
    }

    if (check == true) {
        if (passwordCur.value.length > 0) {
            if (passwordCur.value == currentUser.password) {
                document.querySelector('.password-cur-info-error').innerHTML = '';
                if (passwordAfter.value.length > 0) {
                    if (passwordAfter.value.length < 6) {
                        document.querySelector('.password-after-info-error').innerHTML = 'Vui lòng nhập mật khẩu mới có số  kí tự lớn hơn bằng 6';
                    } else {
                        document.querySelector('.password-after-info-error').innerHTML = '';
                        if (passwordConfirm.value.length > 0) {
                            if (passwordConfirm.value == passwordAfter.value) {
                                document.querySelector('.password-after-comfirm-error').innerHTML = '';
                                currentUser.password = passwordAfter.value;
                                localStorage.setItem('currentuser', JSON.stringify(currentUser));
                                let userChange = JSON.parse(localStorage.getItem('currentuser'));
                                let accounts = JSON.parse(localStorage.getItem('accounts'));
                                let accountChange = accounts.find(acc => {
                                    return acc.phone = userChange.phone;
                                })
                                accountChange.password = userChange.password;
                                localStorage.setItem('accounts', JSON.stringify(accounts));
                                toast({ title: 'Success', message: 'Đổi mật khẩu thành công !', type: 'success', duration: 3000 });
                            } else {
                                document.querySelector('.password-after-comfirm-error').innerHTML = 'Mật khẩu bạn nhập không trùng khớp';
                            }
                        } else {
                            document.querySelector('.password-after-comfirm-error').innerHTML = 'Vui lòng xác nhận mật khẩu';
                        }
                    }
                } else {
                    document.querySelector('.password-after-info-error').innerHTML = 'Vui lòng nhập mật khẩu mới';
                }
            } else {
                document.querySelector('.password-cur-info-error').innerHTML = 'Bạn đã nhập sai mật khẩu hiện tại';
            }
        }
    }
}

function getProductInfo(id) {
    let products = JSON.parse(localStorage.getItem('products'));
    return products.find(item => {
        return item.id == id;
    })
}

// Quan ly don hang
function renderOrderProduct() {
    let currentUser = JSON.parse(localStorage.getItem('currentuser'));
    let order = localStorage.getItem('order') ? JSON.parse(localStorage.getItem('order')) : [];
    let orderHtml = "";
    let arrDonHang = [];
    for (let i = 0; i < order.length; i++) {
        if (order[i].khachhang === currentUser.phone) {
            arrDonHang.push(order[i]);
        }
    }
    if (arrDonHang.length == 0) {
        orderHtml = `<div class="empty-order-section"><img src="./assets/img/empty-order.jpg" alt="" class="empty-order-img"><p>Chưa có đơn hàng nào</p></div>`;
    } else {
        arrDonHang.forEach(item => {
            let productHtml = `<div class="order-history-group">`;
            let chiTietDon = getOrderDetails(item.id);
            chiTietDon.forEach(sp => {
                let infosp = getProductInfo(sp.id);
                productHtml += `<div class="order-history">
                    <div class="order-history-left">
                        <img src="${infosp.img}" alt="">
                        <div class="order-history-info">
                            <h4>${infosp.title}!</h4>
                            <p class="order-history-note"><i class="fa-light fa-pen"></i> ${sp.note}</p>
                            <p class="order-history-quantity">x${sp.soluong}</p>
                        </div>
                    </div>
                    <div class="order-history-right">
                        <div class="order-history-price">
                            <span class="order-history-current-price">${vnd(sp.price)}</span>
                        </div>                         
                    </div>
                </div>`;
            });
            let textCompl = item.trangthai == 1 ? "Đã xử lý" : "Đang xử lý";
            let classCompl = item.trangthai == 1 ? "complete" : "no-complete"
            productHtml += `<div class="order-history-control">
                <div class="order-history-status">
                    <span class="order-history-status-sp ${classCompl}">${textCompl}</span>
                    <button id="order-history-detail" onclick="detailOrder('${item.id}')"><i class="fa-regular fa-eye"></i> Xem chi tiết</button>
                </div>
                <div class="order-history-total">
                    <span class="order-history-total-desc">Tổng tiền: </span>
                    <span class="order-history-toltal-price">${vnd(item.tongtien)}</span>
                </div>
            </div>`
            productHtml += `</div>`;
            orderHtml += productHtml;
        });
    }
    document.querySelector(".order-history-section").innerHTML = orderHtml;
}

// Get Order Details
function getOrderDetails(madon) {
    let orderDetails = localStorage.getItem("orderDetails") ? JSON.parse(localStorage.getItem("orderDetails")) : [];
    let ctDon = [];
    orderDetails.forEach(item => {
        if(item.madon == madon) {
            ctDon.push(item);
        }
    });
    return ctDon;
}

// Format Date
function formatDate(date) {
    let fm = new Date(date);
    let yyyy = fm.getFullYear();
    let mm = fm.getMonth() + 1;
    let dd = fm.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    return dd + '/' + mm + '/' + yyyy;
}

// Xem chi tiet don hang
function detailOrder(id) {
    let order = JSON.parse(localStorage.getItem("order"));
    let detail = order.find(item => {
        return item.id == id;
    })
    document.querySelector(".modal.detail-order").classList.add("open");
    let detailOrderHtml = `<ul class="detail-order-group">
        <li class="detail-order-item">
            <span class="detail-order-item-left"><i class="fa-light fa-calendar-days"></i> Ngày đặt hàng</span>
            <span class="detail-order-item-right">${formatDate(detail.thoigiandat)}</span>
        </li>
        <li class="detail-order-item">
            <span class="detail-order-item-left"><i class="fa-light fa-truck"></i> Hình thức giao</span>
            <span class="detail-order-item-right">${detail.hinhthucgiao}</span>
        </li>
        <li class="detail-order-item">
            <span class="detail-order-item-left"><i class="fa-light fa-clock"></i> Ngày nhận hàng</span>
            <span class="detail-order-item-right">${(detail.thoigiangiao == "" ? "" : (detail.thoigiangiao + " - ")) + formatDate(detail.ngaygiaohang)}</span>
        </li>
        <li class="detail-order-item">
            <span class="detail-order-item-left"><i class="fa-light fa-location-dot"></i> Địa điểm nhận</span>
            <span class="detail-order-item-right">${detail.diachinhan}</span>
        </li>
        <li class="detail-order-item">
            <span class="detail-order-item-left"><i class="fa-thin fa-person"></i> Người nhận</span>
            <span class="detail-order-item-right">${detail.tenguoinhan}</span>
        </li>
        <li class="detail-order-item">
            <span class="detail-order-item-left"><i class="fa-light fa-phone"></i> Số điện thoại nhận</span>
            <span class="detail-order-item-right">${detail.sdtnhan}</span>
        </li>
    </ul>`
    document.querySelector(".detail-order-content").innerHTML = detailOrderHtml;
}

// Create id order 
function createId(arr) {
    let id = arr.length + 1;
    let check = arr.find(item => item.id == "DH" + id)
    while (check != null) {
        id++;
        check = arr.find(item => item.id == "DH" + id)
    }
    return "DH" + id;
}

// Back to top
window.onscroll = () => {
    let backtopTop = document.querySelector(".back-to-top")
    if (document.documentElement.scrollTop > 100) {
        backtopTop.classList.add("active");
    } else {
        backtopTop.classList.remove("active");
    }
}

// Auto hide header on scroll
const headerNav = document.querySelector(".header-bottom");
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
    if(lastScrollY < window.scrollY) {
        headerNav.classList.add("hide")
    } else {
        headerNav.classList.remove("hide")
    }
    lastScrollY = window.scrollY;
})

//Page
function renderProducts(showProduct) {
    let productHtml = '';
    if(showProduct.length == 0) {
        document.getElementById("home-title").style.display = "none";
        productHtml = `<div class="no-result"><div class="no-result-h">Tìm kiếm không có kết quả</div><div class="no-result-p">Xin lỗi, chúng tôi không thể tìm được kết quả hợp với tìm kiếm của bạn</div><div class="no-result-i"><i class="fa-light fa-face-sad-cry"></i></div></div>`;
    } else {
        document.getElementById("home-title").style.display = "block";
        showProduct.forEach((product) => {
            productHtml += `<div class="col-product">
            <article class="card-product" >
                <div class="card-header">
                    <a href="#" class="card-image-link" onclick="detailProduct(${product.id})">
                    <img class="card-image" src="${product.img}" alt="${product.title}">
                    </a>
                </div>
                <div class="food-info">
                    <div class="card-content">
                        <div class="card-title">
                            <a href="#" class="card-title-link" onclick="detailProduct(${product.id})">${product.title}</a>
                        </div>
                    </div>
                    <div class="card-footer">
                        <div class="product-price">
                            <span class="current-price">${vnd(product.price)}</span>
                        </div>
                    <div class="product-buy">
                        <button onclick="detailProduct(${product.id})" class="card-button order-item"><i class="fa-regular fa-cart-shopping-fast"></i> Đặt món</button>
                    </div> 
                </div>
                </div>
            </article>
        </div>`;
        });
    }
    document.getElementById('home-products').innerHTML = productHtml;
}



// Find Product
var productAll = JSON.parse(localStorage.getItem('products')).filter(item => item.status == 1);
function searchProducts(mode) {
    let valeSearchInput = document.querySelector('.form-search-input').value;
    let valueCategory = document.getElementById("advanced-search-category-select").value;
    let minPrice = document.getElementById("min-price").value;
    let maxPrice = document.getElementById("max-price").value;
    if(parseInt(minPrice) > parseInt(maxPrice) && minPrice != "" && maxPrice != "") {
        alert("Giá đã nhập sai !");
    }

    let result = valueCategory == "Tất cả" ? productAll : productAll.filter((item) => {
        return item.category == valueCategory;
    });

    result = valeSearchInput == "" ? result : result.filter(item => {
        return item.title.toString().toUpperCase().includes(valeSearchInput.toString().toUpperCase());
    })

    if(minPrice == "" && maxPrice != "") {
        result = result.filter((item) => item.price <= maxPrice);
    } else if (minPrice != "" && maxPrice == "") {
        result = result.filter((item) => item.price >= minPrice);
    } else if(minPrice != "" && maxPrice != "") {
        result = result.filter((item) => item.price <= maxPrice && item.price >= minPrice);
    }

    document.getElementById("home-service").scrollIntoView();
    switch (mode){
        case 0:
            result = JSON.parse(localStorage.getItem('products'));;
            document.querySelector('.form-search-input').value = "";
            document.getElementById("advanced-search-category-select").value = "Tất cả";
            document.getElementById("min-price").value = "";
            document.getElementById("max-price").value = "";
            break;
        case 1:
            result.sort((a,b) => a.price - b.price)
            break;
        case 2:
            result.sort((a,b) => b.price - a.price)
            break;
    }
    showHomeProduct(result)
}

// Phân trang 
let perPage = 12;
let currentPage = 1;
let totalPage = 0;
let perProducts = [];

function displayList(productAll, perPage, currentPage) {
    let start = (currentPage - 1) * perPage;
    let end = (currentPage - 1) * perPage + perPage;
    let productShow = productAll.slice(start, end);
    renderProducts(productShow);
}

function showHomeProduct(products) {
    let productAll = products.filter(item => item.status == 1)
    displayList(productAll, perPage, currentPage);
    setupPagination(productAll, perPage, currentPage);
}

window.onload = showHomeProduct(JSON.parse(localStorage.getItem('products')))

function setupPagination(productAll, perPage) {
    document.querySelector('.page-nav-list').innerHTML = '';
    let page_count = Math.ceil(productAll.length / perPage);
    for (let i = 1; i <= page_count; i++) {
        let li = paginationChange(i, productAll, currentPage);
        document.querySelector('.page-nav-list').appendChild(li);
    }
}

function paginationChange(page, productAll, currentPage) {
    let node = document.createElement(`li`);
    node.classList.add('page-nav-item');
    node.innerHTML = `<a href="javascript:;">${page}</a>`;
    if (currentPage == page) node.classList.add('active');
    node.addEventListener('click', function () {
        currentPage = page;
        displayList(productAll, perPage, currentPage);
        let t = document.querySelectorAll('.page-nav-item.active');
        for (let i = 0; i < t.length; i++) {
            t[i].classList.remove('active');
        }
        node.classList.add('active');
        document.getElementById("home-service").scrollIntoView();
    })
    return node;
}

// Hiển thị chuyên mục
function showCategory(category) {
    document.getElementById('trangchu').classList.remove('hide');
    document.getElementById('account-user').classList.remove('open');
    document.getElementById('order-history').classList.remove('open');
    let productSearch = productAll.filter(value => {
        return value.category.toString().toUpperCase().includes(category.toUpperCase());
    })
    let currentPageSeach = 1;
    displayList(productSearch, perPage, currentPageSeach);
    setupPagination(productSearch, perPage, currentPageSeach);
    document.getElementById("home-title").scrollIntoView();
}


// Hàm để ẩn/hiện công cụ tính Calories
function toggleCaloriesTool() {
    const caloriesTool = document.getElementById('calories-tool');
    caloriesTool.style.display = (caloriesTool.style.display === 'none' || caloriesTool.style.display === '') ? 'block' : 'none';
}

// Hàm tính TDEE và BMR
document.getElementById('calculate-btn').addEventListener('click', function() {
    const gender = document.getElementById('gender').value;
    const age = parseInt(document.getElementById('age').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const activity = parseFloat(document.getElementById('activity').value);

    // Kiểm tra các giá trị hợp lệ
    if (isNaN(age) || isNaN(weight) || isNaN(height)) {
        alert('Vui lòng nhập đầy đủ thông tin.');
        return;
    }

    // Công thức tính BMR
    let bmr;
    if (gender === 'male') {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    // Tính TDEE
    const tdee = bmr * activity;

    // Hiển thị kết quả BMR và TDEE
    document.getElementById('bmr-result').textContent = `BMR của bạn: ${bmr.toFixed(2)} kcal`;
    document.getElementById('tdee-result').textContent = `TDEE của bạn: ${tdee.toFixed(2)} kcal`;

    // Tính toán lượng calo cho các chế độ ăn uống
    document.getElementById('lose-light').textContent = `${(tdee - 200).toFixed(2)} Calories/ngày`;
    document.getElementById('lose-regular').textContent = `${(tdee - 500).toFixed(2)} Calories/ngày`;
    document.getElementById('lose-fast').textContent = `${(tdee - 1000).toFixed(2)} Calories/ngày`;
    document.getElementById('gain-light').textContent = `${(tdee + 200).toFixed(2)} Calories/ngày`;
    document.getElementById('gain-regular').textContent = `${(tdee + 500).toFixed(2)} Calories/ngày`;
    document.getElementById('gain-fast').textContent = `${(tdee + 1000).toFixed(2)} Calories/ngày`;
});


// Hàm để ẩn/hiện công cụ tính Calories
function toggleMealTool() {
    const mealTool = document.getElementById('meal-tool');
    mealTool.style.display = (mealTool.style.display === 'none' || mealTool.style.display === '') ? 'block' : 'none';
}
// function toggleMealTool() {
//     const mealTool = document.getElementById('meal-tool');
//     mealTool.style.display = (mealTool.style.display === 'none' || mealTool.style.display === '') ? 'block' : 'none';

//     // Optional: Trigger click on the link
//     const mealLink = mealTool.querySelector('a');
//     mealLink.addEventListener('click', function(event) {
//         window.open(mealLink.href, '_blank');
//         event.preventDefault(); // Prevent default link behavior
//     });
// }


    // Khởi tạo số xu của người dùng
function getUserCoins() {
    let currentUser = JSON.parse(localStorage.getItem('currentuser'));
    if (!currentUser.coins) {
        currentUser.coins = 0;
        localStorage.setItem('currentuser', JSON.stringify(currentUser));
    }
    return currentUser.coins;
}

// Cập nhật hiển thị số dư xu
function updateCoinBalance() {
    const coins = getUserCoins();
    document.getElementById('coin-balance').innerText = coins;
}
function watchAd() {
    alert('Đang xem quảng cáo...');
    let currentUser = JSON.parse(localStorage.getItem('currentuser'));
    currentUser.coins += 10; // Thêm 10 xu
    localStorage.setItem('currentuser', JSON.stringify(currentUser));
    updateCoinBalance();
    alert('Bạn đã nhận được 10 xu!');
}


// Khởi tạo
window.onload = function() {
    updateCoinBalance();
    displayLockedProducts();
};


// Mảng chứa các công thức nấu ăn
let recipes = [
    {
        id: 1,
        title: 'Salad rau củ trộn healthy',
        ingredients: [
            '1. Rau xà lách - 100g',
            '2. Dưa leo - 1 trái',
            '3. Cà chua bi - 10 trái',
            '4. Ức gà - 200g (nướng hoặc luộc)',
            '5. Nước sốt dầu oliu, giấm, muối và tiêu'
        ],
        instructions: [
            'Bước 1: Rửa sạch các loại rau và để ráo nước.',
            'Bước 2: Cắt dưa leo, cà chua bi, và ức gà thành miếng vừa ăn.',
            'Bước 3: Cho tất cả các nguyên liệu vào tô lớn.',
            'Bước 4: Trộn đều với nước sốt đã chuẩn bị.',
            'Bước 5: Thưởng thức món salad healthy!'
        ],
        nutrition: {
            calories: 350,
            protein: 30,
            carbs: 20,
            fat: 15
        },
        priceToUnlock: 50
    },
    {
        id: 2,
        title: 'Smoothie xanh bổ dưỡng',
        ingredients: [
            '1. Rau cải bó xôi - 100g',
            '2. Chuối - 1 trái',
            '3. Sữa hạnh nhân không đường - 200ml',
            '4. Bơ đậu phộng - 1 muỗng canh',
            '5. Hạt chia - 1 muỗng cà phê'
        ],
        instructions: [
            'Bước 1: Rửa sạch rau cải bó xôi và để ráo.',
            'Bước 2: Cắt chuối thành từng lát.',
            'Bước 3: Cho tất cả các nguyên liệu vào máy xay sinh tố.',
            'Bước 4: Xay đều cho đến khi hỗn hợp mịn và sánh lại.',
            'Bước 5: Đổ ra ly và thưởng thức.'
        ],
        nutrition: {
            calories: 250,
            protein: 8,
            carbs: 32,
            fat: 10
        },
        priceToUnlock: 40
    },
    {
        id: 3,
        title: 'Cháo yến mạch táo quế',
        ingredients: [
            '1. Yến mạch - 50g',
            '2. Táo - 1 trái',
            '3. Sữa hạnh nhân không đường - 200ml',
            '4. Quế - 1/2 muỗng cà phê',
            '5. Mật ong - 1 muỗng canh'
        ],
        instructions: [
            'Bước 1: Nấu yến mạch với sữa hạnh nhân cho đến khi mềm.',
            'Bước 2: Cắt táo thành lát và thêm vào cháo.',
            'Bước 3: Thêm quế và mật ong vào, khuấy đều.',
            'Bước 4: Thưởng thức ngay khi còn ấm.'
        ],
        nutrition: {
            calories: 300,
            protein: 5,
            carbs: 55,
            fat: 7
        },
        priceToUnlock: 35
    },
    {
        id: 4,
        title: 'Salad quinoa và bơ',
        ingredients: [
            '1. Quinoa - 100g',
            '2. Bơ - 1 trái',
            '3. Cà chua bi - 10 trái',
            '4. Rau xà lách - 50g',
            '5. Dầu oliu - 1 muỗng canh'
        ],
        instructions: [
            'Bước 1: Luộc chín quinoa theo hướng dẫn trên bao bì.',
            'Bước 2: Cắt bơ và cà chua bi thành miếng vừa ăn.',
            'Bước 3: Trộn quinoa với các nguyên liệu còn lại, thêm dầu oliu.',
            'Bước 4: Thưởng thức salad tươi mát.'
        ],
        nutrition: {
            calories: 350,
            protein: 10,
            carbs: 40,
            fat: 15
        },
        priceToUnlock: 50
    },
    {
        id: 5,
        title: 'Smoothie dâu tây và hạt chia',
        ingredients: [
            '1. Dâu tây - 200g',
            '2. Sữa hạnh nhân không đường - 250ml',
            '3. Hạt chia - 1 muỗng cà phê',
            '4. Chuối - 1 trái',
            '5. Mật ong - 1 muỗng cà phê'
        ],
        instructions: [
            'Bước 1: Rửa sạch dâu tây và cắt lát.',
            'Bước 2: Cho dâu tây, chuối và sữa vào máy xay sinh tố, xay nhuyễn.',
            'Bước 3: Thêm hạt chia và mật ong vào, xay thêm 10 giây.',
            'Bước 4: Đổ ra ly và thưởng thức ngay.'
        ],
        nutrition: {
            calories: 220,
            protein: 6,
            carbs: 45,
            fat: 5
        },
        priceToUnlock: 30
    },
    {
        id: 6,
        title: 'Bowl ngũ cốc yến mạch và trái cây',
        ingredients: [
            '1. Yến mạch - 50g',
            '2. Sữa chua Hy Lạp không đường - 200g',
            '3. Việt quất - 50g',
            '4. Chuối - 1/2 trái',
            '5. Hạt chia - 1 muỗng cà phê'
        ],
        instructions: [
            'Bước 1: Ngâm yến mạch trong sữa chua Hy Lạp khoảng 10 phút.',
            'Bước 2: Cắt chuối thành lát và trộn đều với yến mạch.',
            'Bước 3: Thêm việt quất và hạt chia vào.',
            'Bước 4: Thưởng thức món bowl yến mạch giàu dinh dưỡng.'
        ],
        nutrition: {
            calories: 300,
            protein: 15,
            carbs: 50,
            fat: 6
        },
        priceToUnlock: 35
    },
    {
        id: 7,
        title: 'Gà nướng rau củ',
        ingredients: [
            '1. Ức gà - 200g',
            '2. Ớt chuông - 1 quả',
            '3. Cà rốt - 1 củ',
            '4. Bông cải xanh - 100g',
            '5. Dầu ô liu, muối và tiêu - vừa đủ'
        ],
        instructions: [
            'Bước 1: Cắt nhỏ ức gà và rau củ.',
            'Bước 2: Ướp gà với muối, tiêu và dầu ô liu trong 15 phút.',
            'Bước 3: Nướng ức gà và rau củ trong lò ở 180°C khoảng 20-25 phút.',
            'Bước 4: Lấy ra và thưởng thức khi gà và rau củ chín mềm.'
        ],
        nutrition: {
            calories: 350,
            protein: 35,
            carbs: 25,
            fat: 12
        },
        priceToUnlock: 50
    },
    {
        id: 8,
        title: 'Salad bơ và đậu đen',
        ingredients: [
            '1. Bơ - 1 trái',
            '2. Đậu đen luộc - 100g',
            '3. Cà chua bi - 10 trái',
            '4. Hành tây - 1/4 củ',
            '5. Dầu oliu, chanh, muối và tiêu - vừa đủ'
        ],
        instructions: [
            'Bước 1: Cắt bơ và cà chua bi thành miếng nhỏ.',
            'Bước 2: Trộn đậu đen luộc với hành tây cắt nhỏ.',
            'Bước 3: Thêm bơ, cà chua và trộn đều với dầu oliu, nước chanh, muối và tiêu.',
            'Bước 4: Thưởng thức món salad tươi mát, giàu dinh dưỡng.'
        ],
        nutrition: {
            calories: 300,
            protein: 8,
            carbs: 35,
            fat: 18
        },
        priceToUnlock: 40
    },
    {
        id: 9,
        title: 'Smoothie bơ và cải bó xôi',
        ingredients: [
            '1. Bơ - 1/2 trái',
            '2. Cải bó xôi - 100g',
            '3. Sữa hạnh nhân không đường - 250ml',
            '4. Hạt chia - 1 muỗng cà phê',
            '5. Mật ong - 1 muỗng cà phê'
        ],
        instructions: [
            'Bước 1: Rửa sạch cải bó xôi và cắt nhỏ bơ.',
            'Bước 2: Cho tất cả các nguyên liệu vào máy xay sinh tố.',
            'Bước 3: Xay đều cho đến khi hỗn hợp mịn và sánh.',
            'Bước 4: Đổ ra ly và thưởng thức ngay.'
        ],
        nutrition: {
            calories: 250,
            protein: 6,
            carbs: 20,
            fat: 15
        },
        priceToUnlock: 35
    },
    {
        id: 10,
        title: 'Cháo yến mạch và rau củ',
        ingredients: [
            '1. Yến mạch - 50g',
            '2. Cà rốt - 1 củ nhỏ',
            '3. Bông cải xanh - 50g',
            '4. Nấm đông cô - 3 cái',
            '5. Nước dùng rau củ - 300ml'
        ],
        instructions: [
            'Bước 1: Nấu yến mạch với nước dùng rau củ trong 10 phút.',
            'Bước 2: Thêm cà rốt, bông cải xanh và nấm cắt nhỏ vào.',
            'Bước 3: Nấu thêm 5-7 phút cho đến khi các nguyên liệu chín mềm.',
            'Bước 4: Thưởng thức món cháo yến mạch ấm áp và giàu dinh dưỡng.'
        ],
        nutrition: {
            calories: 280,
            protein: 7,
            carbs: 50,
            fat: 6
        },
        priceToUnlock: 30
    }      
    // Thêm các công thức khác tại đây
];

// Lưu công thức vào localStorage sau khi thêm
function saveRecipesToLocalStorage() {
    // Bạn nên cập nhật tất cả các công thức nấu ăn và lưu lại
    localStorage.setItem('recipes', JSON.stringify(recipes));
}

// Gọi hàm này sau khi bạn thêm công thức mới để lưu lại
saveRecipesToLocalStorage();


// Lấy công thức từ localStorage
function getRecipesFromLocalStorage() {
    return JSON.parse(localStorage.getItem('recipes')) || [];
}

// Kiểm tra xem công thức đã được mở khóa chưa
function isRecipeUnlocked(recipeId) {
    let unlockedRecipes = JSON.parse(localStorage.getItem('unlockedRecipes')) || [];
    return unlockedRecipes.includes(recipeId);
}

// Lưu trạng thái mở khóa công thức vào localStorage
function saveUnlockedRecipe(recipeId) {
    let unlockedRecipes = JSON.parse(localStorage.getItem('unlockedRecipes')) || [];
    if (!unlockedRecipes.includes(recipeId)) {
        unlockedRecipes.push(recipeId);
        localStorage.setItem('unlockedRecipes', JSON.stringify(unlockedRecipes));
    }
}

// Hiển thị danh sách công thức và thêm data-recipe-id để dễ dàng tìm
function displayRecipeList(searchTerm = '') {
    let recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = '';  // Xóa danh sách cũ
    
    let recipes = getRecipesFromLocalStorage();
    searchTerm = searchTerm.toLowerCase().trim();
    
    // Lọc công thức dựa trên từ khóa tìm kiếm
    let filteredRecipes = recipes.filter(recipe => {
        if (!isNaN(searchTerm) && searchTerm !== '') {
            return recipe.nutrition.calories.toString().includes(searchTerm);
        }
        return recipe.title.toLowerCase().includes(searchTerm);
    });
    
    if (filteredRecipes.length === 0) {
        recipeList.innerHTML = `<p>Không tìm thấy công thức nào</p>`;
        return;
    }

    filteredRecipes.forEach(recipe => {
        let card = document.createElement('div');
        card.className = 'recipe-card';
        card.setAttribute('data-recipe-id', recipe.id); // Thêm thuộc tính ID để dễ tìm
        
        let recipeImage = `<img src="https://placehold.co/200x200?text=${recipe.title}" alt="${recipe.title}">`;
        let recipeTitle = `<h3>${recipe.title}</h3>`;
        let recipeCalories = `<p>${recipe.nutrition.calories} kcal</p>`;
        
        let unlockButton;
        if (isRecipeUnlocked(recipe.id)) {
            unlockButton = `<button class="unlock-btn" disabled>Đã mở khóa</button>`;
        } else {
            unlockButton = `<button class="unlock-btn" onclick="unlockRecipe(${recipe.id})">Mở khóa - ${recipe.priceToUnlock} xu</button>`;
        }

        card.innerHTML = recipeImage + recipeTitle + recipeCalories + unlockButton;
        
        // Chức năng mở rộng/thu gọn chi tiết công thức
        card.onclick = function() {
            displayRecipe(recipe.id);
        };
        
        recipeList.appendChild(card);
    });
}


// Hiển thị công thức
function displayRecipe(recipeId) {
    let recipes = getRecipesFromLocalStorage();
    let selectedRecipe = recipes.find(r => r.id === recipeId);
    
    // Kiểm tra xem công thức đã được mở khóa hay chưa
    if (isRecipeUnlocked(selectedRecipe.id)) {
        // Nếu đã mở khóa, hiển thị toàn bộ công thức
        displayFullRecipe(selectedRecipe);
    } else {
        // Nếu chưa mở khóa, hiển thị một phần công thức
        displayPartialRecipe(selectedRecipe);
    }
}



// Hiển thị một nửa công thức
function displayPartialRecipe(recipe) {
    let recipeContent = document.getElementById('recipe-content');
    let html = `<h3 data-recipe-id="${recipe.id}">${recipe.title}</h3>`;
    
    // Hiển thị một nửa nguyên liệu
    html += '<h4>Nguyên liệu:</h4><ul>';
    recipe.ingredients.slice(0, Math.ceil(recipe.ingredients.length / 2)).forEach(item => {
        html += `<li>${item}</li>`;
    });
    html += '</ul>';
    
    // Hiển thị một nửa hướng dẫn
    html += '<h4>Hướng dẫn:</h4><ol>';
    recipe.instructions.slice(0, Math.ceil(recipe.instructions.length / 2)).forEach(step => {
        html += `<li>${step}</li>`;
    });
    html += '</ol>';
    
    // Thêm phần bị khóa
    html += '<p><strong>Phần còn lại của công thức đã bị khóa. Vui lòng mở khóa để xem đầy đủ.</strong></p>';
    
    recipeContent.innerHTML = html;
    document.getElementById('unlock-recipe-btn').style.display = 'block';
}



// Hiển thị toàn bộ công thức
function displayFullRecipe(recipe) {
    let recipeContent = document.getElementById('recipe-content');
    let html = `<h3 data-recipe-id="${recipe.id}">${recipe.title}</h3>`;
    
    // Thông tin dinh dưỡng
    html += `<h4>Thông tin dinh dưỡng (per serving):</h4>
             <ul>
               <li>Tổng năng lượng: ${recipe.nutrition.calories} kcal</li>
               <li>Protein: ${recipe.nutrition.protein} g</li>
               <li>Carbs: ${recipe.nutrition.carbs} g</li>
               <li>Chất béo: ${recipe.nutrition.fat} g</li>
             </ul>`;
    
    // Hiển thị toàn bộ nguyên liệu
    html += '<h4>Nguyên liệu:</h4><ul>';
    recipe.ingredients.forEach(item => {
        html += `<li>${item}</li>`;
    });
    html += '</ul>';
    
    // Hiển thị toàn bộ hướng dẫn
    html += '<h4>Hướng dẫn:</h4><ol>';
    recipe.instructions.forEach(step => {
        html += `<li>${step}</li>`;
    });
    html += '</ol>';  
    
    recipeContent.innerHTML = html;
    document.getElementById('unlock-recipe-btn').style.display = 'none';
}

// Mở khóa công thức
function unlockRecipe(recipeId) {
    let currentUser = JSON.parse(localStorage.getItem('currentuser'));
    let recipes = getRecipesFromLocalStorage();
    let recipe = recipes.find(r => r.id === recipeId);

    if (currentUser.coins >= recipe.priceToUnlock) {
        // Hiển thị thông báo xác nhận trước khi trừ xu
        const confirmUnlock = confirm(`Bạn có chắc chắn muốn mở khóa công thức "${recipe.title}" với ${recipe.priceToUnlock} xu không?`);
        if (confirmUnlock) {
            // Trừ xu của người dùng
            currentUser.coins -= recipe.priceToUnlock;
            localStorage.setItem('currentuser', JSON.stringify(currentUser));
            updateCoinBalance();  // Cập nhật số xu hiển thị

            // Lưu trạng thái mở khóa
            saveUnlockedRecipe(recipeId);

            // Cập nhật nút thành "Đã mở khóa"
            updateRecipeCardStatus(recipeId);

            // Hiển thị toàn bộ công thức sau khi mở khóa
            displayFullRecipe(recipe);
            alert('Bạn đã mở khóa thành công công thức!');
        }
    } else {
        // Thông báo không đủ xu
        alert('Bạn không đủ xu để mở khóa công thức này!');
    }
}
// Cập nhật giao diện của công thức trong danh sách sau khi mở khóa
function updateRecipeCardStatus(recipeId) {
    // Tìm công thức đã mở khóa trong danh sách
    let card = document.querySelector(`.recipe-card[data-recipe-id="${recipeId}"]`);
    if (card) {
        let unlockButton = card.querySelector('.unlock-btn');
        if (unlockButton) {
            unlockButton.textContent = 'Đã mở khóa';
            unlockButton.disabled = true;
        }
    }
}

// Cập nhật hiển thị số xu của người dùng
function updateCoinBalance() {
    const coins = getUserCoins();
    document.getElementById('coin-balance').innerText = coins;
}

// Lấy số dư xu của người dùng
function getUserCoins() {
    let currentUser = JSON.parse(localStorage.getItem('currentuser'));
    return currentUser.coins;
}

window.onload = function() {
    kiemtradangnhap(); // Kiểm tra đăng nhập
    displayRecipeList(); // Hiển thị danh sách công thức ban đầu
    
    // Xử lý sự kiện tìm kiếm công thức
    document.getElementById('search-recipe').addEventListener('input', function() {
        let searchTerm = this.value;
        displayRecipeList(searchTerm); // Hiển thị danh sách công thức theo từ khóa tìm kiếm
    });

    document.getElementById('unlock-recipe-btn').addEventListener('click', function() {
        let selectedRecipeId = document.querySelector('#recipe-content h3').getAttribute('data-recipe-id');
        unlockRecipe(parseInt(selectedRecipeId));
    });
};






