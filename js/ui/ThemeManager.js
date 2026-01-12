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

    document.documentElement.removeAttribute("data-theme");

    if (themeName !== "default") {
      document.documentElement.setAttribute("data-theme", themeName);
    }

    this.currentTheme = themeName;
    this.saveTheme();

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

  initializeUI() {
    const themeOptions = document.querySelectorAll(".theme-option");

    themeOptions.forEach((option) => {
      option.addEventListener("click", (e) => {
        e.stopPropagation();
        const themeId = option.dataset.id;
        this.applyTheme(themeId);
      });
    });

    this.updateThemeUI();
  }
}
