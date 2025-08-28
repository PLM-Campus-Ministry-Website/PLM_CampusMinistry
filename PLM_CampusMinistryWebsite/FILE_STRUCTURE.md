# PLM Campus Ministry - File Structure

## Project Overview
This is an Ionic Angular application with Capacitor for cross-platform mobile development, specifically designed for PLM Campus Ministry.

## ASCII File Structure

```
PLM_CampusMinistry/
└── PLM_CampusMinistryWebsite/
    ├── 📱 android/                          # Android platform files
    │   ├── app/
    │   │   ├── build.gradle                 # App-level build configuration
    │   │   ├── src/main/
    │   │   │   ├── java/                    # Java source files
    │   │   │   └── res/                     # Android resources
    │   │   └── proguard-rules.pro           # ProGuard rules
    │   ├── build.gradle                     # Project-level build configuration
    │   ├── capacitor.settings.gradle        # Capacitor Android settings
    │   ├── gradle.properties                # Gradle properties
    │   ├── gradlew                          # Gradle wrapper script (Unix)
    │   ├── gradlew.bat                      # Gradle wrapper script (Windows)
    │   └── settings.gradle                  # Gradle settings
    │
    ├── 🌐 src/                              # Source code directory
    │   ├── app/                             # Application components
    │   │   ├── app.component.html           # Main app template
    │   │   ├── app.component.scss           # Main app styles
    │   │   ├── app.component.ts             # Main app component
    │   │   ├── app.module.ts                # Main app module
    │   │   ├── app-routing.module.ts        # Application routing
    │   │   ├── home/                        # Home page module
    │   │   │   ├── home.page.html
    │   │   │   ├── home.page.scss
    │   │   │   ├── home.page.ts
    │   │   │   ├── home.module.ts
    │   │   │   └── home-routing.module.ts
    │   │   ├── prayer/                      # Prayer module
    │   │   │   ├── prayer.page.html
    │   │   │   ├── prayer.page.scss
    │   │   │   ├── prayer.page.ts
    │   │   │   ├── prayer.module.ts
    │   │   │   └── prayer-routing.module.ts
    │   │   ├── music/                       # Music module
    │   │   │   ├── music.page.html
    │   │   │   ├── music.page.scss
    │   │   │   ├── music.page.ts
    │   │   │   ├── music.module.ts
    │   │   │   └── music-routing.module.ts
    │   │   ├── meditation/                  # Meditation module
    │   │   │   ├── meditation.page.html
    │   │   │   ├── meditation.page.scss
    │   │   │   ├── meditation.page.ts
    │   │   │   ├── meditation.module.ts
    │   │   │   └── meditation-routing.module.ts
    │   │   └── game/                        # Game module
    │   │       ├── game.page.html
    │   │       ├── game.page.scss
    │   │       ├── game.page.ts
    │   │       ├── game.module.ts
    │   │       └── game-routing.module.ts
    │   │
    │   ├── assets/                          # Static assets
    │   │   ├── logo.png                     # Main logo
    │   │   ├── bg.png                       # Background image
    │   │   ├── cmlogo.png                   # Campus Ministry logo
    │   │   ├── acylogo.jpg                  # ACY logo
    │   │   ├── rcamlogo.jpg                 # RCAM logo
    │   │   ├── gal1.jpg - gal20.jpg         # Gallery images
    │   │   ├── meditation1.jpg              # Meditation images
    │   │   ├── benefits1.png                # Benefits image
    │   │   ├── chalice.png                  # Chalice image
    │   │   ├── EveryoneYouthCamp.jpg        # Youth camp image
    │   │   ├── icon/                        # Icon directory
    │   │   └── shapes.svg                   # SVG shapes
    │   │
    │   ├── environments/                    # Environment configuration
    │   │   ├── environment.ts               # Development environment
    │   │   └── environment.prod.ts          # Production environment
    │   │
    │   ├── theme/                           # Theme configuration
    │   │   └── variables.scss               # SCSS variables
    │   │
    │   ├── index.html                       # Main HTML file
    │   ├── main.ts                          # Application entry point
    │   ├── global.scss                      # Global styles
    │   ├── polyfills.ts                     # Polyfills for browser compatibility
    │   ├── test.ts                          # Test configuration
    │   └── zone-flags.ts                    # Zone.js flags
    │
    ├── 📦 Configuration Files
    │   ├── package.json                     # Node.js dependencies and scripts
    │   ├── angular.json                     # Angular CLI configuration
    │   ├── ionic.config.json                # Ionic configuration
    │   ├── capacitor.config.json            # Capacitor configuration
    │   ├── capacitor.config.ts              # Capacitor TypeScript config
    │   ├── tsconfig.json                    # TypeScript configuration
    │   ├── tsconfig.app.json                # App-specific TypeScript config
    │   ├── tsconfig.spec.json               # Test TypeScript config
    │   ├── karma.conf.js                    # Karma test runner config
    │   ├── .browserslistrc                  # Browser compatibility list
    │   ├── .editorconfig                    # Editor configuration
    │   ├── .eslintrc.json                   # ESLint configuration
    │   └── .gitignore                       # Git ignore rules
    │
    ├── 🗂️  node_modules/                    # Node.js dependencies
    ├── 🌍 www/                              # Built web assets (generated)
    └── 📄 README.md                         # Project documentation
```

## Key Features

### 🎯 **Core Modules**
- **Home**: Main landing page
- **Prayer**: Prayer-related functionality
- **Music**: Music and audio features
- **Meditation**: Meditation and mindfulness features
- **Game**: Interactive game elements

### 🛠️ **Technology Stack**
- **Frontend**: Ionic + Angular
- **Mobile**: Capacitor for cross-platform deployment
- **Styling**: SCSS with custom theming
- **Build**: Angular CLI + Gradle (Android)

### 📱 **Platform Support**
- **Web**: Progressive Web App (PWA)
- **Android**: Native Android app via Capacitor
- **iOS**: Ready for iOS deployment (Capacitor)

### 🎨 **Design Assets**
- **Logos**: Multiple ministry and organization logos
- **Gallery**: 20+ gallery images (gal1.jpg - gal20.jpg)
- **Icons**: Custom icon set
- **Backgrounds**: High-quality background images
- **Themes**: Customizable SCSS variables

## Development Workflow

1. **Development**: Use `ng serve` for web development
2. **Build**: `ng build` creates web assets
3. **Mobile**: `ionic capacitor build android` for Android
4. **Testing**: `ng test` for unit testing
5. **Linting**: ESLint for code quality

## Important Notes

- This is a **Campus Ministry** application with religious/spiritual content
- Supports both **web** and **mobile** platforms
- Uses **modular architecture** with feature-based components
- **Responsive design** with Ionic components
- **Cross-platform** deployment via Capacitor
