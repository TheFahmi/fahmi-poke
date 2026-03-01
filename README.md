# <img src="https://archives.bulbagarden.net/media/upload/4/4b/Pok%C3%A9_Ball_icon.png" width="30"> Pokémon Explorer: Gotta Catch 'Em All! <img src="https://archives.bulbagarden.net/media/upload/4/4b/Pok%C3%A9_Ball_icon.png" width="30">

<div align="center">
  <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" alt="Pikachu" width="150" style="float:left;">
  <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png" alt="Charizard" width="180">
  <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png" alt="Blastoise" width="150" style="float:right;">
</div>

<div align="center">
  <img src="https://img.shields.io/badge/vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue.js">
  <img src="https://img.shields.io/badge/tailwindcss-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/PokéAPI-EF5350?style=for-the-badge&logo=pokemon&logoColor=white" alt="PokéAPI">
</div>

<div align="center">
  <h3>🔴 ⚪ Start your Pokémon journey today! ⚪ 🔴</h3>
</div>

## 📖 Your Pokédex Guide

Welcome, Pokémon Trainer! The Pokémon Explorer is your digital Pokédex built with Vue 3 and Tailwind CSS. Browse, search, and capture your favorite Pokémon from across all regions. With data directly from the [PokéAPI](https://pokeapi.co/), this responsive Pokédex is your ultimate companion on your journey to become a Pokémon Master!

## Features

### Core Features
- **Browse Pokémon**: View a list of Pokémon with infinite scroll loading
- **Search**: Search for Pokémon by name
- **Filter by Type**: Filter Pokémon by their types (Fire, Water, Grass, etc.)
- **Favorites**: Add Pokémon to your favorites list for quick access
- **Detailed View**: View detailed information about each Pokémon

### UI/UX Features
- **Responsive Design**: Works on mobile, tablet, and desktop devices
- **Splash Screen**: Engaging splash screen with animations when the app loads
- **Skeleton Loading**: Skeleton placeholders while content is loading
- **Animations**: Smooth animations for favoriting Pokémon and other interactions
- **Glass Morphism**: Modern UI with glass-like effects
- **Dark Mode**: Comfortable viewing in low-light environments

### Technical Features
- **Offline Support**: Fallback data when API is unavailable
- **State Management**: Centralized state management with Pinia
- **Lazy Loading**: Images and components load only when needed
- **TypeScript Support**: Type safety throughout the application
- **Optimized Performance**: Fast loading and rendering

## Getting Started 🚀

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```sh
git clone https://github.com/TheFahmi/fahmi-poke.git
cd fahmi-poke
```

2. Install dependencies
```sh
npm install
# or
yarn install
```

3. Start the development server
```sh
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```sh
npm run build
# or
yarn build
```

### Deployment

This project is configured for automatic deployment to Vercel. When you push to the main branch, GitHub Actions will automatically deploy your changes to Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FTheFahmi%2Ffahmi-poke)

#### Setting up Vercel Deployment

1. Fork this repository
2. Create a Vercel account at [vercel.com](https://vercel.com) if you don't have one
3. Import your forked repository in Vercel
4. Add the following secrets to your GitHub repository:
   - `VERCEL_TOKEN`: Your Vercel API token
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `VERCEL_PROJECT_ID`: Your Vercel project ID
5. Push to the main branch to trigger a deployment

## Project Structure

```
/
├── public/          # Static assets
├── src/             # Source code
│   ├── assets/      # Images and other assets
│   ├── components/   # Vue components
│   ├── stores/       # Pinia stores
│   ├── App.vue       # Main app component
│   └── main.js       # App entry point
├── index.html       # HTML template
├── package.json     # Project dependencies
└── vite.config.js   # Vite configuration
```

## Technologies Used

- [Vue 3](https://v3.vuejs.org/) - Progressive JavaScript framework
- [Vite](https://vitejs.dev/) - Next-generation frontend tooling
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Pinia](https://pinia.esm.dev/) - Intuitive, type safe store for Vue
- [PokéAPI](https://pokeapi.co/) - RESTful Pokémon API

## Features in Detail

### Infinite Scroll
The app implements infinite scrolling to load more Pokémon as the user scrolls down the page, providing a seamless browsing experience without pagination.

### Favoriting System
Users can favorite Pokémon by clicking the heart icon. Favorited Pokémon are stored locally and can be viewed in the Favorites tab. The favoriting action includes a delightful animation with floating hearts.

### Skeleton Loading
While data is being fetched, the app displays skeleton loading placeholders that match the shape and size of the actual content, reducing perceived loading time.

### Splash Screen
A visually appealing splash screen with animations is displayed when the app first loads, creating an engaging first impression.

### Responsive Design
The app is fully responsive and works well on devices of all sizes, from mobile phones to desktop computers.

## Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [PokéAPI](https://pokeapi.co/) for providing the Pokémon data
- [Pokémon](https://www.pokemon.com/) for the inspiration