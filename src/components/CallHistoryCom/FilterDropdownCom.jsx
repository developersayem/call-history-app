import { useState, useEffect, useRef } from "react";
import { CirclePlus, Filter } from "lucide-react";

const fields = [
  "Agent", "Call ID", "Batch Call ID", "Type", "Call Duration", "From",
  "To", "User Sentiment", "Disconnection Reason", "Call Successful",
  "Call Status", "End to End Latency"
];

export default function FilterDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex gap-2 p-4 relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 ">
        <Filter className="mr-2" size={16} /> Filter
      </button>


      {isOpen && (
        <div className="absolute bg-white shadow-lg p-2 rounded-lg w-64 mt-12 border border-gray-300">
          {fields.map((field) => (
            <div key={field} className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
              <CirclePlus size={14} className="mr-2" />
              {field}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
