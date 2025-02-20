"use client"

import { useState, useMemo } from "react"
import { ChevronLeftIcon, ChevronRightIcon, FilterIcon, Settings2Icon } from "lucide-react"
import callHistoryData from "../../data/call-data.js"
import DateRangePicker from "./DateRangePicker.js"

export default function CallHistory() {
    // const [dateRange, setDateRange] = useState("Date Range")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentCalls = callHistoryData.slice(indexOfFirstItem, indexOfLastItem)

    const totalPages = Math.ceil(callHistoryData.length / itemsPerPage)

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

    return (
        <div className="p-6 bg-gray-50">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Call History</h2>

            <div className="flex flex-wrap items-center gap-4 mb-6">
                {/* <button
                    className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setDateRange("Custom Date Range")}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange}
                </button> */}
                <DateRangePicker />

                <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <FilterIcon className="mr-2 h-4 w-4" />
                    Filter
                </button>

                <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <Settings2Icon className="mr-2 h-4 w-4" />
                    Customize Field
                </button>
            </div>

            <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {[
                                    "Time",
                                    "Call Duration",
                                    "Type",
                                    "Cost",
                                    "Call ID",
                                    "Disconnection Reason",
                                    "Call Status",
                                    "User Sentiment",
                                    "From",
                                    "To",
                                    "Call Successful",
                                    "End to End Latency",
                                ].map((header) => (
                                    <th
                                        key={header}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentCalls.map((call, index) => (
                                <tr key={call.callId} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{call.time}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{call.duration}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{call.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{call.cost}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{call.callId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className={`h-2 w-2 rounded-full mr-2 ${getStatusDotColor(call.callStatus)}`}></span>
                                            <span className="text-sm text-gray-500">{call.disconnectionReason}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`text-sm ${getTextColor(call.callStatus)}`}>{call.callStatus}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{call.userSentiment}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{call.from}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{call.to}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`text-sm ${getTextColor(call.callSuccessful)}`}>{call.callSuccessful}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{call.latency || "-"}</td>
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
                            className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === number ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-50"
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
        </div>
    )
}

