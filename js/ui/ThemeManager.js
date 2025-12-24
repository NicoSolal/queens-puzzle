// ThemeManager.js - Manages theme switching (Singleton pattern)

export class ThemeManager {
  static instance = null;

  constructor() {
    if (ThemeManager.instance) {
      return ThemeManager.instance;
    }

    this.themes = ["default", "dark", "light", "cream"];
    this.currentTheme = "default";
    this.loadTheme();

    ThemeManager.instance = this;
  }

  static getInstance() {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  // Load theme from localStorage or use default
  loadTheme() {
    const savedTheme = localStorage.getItem("queens-theme");
    if (savedTheme && this.themes.includes(savedTheme)) {
      this.currentTheme = savedTheme;
    }
    this.applyTheme(this.currentTheme);
  }

  // Apply theme to document
  applyTheme(themeName) {
    if (!this.themes.includes(themeName)) {
      console.error(`Invalid theme: ${themeName}`);
      return;
    }

    // Remove all theme data attributes
    document.documentElement.removeAttribute("data-theme");

    // Apply new theme (default doesn't need data attribute)
    if (themeName !== "default") {
      document.documentElement.setAttribute("data-theme", themeName);
    }

    this.currentTheme = themeName;
    this.saveTheme();

    // Update UI to reflect current theme
    this.updateThemeUI();
  }

  // Save theme to localStorage
  saveTheme() {
    localStorage.setItem("queens-theme", this.currentTheme);
  }

  // Get current theme
  getCurrentTheme() {
    return this.currentTheme;
  }

  // Get theme display name
  getThemeDisplayName(themeName) {
    const names = {
      default: "Blue/Gray",
      dark: "Dark",
      light: "Light",
      cream: "Cream",
    };
    return names[themeName] || themeName;
  }

  // Update theme UI buttons
  updateThemeUI() {
    const themeOptions = document.querySelectorAll(".theme-option");
    themeOptions.forEach((option) => {
      if (option.dataset.theme === this.currentTheme) {
        option.classList.add("active");
      } else {
        option.classList.remove("active");
      }
    });
  }

  // Initialize theme selector UI
  initializeUI() {
    const themeBtn = document.getElementById("theme-btn");
    const themeMenu = document.getElementById("theme-menu");

    // Toggle menu on button click
    themeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      themeMenu.classList.toggle("show");
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!themeMenu.contains(e.target) && e.target !== themeBtn) {
        themeMenu.classList.remove("show");
      }
    });

    // Theme option clicks
    const themeOptions = document.querySelectorAll(".theme-option");
    themeOptions.forEach((option) => {
      option.addEventListener("click", () => {
        const theme = option.dataset.theme;
        this.applyTheme(theme);
        themeMenu.classList.remove("show");
      });
    });

    // Set initial active state
    this.updateThemeUI();
  }
}
