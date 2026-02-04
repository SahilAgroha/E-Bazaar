# 🛒 BuyBaazar: A Multi-Tenant E-commerce Platform

**BuyBaazar** is a cutting-edge e-commerce platform designed to host multiple sellers in a single, scalable ecosystem. It features a modern, full-stack architecture with a focus on intelligent user experiences and robust administrative control.

---

### ✨ Key Features

* **Multi-Tenant System**: A single platform supporting a diverse network of sellers, each managing their own products and orders.
* **AI-Powered Personalization**: Integrates the Gemini API to provide intelligent product suggestions and a dynamic chatbot for customer support.
* **Advanced Logistics**: A custom delivery network with dedicated warehouses and distributors, enabling real-time order tracking.
* **Secure & Scalable Backend**: Built with Spring Boot, ensuring high performance, data security, and seamless API communication.
* **Comprehensive Admin Portal**: A powerful dashboard for platform administrators to oversee all users, sellers, products, and transactions.

---

### 💻 Tech Stack

* **Frontend**: `React.js` | `Redux Toolkit` | `TypeScript`
* **Backend**: `Spring Boot` | `Java` | `Spring Security`
* **Database**: `MySQL`
* **AI Integration**: `Gemini API`
* **Cloud Services**: `Cloudinary`

---

### 🚀 Getting Started

Follow these steps to get a development copy of the project running on your local machine.

#### Prerequisites

* `Java 17` or higher
* `Node.js` and `npm`
* `MySQL` server instance
* API keys for `Gemini`, `Razorpay`, `Stripe`, and `Cloudinary`

#### Installation

1.  **Clone the repository:**
    ```bash
    git clone [repository_url]
    ```

2.  **Set up the Backend:**
    ```bash
    cd Buy-Baazar
    # Configure your database and API keys in src/main/resources/application.properties
    # Build and run the Spring Boot app
    ./mvnw spring-boot:run
    ```

3.  **Set up the Frontend:**
    ```bash
    cd buyBaazar
    npm install
    npm start
    ```

The application will be live at `http://localhost:5173` (Frontend) and `http://localhost:8080` (Backend).

---

### 🤝 Contributions & Roadmap

We welcome contributions! Feel free to open an issue or submit a pull request with new features or bug fixes. The roadmap includes further enhancements to the AI recommendation engine and expanded logistics features.
