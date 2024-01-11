import { useEffect, useState } from "react";
import ManagerAccount from "./ManagerAccount";
import { IAccount } from "../account";

export default function useAccount() {
  const managerAccount = ManagerAccount;
  const [account, setAccount] = useState<IAccount | undefined>(undefined);

  useEffect(() => {
    const listener = managerAccount.addListenerAccount(
      (account: IAccount | null) => {
        if (account) {
          setAccount(account);
        } else {
          setAccount(undefined);
        }
      }
    );

    return () => {
      managerAccount.removeListenerAccount(listener);
    };
  });

  return account;
}
