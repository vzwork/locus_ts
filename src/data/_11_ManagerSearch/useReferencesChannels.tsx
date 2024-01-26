import { useEffect, useState } from "react";
import { IReferenceChannel } from "../referenceChannel";
import ManagerSearch from "./ManagerSearch";

export default function useReferencesChannels() {
  const managerSearch = ManagerSearch;
  const [referencesChannels, setReferencesChannels] = useState<{
    references: IReferenceChannel[];
  }>({ references: [] });

  useEffect(() => {
    const listener = managerSearch.addListenerReferencesChannels(
      (references: IReferenceChannel[]) => {
        setReferencesChannels({ references });
      }
    );

    return () => {
      managerSearch.removeListenerReferencesChannels(listener);
    };
  }, []);

  return referencesChannels.references;
}
