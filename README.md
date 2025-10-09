# BomCorte - Black Friday Campaign Platform

This project is a comprehensive, self-contained web application for creating, managing, and deploying a lead-capture landing page, specifically tailored for a Black Friday campaign for a fictional tool company, "BomCorte".

It features a public-facing landing page and a complete password-protected admin panel for real-time content editing, lead source configuration, and campaign monitoring. The entire application is built with React and TypeScript and runs entirely in the browser, using LocalStorage for data persistence.

## ✨ Features

### 🛒 Landing Page
- **Dynamic Content**: All text, images, colors, and features are fully customizable through the admin panel.
- **Countdown Timer**: A prominent "Black November" countdown timer to create urgency.
- **Lead Capture Form**: A multi-step form with CEP-based location auto-fill, international phone number support, and input masking.
- **Product Showcase**: A dedicated section to display featured products on sale.
- **Responsive Design**: Fully responsive layout for optimal viewing on desktops, tablets, and mobile devices.

### 🔒 Admin Panel
- **Secure Access**: Protected by a mock authentication system with different user roles (Admin, Editor, Viewer).
- **Campaign Dashboard**: An overview of key campaign metrics like total leads, traffic sources, top regions, and representative performance (using mock data).
- **Live Landing Page Editor**: A user-friendly interface to change the landing page's logo, background, titles, descriptions, features, products, and color palette in real-time.
- **Lead Source Management**: Configure different lead sources (e.g., Landing Page, Organic), manage required fields, and set up webhook integrations.
- **User Management**: (Admin only) Create and delete users with different permission levels.

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/) (with Hooks)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Context API
- **Client-side Storage**: Browser LocalStorage for persisting content edits and user data.

## 📂 Project Structure

```
.
├── components/          # Reusable React components
│   ├── admin/           # Components for the Admin Panel
│   ├── auth/            # Authentication components (Login page)
│   └── ...              # UI components for the landing page
├── contexts/            # React Context providers (e.g., AuthContext)
├── types.ts             # TypeScript type definitions
├── constants.ts         # Initial data and constants
├── App.tsx              # Main application component with routing logic
└── index.tsx            # Application entry point
```

## 🚀 Getting Started

This application is designed to run in a specific web-based development environment that automatically handles dependencies and setup.

To explore the application:

1.  **Home Page**: The initial view provides two options:
    - **View Landing Page**: See the campaign page as a visitor.
    - **Access Panel**: Log in to the admin area.

2.  **Admin Access**:
    - Navigate to the Admin Panel.
    - Use the following mock credentials to log in:
      - **Email**: `admin@bomcorte.com`
      - **Password**: `password123`
    - You can also log in with `editor@bomcorte.com` or `viewer@bomcorte.com` to test the different user roles.

## 🎨 Customization

Almost every aspect of the landing page can be customized via the **Admin Panel -> Editor da Landing Page**. Changes are saved to your browser's LocalStorage and will persist on your machine.

- **General**: Change the logo and background image.
- **Header**: Edit the main titles and description.
- **Features**: Add, remove, or edit the feature highlights below the description.
- **Products**: Toggle the product section, change its title, and manage the list of products with their names and images.
- **Colors**: Adjust the site-wide color palette to match your brand.
