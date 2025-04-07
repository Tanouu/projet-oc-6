# P6-Full-Stack-reseau-dev

## BDD

Create a database in postgresql

# .env file

Create a `.env` file in the root directory of your project (next to the README) and add the following environment variables:

```env
DB_URL=jdbc:postgresql://localhost:5432/your_database_name
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password

# JWT secret key (must be secure and at least 256 bits)
JWT_SECRET=your_very_secure_jwt_secret_key
```

Here is an example of a JWT secret key:

```env
JWT_SECRET=e0gkZlQ2Rkt3NGRzVG9qQlMzd3BwbklzQkt3RGtGcDJOSkd5TXNQU0pKa1plb2w3c2ViNHBLcDFvZ3NHOVpLMG1EVlFkQUc1RkpWVFhYTWd4YlpibE5jcUdPZ01rRzlURQ==
```

# Back
## Run the application

To run the application, launch the MddApiApplication class.

```ini
back/src/main/java/com/openclassrooms/mddapi/MddApiApplication.java
```

This will start the Spring Boot application on port 8080.

# Front

## API Backend Configuration

### Development

The application uses a proxy (`proxy.conf.json`) to redirect `/api/*` requests to the backend API.

To make it work, update the `proxy.conf.json` file:

```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true
  }
}
```

## Run the application

To run the application, use the following command:

```bash
cd front 
```

```bash
ng serve --proxy-config proxy.conf.json
```

This will start the Angular application on port 4200.
You can access the application at `http://localhost:4200`.






