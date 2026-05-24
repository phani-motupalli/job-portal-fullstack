import React from "react";
import { Link, useNavigate } from "react-router-dom";


function LandingPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  React.useEffect(() => {
    if (user) {
      navigate("/jobs");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-teal-500 relative overflow-hidden">
        <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-white opacity-10 rounded-full"/>
        <div className="absolute bottom-[-60px] left-[-60px] w-64 h-64 bg-white opacity-10 rounded-full"/>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-teal-300 opacity-20 rounded-full"/>

        <div className="max-w-6xl mx-auto px-6 py-24 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 text-white px-4 py-2 rounded-full text-sm font-semibold mb-8 backdrop-blur">
              🚀 #1 Job Portal in India
            </div>
            <h1 className="font-satisfy text-6xl md:text-7xl text-white mb-6">
              Find Your Dream Job
            </h1>
            <p className="text-indigo-200 text-xl mb-12 max-w-2xl mx-auto">
              Connect with top companies and kickstart your career journey today. 
              Thousands of opportunities waiting for you!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                to="/register"
                className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition shadow-lg"
              >
                Get Started Free →
              </Link>
              <Link
                to="/jobs"
                className="bg-white bg-opacity-20 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-opacity-30 transition backdrop-blur border border-white border-opacity-30"
              >
                Browse Jobs
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              {[
                { number: "10,000+", label: "Jobs Posted" },
                { number: "50,000+", label: "Students Hired" },
                { number: "5,000+", label: "Companies" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white bg-opacity-10 rounded-2xl p-6 backdrop-blur">
                  <div className="text-3xl font-bold text-white">{stat.number}</div>
                  <div className="text-indigo-200 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">How It Works</h2>
          <p className="text-gray-500">Get hired in 3 simple steps</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "01", icon: "📝", title: "Create Account", desc: "Sign up for free as a student or recruiter in just 2 minutes" },
            { step: "02", icon: "🔍", title: "Browse Jobs", desc: "Explore thousands of job opportunities from top companies" },
            { step: "03", icon: "🚀", title: "Get Hired", desc: "Apply with one click and track your applications on dashboard" },
          ].map((item) => (
            <div key={item.step} className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-xl transition relative">
              <div className="absolute top-4 right-4 text-indigo-100 font-bold text-4xl">{item.step}</div>
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose JobPortal?</h2>
            <p className="text-gray-500">Everything you need to land your dream job</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "⚡", title: "Fast Hiring", desc: "Get hired within weeks" },
              { icon: "🔒", title: "Safe & Secure", desc: "Your data is protected" },
              { icon: "🎯", title: "Best Match", desc: "Jobs tailored for you" },
              { icon: "📱", title: "Easy Apply", desc: "One click application" },
              { icon: "🏢", title: "Top Companies", desc: "500+ verified companies" },
              { icon: "💰", title: "Best Salaries", desc: "Competitive packages" },
              { icon: "🌍", title: "Remote Jobs", desc: "Work from anywhere" },
              { icon: "📊", title: "Track Apps", desc: "Dashboard to monitor" },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition">
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="font-bold text-gray-800 text-sm mb-1">{item.title}</div>
                <div className="text-gray-500 text-xs">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Success Stories</h2>
          <p className="text-gray-500">People who found their dream jobs</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Rahul Sharma", role: "Software Engineer", company: "Google", text: "I got my dream job within 2 weeks of joining JobPortal. The platform is amazing!", avatar: "R" },
            { name: "Priya Patel", role: "UI/UX Designer", company: "Flipkart", text: "Best job portal I have used. The interface is clean and applying is super easy!", avatar: "P" },
            { name: "Arjun Kumar", role: "Data Analyst", company: "Amazon", text: "Got 5 interview calls in the first week. Highly recommend JobPortal to everyone!", avatar: "A" },
          ].map((item) => (
            <div key={item.name} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {item.avatar}
                </div>
                <div>
                  <div className="font-bold text-gray-800">{item.name}</div>
                  <div className="text-gray-500 text-sm">{item.role} at {item.company}</div>
                </div>
              </div>
              <p className="text-gray-600 italic">"{item.text}"</p>
              <div className="mt-4 flex gap-1">
                {[1,2,3,4,5].map((s) => (
                  <span key={s} className="text-yellow-400">⭐</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-satisfy text-5xl text-white mb-4">Ready to Get Started?</h2>
          <p className="text-indigo-200 text-lg mb-8">Join 50,000+ students who found their dream jobs on JobPortal</p>
          <Link
            to="/register"
            className="bg-white text-indigo-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition shadow-lg inline-block"
          >
            Create Free Account →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="font-satisfy text-2xl text-white mb-4">JobPortal</div>
              <p className="text-sm">Your career journey starts here. Find your dream job today!</p>
            </div>
            <div>
              <div className="font-bold text-white mb-4">For Students</div>
              <div className="space-y-2 text-sm">
                <div>Browse Jobs</div>
                <div>Create Profile</div>
                <div>Track Applications</div>
              </div>
            </div>
            <div>
              <div className="font-bold text-white mb-4">For Recruiters</div>
              <div className="space-y-2 text-sm">
                <div>Post Jobs</div>
                <div>Find Candidates</div>
                <div>Manage Applications</div>
              </div>
            </div>
            <div>
              <div className="font-bold text-white mb-4">Company</div>
              <div className="space-y-2 text-sm">
                <div>About Us</div>
                <div>Contact</div>
                <div>Privacy Policy</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            © 2026 JobPortal. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}

export default LandingPage;