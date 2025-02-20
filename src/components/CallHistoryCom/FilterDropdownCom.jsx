import { useState, useEffect, useRef } from "react";
import { ChevronDown, CirclePlus, Filter } from "lucide-react";

const fields = [
  "Agent", "Call ID", "Batch Call ID", "Type", "Call Duration", "From",
  "To", "User Sentiment", "Disconnection Reason", "Call Successful",
  "Call Status", "End to End Latency"
];

export default function FilterDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubDropdown, setOpenSubDropdown] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setOpenSubDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative p-4" ref={dropdownRef}>
      {/* Main Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <Filter className="mr-2" size={16} /> Filter
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute bg-white shadow-lg p-2 rounded-lg w-64 mt-2 border border-gray-300 z-10">
          {fields.map((field) => (
            <div key={field} className="relative">
              {/* Field Item */}
              <div
                className="flex justify-between items-center p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() =>
                  setOpenSubDropdown((prev) => (prev === field ? null : field))
                }
              >
                <div className="flex items-center">
                  <CirclePlus size={14} className="mr-2" />
                  {field}
                </div>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${openSubDropdown === field ? "rotate-180" : ""}`}
                />
              </div>

              {/* Sub-dropdown for filters */}
              {openSubDropdown === field && (
                <div className="absolute left-full top-0 ml-2 w-48 bg-white border border-gray-300 shadow-lg rounded-md p-2">
                  <p className="text-sm text-gray-600 font-semibold mb-2">Filter by {field}</p>
                  <input
                    type="text"
                    placeholder={`Enter ${field}`}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                  <button className="mt-2 w-full bg-blue-500 text-white px-2 py-1 rounded-md text-sm hover:bg-blue-600">
                    Apply
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
