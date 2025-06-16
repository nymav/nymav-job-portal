import { Briefcase, Search, Star, TrendingUp, Users, Zap } from "lucide-react";
import Link from "next/link";

const DashboardHomePage = async () => {
  const stats = [
    { icon: Briefcase, label: "Active Jobs", value: "12,450+", color: "text-blue-400" },
    { icon: Users, label: "Companies", value: "3,200+", color: "text-green-400" },
    { icon: TrendingUp, label: "Placements", value: "8,900+", color: "text-purple-400" },
    { icon: Star, label: "Success Rate", value: "94%", color: "text-yellow-400" },
  ];

  const features = [
    {
      icon: Search,
      title: "Smart Job Search",
      description: "AI-powered matching to find your perfect role",
      href: "/search"
    },
    {
      icon: Briefcase,
      title: "Career Insights",
      description: "Market trends and salary analytics for informed decisions",
      href: "/analytics"
    },
    {
      icon: Users,
      title: "Company Profiles",
      description: "Detailed company information and culture insights",
      href: "/companies"
    },
    {
      icon: Zap,
      title: "Instant Apply",
      description: "One-click applications with your optimized profile",
      href: "/user"
    },
  ];

  return (
    <div className="w-full min-h-screen py-8 px-4 sm:px-6 text-white bg-transparent font-sans">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          Welcome to JobPortal
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Your gateway to exceptional career opportunities. Connect with top companies, 
          discover your dream job, and accelerate your professional journey.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 text-center hover:bg-gray-800/70 hover:border-gray-600/60 hover:scale-105 transition-all duration-300"
          >
            <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          Powerful Tools for Your Success
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Link
              key={index}
              href={feature.href}
              className="group bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:bg-gray-800/70 hover:border-gray-600/60 hover:shadow-2xl transition-all duration-300"
            >
              <feature.icon className="w-10 h-10 text-gray-400 group-hover:text-white mb-4 transition-colors" />
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-gray-100">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Find Your Dream Job?
        </h2>
        <p className="text-gray-300 mb-8 max-w-lg mx-auto">
          Join thousands of professionals who have transformed their careers through our platform.
        </p>
        <div className="flex justify-center flex-wrap gap-6">
          <Link
            href="/search"
            className="bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Start Job Search
          </Link>
          <Link
            href="/user"
            className="bg-gray-800/80 hover:bg-gray-700/90 text-white px-8 py-4 rounded-xl font-semibold border border-gray-600/40 hover:border-gray-500/60 hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Complete Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHomePage;