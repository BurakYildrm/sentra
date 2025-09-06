# Technical Assignment - React Developer

## Project Overview

We are developing a new **Frontend Framework** designed to provide a **modular**, **customizable**, and **high-performance** structure tailored for our enterprise needs. This assignment aims to assess your ability to utilize modern frontend technologies and implement robust solutions within our framework.

---

## Problem Statement

Our current admin panel implementation needs enhancements in:

1. **Implementing role-based access control (RBAC)** for secure and dynamic user permissions.
2. **Efficiently managing data** through API integration and state management solutions.
3. **Improving user interface performance** with techniques such as lazy loading.

---

## Detailed Scenario

To make the requirements clearer, here is an example scenario illustrating the use of RBAC, data management, and performance optimizations:

- We have different user roles in the application, such as **Admin**, **Editor**, and **Viewer**.

  - **Admin** users can perform all CRUD (Create, Read, Update, Delete) operations on certain resources (e.g., Users, Articles).
  - **Editor** users can view, create, and update resources but cannot delete them.
  - **Viewer** users can only view resources.

- The application should integrate with an API (or mock endpoints) that provides data for entities like **Users** and **Articles**. Each entity typically has attributes such as `id`, `name`, `role` for Users, and `id`, `title`, `content`, `status` for Articles.

- When fetching data, the UI should show loading indicators (e.g., spinner, skeleton screens). If errors occur (e.g., 401, 403), the user should see relevant notifications or messages.

- Performance can be improved by lazily loading pages or components that users rarely access, and by using conditional rendering to avoid unnecessary renders.

These details illustrate a real-world admin panel scenario where different users with different roles have varying levels of access. You can expand or modify the data model as needed.

---

## Requirements

1. **Develop an admin panel module** that supports RBAC for managing user roles and permissions.
2. **Implement efficient state management and API integration** for data handling.
3. **Optimize the UI performance** through techniques like lazy loading and conditional rendering.
4. **Design Standards and UI/UX Details**

   - Use a component library (e.g., Material-UI, Chakra UI, Ant Design) or a simple design system to ensure consistent styling.
   - Maintain a coherent look and feel across all components.

5. **API Error Handling**

   - Gracefully handle HTTP error codes (e.g., 401, 403) with user notifications (e.g., Toasts/Snackbars).
   - Demonstrate clear strategies for handling and recovering from API or network errors.

6. **User Experience (UX) and Loading States**
   - Show loading indicators, skeleton screens, or other feedback while data is being fetched.
   - Handle empty or error states in tables/lists with clear messaging.

---

## Expected Deliverables

1. **A repository** demonstrating your implementation, including:

   - RBAC-enabled admin panel
   - Effective state management and API integration
   - Performance optimizations in the user interface
   - Mandatory inclusion of design standards, error handling, and loading states

2. **Documentation** explaining:

   - Your approach to implementing RBAC and its benefits
   - How state management is handled and optimized
   - Performance enhancements and their impact
   - How you addressed design standards, user experience, and error handling

3. **Test cases** validating the functionality and performance improvements

---

## Evaluation Criteria

- **Implementation of RBAC** in a real-world scenario
- **Efficiency in data handling and state management**
- **UI/UX quality** (design consistency, error handling, loading states)
- **Clarity and thoroughness of documentation**
- **Code quality** (readability, organization, maintainability)
- **Adequacy of test coverage** and functionality verification

---

## Optional Enhancements ** Bonus Points **

After completing the core requirements, you may choose to demonstrate your expertise in one of these areas:

1. **Server-Side Rendering (SSR)**

   - Implement SSR using Next.js
   - Demonstrate improved initial page load performance
   - Handle SEO considerations with proper meta tags
   - Show understanding of SSR vs CSR tradeoffs

2. **Advanced State Management**

   - Implement data caching for better performance
   - Add offline functionality for critical features
   - Demonstrate optimistic updates in the UI

3. **CI/CD and Deployment**

   - Set up a basic GitHub Actions pipeline
   - Include automated testing
   - Deploy to a cloud platform (e.g., Vercel, Netlify)

---

## Submission Guidelines

Please provide a **GitHub repository link** with your complete solution, including all code, documentation, and test cases.

---

## Duration

You have **7 days** to complete this assignment. If you have any questions, please reach out to us at [eren.kan@smartface.io] and [ali.pinar@smartface.io].
