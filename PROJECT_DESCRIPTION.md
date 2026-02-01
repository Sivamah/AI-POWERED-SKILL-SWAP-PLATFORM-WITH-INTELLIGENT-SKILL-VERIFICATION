# Skill Swap AI: Project Description

## Overview
Skill Swap AI is a decentralized, peer-to-peer knowledge exchange platform designed to democratize education. It enables users to teach skills they possess in exchange for credits, which can then be used to learn new skills from other verified tutors. The platform leverages Artificial Intelligence to optimize matchmaking and validate user expertise, creating a self-sustaining educational ecosystem.

## Core Features
-   **Smart Matchmaking**: Utilizes TF-IDF and cosine similarity algorithms to connect learners with the most suitable tutors based on skill offerings and learning requirements.
-   **Credit-Based Economy**: Implements a tokenized system where teaching earns credits and learning consumes them, ensuring balanced participation.
-   **Verified Skills**: Employing AI-driven validation mechanisms to ensure tutor expertise and instructional quality.
-   **Session Management**: Integrated scheduling and session tracking for seamless coordination between peers.

## Technical Implementation

### Frontend Architecture
-   **Framework**: Built with **React** and **Vite** for high-performance, client-side rendering.
-   **Styling**: Utilizes **Tailwind CSS** for a responsive, modern design system with custom "Glassmorphism" aesthetics.
-   **State Management**: React Hooks (`useState`, `useEffect`) govern local component state and API integration.

### Backend Architecture
-   **API Framework**: Powered by **FastAPI** (Python) for high-concurrency, asynchronous API handling.
-   **Database**: Uses **SQLModel** (SQLite in development) for ORM-based relational data management.
-   **Authentication**: Secure user sessions managed via **JWT (JSON Web Tokens)** OAuth2 schemes.

### AI Engine
-   **Library**: **Scikit-learn** provides the core machine learning capabilities.
-   **Logic**:
    1.  **Vectorization**: User skills and requests are converted into TF-IDF vectors.
    2.  **Matching**: Cosine similarity calculates the relevance score between a learner request and available tutors.
    3.  **Filter**: Top-k candidates are returned to the frontend for selection.
