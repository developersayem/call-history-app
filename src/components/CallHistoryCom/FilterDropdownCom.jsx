import { useState } from "react";
import { CirclePlus, FilterIcon } from "lucide-react";

const fields = [
  "Agent", "Call ID", "Batch Call ID", "Type", "Call Duration", "From",
  "To", "User Sentiment", "Disconnection Reason", "Call Successful",
  "Call Status", "End to End Latency"
];

export default function FilterDropdownCom() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex gap-2 p-4">

      <button onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 ">
        <FilterIcon className="mr-2 h-4 w-4" />
        Filter
      </button>


      {isOpen && (
        <div className="w-fit absolute left-34 top-34 mt-2 bg-white border border-gray-300 shadow-lg rounded-lg p-4">
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
