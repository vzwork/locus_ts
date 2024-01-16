import { useEffect, useState } from "react";
import ManagerTraceUser from "./ManagerTraceUser";

export default function useStateBooks() {
  const managerTraceUser = ManagerTraceUser;
  const [books, setBooks] = useState<Set<string>>();

  useEffect(() => {
    const listener = managerTraceUser.addListenerBooks((books: Set<string>) => {
      setBooks(books);
    });

    return () => {
      managerTraceUser.removeListenerBooks(listener);
    };
  });

  return books;
}
