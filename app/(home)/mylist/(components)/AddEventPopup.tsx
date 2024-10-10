"use client";
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState, useTransition } from "react";
import HourSelector from "./HourSelector";
import Avvvatars from "avvvatars-react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentPopup } from "@/lib/features/popups";
import { RootState } from "@/lib/store";
import getAllFriends from "@/app/actions/user/getAllFriends";
import { Friend } from "@/lib/types/friend";
import { createEvent } from "@/app/actions/events/createEvent";
import { convertTo24HourFormat } from "@/utils/convertTo24Hour";
import Loading from '/public/loading.svg';
import Image from 'next/image';


const getCurrentDate = () => {
  const today = new Date();

  const year = today.getFullYear();
  const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    today
  );

  return {
    month: monthName,
    year: year,
  };
};

export default function AddEventPopup() {
  const [meridiem, setMeridiem] = useState<"AM" | "PM">("AM");
  const [hourSelected, setHourSelected] = useState(8);
  const [eventTitle, setEventTitle] = useState("");
  const [dateSelected, setDateSelected] = useState<Date | undefined>();
  const [isFriendPending, startFriendTransition] = useTransition();
  const userId = useSelector((state: RootState) => state.userData.id);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    startFriendTransition(async () => {
      const results = await getAllFriends(userId);
      if (results) {
        setFriends(results.friends || []);
      }
    });
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (dateSelected) {
        const eventDate = new Date(
          dateSelected.getFullYear(), // Set year
          dateSelected.getMonth(), // Set month
          dateSelected.getDate(), // Set day
          convertTo24HourFormat(hourSelected, meridiem), // Set hour
          0 // minutes
        );
        const friendsId = selectedFriends.map((friend) => friend.id);

        const responseData = await createEvent({
          userId: userId,
          data: {
            id: '',
            userId: userId,
            date: eventDate,
            eventTitle: eventTitle,
            invitedFriends: friendsId,
          }
        });

        dispatch(updateCurrentPopup('none'));

      }
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  const handleSelectFriend = (friend: Friend) => {
    setSelectedFriends((prev) => [friend, ...prev]);
    setFriends((prev) => prev.filter((element) => element.id !== friend.id));
  };

  const handleRemoveSelectedFriend = (friend: Friend) => {
    setFriends((prev) => [friend, ...prev]);
    setSelectedFriends((prev) =>
      prev.filter((element) => element.id !== friend.id)
    );
  };

  return (
    <div
      style={{ width: 500, height: 630 }}
      className=" p-4 bg-white  rounded-2xl border-2 border-gray"
    >
      {/* <p className="text-2xl font-bold">Add Event</p> */}
      <div className=" flex justify-between">
        <div className="text-2xl font-bold flex gap-2">
          <span>{getCurrentDate().month}</span>
          <span>{getCurrentDate().year}</span>
        </div>
        <button
          className="underline"
          onClick={() => {
            dispatch(updateCurrentPopup("none"));
          }}
        >
          Close
        </button>
      </div>
      {/**Calendar Section **/}
      <Calendar
        classNames={{
          day_selected: "bg-blue-500 rounded-xl text-white",
          day: "p-1 pl-2 pr-2 hover:bg-blue-300 rounded-xl",
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
      {/**Ends Section **/}
      <div className="flex justify-between mb-2">
        <span>Ends</span>
        <div className="flex gap-2">
          <HourSelector
            initialHour={8}
            onSelect={(selectedHour) => {
              setHourSelected(selectedHour);
            }}
          />
          <div className="flex bg-gray-200 rounded border">
            <button
              className={`${
                meridiem == "AM" && "bg-white"
              }  pl-4 pr-4 rounded `}
              onClick={() => {
                setMeridiem("AM");
              }}
            >
              AM
            </button>
            <button
              className={`${meridiem == "PM" && "bg-white"} pl-4 pr-4 rounded`}
              onClick={() => {
                setMeridiem("PM");
              }}
            >
              PM
            </button>
          </div>
        </div>
      </div>
      {/**Event title section **/}
      <div className="flex flex-col mb-2">
        <span>Event title</span>
        <input
          className="bg-white rounded-full p-2 w-64 pl-4"
          placeholder="Event title"
          value={eventTitle}
          onChange={(e) => {
            setEventTitle(e.target.value);
          }}
        />
      </div>
      {/**Friend Section **/}
      <div>
        <span className="text-xl pt-2">Friend you{"'"}ll share this event</span>
        <div className="flex gap-2 overflow-auto w-96 h-8 ">
          <div className="flex w-full">
            {selectedFriends.map((friend) => (
              <div key={friend.id} onClick={() => handleRemoveSelectedFriend(friend)}>
                <Avvvatars  value={`${friend.firstName}`} />
              </div>
            ))}
          </div>
        </div>
        <span className="text-xl pt-2 ">Select Friend</span>
        <div className="h-8">
          {isFriendPending ? (
            <div>Loading...</div>
          ) : (
            <div className="flex w-full">
              {friends.map((friend) => (
                <div key={friend.id} onClick={() => handleSelectFriend(friend)}>
                  <Avvvatars  value={`${friend.firstName}`} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center gap-8 mt-6">
        <button onClick={handleSubmit} className="bg-blue-500 rounded-2xl pl-12 pr-12  text-white">
          Accept
        </button>
        <button
          className="bg-black rounded-2xl pl-12 pr-12  text-white"
          onClick={() => {
            dispatch(updateCurrentPopup("none"));
          }}
        >
          Cancel
        </button>
      </div>
    
      <div className="flex justify-center items-center p-4">
        {isLoading && <Image src={Loading} alt='' style={{width: 30}} />}
      </div>
    </div>
  );
}
