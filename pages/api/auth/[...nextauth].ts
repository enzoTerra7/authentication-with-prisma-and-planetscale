import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "../../../lib/prisma"

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            profile(profile) {
                return {
                    id: profile.id.toString(),
                    name: profile.name || profile.login,
                    username: profile.login,
                    email: profile.email,
                    image: profile.avatar_url
                }
            }
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            return true
        },
        async redirect({ url, baseUrl }) {
            return baseUrl
        },
        async session({ session, user, token }) {
            return {
                ...session,
                user: {
                    ...session.user
                },
                id: user.id,
                username: user.username,
                token: token
            }
        },
        async jwt({ token, user, account, profile, isNewUser }) {
            return token
        }
    },
    pages: {
        signIn: '/login',
        error: '/login',
        newUser: '/login'
    }
}

export default NextAuth(authOptions)