
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';

const Home: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gov-blue text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your voice matters to us
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Report issues, submit feedback, and help us improve public services in your community
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/submit">
              <Button size="lg" className="bg-white text-gov-blue hover:bg-gray-100">
                Submit a Complaint
              </Button>
            </Link>
            <Link to="/track">
              <Button size="lg" variant="outline" className="border-white text-white bg-blue-700">
                Track Your Complaints
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gov-blue rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Submit</h3>
              <p className="text-gray-600">
                Fill out a simple form describing the issue you've encountered with any public service.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gov-blue rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Track</h3>
              <p className="text-gray-600">
                Get a unique ticket ID to monitor the progress of your complaint in real-time.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gov-blue rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Resolve</h3>
              <p className="text-gray-600">
                Receive notifications as your complaint is processed, addressed, and resolved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Common Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Roads & Traffic', icon: '🚗' },
              { name: 'Water Supply', icon: '💧' },
              { name: 'Public Spaces', icon: '🏞️' },
              { name: 'Transportation', icon: '🚌' },
              { name: 'Safety & Security', icon: '🛡️' },
              { name: 'Sanitation', icon: '🗑️' },
            ].map((category) => (
              <Link to="/submit" key={category.name}>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col items-center justify-center">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-medium">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-gov-blue mb-2">95%</div>
              <p className="text-gray-600">Complaints addressed within 7 days</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gov-blue mb-2">10k+</div>
              <p className="text-gray-600">Citizens actively participating</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gov-blue mb-2">24</div>
              <p className="text-gray-600">Government agencies connected</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gov-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to report an issue?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Your feedback helps us improve public services for everyone in the community.
          </p>
          <Link to="/submit">
            <Button size="lg" className="bg-white text-gov-blue hover:bg-gray-100">
              Submit a Complaint Now
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
