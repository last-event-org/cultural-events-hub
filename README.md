# Cultural Events Hub: A Last-Minute Ticketing Solution

## Project Overview

Cultural Events Hub is a collaborative project aimed at revitalizing local cultural scenes by offering a unique platform where event organizers can list their events and sell discounted last-minute tickets (within 72 hours of the event start time). This dual-purpose platform serves as both an event agenda and a spontaneous entertainment guide, encouraging locals to explore new and unexpected cultural experiences in their region.

## Key Features

- Event Listing: Organizers can easily add their events to the platform, providing details such as date, time, venue, and a brief description.
- Last-Minute Ticketing: Event organizers have the option to sell discounted tickets for their events starting from 72 hours before the event begins. This feature aims to boost attendance and reduce unsold tickets.
- User HomePage: Users can browse through various cultural events happening in their region, filter by categories, and purchase last-minute tickets directly from the platform.
- Spontaneous Entertainment Guide: Encouraging users to discover new events and experiences, this feature highlights events that are about to happen within the next 24-48 hours, perfect for those looking for something to do spontaneously.
- Localization: give the possibility to select their preferred language.
- Dark Mode.

## Technology Stack

### Backend:
- Developed using Adonis.js, a Node.js-based framework.
- It will handle all server-side logic, including user authentication, event management, and ticket sales processing.
- The project will implement an MVC architecture.
- The Database will be built on MySQL and managed via Adonis.Js Lucid query builder.

### Frontend:
- The user interface will be crafted using Adonis.js Edge template engine and Tailwind CSS.
- Responsive design ensuring a seamless experience across devices.
- All the project views will be based on sample files created with Figma.

## APIs

- Graph API: Meta Api to manage Facebook actions
- OpenStreetMap: API using Javascript library Leaflet for geo-localisation

## UX Design

There will be 3 roles on the platform:

- Admin
- User
- Vendor

### The Admin will be able to do the following things:

- CRUD (Create, Read, Update & Delete) all events, Users and Vendors
- Access all sales related data

### The User will be able to do the following things:

- Create a User profile
- See all the events located in a defined place
- See all the events located nearby (Geolocalization)
- See all the events based on a specified category
- Buy event tickets
- Add an event to my 'wishlist'
- Add Vendors to 'favourites'
- Manage a notifications system based on the event localisation or 'favourites' Vendors
- See events with a discounted price
- Add the event in my calendar (Google)
- Access a User Dashboard including the User wishlist, favourites, purchase history, settings.

### The Vendor will be able to do the following things:

- Create a Vendor profile
- Create multiple event locations
- Can Create, Read, Update & Delete his events
- Add an event coming from Facebook Event (Graph API ?)
- Can offer the purchase to a discounted price
- Promote his events by purchasing Ads
- Access a Vendor Dashboard including the sales history, Location list, settings.
