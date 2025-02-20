"use client";

import { useState } from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { CalendarIcon } from "lucide-react";

export default function DateRangePicker() {
  const [range, setRange] = useState({});
  const [open, setOpen] = useState(false);

  return (
    <div className=" max-w-full">
      {/* Button to open calendar */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 "
      >
        <CalendarIcon />
        {range.from && range.to ? (
          <span>
            {format(range.from, "MM/dd/yyyy")} -{" "}
            {format(range.to, "MM/dd/yyyy")}
          </span>
        ) : (
          "Date Range"
        )}
      </button>
      <div className="">
        {/* Calendar Popup */}
        {open && (
          <div className=" w-fit absolute left-6 mt-2 bg-white border border-gray-300 shadow-lg rounded-lg p-4">
            <DayPicker
              mode="range"
              selected={range}
              onSelect={(selected) => {
                if (selected?.from && selected?.to) {
                  setRange({ from: selected.from, to: selected.to });
                } else {
                  setRange({ from: undefined, to: undefined });
                }
              }}
              numberOfMonths={2}
              modifiersClassNames={{
                selected: "!bg-black !text-white ", // Selected date (black)
                range_middle: "!bg-gray-300 !text-black", // Range middle (light gray)
                range_start: "!bg-black !text-white !rounded-none", // Start of range
                range_end: "!bg-black !text-white !rounded-none", // End of range
                today: "!text-blue-500", // Today's date
                month_toggle: "!bg-black !text-white", // Month toggle button
              }}
            />
            <div className="flex justify-between mt-2">
              <button
                onClick={() => setRange({ from: undefined, to: undefined })}
                className="text-sm text-red-500 hover:underline"
              >
                Clear
              </button>
              <button
                onClick={() => setOpen(false)}
                className="text-sm text-black hover:underline"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
