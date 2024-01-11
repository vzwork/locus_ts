// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
// The idea behind managers is that every click
// of a button is handled by a manager.
//
// This provides a single point of entry for all actions
// and allows a very granular control over the application.
// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
// Communications between manager and React Components
//
// Component -> Manager
// - Component calls a method on the manager
//
// Manager -> Component
// - A component uses a hook to subscribe to a piece of state
// - A hook uses subscriber + notifier pattern to update the component
// - Manager keeps track of all hooks and notifies them when a change occurs
// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

class ManagerNotificationsUser {
  private static instance: ManagerNotificationsUser;

  private constructor() {
    // Private constructor to prevent instantiation from outside
  }

  public static getInstance(): ManagerNotificationsUser {
    if (!ManagerNotificationsUser.instance) {
      ManagerNotificationsUser.instance = new ManagerNotificationsUser();
    }
    return ManagerNotificationsUser.instance;
  }

  // Other methods and properties...
}

export default ManagerNotificationsUser.getInstance();