import React, { useState } from "react";
import axios from "axios";

const DomainCheck: React.FC<{ setDomainData: any; setError: any }> = ({ setDomainData, setError }) => {
  const [domain, setDomain] = useState("");

  const handleDomainCheck = async () => {
    try {
      setError("");
      const response = await axios.post("http://localhost:5000/api/check-registration", { domain });
      setDomainData(response.data.extensions);
    } catch (err) {
      setError("No extensions found for this domain.");
      setDomainData([]);
    }
  };

  return (
    <div className="flex-1 border border-gray-300 shadow-md rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-2">Check Domain</h3>
      <div className="flex space-x-4">
        <input
          type="text"
          className="flex-1 p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400"
          placeholder="Enter domain (e.g., 3333.ip-com.co.il)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />
        <button
          className="px-6 py-3 border border-gray-400 rounded hover:bg-gray-200 transition"
          onClick={handleDomainCheck}
        >
          Check
        </button>
      </div>
    </div>
  );
};

const ExtensionCheck: React.FC<{ domain: string }> = ({ domain }) => {
  const [extension, setExtension] = useState("");
  const [registrationError, setRegistrationError] = useState("");

  const handleExtensionCheck = async () => {
    try {
      setRegistrationError("");
      const response = await axios.post("http://localhost:5000/api/check-extension", { domain, extension });
      if (response.data.status === "failed") {
        alert(`Registration failed for extension ${extension}.`);
      } else {
        alert(`Extension ${extension} is registered at ${response.data.sipIp}`);
      }
    } catch (err) {
      setRegistrationError("Extension not found or inactive.");
    }
  };

  return (
    <div className="flex-1 border border-gray-300 shadow-md rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-2">Check Extension</h3>
      <div className="flex space-x-4">
        <input
          type="text"
          className="flex-1 p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400"
          placeholder="Enter extension (200-399)"
          value={extension}
          onChange={(e) => setExtension(e.target.value)}
        />
        <button
          className="px-6 py-3 border border-gray-400 rounded hover:bg-gray-200 transition"
          onClick={handleExtensionCheck}
        >
          Check
        </button>
      </div>
      {registrationError && <p className="text-red-500 mt-2">{registrationError}</p>}
    </div>
  );
};

const CheckRegistration: React.FC = () => {
  const [domainData, setDomainData] = useState<{ extension: string; status: string; sipIp?: string }[]>([]);
  const [error, setError] = useState("");

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Check Registration Status</h2>

      {/* Forms in One Row */}
      <div className="flex space-x-6 mb-6">
        <DomainCheck setDomainData={setDomainData} setError={setError} />
        <ExtensionCheck domain="" />
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Table of Extensions */}
      {domainData.length > 0 && (
        <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-md">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Extension</th>
                <th className="py-2">Status</th>
                <th className="py-2">SIP IP</th>
              </tr>
            </thead>
            <tbody>
              {domainData.map((ext, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{ext.extension}</td>
                  <td className="py-2">{ext.status}</td>
                  <td className="py-2">{ext.sipIp || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CheckRegistration;
