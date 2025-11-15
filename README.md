# Redolent Fragrances

A modern e-commerce website for perfumes featuring a product catalog, custom fragrance builder, shopping cart, and personalized scent quiz.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v14+) for running linting tools
- **Python 3** or **Docker** for serving the application locally

### Running Locally

#### Option 1: Python HTTP Server (Recommended for Development)

```powershell
cd public
python -m http.server 5500
```

Then open http://localhost:5500 in your browser.

#### Option 2: Docker

```powershell
docker-compose up
```

Then open http://localhost:8080 in your browser.

### Development Setup

1. **Clone the repository**
   ```powershell
   git clone <repository-url>
   cd COSC341-team9
   ```

2. **Install dependencies** (for linting)
   ```powershell
   npm install
   ```

3. **Run linter**
   ```powershell
   npm run lint
   npm run lint:fix  # Auto-fix issues
   ```

## 📁 Project Structure

```
COSC341-team9/
├── public/                 # Production frontend (served by nginx)
│   ├── index.html         # Homepage
│   ├── pages/             # All site pages
│   │   ├── shop.html      # Product listing
│   │   ├── product.html   # Product detail
│   │   ├── cart.html      # Shopping cart
│   │   ├── checkout.html  # Checkout flow
│   │   ├── customizer.html # Perfume customizer
│   │   ├── quiz.html      # Scent finder quiz
│   │   ├── account.html   # User account
│   │   ├── blog.html      # Blog listing
│   │   ├── about.html     # About page
│   │   └── contact.html   # Contact page
│   ├── css/
│   │   └── styles.css     # Main stylesheet
│   ├── js/
│   │   ├── main.js        # Homepage interactions
│   │   ├── components/    # Page-specific modules
│   │   │   ├── cart-page.js
│   │   │   ├── checkout.js
│   │   │   ├── customizer.js
│   │   │   └── quiz.js
│   │   └── utils/         # Shared utilities
│   │       ├── cart.js    # Cart management (localStorage)
│   │       ├── header.js  # Site-wide header component
│   │       ├── shop.js    # Shop page logic
│   │       └── product.js # Product page logic
│   ├── data/
│   │   └── products.json  # Sample product data (6 products)
│   └── assets/            # Images, icons, logos
├── docker-compose.yml     # Docker orchestration
├── Dockerfile             # nginx:alpine container config
├── nginx.conf             # nginx configuration
├── package.json           # npm scripts & dependencies
├── .eslintrc.json         # ESLint configuration
└── LAB06.md              # Content inventory & design tokens
```

## 🎨 Design System

### Color Palette (Monochrome)

```css
--bg-color: #C7B59B        /* Main background */
--heading-color: #332715   /* Headings */
--text-color: #33220B      /* Body text */
--accent-color: #61523C    /* Interactive elements */
--highlight-color: #948979 /* Secondary highlights */
```

### Typography

- **Headings**: Playfair Display (serif)
- **Body**: Lato (sans-serif)
- **Base font size**: 16px minimum

### Accessibility Standards

- **Contrast ratio**: 4.5:1 minimum for body text
- **Focus states**: 3px visible outline on all interactive elements
- **Keyboard navigation**: Full support for tab navigation
- **ARIA**: Proper labels on interactive components
- **Semantic HTML**: Use appropriate HTML5 elements

## 🛠️ Core Features

### 1. Shopping Experience
- **Product Catalog** (`/pages/shop.html`) - Filterable grid with sorting
- **Product Detail** (`/pages/product.html`) - Full product information with reviews
- **Shopping Cart** (`/pages/cart.html`) - Add/remove items, update quantities
- **Checkout** (`/pages/checkout.html`) - Shipping & payment flow (stub)

### 2. Customization
- **Perfume Customizer** (`/pages/customizer.html`) - Multi-step custom blend builder
- **Scent Quiz** (`/pages/quiz.html`) - Personalized product recommendations

### 3. Content & Community
- **Blog** (`/pages/blog.html`) - Articles and scent guides
- **User Account** (`/pages/account.html`) - Profile and order history
- **About/Contact** - Brand information and support

## 💾 Data Management

### Cart System

The cart is managed via `public/js/utils/cart.js` using localStorage with key `rf_cart_v1`.

**API:**
```javascript
import { loadCart, saveCart, addItem, removeItem, updateQty, clearCart, getCount } from './utils/cart.js';

// Add item to cart
addItem({ productId: 'p_001', variantId: 'p_001_v1', quantity: 1, price: 49.0 });

// Get current cart
const cart = loadCart();

// Get item count for badge
const count = getCount();
```

### Product Data

Products are stored in `public/data/products.json`. Each product follows this structure:

```json
{
  "id": "p_001",
  "slug": "amber-blossom",
  "name": "Amber Blossom",
  "price": 49.0,
  "currency": "USD",
  "images": ["/assets/images/products/rf-prod-amber-blossom-01.jpg"],
  "badges": ["featured", "new"],
  "notes": {
    "top": ["bergamot"],
    "middle": ["amber"],
    "base": ["vanilla"]
  },
  "tags": ["luxurious", "spicy"],
  "variants": [
    { "id": "p_001_v1", "size": "50ml", "price": 49.0 }
  ],
  "inventory": 12,
  "rating": 4.6
}
```

## 🧪 Code Quality

### ESLint Rules

The project uses `eslint:recommended` with custom rules:

- **Quotes**: Single quotes
- **Semicolons**: Required
- **Indentation**: 2 spaces
- **Line endings**: Unix (LF)

### Running Tests

```powershell
npm run lint        # Check for issues
npm run lint:fix    # Auto-fix issues
```

## 🔄 Workflow

### Branch Strategy

- `main` - Production-ready code
- `feature/*` - New features
- `bugfix/*` - Bug fixes

### Making Changes

1. Create a feature branch
   ```powershell
   git checkout -b feature/your-feature-name
   ```

2. Make your changes in the `public/` directory

3. Test locally (see Quick Start)

4. Run linter
   ```powershell
   npm run lint:fix
   ```

5. Commit and push
   ```powershell
   git add .
   git commit -m "feat(<scope>): <description-of-change>"
   git push origin feature/your-feature-name
   ```

6. Create a Pull Request

## 🎯 Common Tasks

### Adding a New Product

1. Add product object to `public/data/products.json`
2. Add product images to `assets/images/products/` following naming convention:
   - `rf-prod-<slug>-01.jpg` (primary)
   - `rf-prod-<slug>-02.jpg` (alternate)
   - `rf-prod-<slug>-thumb.jpg` (thumbnail)

### Adding a New Page

1. Create HTML file in `public/pages/`
2. Link to CSS: `<link rel="stylesheet" href="../css/styles.css">`
3. Import header utility: `<script src="../js/utils/header.js" type="module"></script>`
4. Add navigation link to header in `public/js/utils/header.js`

### Modifying Styles

- Global styles: `public/css/styles.css`
- Design tokens are defined in `:root` CSS variables
- Follow BEM naming convention for new classes

## 📚 Documentation

- **Content Inventory**: See `LAB06.md` for detailed content requirements
- **API Contracts**: See `.github/copilot-instructions.md` for data models and endpoint specifications
- **Component Specs**: See copilot-instructions.md for component contracts and props

## 🐳 Docker Deployment

The project is containerized with nginx for production deployment.

**Build and run:**
```powershell
docker-compose up --build
```

**Configuration:**
- Base image: `nginx:alpine`
- Port: 8080 (mapped to nginx port 80)
- Static files served from `/usr/share/nginx/html`
- gzip compression enabled
- Security headers configured

## 🚧 Current Status

### ✅ Implemented
- Homepage with hero and featured products
- Shop page with product grid
- Product detail page
- Cart system with localStorage persistence
- Header with dynamic cart count
- All page scaffolds (HTML structure)
- Docker containerization
- ESLint configuration

### 🔨 In Progress
- Customizer multi-step builder
- Quiz logic and recommendations
- Checkout payment integration

### 📋 Planned
- Backend API (REST endpoints)
- User authentication
- Order management
- Review system
- Blog CMS integration

## 🤝 Contributing

1. Follow the ESLint rules (enforced via `npm run lint`)
2. Ensure accessibility standards are met (WCAG 2.1 AA)
3. Test across browsers (Chrome, Firefox, Safari, Edge)
4. Update documentation for new features
5. Write descriptive commit messages

## 📞 Support

For questions or issues:
- Check `LAB06.md` for content guidelines
- Review `.github/copilot-instructions.md` for technical specifications
- Open an issue in the repository

## 📄 License

[Specify your license here]

---

**Happy Building!** 🌸✨
