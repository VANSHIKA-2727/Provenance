import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 🔒 SSR protection
  if (!user) {
    redirect("/auth");
  }

  // Fetch company row (verifies trigger worked)
  const { data: company, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-neutral-100 p-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="space-y-2">
          <p>
            <strong>User ID:</strong> {user.id}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>

        <div className="border-t pt-6 space-y-2">
          <h2 className="text-xl font-semibold">Company Row</h2>

          {error && (
            <p className="text-red-600">Company fetch error: {error.message}</p>
          )}

          {!company && !error && (
            <p className="text-red-600">
              No company row found (trigger failed)
            </p>
          )}

          {company && (
            <div className="space-y-1">
              <p>
                <strong>Company ID:</strong> {company.id}
              </p>
              <p>
                <strong>Email ID:</strong> {company.email_id}
              </p>
              <p>
                <strong>Onboarding Completed:</strong>{" "}
                {company.onboarding_completed ? "Yes" : "No"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
