//Khoi tao danh sach san pham
function createProduct() {
    if (localStorage.getItem('products') == null) {
        let products = [
        {
            id: 1,
            status: 1, 
            title: 'Viên uống mầm đậu nành Úc Super Lecithin 1200mg',
            img: './assets/img/products/superlecithin.jpg',
            category: 'Sản Phẩm',
            price: 285000,
            desc: 'Viên uống tinh chất mầm đậu nành Super Lecithin 1200mg Healthy Care được nghiên cứu, sản xuất bởi những chuyên gia hàng đầu của Úc trong lĩnh vực chăm sóc sức khỏe phái đẹp. Sản phẩm này được chế xuất từ mầm đậu nành nguyên chất 100%, giúp đem lại cho cơ thể bạn sức khỏe và cải thiện những vấn đề sinh lý.Viên uống mầm đậu nành Healthy Care giúp cải thiện sức khỏe, sắc đẹp và sinh lý nữ.'       
        },
        {
            id: 2,
            status: 1, 
            title: 'DHA Healthy Care',
            img: './assets/img/products/DHAKis.jpg',
            category: 'Sản Phẩm',
            price: 100000,
            desc: 'Healthy Care Kids High Strength DHA là một trong những sản phẩm chất lượng của nhà Healthy Care.'       
        },
        {
            id: 3,
            status: 1, 
            title: 'BioTechUSA Vegan Protein, 500 Gram',
            img: './assets/img/products/biotechusa-vegan-protein-chocola.jpg',
            category: 'Sản Phẩm',
            price: 600000,
            desc: '3 loại siêu thực vật bột: Bột Quinoa - Bột Acai - Bột quả Goji,19g Protein,1390 mg L-Glutamine,650mg L-Arginine,Không chứa đường và lactose,Không chứa gluten'       
        },
        {
            id: 4,
            status: 1, 
            title: 'Nutrabolics Hydropure 100% Hydrolyzed Whey Protein 4.5lbs',
            img: './assets/img/products/wheynutrabolics.jpg',
            category: 'Sản Phẩm',
            price: 600000,
            desc: '3 loại siêu thực vật bột: Bột Quinoa - Bột Acai - Bột quả Goji,19g Protein,1390 mg L-Glutamine,650mg L-Arginine,Không chứa đường và lactose,Không chứa gluten'       
        },
        {
            id: 5,
            status: 1, 
            title: 'Scivation Xtend BCAA Original, 30 Servings',
            img: './assets/img/products/s9.jpg',
            category: 'Sản Phẩm',
            price: 650000,
            desc: '7G BCAA - Tỷ lệ 2:1:1. Hỗ trợ phục hồi và xây dựng cơ bắp tối ưu 0 Carbs, 0 Calo, 0 đường'       
        }
        ]
        localStorage.setItem('products', JSON.stringify(products));
    }
}

// Create admin account 
function createAdminAccount() {
    let accounts = localStorage.getItem("accounts");
    if (!accounts) {
        accounts = [];
        accounts.push({
            fullname: "Nguyễn Thanh Tùng",
            phone: "devthanh14",
            password: "123456",
            address: 'https://github.com/thanhtungt',
            email: 'tungccvv111@gmail.com',
            status: 1,
            join: new Date(),
            cart: [],
            userType: 1
        })
        accounts.push({
            fullname: "Trần Nhật Sinh",
            phone: "0123456789",
            password: "123456",
            address: '',
            email: '',
            status: 1,
            join: new Date(),
            cart: [],
            userType: 1
        })
        localStorage.setItem('accounts', JSON.stringify(accounts));
    }
}

window.onload = createProduct();
window.onload = createAdminAccount();
// localStorage.removeItem('products'); //reset DB product
// localStorage.removeItem('accounts'); //reset DB accounts