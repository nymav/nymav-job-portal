import Box from "@/components/box";
import { auth, currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import { NameForm } from "./_components/name-form";
import { db } from "@/lib/db";
import { EmailForm } from "./_components/email-form";
import { ContactForm } from "./_components/contact-form";
import { ResumeForm } from "./_components/resume-form";
import type { UserProfile, Resumes } from "@/lib/generated/prisma";

const ProfilePage = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/sign-in");
  }

  const profile = await db.userProfile.findUnique({
    where: { userId },
    include: { resumes: { orderBy: { createdAt: "desc" } } },
  }) as (UserProfile & { resumes: Resumes[] }) | null;

  return (
    <div className="w-full min-h-screen py-6 px-4 sm:px-6 text-white bg-transparent font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          {user?.hasImage && (
            <div className="w-24 h-24 mx-auto relative rounded-full overflow-hidden border border-purple-700 shadow-md">
              <Image
                fill
                className="object-cover"
                alt="User Profile Pic"
                src={user.imageUrl}
              />
            </div>
          )}
        </div>

        <div className="grid gap-6">
          <div>
            <h2 className="text-xl font-semibold text-purple-300 mb-2">Name</h2>
            <NameForm initialData={profile} userId={userId} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-purple-300 mb-2">Email</h2>
            <EmailForm initialData={profile} userId={userId} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-purple-300 mb-2">Contact</h2>
            <ContactForm initialData={profile} userId={userId} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-purple-300 mb-2">Resume</h2>
            <ResumeForm initialData={profile ?? undefined} userId={userId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;