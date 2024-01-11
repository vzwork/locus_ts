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

class ManagerCompetencyUser {
  private static instance: ManagerCompetencyUser;

  private constructor() {
    // Private constructor to prevent instantiation from outside
  }

  public static getInstance(): ManagerCompetencyUser {
    if (!ManagerCompetencyUser.instance) {
      ManagerCompetencyUser.instance = new ManagerCompetencyUser();
    }
    return ManagerCompetencyUser.instance;
  }

  // Other methods and properties...
}

export default ManagerCompetencyUser.getInstance();
