import { redirect } from "next/navigation"

export default function ApplicationStatusRedirectPage() {
  redirect("/dashboard/applications")
}

