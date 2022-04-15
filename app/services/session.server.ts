import bcrypt from "bcryptjs";
import {
  createCookieSessionStorage,
  redirect,
} from "@remix-run/node";
import {query} from "~/services/graphql.server";
import {gql} from "@urql/core";
import {env} from "~/services/utils";

const sessionSecret = env('SESSION_SECRET')

type LoginForm = {
  email: string;
  password: string;
};

export async function login({email, password}: LoginForm) {
  const data = await query(gql`
    query get_user($email: String!) {
      user(where: {email: {_eq: $email}}) {
        id, pass_hash
      }
    }
  `, {email});
  
  const [user] = data.user
  if (!user) return null;
  const isCorrectPassword = await bcrypt.compare(password, user.pass_hash);
  if (!isCorrectPassword) return null;
  return { id: user.id, email };
}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const userId = await getUserId(request)
  if (!userId) {
    const searchParams = new URLSearchParams([
      ["redirectTo", redirectTo],
    ]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function requireUser(request: Request, redirectTo: string = new URL(request.url).pathname) {
  const id = await requireUserId(request, redirectTo)
  const {user} = await query(
    gql`query get_user($id: uuid!) {
      user: user_by_pk(id: $id) { id, email }
    }`,
    {id}
  )
  return user
}
