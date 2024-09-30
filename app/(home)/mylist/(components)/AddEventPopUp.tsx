'use client'
import { Calendar } from "@/components/ui/calendar";

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
    return (
        <div style={{width: 500, height: 600}} className=" p-4 bg-gray-100 rounded-2xl border-2 border-black">
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
        <div className="flex justify-between">
          <span>Ends</span>
          <div className="flex gap-2">
            <span className="rounded border bg-gray-200 pl-2 pr-2">8:00</span>
            <div className="flex bg-gray-200 rounded border">
              <span className="bg-white pl-4 pr-4 rounded ">AM</span>
              <span className="pl-4 pr-4 rounded">PM</span>
            </div>
          </div>
        </div>
            {/**Event title section **/ }
        <div className="flex flex-col">
          <span>Event title</span>
          <input className="bg-white rounded-full p-2 w-64 pl-4" placeholder="Event title"/>
        </div>
            {/**Friends Section **/ }
        <div>
          
        </div>
     </div>
    )
}