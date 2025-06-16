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
    <div className="w-full min-h-screen py-8 px-4 sm:px-6 text-white bg-transparent font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Your Profile
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Complete your profile to unlock better job matches and showcase your professional potential.
          </p>
        </div>

        {/* Profile Image Section */}
        {user?.hasImage && (
          <div className="text-center mb-12">
            <div className="w-32 h-32 mx-auto relative rounded-full overflow-hidden border-2 border-gray-600/50 shadow-xl bg-gray-900/60 backdrop-blur-sm">
              <Image
                fill
                className="object-cover"
                alt="User Profile Pic"
                src={user.imageUrl}
              />
            </div>
          </div>
        )}

        {/* Profile Forms Grid */}
        <div className="grid gap-8">
          <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:bg-gray-800/70 hover:border-gray-600/60 transition-all duration-300">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
              Personal Information
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-3">Full Name</h3>
                <NameForm initialData={profile} userId={userId} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-3">Email Address</h3>
                <EmailForm initialData={profile} userId={userId} />
              </div>
            </div>
          </div>

          <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:bg-gray-800/70 hover:border-gray-600/60 transition-all duration-300">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
              Contact Details
            </h2>
            <div>
              <h3 className="text-lg font-medium text-gray-300 mb-3">Phone Number</h3>
              <ContactForm initialData={profile} userId={userId} />
            </div>
          </div>

          <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:bg-gray-800/70 hover:border-gray-600/60 transition-all duration-300">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
              Resume & Documents
            </h2>
            <div>
              <h3 className="text-lg font-medium text-gray-300 mb-3">Upload Resume</h3>
              <ResumeForm initialData={profile ?? undefined} userId={userId} />
            </div>
          </div>
        </div>

        {/* Profile Completion CTA */}
        <div className="mt-12 text-center bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Complete Your Profile
          </h2>
          <p className="text-gray-300 mb-6 max-w-lg mx-auto">
            A complete profile increases your chances of landing your dream job by up to 70%.
          </p>
          <div className="flex justify-center flex-wrap gap-4">
            <button className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 hover:scale-105 transition-all duration-200 shadow-lg">
              Save Changes
            </button>
            <button className="bg-gray-800/80 hover:bg-gray-700/90 text-white px-6 py-3 rounded-xl font-semibold border border-gray-600/40 hover:border-gray-500/60 hover:scale-105 transition-all duration-200 shadow-lg">
              Preview Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;