"use client";

import { useEffect, useState } from "react";
import HourSelector from "../HourSelector";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentPopup } from "@/lib/features/popups";
import { RootState } from "@/lib/store";
import { Friend } from "@/lib/types/friend";
import { createEvent } from "@/app/actions/events/createEvent";
import { convertTo24HourFormat } from "@/utils/convertTo24Hour";
import Loading from "/public/loading.svg";
import Image from "next/image";
import { insertHighlightedDate, insertMyListEvent, updateHighlightedDates } from "@/lib/features/mylist";
import UserProfileImage from "@/components/UserProfileImage";
import DateSelector from "@/components/DateSelector";

export default function AddEventPopup() {
  const [meridiem, setMeridiem] = useState<"AM" | "PM">("AM");
  const [hourSelected, setHourSelected] = useState(8);
  const [eventTitle, setEventTitle] = useState("");
  const [dateSelected, setDateSelected] = useState<string>('');
  const userId = useSelector((state: RootState) => state.userData.id);
  const [displayFriends, setDisplayFriends] = useState<Friend[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [handledAllError, setHandledAllError] = useState(false);

  const friends = useSelector(
    (state: RootState) => state.friendsSidebar.friends
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setDisplayFriends(friends);
  }, []);

  const handleSubmit = async () => {
    // Check if no date is selected
    if (!dateSelected) {
      setErrorMessage("No date selected, please select a date");
      setHandledAllError(false);
      return;
    }

    if (eventTitle.length == 0) {
      setErrorMessage("Please provide an event title");
      setHandledAllError(false);
      return;
    }

    setHandledAllError(true);
    setIsLoading(true);
    try {
      if (dateSelected) {
        let date = new Date(dateSelected);
        const eventDate = new Date(
          date.getFullYear(), // Set year
          date.getMonth(), // Set month
          date.getDate(), // Set day
          convertTo24HourFormat(hourSelected, meridiem), // Set hour
          0 // minutes
        );
        const friendsId = selectedFriends.map((friend) => friend.id);

        const responseData = await createEvent({
          userId: userId,
          data: {
            id: "",
            userId: userId,
            date: eventDate.toString(),
            eventTitle: eventTitle,
            invitedFriends: friendsId,
          },
        });
        if (responseData.data) {
          dispatch(insertMyListEvent(responseData.data));
        } else {
          console.error("No event data returned from the servers.");
          // You can also handle this error case here (e.g., show an error message to the user)
        }
        dispatch(updateCurrentPopup("none"));
      }
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  const handleSelectFriend = (friend: Friend) => {
    setSelectedFriends((prev) => [friend, ...prev]);
    setDisplayFriends((prev) =>
      prev.filter((element) => element.id !== friend.id)
    );
  };

  const handleRemoveSelectedFriend = (friend: Friend) => {
    setDisplayFriends((prev) => [friend, ...prev]);
    setSelectedFriends((prev) =>
      prev.filter((element) => element.id !== friend.id)
    );
  };

  return (
  <div
    style={{ backgroundColor: '#f5f5f5',width: 426, height: 552, paddingLeft: 10, paddingTop: 5 }}
    className="bg-white  rounded-2xl"
  >
    {/**Calendar Section **/}
    <DateSelector
      selected={new Date(dateSelected)}
      onSelect={(selected) => {
        if (selected){
          setDateSelected(selected.toString());
        }
      }}
    />
    {/**Ends Section **/}
    <div style={{ fontSize: 14 }} className="flex justify-between mb-2 ">
      <span>Ends</span>
      <div className="flex gap-2">
        <HourSelector
          initialHour={8}
          onSelect={(selectedHour) => {
            setHourSelected(selectedHour);
          }}
        />
        <div className="flex bg-[#dadadb] rounded border mr-2">
          <button
            className={`${
              meridiem == "AM" && "bg-white border-2 border-[#dadadb] rounded shadow-xl"
            }  pl-4 pr-4 rounded `}
            onClick={() => {
              setMeridiem("AM");
            }}
          >
            AM
          </button>
          <button
            className={`${meridiem == "PM" && "bg-white border-2 border-[#dadadb] rounded shadow-xl" } pl-4 pr-4 rounded`}
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
    <div style={{ fontSize: 14 }} className="flex flex-col mb-2">
      <span>Event title</span>
      <input
        style={{ width: 200 }}
        className="bg-white rounded-xl p-2 pl-4 border border-gray-300"
        placeholder="Event title"
        value={eventTitle}
        onChange={(e) => {
          setEventTitle(e.target.value);
        }}
      />
    </div>
    {/**Friend Section **/}
    <div className="w-full">
      <span className=" pt-2">Friend you{"'"}ll share this event</span>
      <div className="flex gap-2 overflow-auto w-96 h-8 ">
        <div className="flex w-full">
          {selectedFriends.map((friend) => (
            <div
              key={friend.id}
              onClick={() => handleRemoveSelectedFriend(friend)}
            >
              <UserProfileImage
                userId={friend.id}
                userName={friend.firstName}
                alt=""
                width={30}
                height={30}
              />
            </div>
          ))}
        </div>
      </div>
      <span className="pt-2 ">Select Friends</span>
      <div className="h-8 w-full">
          <div className="flex w-full">
            {displayFriends.map((friend) => (
              <div key={friend.id} onClick={() => handleSelectFriend(friend)}>
                <UserProfileImage
                  userId={friend.id}
                  userName={friend.firstName}
                  alt=""
                  width={30}
                  height={30}
                />
              </div>
            ))}
          </div>
      </div>
    </div>
    <div className="flex justify-center gap-8 mt-6">
      {isLoading ? (
        <Image src={Loading} alt="" style={{ width: 30 }} />
      ) : (
        <button
          onClick={handleSubmit}
          className="bg-blue-500 rounded-2xl pl-12 pr-12  text-white"
        >
          Accept
        </button>
      )}
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
      {errorMessage && !handledAllError && (
        <p className="text-red-500">{errorMessage}</p>
      )}
    </div>
  </div>
  );
}
