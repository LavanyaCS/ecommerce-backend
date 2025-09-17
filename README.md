# 🛒 E-Commerce Backend

This is a Node.js + Express backend for an e-commerce application with features like authentication, products, cart, wishlist, orders, reviews, and addresses.  
MongoDB (with Mongoose) is used as the database.

---

## 🚀 Features
- User Authentication (Register, Login, JWT)
- Product Management (CRUD)
- Cart Management (Add, Remove, Update items, Calculate total)
- Wishlist Management (Add, Remove items)
- Order Management
- Address Management
- Product Reviews
- Secure APIs with JWT Authentication
- CORS + dotenv support

---

## 📂 Project Structure

```
project/
│── models/          # Mongoose models
│   ├── userModel.js
│   ├── productModel.js
│   ├── cartModel.js
│   ├── wishlistModel.js
│   ├── orderModel.js
│   ├── reviewModel.js
│   └── addressModel.js
│
│── routes/          # Express routes
│   ├── authRoute.js
│   ├── productRoute.js
│   ├── cartRoute.js
│   ├── wishlistRoute.js
│   ├── orderRoute.js
│   ├── reviewRoute.js
│   └── addressRoute.js
│
│── config/          # Database connection
│── .env             # Environment variables
│── server.js / index.js
```

---

## ⚙️ Installation

1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd project
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Setup environment variables in `.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/mydb
   JWT_SECRET=your_secret_key
   ```

4. Start the server:
   ```sh
   npm run dev
   ```
   (Uses `nodemon` if configured)

---

## 📌 API Endpoints

### Auth
- `POST /auth/register` → Register user
- `POST /auth/login` → Login user

### Products
- `GET /product` → Get all products
- `POST /product` → Add product
- `PUT /product/:id` → Update product
- `DELETE /product/:id` → Delete product

### Cart
- `POST /cart/add` → Add product to cart
- `DELETE /cart/remove` → Remove product from cart
- `GET /cart` → Get user cart

### Wishlist
- `POST /wishlist/add` → Add product to wishlist
- `DELETE /wishlist/remove` → Remove product from wishlist
- `GET /wishlist` → Get user wishlist

### Orders
- `POST /order/create` → Place order
- `GET /order/:id` → Get order details

### Reviews
- `POST /review/add` → Add review
- `GET /review/:productId` → Get reviews for a product

### Address
- `POST /address/add` → Add address
- `GET /address` → Get addresses

---

## 🛠️ Tech Stack
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- dotenv
- CORS

---

## 🤝 Contributing
Pull requests are welcome!  

---

## 📜 License
MIT License
