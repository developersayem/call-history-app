import { useState, useEffect, useRef } from "react";
import { ChevronDown, CirclePlus, Filter } from "lucide-react";

const fields = [
  {
    name: "Agent",
    options: [
      "Evo Energy - Crystal", "Single-Prompt Agent", "Evo Energy", "Solar", "Solar 2",
      "Lead Qualification (Multi-Prompt)", "Dentist Receptionist (Multi-Prompt)",
      "Healthcare Check-In (Single Prompt)", "Amazon Customer Support (from template)", "Custom LLM agent",
    ]
  },
  { name: "Call ID", options: [] },
  { name: "Batch Call ID", options: [] },
  { name: "Type", options: ["Inbound", "Outbound", "Automated", "Manual"] },
  { name: "Call Duration", options: [] },
  { name: "From", options: [] },
  { name: "To", options: [] },
  { name: "User Sentiment", options: ["Positive", "Neutral", "Negative", "Unknown"] },
  {
    name: "Disconnection Reason", options: [
      "User Hangup",
      "Agent Hangup",
      "Call Transfer",
      "Voicemail Reached",
      "Inactivity",
      "Machine Detected",
      "Max Duration Reached",
      "Concurrency Limit Reached",
      "No Valid Payment",
      "Scam Detected",
      "Error Inbound Webhook",
      "Dial Busy",
      "Dial Failed",
      "Dial No Answer",
      "Error Llm Websocket Open",
      "Error Llm Websocket Lost Connection",
      "Error Llm Websocket Runtime",
      "Error Llm Websocket Corrupt Payload",
      "Error Frontend Corrupted Payload",
      "Error Twilio",
      "Error No Audio Received",
      "Error Asr",
      "Error Retell",
      "Error Unknown",
      "Error User Not Joined",
      "Registered Call Timeout",
    ]
  },
  {
    name: "Call Successful", options: ["Success", "Unsuccess"]
  },
  {
    name: "Call Status", options: [
      "ended",
      "ongoing",
      "error"]
  },
  { name: "End to End Latency", options: [] } // Added End to End Latency field
];

export default function FilterDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubDropdown, setOpenSubDropdown] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [callIdFilter, setCallIdFilter] = useState("");
  const [batchCallIdFilter, setBatchCallIdFilter] = useState("");
  const [fromFilter, setFromFilter] = useState("");
  const [toFilter, setToFilter] = useState("");
  const [callDurationCondition, setCallDurationCondition] = useState("greater");
  const [callDurationValue, setCallDurationValue] = useState("");
  const [callDurationRange, setCallDurationRange] = useState([null, null]);
  const [latencyCondition, setLatencyCondition] = useState("greater"); // Default to 'greater'
  const [latencyValue, setLatencyValue] = useState("");
  const [latencyRange, setLatencyRange] = useState([null, null]); // For 'Is Between' condition
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

  const toggleOptionSelection = (fieldName, option) => {
    setSelectedOptions((prev) => {
      const prevSelected = prev[fieldName] || [];
      const newSelected = prevSelected.includes(option)
        ? prevSelected.filter((item) => item !== option) // Deselect
        : [...prevSelected, option]; // Select

      return { ...prev, [fieldName]: newSelected };
    });
  };

  const applyFilters = () => {
    console.log("Selected Filters:", selectedOptions);
    console.log("Call ID Filter:", callIdFilter);
    console.log("Batch Call ID Filter:", batchCallIdFilter);
    console.log("From Filter:", fromFilter);
    console.log("To Filter:", toFilter);
    console.log("Call Duration Condition:", callDurationCondition);
    console.log("Call Duration Value:", callDurationValue);
    console.log("Call Duration Range:", callDurationRange);
    console.log("Latency Condition:", latencyCondition);
    console.log("Latency Value:", latencyValue);
    console.log("Latency Range:", latencyRange);
    setOpenSubDropdown(null);
    setIsOpen(false);
  };

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
            <div key={field.name} className="relative">
              {/* Field Item */}
              <div
                className="flex justify-between items-center p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => setOpenSubDropdown(openSubDropdown === field.name ? null : field.name)}
              >
                <div className="flex items-center">
                  <CirclePlus size={14} className="mr-2" />
                  {field.name}
                </div>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${openSubDropdown === field.name ? "rotate-180" : ""}`}
                />
              </div>

              {/* Sub-dropdown for filters */}
              {openSubDropdown === field.name && (
                <div className="absolute left-full top-0 ml-2 w-60 bg-white border border-gray-300 shadow-lg rounded-md p-3">
                  <p className="text-sm text-gray-600 font-semibold mb-2">Filter by {field.name}</p>

                  {/* Special Case: "Call ID", "Batch Call ID", "From", "To" Input Box */}
                  {field.name === "Call ID" || field.name === "Batch Call ID" || field.name === "From" || field.name === "To" ? (
                    <div className="mb-4">
                      <input
                        type="text"
                        value={field.name === "Call ID" ? callIdFilter :
                          field.name === "Batch Call ID" ? batchCallIdFilter :
                            field.name === "From" ? fromFilter : toFilter}
                        onChange={(e) =>
                          field.name === "Call ID"
                            ? setCallIdFilter(e.target.value)
                            : field.name === "Batch Call ID"
                              ? setBatchCallIdFilter(e.target.value)
                              : field.name === "From"
                                ? setFromFilter(e.target.value)
                                : setToFilter(e.target.value)
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        placeholder={`Enter ${field.name}`}
                      />
                    </div>
                  ) : field.name === "Call Duration" || field.name === "End to End Latency" ? (
                    <div className="mb-4">
                      <select
                        value={field.name === "Call Duration" ? callDurationCondition : latencyCondition}
                        onChange={(e) => {
                          if (field.name === "Call Duration") setCallDurationCondition(e.target.value);
                          else setLatencyCondition(e.target.value);
                        }}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      >
                        <option value="greater">Is Greater Than</option>
                        <option value="less">Is Less Than</option>
                        <option value="between">Is Between</option>
                      </select>
                      {((field.name === "Call Duration" && callDurationCondition === "between") ||
                        (field.name === "End to End Latency" && latencyCondition === "between")) ? (
                        <div className="mt-2 flex space-x-2">
                          <input
                            type="number"
                            value={(field.name === "Call Duration" ? callDurationRange[0] : latencyRange[0]) || ""}
                            onChange={(e) =>
                              field.name === "Call Duration"
                                ? setCallDurationRange([e.target.value, callDurationRange[1]])
                                : setLatencyRange([e.target.value, latencyRange[1]])
                            }
                            className="w-1/2 px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            placeholder="From"
                          />
                          <input
                            type="number"
                            value={(field.name === "Call Duration" ? callDurationRange[1] : latencyRange[1]) || ""}
                            onChange={(e) =>
                              field.name === "Call Duration"
                                ? setCallDurationRange([callDurationRange[0], e.target.value])
                                : setLatencyRange([latencyRange[0], e.target.value])
                            }
                            className="w-1/2 px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            placeholder="To"
                          />
                        </div>
                      ) : (
                        <input
                          type="number"
                          value={field.name === "Call Duration" ? callDurationValue : latencyValue || ""}
                          onChange={(e) =>
                            field.name === "Call Duration"
                              ? setCallDurationValue(e.target.value)
                              : setLatencyValue(e.target.value)
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          placeholder="Enter Duration"
                        />
                      )}
                    </div>
                  ) : field.options.length > 0 ? (
                    // Checkboxes for options
                    field.options.map((option) => (
                      <label key={option} className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-gray-100 rounded-md">
                        <input
                          type="checkbox"
                          checked={selectedOptions[field.name]?.includes(option) || false}
                          onChange={() => toggleOptionSelection(field.name, option)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))
                  ) : null}

                  {/* Action Buttons */}
                  <div className="flex justify-end mt-3 space-x-2">
                    <button
                      onClick={() => setOpenSubDropdown(null)}
                      className="text-gray-500 text-sm px-3 py-1 rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-blue-600 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-700"
                      onClick={applyFilters}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
