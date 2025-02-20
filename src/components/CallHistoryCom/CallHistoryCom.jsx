"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { ChevronLeftIcon, ChevronRightIcon, Settings2Icon, ClipboardIcon } from "lucide-react"
import callHistoryData from "../../data/call-data.js"
import DateRangePicker from "./DateRangePicker.jsx"
import FilterDropdownCom from "./FilterDropdownCom.jsx"
import { isWithinInterval, parseISO } from "date-fns"
import { toast } from "sonner"
import Drawer from "./Drawer.jsx" // Import the Drawer component

const allFields = [
    "Time", "Call Duration", "Type", "Cost", "Call ID",
    "Disconnection Reason", "Call Status", "User Sentiment",
    "From", "To", "Call Successful", "End to End Latency"
];

export default function CallHistory() {
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(20)
    const [selectedFields, setSelectedFields] = useState(allFields);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });
    const [hoveredCallId, setHoveredCallId] = useState(null);
    const [selectedCall, setSelectedCall] = useState(null); // State for selected call
    const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State for drawer status
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const filteredCalls = useMemo(() => {
        if (!dateRange.from || !dateRange.to) return callHistoryData;
        return callHistoryData.filter(call => {
            const callDate = parseISO(call.time);
            return isWithinInterval(callDate, { start: dateRange.from, end: dateRange.to });
        });
    }, [dateRange]);

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentCalls = filteredCalls.slice(indexOfFirstItem, indexOfFirstItem + itemsPerPage)

    const totalPages = Math.ceil(filteredCalls.length / itemsPerPage)

    const toggleField = (field) => {
        setSelectedFields(prev =>
            prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
        );
    };

    const pageNumbers = useMemo(() => {
        const numbers = []
        for (let i = 1; i <= totalPages; i++) {
            numbers.push(i)
        }
        return numbers
    }, [totalPages])

    const getStatusDotColor = (status) => {
        switch (status.toLowerCase()) {
            case "ended":
                return "bg-green-400"
            case "error":
                return "bg-red-400"
            default:
                return "bg-gray-400"
        }
    }

    const getTextColor = (text) => {
        switch (text.toLowerCase()) {
            case "successful":
                return "text-green-500"
            case "unsuccessful":
                return "text-red-500"
            default:
                return "text-gray-500"
        }
    }

    const handleCopy = (callId, event) => {
        event.stopPropagation(); // Prevents the row click event
        navigator.clipboard.writeText(callId).then(() => {
            toast("Call ID copied to clipboard!");
        });
    };


    const handleRowClick = (call) => {
        setSelectedCall(call);
        setIsDrawerOpen(true);
    };

    return (
        <div className="p-6 bg-gray-50">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Call History</h2>
            <div className="flex flex-wrap items-center gap-4 mb-6">
                <DateRangePicker range={dateRange} setRange={setDateRange} />
                <FilterDropdownCom />
                <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2" onClick={() => setIsDropdownOpen(!isDropdownOpen)} ref={dropdownRef}>
                    <Settings2Icon className="mr-2 h-4 w-4" />
                    Customize Field
                </button>
                {isDropdownOpen && (
                    <div className="w-fit absolute left-76 top-34 mt-2 bg-white border border-gray-300 shadow-lg rounded-lg p-4">
                        {allFields.map(field => (
                            <label key={field} className="flex items-center text-black space-x-2 py-1">
                                <input type="checkbox" checked={selectedFields.includes(field)} onChange={() => toggleField(field)} />
                                <span>{field}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {selectedFields.map(header => (
                                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentCalls.map(call => (
                                <tr key={call.callId} onClick={() => handleRowClick(call)} className="cursor-pointer">
                                    {selectedFields.includes("Time") && <td className="px-6 py-4 text-sm text-gray-500">{call.time}</td>}
                                    {selectedFields.includes("Call Duration") && <td className="px-6 py-4 text-sm text-gray-500">{call.duration}</td>}
                                    {selectedFields.includes("Type") && <td className="px-6 py-4 text-sm text-gray-500">{call.type}</td>}
                                    {selectedFields.includes("Cost") && <td className="px-6 py-4 text-sm text-gray-500">{call.cost}</td>}
                                    {selectedFields.includes("Call ID") && (
                                        <td
                                            className="items-center px-6 py-4 text-sm text-gray-500 relative"
                                            onMouseEnter={() => setHoveredCallId(call.callId)}
                                            onMouseLeave={() => setHoveredCallId(null)}
                                        >
                                            {call.callId}
                                            {hoveredCallId === call.callId && (
                                                <ClipboardIcon
                                                    className="absolute right-0 top-7 h-4 w-4 text-gray-400 cursor-pointer"
                                                    onClick={(e) => handleCopy(call.callId, e)} // Pass event
                                                />
                                            )}
                                        </td>
                                    )}
                                    {selectedFields.includes("Disconnection Reason") && <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className={`h-2 w-2 rounded-full mr-2 ${getStatusDotColor(call.callStatus)}`}></span>
                                            <span className="text-sm text-gray-500">{call.disconnectionReason}</span>
                                        </div>
                                    </td>}
                                    {selectedFields.includes("Call Status") && <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`text-sm ${getTextColor(call.callStatus)}`}>{call.callStatus}</span>
                                    </td>}
                                    {selectedFields.includes("User Sentiment") && <td className="px-6 py-4 text-sm text-gray-500">{call.userSentiment}</td>}
                                    {selectedFields.includes("From") && <td className="px-6 py-4 text-sm text-gray-500">{call.from}</td>}
                                    {selectedFields.includes("To") && <td className="px-6 py-4 text-sm text-gray-500">{call.to}</td>}
                                    {selectedFields.includes("Call Successful") && <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`text-sm ${getTextColor(call.callSuccessful)}`}>{call.callSuccessful}</span>
                                    </td>}
                                    {selectedFields.includes("End to End Latency") && <td className="px-6 py-4 text-sm text-gray-500">{call.latency || "-"}</td>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="flex flex-wrap items-center justify-between mt-4">
                <button
                    className="flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    <ChevronLeftIcon className="mr-2 h-4 w-4" />
                    Previous
                </button>
                <div className="flex flex-wrap items-center gap-2 my-2">
                    {pageNumbers.map((number) => (
                        <button
                            key={number}
                            className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === number ? "bg-black text-white" : "text-gray-700 hover:bg-gray-50"
                                }`}
                            onClick={() => setCurrentPage(number)}
                        >
                            {number}
                        </button>
                    ))}
                </div>
                <button
                    className="flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                    <ChevronRightIcon className="ml-2 h-4 w-4" />
                </button>
            </div>
            {isDrawerOpen && <Drawer call={selectedCall} onClose={() => setIsDrawerOpen(false)} />}
        </div>
    )
}