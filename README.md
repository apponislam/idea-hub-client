# IdeaHub Client - Sustainability Idea Sharing Platform

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://idea-hub-client.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.2-blue)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue)](https://react.dev/)

The frontend for IdeaHub, a community platform where users can share and discuss sustainability ideas. Built with Next.js, Tailwind CSS, and NextAuth.js.

## Features

-   **User Authentication**: Secure login with NextAuth.js
-   **Idea Management**: Create, view, and interact with sustainability ideas
-   **Voting System**: Upvote/downvote ideas (Reddit-style)
-   **Comments**: Nested comment system for discussions
-   **Responsive Design**: Works on all device sizes
-   **Modern UI**: Built with Radix UI and Tailwind CSS

## Live Demo

The application is live at: [https://idea-hub-client.vercel.app/](https://idea-hub-client.vercel.app/)

## Database Schema

![Database Diagram](https://i.ibb.co.com/j9PQq4T6/Blank-diagram.png)

## Installation

```bash

# Clone the repository

git clone https://github.com/yourusername/idea-hub-client.git

# Navigate to the project directory

cd idea-hub-client

# Install dependencies

npm install

# Set up environment variables

Create a .env file based on .env.example

# Run the development server

npm run dev
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash

# Next.js Client Configuration

NEXT_PUBLIC_CLOUD_NAME="cloudinary cloud name"
NEXT_PUBLIC_BASE_API="http://localhost:5000"

# NextAuth.js Configuration

NEXTAUTH_SECRET="your-strong-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

## Technologies Used

-   **Framework**: Next.js 15
-   **Styling**: Tailwind CSS
-   **UI Components**: Radix UI, ShadCN
-   **Animation**: Framer Motion
-   **Form Management**: React Hook Form + Zod
-   **Authentication**: NextAuth.js
-   **State Management**: React Context
-   **Icons**: Lucide React
-   **Notifications**: Sonner

## Available Scripts

```bash

# Run development server

npm run dev

# Build for production

npm run build

# Start production server

npm run start

# Lint code

npm run lint
```

## Dependencies

See the full list in [package.json](#) (link to your package.json if hosted)

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact

For any questions or suggestions, please contact [Appon Islam] at [11appon11@gmail.com].
