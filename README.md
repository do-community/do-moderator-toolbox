# DO Moderator Toolbox

A useful set of moderator tools for the DO Community team.
A compiled Vue app running through a userscript to provide quick and useful actions for moderators.

---

## Features

 - Quick access to moderation queues and their current totals
   - Under review, flagged and unanswered questions
 - Predefined response macros for Community Questions
   - Common issues such as contacting support
 - Easy access to advanced user account moderation actions from posted questions & user profiles
   - Any combination of wiping an account, archiving an account, disabling an account & marking all posts as spam
 
## Installation

[Install the userscript](https://do-community.github.io/do-moderator-toolbox/do-moderator-toolbox.user.js)
 (ensure you have [TamperMonkey](https://www.tampermonkey.net/) or [GreaseMonkey](https://www.greasespot.net/) installed
 as an extension in your browser to run the userscript).

## Usage

1. Log in to the DigitalOcean Community site
2. Press <kbd>`</kbd> (back-tick) on any Community page to active the toolbox

## Modules

## Settings

This module acts as a meta-module, providing options for configuring the toolbox and certain automation within it, as well as minor customisations to the community site.

Some settings may only apply to moderators and will be hidden for non-moderator accounts.

### User

This module contains three sub-features:

#### User posts

Loads all user submitted posts from the API on their profile page, replacing the default Algolia view.

For moderators, this allows them to see posts from the user in all states, not just published items.
For non-moderators, this just returns the published posts in a different format.

#### User details

This expands the user profile sidebar (left-hand side) to include more specific information about the user that the Community stores.

Certain information is restricted for moderators (and your own profile) only, such as the account email address.

#### User actions

**⚠️ Moderator only**

This feature provides an advanced set of buttons on the user profile to quickly take moderation actions against the user such as wiping the account, disabling it or archiving it.

### Tutorials

A simple module that allows for deep-linking to comments on tutorials pages.

### Queues

**⚠️ Moderator only**

Displays the current number of posts in each of a set of internal system queues (posts that are awaiting moderator review, posts that are spam, etc.).

### Questions

This module allows for all published questions from a user to be fetched and displayed on a question page.

For non-moderators, this will only show other published questions.
For moderators, this will show all questions submitted by a user in all states, useful for quickly tracking spammers.

### Macros

This feature provides a decent selection of commonly used macro responses on community.

For non-moderators and moderators, this module will provide a dropdown input on a question page, providing common macros.
For moderators, this feature will also provide a similar set of macro options on user report flags.
