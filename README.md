# Curations

**Curations** is a high-performance digital bookmarking platform built with **React**, **Supabase**, and **Tailwind CSS**. The application allows users to save and manage a wide range of content types including notes, code snippets, links, and images. 

---

## Overview

Curations enables users to:

* Save notes
* Paste and preview web links
* Embed and highlight code snippets
* Store image URLs with display support

The platform utilizes Supabase Realtime capabilities to sync and persist data dynamically.

---

## Technology Stack

| Layer               | Technology                             |
| ------------------- | -------------------------------------- |
| Frontend            | React                                  |
| Styling             | Tailwind CSS                           |
| Database            | Supabase (PostgreSQL + Realtime)       |
| Syntax Highlighting | PrismJS (via react-syntax-highlighter) |
| Build Tool          | Parcel                                 |

---

## Features

* Real-time sync of all saved entries using Supabase subscriptions
* Multiple content types: notes, images, links, and formatted code
* Card-based UI with responsive design
* Optional media and metadata previews for supported links
* Syntax highlighting for code using PrismJS themes

---
## Screenshots
![Note](assests/image.png)

![Note](assests/imagetwo.png)


---

## Setup Instructions

1. **Clone the Repository**

```bash
git clone https://github.com/YOUR_USERNAME/curations.git
cd curations
```

2. **Install Dependencies**

```bash
npm install
```

3. **Configure Supabase Client**

Edit `services/supabaseClient.js` with your project credentials:

```js
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient('https://your-project.supabase.co', 'public-anon-key');
```

4. **Start the Application**

```bash
npm run dev
```

---

## Supabase Schema Requirements

Create a `scraps` table in Supabase with the following fields:

| Field                           | Type                    |
| ------------------------------- | ----------------------- |
| id                              | UUID (Primary Key)      |
| type                            | Text                    |
| content / url / imageUrl / code | Text                    |
| language                        | Text (nullable)         |
| created\_at                     | Timestamp with timezone |

Ensure Realtime is enabled for the `scraps` table.

---

## Folder Structure

```
├── public/
│   └── index.html
├── src/
│   ├── components/
│   ├── styles/
│   ├── services/
│   └── App.jsx
├── package.json
└── README.md
```

---

## Deployment

This application can be deployed to:

* **Vercel** (recommended for frontend apps)
* **Netlify** (supports Parcel projects)

Ensure your environment variables (if any) are securely configured in the deployment platform.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
