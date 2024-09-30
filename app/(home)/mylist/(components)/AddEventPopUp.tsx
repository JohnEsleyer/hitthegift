'use client'
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

interface AddEventProps{
    setShowAddEventUI: React.Dispatch<React.SetStateAction<boolean>>;
    dateSelected: Date | undefined;
    setDateSelected: React.Dispatch<React.SetStateAction<Date | undefined>>;
}

const getCurrentDate = () => {
    const today = new Date();
    const day = today.getDay();
    const month = today.getMonth();
    const year = today.getFullYear();
    const monthName = new Intl.DateTimeFormat('en-US', {month: 'long'}).format(today);
    
    return {
      month: monthName,
      year: year,
    };
  }


export default function AddEventPopUp({
    setShowAddEventUI,
    dateSelected,
    setDateSelected,
    
}: AddEventProps){
  
  const [meridiem, setMeridiem] = useState('AM');

    return (
        <div style={{width: 500, height: 630}} className=" p-4 bg-gray-100 rounded-2xl border-2 border-black">
        {/* <p className="text-2xl font-bold">Add Event</p> */}
        <p className=" flex justify-between">
          <div className="text-2xl font-bold flex gap-2">
          <span>{getCurrentDate().month}</span>
          <span>{getCurrentDate().year}</span>
          </div>
          <button 
            className="underline"
            onClick={()=>{
              setShowAddEventUI(false);
            }}
            >
            Close
          </button>
          </p>
          {/**Calendar Section **/ }
        <Calendar
             classNames={{
            day_selected: 'bg-blue-500 rounded-2xl text-white ',
            months:
              "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
            month: "space-y-4 w-full flex flex-col",
            table: "w-full h-full border-collapse space-y-1",
            head_row: "",
            row: "w-full mt-2",
          }}
            
            mode="single"
            selected={dateSelected}
            onSelect={setDateSelected}
            className="m-2 rounded-md border"
          />
        {/**Ends Section **/ }
        <div className="flex justify-between mb-8">
          <span>Ends</span>
          <div className="flex gap-2">
            <span className="rounded border bg-gray-200 pl-2 pr-2">8:00</span>
            <div className="flex bg-gray-200 rounded border">
              <button 
                className={`${meridiem == "AM" && "bg-white"}  pl-4 pr-4 rounded `}
                onClick={() => {
                  setMeridiem('AM');
                }}
                >
                AM
              </button>
              <button 
                className={`${meridiem == "PM" && "bg-white"} pl-4 pr-4 rounded`}
                onClick={() => {
                  setMeridiem('PM');
                }}
                >
                PM
              </button>
            </div>
          </div>
        </div>
            {/**Event title section **/ }
        <div className="flex flex-col mb-4">
          <span>Event title</span>
          <input className="bg-white rounded-full p-2 w-64 pl-4" placeholder="Event title"/>
        </div>
            {/**Friends Section **/ }
        <div>
            <span className="text-xl pt-2">Friends you'll share this event</span>
            <div className="flex gap-2 overflow-auto w-96 ">
              <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
              <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
              <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
              <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
              <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
              <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
              <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
           

            </div>
            <span className="text-xl pt-2">Selected friends</span>
            <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
        </div>
        <div className="flex justify-center gap-8">
          <button className="bg-blue-500 rounded-2xl pl-12 pr-12  text-white">Accept</button>
          <button 
            className="bg-black rounded-2xl pl-12 pr-12  text-white"
            onClick={() => {
              setShowAddEventUI(false);
            }}
            >
            Cancel
          </button>
        </div>
     </div>
    )
}