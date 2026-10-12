# EQUIPTRACE — Physical Education Equipment Tracking System

EQUIPTRACE is a real-time smart equipment borrowing, inventory tracking, and analytics system designed for Physical Education departments, sports facilities, and academic institutions.

---

## 🏛️ System Architecture & Technology Stack

The system is built upon a high-performance stack addressing transaction handling, fast identification, real-time messaging, and analytics:

| Layer / Component | Technology | Description & Purpose |
| :--- | :--- | :--- |
| **Backend** | `Node.js` + `Express.js` | REST API handling equipment checkouts, return transactions, borrowing validations, request approvals, and administrative rules. |
| **Database** | `Firebase Firestore` | Scalable NoSQL real-time document database storing equipment records, inventory logs, user accounts, and borrowing history. |
| **Authentication** | `Firebase Authentication` | Secure role-based identity management supporting Student and Admin/Staff accounts, sessions, and claims. |
| **QR Code** | `QR Code library / API` (`html5-qrcode`, `qrcode`) | High-speed equipment identification via built-in camera scanning and automated label QR code generation. |
| **Notifications** | `Firebase Cloud Messaging (FCM)` | Real-time push alerts for borrow confirmations, due date reminders, and overdue item notices. |
| **Analytics** | `Firebase / Custom Dashboard` | Interactive administrative dashboard visualizing borrowing trends, equipment utilization rates, and overdue patterns. |

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Client (React + Vite)
```bash
npm run dev
```

### 3. Run the Backend API Server (Node.js + Express)
```bash
npm run server
```

---

## 📂 Project Structure

```text
EQUIPTRACE/
├── server/
│   └── index.js             # Express.js REST API (Borrowing, QR, Requests, FCM, Analytics)
├── src/
│   ├── components/
│   │   ├── Admin/           # Admin Dashboard, Equipment Catalog, Requests, Analytics, More
│   │   │   ├── SystemArchitectureModal.jsx # In-app tech stack & architecture modal
│   │   │   └── ...
│   │   ├── HomeScreen.jsx   # Student portal home
│   │   ├── ScanScreen.jsx   # QR Scanner screen
│   │   ├── BorrowingsScreen.jsx
│   │   └── ...
│   ├── services/
│   │   └── firebase.js      # Firebase App, Firestore, Auth, and FCM service initialization
│   ├── App.jsx              # Main router & state management
│   └── main.jsx
├── package.json
└── README.md
```
