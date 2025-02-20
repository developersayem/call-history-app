/* eslint-disable react/prop-types */
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Drawer({ call, onClose }) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(!!call);
    }, [call]);

    if (!call) return null;

    return (
        <div className="fixed inset-0 flex justify-end z-50">
            {/* Background Overlay */}
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>

            {/* Drawer */}
            <div className={`relative bg-white w-[450px] p-6 shadow-lg transform transition-transform duration-300 ease-in-out border-l border-gray-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-lg font-semibold">{call.time} phone_call</h2>
                    <button onClick={onClose}>
                        <XIcon className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Call Details */}
                <div className="space-y-2 text-sm text-gray-700">
                    <p><strong>Agent:</strong> {call.agent}</p>
                    <p><strong>Call ID:</strong> {call.callId}</p>
                    <p><strong>Phone Call:</strong> {call.from} → {call.to}</p>
                    <p><strong>Duration:</strong> {call.duration}</p>
                </div>

                {/* Conversation Analysis */}
                <div className="mt-4 border-t pt-3">
                    <h3 className="text-md font-semibold mb-2">Conversation Analysis</h3>
                    <ul className="space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${call.callSuccessful ? "bg-green-500" : "bg-red-500"}`}></span>
                            Call Successful
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-gray-500"></span>
                            Call Status: {call.callStatus}
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-gray-500"></span>
                            User Sentiment: {call.userSentiment || "Unknown"}
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-gray-500"></span>
                            Disconnection Reason: {call.disconnectionReason}
                        </li>
                    </ul>
                </div>

                {/* Summary & Transcription Section */}
                <div className="mt-4 border-t pt-3">
                    <h3 className="text-md font-semibold mb-2">Summary</h3>
                    <div className="text-sm text-gray-600">
                        <p className="font-medium text-gray-800">Transcription</p>
                        <p className="text-gray-500 italic">No transcript.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
