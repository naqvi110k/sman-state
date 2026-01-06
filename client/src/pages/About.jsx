import React from 'react';

export default function About() {
  return (
    <div className="py-20 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
      {/* Left Side - Text Content */}
      <div>
        <h1 className="text-4xl font-extrabold mb-6 text-slate-100">
          About <span className="text-blue-400">SMAN Estate</span>
        </h1>
        
        <p className="mb-4 text-slate-300 leading-relaxed">
          <span className="font-semibold text-blue-300">SMAN Estate</span> is a leading real estate agency 
          that specializes in helping clients buy, sell, and rent properties in the most desirable neighborhoods. 
          Our team of experienced agents is dedicated to providing exceptional service and making the process as smooth as possible.
        </p>
        
        <p className="mb-4 text-slate-300 leading-relaxed">
          Our mission is to help our clients achieve their real estate goals by providing 
          <span className="font-semibold text-blue-300"> expert advice</span>, 
          <span className="font-semibold text-blue-300"> personalized service</span>, 
          and a deep understanding of the local market. Whether you are buying, selling, or renting, 
          we are here to support you every step of the way.
        </p>
        
        <p className="mb-6 text-slate-300 leading-relaxed">
          With years of experience and deep market knowledge, our agents are committed to delivering 
          the <span className="font-semibold text-blue-300">highest level of service</span>. 
          We believe real estate should be an exciting and rewarding experience — and we are here to make that happen.
        </p>
      </div>

      {/* Right Side - Image */}
      <div className="flex justify-center">
        <img 
          src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80" 
          alt="Real Estate"
          className="rounded-2xl shadow-lg"
        />
      </div>
    </div>
  );
}
