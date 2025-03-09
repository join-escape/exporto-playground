# Notion Convert Playground

powered by [notion-to-md v4](https://github.com/souvikinator/notion-to-md/tree/v4.0.0-alpha)

## Overview

Notion Convert Playground is a simple tool that provides a seamless interface for converting Notion pages to various formats (MD, MDX, JSX, HTML, etc...) while maintaining the structure, formatting, and content hierarchy. 

## Status

Under development


## Getting Started

### Prerequisites

- Node.js 18.x
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/notion-converter-playground.git
cd notion-converter-playground
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Create a `.env.local` file in the root directory and add your environment variables:

```
# Notion API
NOTION_CLIENT_ID=your_notion_client_id
NOTION_CLIENT_SECRET=your_notion_client_secret
NOTION_REDIRECT_URI=http://localhost:3000/api/auth/callback/notion

# Authentication (NextAuth)
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000/playground](http://localhost:3000/playground) in your browser.

## Usage

### Converting a Notion Page

1. Connect to your Notion workspace:
   - Sign in with your account (Google/GitHub) and authorize the Notion integration
   - OR enter your Notion integration key directly

2. Select a page from your workspace or enter a page ID

3. Choose your desired output format

4. Click "Convert" to generate your content

5. Use the action buttons to download, copy, or share your converted content

### Creating a Notion Integration Key

If you prefer to use an integration key instead of signing in:

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Name your integration and submit
4. Copy the "Internal Integration Token"
5. Share the specific Notion pages you want to access with your integration

## Contributing

We welcome contributions to improve Notion Converter Playground! Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests to ensure everything works as expected
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines

- Follow the existing code style and component structure
- Write meaningful commit messages
- Add appropriate comments for complex logic
- Update documentation for significant changes
- Important: Try to use SSR as and when possible 

## Support & Feedback

For support or feedback, please [open an issue](https://github.com/notion-convert/notion-converter-playground/issues)

---

Built with ❤️ for Notion users everywhere
