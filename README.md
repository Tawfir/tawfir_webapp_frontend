# TAWFIR - Admin/Restaurant Portals

This is a repo containing the main admin and restaurant portal management for the overall application. 

Follow these steps to run the application locally on your machine.

### 1. Install Dependencies
```sh
# Step 3: Install the necessary dependencies.
npm i
```

### 2 Start Development Servers
```sh
npm run dev
```

### 3. Access the application

- **Admin Panel:** http://127.0.0.1:8000/admin
- **Restaurant Panel:** http://127.0.0.1:8000/restaurant

**Login Credentials:**
Admin portal (/admin/login)
- Email: admin@example.com
- Password: password

Restaurant portal (/login)
- Email: restaurant@example.com
- Password: password

## Notes

- Keep both terminal windows running while developing
- The application is configured to run on HTTP in local environment (not HTTPS)
- Assets are automatically compiled by Vite in watch mode