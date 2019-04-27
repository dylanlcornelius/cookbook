# Cookbook v1.0.0:
---
#### Version 1.0 - The Cookbook
- created CRUD for recipes
- added users to recipes to track recipe authors
- created CRUD for ingredients and tied ingredients to recipies
- switched recipe-ingredients and recipe author to be dynamic and always get current data
- created an admin dashboard and user roles to allow elevated permissions
- utilized Google Sign-in
- added a user pending role to prevent user flooding
- used ngx-cookie-service to remember user
- made a configs table for auto-logout and implemented a session timeout
- added action tracking by week for profile analytics
- created an about page with images of technologies used throughout the project

#### Version 1.1 - A Grocery List
- made all data fetches null-safe
- fixed pending users not working: data was in wrong fields and not locked out of site
- added cascading deletions with self-correcting data fields
- centered ingredient box text
- added "minutes" onto preparation time
- added recipes "Directions" header
- changed steps to multiline input and make more room for ingredient boxes
- changed create and update pages to utilize errorStateMatcher
- created a validation popup component
- created a success and failure, notification modal
- added router animations
- combined create and update pages
- implemented a shopping list page
- wired up ingredient quantities. change "quantity" to "your pantry". create UOM and increments
- created a calculated field for recipe quantities. add ingredient amounts/UOM to ingredient boxes
- specified recipes UOMs and UOM conversions for quick usage
- added an import and export of the database for admins
