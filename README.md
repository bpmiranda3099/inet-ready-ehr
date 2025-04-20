# INET-READY: Electronic Health Record (EHR)

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![Platform](https://img.shields.io/badge/platform-Web-brightgreen)
![Status](https://img.shields.io/badge/status-Active-success)
[![ORCID](https://img.shields.io/badge/ORCID-0009--0008--4716--7429-green.svg)](https://orcid.org/0009-0008-4716-7429)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fbpmiranda3099.github.io%2Finet-ready-ehr%2F&label=Website&color=purple)](https://bpmiranda3099.github.io/inet-ready-ehr/)
![Visitors](https://visitor-badge.laobi.icu/badge?page_id=bpmiranda3099.inet-ready-ehr)

</div>

A secure, modern Electronic Health Record (EHR) backend built with Node.js, Express, PostgreSQL, and Firebase Authentication. Designed for seamless integration with modern web frontends and deployment on cloud platforms like Aptible.

---

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication via Firebase.
- **Medical Data API**: CRUD endpoints for storing, retrieving, and deleting user medical data.
- **PostgreSQL Integration**: Robust, scalable data storage.
- **CORS Support**: Configured for secure cross-origin requests from trusted frontends.
- **Dockerized**: Easy containerized deployment.
- **Cloud Ready**: Out-of-the-box support for Aptible and other cloud platforms.

---

## 🛠️ Tech Stack

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white&style=for-the-badge" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express-000000?logo=express&logoColor=white&style=for-the-badge" alt="Express"/>
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white&style=for-the-badge" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=white&style=for-the-badge" alt="Firebase"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white&style=for-the-badge" alt="Docker"/>
  <img src="https://img.shields.io/badge/Aptible-2B2B2B?logo=aptible&logoColor=white&style=for-the-badge" alt="Aptible"/>
</p>

---

## 📦 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL database
- Firebase project with a service account key
- Docker (optional, for containerized deployment)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/inet-ready-ehr.git
   cd inet-ready-ehr
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Set up environment variables:**

   - Copy `.env` and `serviceAccountKey.json` (do not commit secrets!)
   - Example `.env`:
     ```env
     FIREBASE_ADMIN_SDK=serviceAccountKey.json
     DATABASE_URL=postgres://localhost:5432/mydb
     PORT=3000
     ```

4. **Prepare PostgreSQL database:**
   - Create a `medical_data` table:
     ```sql
     CREATE TABLE medical_data (
       user_id VARCHAR(128) PRIMARY KEY,
       data JSONB NOT NULL,
       updated_at TIMESTAMP DEFAULT NOW()
     );
     ```

### Running Locally

```sh
node server.js
```

---

## 🧪 API Endpoints

All endpoints require a valid Firebase ID token in the `Authorization: Bearer <token>` header.

### `GET /get-medical-data`

- **Description:** Fetches the authenticated user's medical data.
- **Response:**
  ```json
  [
    {
      "data": {
        /* user medical data */
      }
    }
  ]
  ```

### `POST /store-medical-data`

- **Description:** Creates or updates the user's medical data.
- **Body:**
  ```json
  {
    "medicalData": {
      /* your data */
    }
  }
  ```
- **Response:**
  ```json
  {
    "user_id": "...",
    "data": {
      /* ... */
    },
    "updated_at": "..."
  }
  ```

### `DELETE /delete-medical-data`

- **Description:** Deletes the authenticated user's medical data.
- **Response:**
  ```json
  {
    "message": "Entry deleted",
    "deleted": {
      /* ... */
    }
  }
  ```

---

## 🐳 Docker

Build and run the app in a container:

```sh
docker build -t inet-ready-ehr .
docker run -p 3000:3000 --env-file .env inet-ready-ehr
```

---

## 🚀 Deployment

This app is ready for deployment on [Aptible](https://www.aptible.com/) via GitHub Actions. See `.github/workflows/deploy.yml` for CI/CD setup.

---

## 🤝 Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements and bug fixes.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 📬 Contact

- **Author:** bpmiranda3099
- **Project:** [inet-ready-ehr](https://github.com/your-username/inet-ready-ehr)

---

> _Your Heat Check for Safe and Informed Travel._
