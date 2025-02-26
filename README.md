# Angular GitHub Explorer

## 🚀 Overview
This project is an Angular-based application that allows users to search for GitHub repositories and view their commits using the GitHub API. It includes features like:

- Repository search with filtering options (by name, language, stars, and issue content).
- Lazy-loaded routes for better performance.
- Results with pagination.
- Signals for efficient UI updates.
- TailwindCSS for styling.

## 📌 Features
- **Search Repositories**: Find repositories using GitHub's API with filtering options.
- **View Commits**: See the commit history of a selected repository.
- **Pagination**: Navigate results using Angular Material's paginator.
- **Optimized UI Update**: Using Signals for efficiency.

## 🏗️ Installation
### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v19+ recommended)
- [Angular CLI](https://angular.io/cli)

### Steps to Run Locally
```sh
# Clone the repository
git clone https://github.com/ngakui/github-assessment.git
cd github-assessment

# Install dependencies
npm install

# Generate environments
ng genrate environments
```
# Add environments variables
```
github_api: 'https://api.github.com',
apiUrl: 'https://api.github.com/search',
```
# Run the development server
`ng serve`

Now open `http://localhost:4200/` in your browser.

## 🛠️ Usage
### Searching for Repositories
1. Navigate to `/repos`.
2. Enter a repository name, language, or issue content.
3. Click on a repository to view its commits.

### Viewing Commits
1. Click on a repository from the search results.
2. The `/commits` page will show a list of commits with:
   - Commit author
   - Commit message
   - URL to the commit on GitHub
3. Use the paginator to navigate through commit history.

## 📂 Project Structure
```
/src
 |-- app/
 |   |-- features/   # Contain all project feature
 |       |-- commits # Commit related files (models, services, component) 
 |       |-- repos   # Repos related files (models, services, component) 
 |   |-- helpers/    # Contain custom helpers
 |   |-- app.config.ts # Main Angular configuration file
 |   |-- app-routes.ts # Routes configuration
```

## 🔧 Technologies Used
- **Angular 19+** (Framework)
- **RxJS** (Reactive Programming)
- **TailwindCSS** (Styling)
- **Angular Material** (UI Components)
- **GitHub API** (Data Source)
- **Signals** (Efficient UI updates)

## ✅ Future Improvements
- Implement authentication using GitHub OAuth.
- Add more filters for repository search.
- Improve UI/UX with animations and better responsiveness.
- Add Local storage management to avoid Github rate limit.
- Add Tests.

## 📝 License
This project is licensed under the MIT License.
