
# CampusCircle Application

## Application’s Purpose
CampusCircle is a collaborative platform designed to connect students, share knowledge, and foster teamwork.  
Its purpose is to create an inclusive space where ideas grow, skills are developed through projects, and learning becomes a collective experience.

---

## Libraries

### 1. Frontend
- **HTML / CSS / JavaScript**: The core technologies of the web, used to build structure, style, and interactivity.  
- **TypeScript (TS)**: A typed superset of JavaScript that helps prevent errors and improves maintainability.  
- **React**: A powerful library for building fast, modular, and reusable user interfaces.  
- **Vite**: A modern and lightning-fast build tool and development server for React apps.  

### 2. Backend
- **TailwindCSS**: A utility-first CSS framework that allows fast and flexible styling.  
- **GSAP (GreenSock Animation Platform)**: An advanced animation library for smooth, professional interactions.  

### 3. Develop
- **Git / GitHub**: Version control and collaborative development platform.  
- **ESLint**: A tool to analyze code and enforce consistent quality standards.  
- **Prettier**: An automatic code formatter to keep code clean and readable.  

### 4. Others
- **Husky**: Automates tasks like running tests or linters before committing code.  
- **Lodash**: A utility library that simplifies working with arrays, objects, and functions.  

---

## Code of Conduct

### 1. Collaboration
- Respect the ideas and contributions of others.  
- Review teammates’ work with constructive feedback.  
- Ask for help when needed and offer support when possible.  

### 2. Work Style
- Use the defined Commit Convention (`feat`, `fix`, etc.).  
- Follow the Branching Model (`main`, `dev`, `feature`, `release`, `hotfix`).  
- Create Pull Requests with clear descriptions and wait for review.  

### 3. Code Quality
- Keep code clear, clean, and well-documented.  
- Ensure tests and builds pass before merging.  
- Avoid code duplication and apply refactoring when necessary.  

### 4. Respect and Communication
- Always communicate with professionalism and respect.  
- Be punctual with deliveries and inform the team if a blocker arises.  
- Value teamwork above individual work.  

### 5. Security and Trust
- Do not commit sensitive information to the repository.  
- Follow security best practices for dependencies and libraries.  
- Trust the review process before pushing to production.  

---

## Convention of Commits

We use **Conventional Commits** to keep a clean and clear history.  
All commits must follow this format:


### Allowed types
- **feat**: Used to add a new feature.  
- **fix**: Used to fix a bug.  
- **style**: Changes related to formatting, without affecting functionality (spaces, commas, etc.).  
- **refactor**: Changes that improve code without fixing bugs or adding features.  
- **file**: Changes on scaffolding or adding a new file.  

### Rules
- Max 50 characters in subject  
- No period (`.`) at the end  
- Use English and present tense  
- Add body only if explanation is needed  

### Examples
1. `feat: add user profile page with avatar upload and bio section`  
2. `fix: prevent crash when user submits form with empty username field`  
3. `style: reformat CSS classes and align button spacing in header`  

---

## Branching Model

We use a **trunk-based approach**, with `main` as the primary branch and `dev` as the branch for ongoing changes and fixes.  
This structure helps us keep the project organized, safe, and easy to manage when working as a team.

### Types of branches
- **Main**: Stable code, what is released to production.  
- **Dev**: Integration space where all new features are merged before release.  
- **Feature**: Each new page or function is developed in its own branch (e.g., chat, calendar, groups).  
- **Release**: Used to prepare a new version before going live.  
- **Hotfix**: For urgent fixes applied directly in production.  

