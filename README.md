# Aloo - A Next.js Chat Application

Aloo is a modern chat application built with Next.js and powered by Google's Generative AI. It features a clean, responsive user interface and leverages the latest web technologies to provide a seamless chatting experience.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v20 or later)
- npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/aloo.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd aloo
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Development Server

To start the development server, run the following command:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technologies Used

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/)
- **AI:** [Google Generative AI](https://ai.google.dev/)
- **Markdown Rendering:** [React Markdown](https://github.com/remarkjs/react-markdown) with [Highlight.js](https://highlightjs.org/) for syntax highlighting.
- **Icons:** [Lucide React](https://lucide.dev/)

## Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in development mode with Turbopack.
- `npm run build`: Builds the app for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Lints the code using Next.js's built-in ESLint configuration.

## Project Structure

```
.
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── api/         # API routes
│   │   └── page.tsx     # Main page
│   ├── components/      # React components
│   ├── context/         # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   └── types/           # TypeScript types
├── next.config.ts       # Next.js configuration
├── package.json         # Project dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```
