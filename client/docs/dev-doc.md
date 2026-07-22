# 📂 Project Documentation

Welcome to the official documentation for this project!  
This README covers everything you need — project structure, setup, coding guidelines, contribution rules, and phase assignments.

---

## 📖 Developer Docs

### ⚙️ Setup

1. **Clone the repository**

```bash
git clone https://github.com/cyaxiom/Ethiohope.git
cd Ethiohope
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npm run dev
```

4. **Build for production**

```bash
npm run build
```

---

### 🧩 Project Structure

```
/src
  /pages         → Main app pages
  /components    → Reusable UI components
  /layouts       → Shared layouts
  /hooks         → Custom React hooks
  /store         → State management
  /utils         → Helper functions
  /assets        → Images, fonts, styles
/docs            → Developer documentation
```

---

### 📝 Coding Guidelines

- Use **React functional components** with hooks.
- Follow **component-based architecture**.
- Keep files small and reusable.
- Use **Tailwind CSS** for styling.
- Naming conventions:
  - Components → `PascalCase`
  - Hooks/Functions → `camelCase`
  - Files/Folders → `kebab-case`
- Use **path aliases** (`@components`, `@utils`, `@pages`, etc.) for clean imports.

---

### 📄 Page Examples

Each page should import components, layouts, or utils using path aliases.  
Keep them **minimal** and **focused**.

#### 🏠 Home Page (`Home.jsx`)

```jsx
import React from 'react';
import Banner from '@components/Home/Banner';
import Features from '@components/Home/Features';

function Home() {
  return (
    <div>
      <Banner />
      <Features />
    </div>
  );
}

export default Home;
```

> 💡 Here, the `Home` page imports two components: `Banner` and `Features`.  
> You can easily integrate multiple components this way to build complex pages.

#### ℹ️ About Page (`About.jsx`)

```jsx
import React from 'react';
import Team from '@components/About/Team';

function About() {
  return (
    <section>
      <Team />
    </section>
  );
}

export default About;
```

#### 🔐 Login Page (`Login.jsx`)

```jsx
import React from 'react';
import LoginForm from '@components/Auth/LoginForm';

function Login() {
  return (
    <div className="flex justify-center items-center h-screen">
      <LoginForm />
    </div>
  );
}

export default Login;
```

#### 📊 Dashboard Page (`Dashboard.jsx`)

```jsx
import React from 'react';
import Sidebar from '@components/Dashboard/Sidebar';
import Overview from '@components/Dashboard/Overview';

function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        <Overview />
      </main>
    </div>
  );
}

export default Dashboard;
```

#### ⚙️ Settings Page (`Settings.jsx`)

```jsx
import React from 'react';
import ProfileSettings from '@components/Settings/ProfileSettings';

function Settings() {
  return (
    <div>
      <ProfileSettings />
    </div>
  );
}

export default Settings;

---

```

## 🎨 Theming (Light & Dark Mode)

This project includes a **custom light/dark theme system** using Tailwind CSS variables defined in `index.css`. Developers can easily switch between themes using the `ThemeProvider` hook.

### ✅ Example Usage

```jsx
import React from 'react';
import { useTheme } from '@provider/ThemeProvider/ThemeProvider';

function ThemeExample() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-6 transition-colors duration-300">
      <h1 className="text-3xl font-bold">Theme Example</h1>
      <p className="text-muted-foreground">Current theme: {theme} mode</p>
      <button
        onClick={toggleTheme}
        className="bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow hover:opacity-90 transition"
      >
        Toggle Theme
      </button>
    </div>
  );
}

export default ThemeExample;
```

### 🔑 Key Points

- Theme colors are defined in `index.css` under `:root` for **light mode** and `.dark` for **dark mode**.
- Utility classes like `bg-background`, `text-foreground`, `bg-primary`, etc., are automatically applied.
- Use `useTheme()` hook to:
  - `theme` → get current theme (light/dark).
  - `toggleTheme()` → switch themes dynamically.

---

### 🗂 Page Assignment Phases

#### Phase 1 – First Half of Pages

| Group   | Developers          | Pages Assigned                                                                         |
| ------- | ------------------- | -------------------------------------------------------------------------------------- |
| Group 1 | Dev 1, Dev 2, Dev 3 | `/pages/home`, `/pages/about`                                                          |
| Group 2 | Dev 4, Dev 5, Dev 6 | `/pages/community`, `/pages/academy/KidsProgramming`, `/pages/academy/Web3Development` |
| Group 3 | Dev 7, Dev 8, Dev 9 | `/pages/services/KidsTutor`, `/pages/services/ProgrammingService`                      |

#### Phase 2 – Second Half of Pages

| Group   | Developers          | Pages Assigned                                                   |
| ------- | ------------------- | ---------------------------------------------------------------- |
| Group 1 | Dev 1, Dev 2, Dev 3 | `/pages/academy/FullStackDev`, `/pages/academy/KidsTutorial`     |
| Group 2 | Dev 4, Dev 5, Dev 6 | `/pages/services/EthiohopeService`, `/pages/auth`                |
| Group 3 | Dev 7, Dev 8, Dev 9 | `/pages/dashboard` & subpages including `/settings` & `/courses` |

> 💡 Each group should collaborate internally to complete their assigned pages during the respective phase. After completion, they can request a review for merging into `dev-branch`.

---

### 🧪 Testing

We use **Vitest + React Testing Library**:

```bash
npm run test
```

Write tests in the `__tests__` folder next to components:

```
/src/components/Button.jsx
/src/components/__tests__/Button.test.jsx
```

---

### 🤝 Contributing

We welcome contributions! Please follow these steps carefully:

1. **Create a new branch** (never push directly to `main`):

```bash
git checkout -b feature/your-feature
```

2. **Make your changes** and commit them:

```bash
git commit -m "Add: your feature"
```

3. **Push your branch** to GitHub:

```bash
git push origin feature/your-feature
```

4. **Open a Pull Request (PR)** on GitHub

- Go to the repository page.
- Click **Compare & Pull Request**.
- Add a clear description of your changes.

5. **Wait for review & approval**

- Another team member will review your code.
- Make changes if requested.

6. **Merge into dev-branch**

- Once approved, the PR will be merged into `dev-branch`.
- Delete the feature branch after merging to keep the repo clean.

---

### 📌 Useful Links

- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [React Query Docs](https://tanstack.com/query/latest)

---

[⬆ Back to Top](#-project-documentation)
