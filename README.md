# 🚀 Next.js App

A modern Next.js application bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## ✨ Features

- ⚡ **Next.js 14** - The React Framework for Production
- 🎨 **Geist Font** - Modern typography by Vercel
- 🔄 **Hot Reload** - Instant feedback during development
- 📱 **Responsive Design** - Works on all devices
- 🛠️ **TypeScript Ready** - Built with TypeScript support

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js installed on your machine.

### Installation & Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd your-project-name
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see your application running.

### 🎯 Quick Start

You can start editing the homepage by modifying `app/page.tsx`. The page auto-updates as you edit the file thanks to Next.js's hot reload feature.

## 🖋️ Typography

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load **Geist** — a modern font family created by Vercel for optimal readability and performance.

## 📁 Project Structure

```
├── app/                    # App directory (App Router)
│   ├── page.tsx           # Homepage
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── public/                # Static assets
├── next.config.js         # Next.js configuration
└── package.json           # Dependencies and scripts
```

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run install-chrome` | Install Chrome for PDF generation |

## 📄 PDF Generation Setup

This application includes a PDF generation feature that uses Puppeteer to convert web pages to PDF. To use this feature:

### Prerequisites
1. **Install Chrome for Puppeteer**:
   ```bash
   npm run install-chrome
   ```
   
   This will install the Chrome browser required by Puppeteer.

### Usage
The PDF generation API is available at `/api/pdf` and accepts a URL parameter:
```
GET /api/pdf?url=https://example.com
```

### Troubleshooting
- If you encounter "Could not find Chrome" errors, run `npm run install-chrome`
- For production deployments, consider using a Docker container with Chrome pre-installed
- The API includes fallback mechanisms and detailed error messages for debugging

## 📚 Learn More

Expand your Next.js knowledge with these resources:

- 📘 [**Next.js Documentation**](https://nextjs.org/docs) - Learn about Next.js features and API
- 🧠 [**Learn Next.js**](https://nextjs.org/learn) - Interactive Next.js tutorial
- 💻 [**Next.js GitHub Repository**](https://github.com/vercel/next.js/) - Your feedback and contributions are welcome!

## 🌐 Deployment

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)

### Other Deployment Options

- **Netlify** - [Deploy to Netlify](https://docs.netlify.com/integrations/frameworks/next-js/)
- **Railway** - [Deploy to Railway](https://railway.app)
- **DigitalOcean** - [App Platform](https://www.digitalocean.com/products/app-platform/)

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <strong>Built with ❤️ using Next.js</strong>
</div>
