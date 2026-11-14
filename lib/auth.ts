import { betterAuth } from "better-auth"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"

const client = new MongoClient(process.env.MONGODB_URI as string)
const db = client.db("hireloop")

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: ["seeker", "recruiter", "admin"],
        input: true,
        defaultValue: "seeker",
      },
      // Free/Premium subscription. `input: false` stops clients from signing
      // up — or patching themselves — as premium; upgrades are a server-side
      // concern (hireloop-server owns the quota check).
      plan: {
        type: ["free", "premium"],
        input: false,
        defaultValue: "free",
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  database: mongodbAdapter(db, {
    client,
  }),
})
