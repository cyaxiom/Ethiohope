import React from "react";

function EthiohopeService() {
  return (
    <div className="bg-background text-white">
      <section className="hero-section text-center py-20">
        <h1 className="text-6xl font-bold tracking-wide">SECURING</h1>
        <p className="text-2xl mt-4">
          Your Organization's Digital Landscape From Cyber Risks
        </p>
        <div className="mt-6">
          <button className="px-8 py-4 bg-purple-600 text-white rounded-lg text-lg">
            Explore solutions
          </button>
        </div>
      </section>

      <section className="clients-section text-center py-10">
        <h2 className="text-4xl font-bold">300K Clients worldwide</h2>
        <p className="text-lg text-gray-400">Effective service | Fast security</p>
      </section>

      <section className="services-section grid grid-cols-1 md:grid-cols-3 gap-6 py-10">
        <div className="service-card p-6 bg-gray-800 rounded">
          <h3 className="text-2xl font-bold">Secure Your Network</h3>
          <ul className="mt-4 space-y-2">
            <li>Consistently Secure the Enterprise.</li>
            <li>Apply AI inline to prevent evasive.</li>
            <li>Simplify network security operations.</li>
            <li>Adopt Zero Trust across the network.</li>
            <li>Simplify with AI-Powered SASE.</li>
          </ul>
        </div>
        <div className="service-card p-6 bg-gray-800 rounded">
          <h3 className="text-2xl font-bold">Secure Your Cloud</h3>
          <ul className="mt-4 space-y-2">
            <li>End-to-End Cloud Security.</li>
            <li>Real-Time Threat Detection.</li>
            <li>Identity & Access Management.</li>
            <li>Data Encryption & Privacy.</li>
            <li>Compliance & Governance.</li>
          </ul>
        </div>
        <div className="service-card p-6 bg-gray-800 rounded">
          <h3 className="text-2xl font-bold">Data Source Identification</h3>
          <ul className="mt-4 space-y-2">
            <li>Accelerate Threat Detection.</li>
            <li>Automate Security Processes.</li>
            <li>Streamline Incident Response.</li>
            <li>Attack Surface Management.</li>
            <li>Integrated Security Monitoring.</li>
          </ul>
        </div>
      </section>

      <section className="contact-section text-center py-10">
        <h2 className="text-3xl font-bold">Send Us A Message</h2>
        <p className="mt-4">
          And We'll Promptly Discuss Your Project With You.
        </p>
        <form className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Your name"
            className="w-full px-4 py-2 bg-gray-700 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 bg-gray-700 rounded"
          />
          <input
            type="text"
            placeholder="Phone"
            className="w-full px-4 py-2 bg-gray-700 rounded"
          />
          <input
            type="text"
            placeholder="Company name"
            className="w-full px-4 py-2 bg-gray-700 rounded"
          />
          <textarea
            placeholder="How can we help you today?"
            className="w-full px-4 py-2 bg-gray-700 rounded"
          ></textarea>
          <button
            type="submit"
            className="px-6 py-3 bg-purple-600 text-white rounded"
          >
            Submit now
          </button>
        </form>
      </section>

      <section className="awards-section text-center py-10">
        <h2 className="text-3xl font-bold">Awards And Recognition</h2>
        <p className="mt-4">
          We’re proud of the awards we’ve earned, reflecting our dedication to
          delivering top-notch cybersecurity solutions and the trust our clients
          place in us.
        </p>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="award-card p-4 bg-gray-800 rounded">
            Best Network Security 2023
          </div>
          <div className="award-card p-4 bg-gray-800 rounded">
            Cyber Defense Leader 2022
          </div>
          <div className="award-card p-4 bg-gray-800 rounded">
            Data Protection Awards 2020
          </div>
          <div className="award-card p-4 bg-gray-800 rounded">
            Innovator in Security 2023
          </div>
        </div>
      </section>
    </div>
  );
}

export default EthiohopeService;
