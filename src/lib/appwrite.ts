"use server";

import { Account, Avatars, Client, Databases, Storage } from "node-appwrite";
import { cookies } from "next/headers";

export async function CreateSessionClient() {
    const AppwriteClinte = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT!)
    .setProject(process.env.APPWRITE_PROJECT!);

    const SessionClient = (await cookies()).get("Sess");
    if (!SessionClient || !SessionClient.value ) {
        throw new Error("Nenhum sessão válida")
    }

    AppwriteClinte.setSession(SessionClient.value); 

    return {
        get account() {
          return new Account(AppwriteClinte);
        },
        get avatars() {
          return new Avatars(AppwriteClinte);
        }
    };
};

export async function PegarUsuarioLogado() {
    try {
      const { account, avatars } = await CreateSessionClient();
      const user = await account.get();
      const avatarUrl = avatars.getInitials(user.name || user.email).toString();
      return { ...user, avatarUrl };
    } catch (error: any) {
        console.log("Erro ao buscar o usuário da Sessão atual", error)
      return null;
    }
};

export async function SignOut() {

  const { account } = await CreateSessionClient();

  (await cookies()).delete("Sess");
  await account.deleteSession("current");

  return true;
};

export async function CreateClient() {
    const Clinte = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT!)
    .setProject(process.env.APPWRITE_PROJECT!)
    .setKey(process.env.APPWRITE_KEY!);

    return {
      get account() {
        return new Account(Clinte);
      },
      get databases() {
        return new Databases(Clinte)
      },
      get storage() {
        return new Storage(Clinte);
      }
    };
};

export async function VerifcationClient(sessionToken?: string) {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT!)
    .setProject(process.env.APPWRITE_PROJECT!);

  if (sessionToken) {
    client.setSession(sessionToken);
  }

  return {
    get accountVerify() {
      return new Account(client);
    },
  };
}