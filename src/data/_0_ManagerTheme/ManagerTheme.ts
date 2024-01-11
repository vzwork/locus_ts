type ArrayListenerState = (theme: string) => void;

class ManagerTheme {
  private static instance: ManagerTheme;
  private state: string;
  private listenersState: ArrayListenerState[] = [];

  private constructor() {
    // Initialize the theme manager

    const localTheme = localStorage.getItem("theme");
    if (localTheme) {
      this.state = localTheme;
    } else {
      const currentTime = new Date().getHours();
      this.state = currentTime >= 6 && currentTime < 18 ? "light" : "dark";
    }
  }

  public static getInstance(): ManagerTheme {
    if (!ManagerTheme.instance) {
      ManagerTheme.instance = new ManagerTheme();
    }
    return ManagerTheme.instance;
  }

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
  // user actions
  public toggleTheme() {
    this.state = this.state === "light" ? "dark" : "light";
    localStorage.setItem("theme", this.state);
    this.listenersState.forEach((listener) => listener(this.state));
  }
  // user actions
  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
  // state theme
  public addListenerStateThemeMode(
    listener: (theme: string) => void
  ): (theme: string) => void {
    this.listenersState.push(listener);

    listener(this.state);
    return listener;
  }

  public removeListenerStateThemeMode(listener: (theme: string) => void) {
    const index = this.listenersState.indexOf(listener);
    if (index !== -1) {
      this.listenersState.splice(index, 1);
    }
  }
  // state theme
  // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
}

export default ManagerTheme.getInstance();
