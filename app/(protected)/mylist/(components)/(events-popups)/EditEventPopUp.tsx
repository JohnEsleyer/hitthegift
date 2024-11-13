
"use client";
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState, useTransition } from "react";
import HourSelector from "../HourSelector";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentPopup } from "@/lib/features/popups";
import { RootState } from "@/lib/store";
import getAllFriends from "@/app/actions/user/getAllFriends";
import { Friend } from "@/lib/types/friend";
import { convertTo24HourFormat } from "@/utils/convertTo24Hour";
import Loading from '/public/loading.svg';
import Image from 'next/image';
import { deleteMyListEventById, insertMyListEvent, updateEventStore, updateMyListEvents } from "@/lib/features/mylist";
import { updateEditEventDate, updateEditEventInvitedFriends, updateEditEventTitle } from "@/lib/features/editEventsPopup";
import { convertTo12HourFormat, getMeridiem } from "@/utils/convertTo12Hour";
import { updateEvent } from "@/app/actions/events/updateEvent";
import UserProfileImage from "@/components/UserProfileImage";
import { CircleSkeleton } from "@/components/skeletons/CircleSkeleton";
import { Trash2 } from "lucide-react";
import { deleteEvent } from "@/app/actions/events/deleteEvent";


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

export default function EditEventPopup() {
  const [meridiem, setMeridiem] = useState<"AM" | "PM">("AM");
  const [hourSelected, setHourSelected] = useState(8);
  const eventTitle = useSelector((state: RootState) => state.editEventPopup.eventTitle);
  const dateSelected = useSelector((state: RootState) => state.editEventPopup.date);
  const [isFriendPending, startFriendTransition] = useTransition();
  const userId = useSelector((state: RootState) => state.userData.id);
  const [friends, setFriends] = useState<Friend[]>([]);
  const selectedFriends = useSelector((state: RootState) => state.editEventPopup.invitedFriends);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [handledAllError, setHandledAllError] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeletePending, startDeleteTransition] = useTransition();
  const [deleteFailed, setDeleteFailed] = useState(false);

  const eventId = useSelector((state: RootState) => state.editEventPopup.id);

  const dispatch = useDispatch();

  useEffect(() => {
    // Knowing whether date hour is AM or PM
    setMeridiem(getMeridiem(new Date(dateSelected).getHours()))

    startFriendTransition(async () => {
      const results = await getAllFriends(userId);
      if (results) {
        // Filter unselected friends

        const filterFriends = results.friends.filter(
          (friend) => !selectedFriends.some((selected) => selected.id === friend.id)
        );
        
        setFriends(filterFriends || []);
      }
    });

  }, []);

  const handleSubmit = async () => {
    
    // Check if no date is selected
    if (!dateSelected){
      setErrorMessage("No date selected, please select a date");
      setHandledAllError(false);
      return;
    }
    if (eventTitle.length == 0){
      setErrorMessage("Please provide an event title");
      setHandledAllError(false);
      return;
    }

    setHandledAllError(true);

    setIsLoading(true);
    try {
      if (dateSelected) {
       
        const parsedDate = new Date(dateSelected);
        const eventDate = new Date(
          parsedDate.getFullYear(), // Set year
          parsedDate.getMonth(), // Set month
          parsedDate.getDate(), // Set day
          convertTo24HourFormat(hourSelected, meridiem), // Set hour
          0 // minutes
        );
        const friendsId = selectedFriends.map((friend) => friend.id);

        const responseData = await updateEvent({
            id: eventId,
            userId: userId,
            date: eventDate.toString(),
            eventTitle: eventTitle,
            invitedFriends: friendsId,
        });
        if (responseData.data) {
          dispatch(updateEventStore(responseData.data));
        } else {
          console.error('No event data returned from the server.');
          // You can also handle this error case here (e.g., show an error message to the user)
        }
        
        dispatch(updateCurrentPopup('none'));

      }
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  const handleSelectFriend = (friend: Friend) => {

    const updatedSelectedFriends: Friend[] = [
        friend,
        ...selectedFriends,
    ]
    dispatch(updateEditEventInvitedFriends(updatedSelectedFriends));
    setFriends((prev) => prev.filter((element) => element.id !== friend.id));
  };

  const handleRemoveSelectedFriend = (friend: Friend) => {
    setFriends((prev) => [friend, ...prev]);

    const updatedSelectedFriends: Friend[] = selectedFriends.filter((element) => element.id !== friend.id);
    dispatch(updateEditEventInvitedFriends(updatedSelectedFriends));
  };

  const handleDeleteEvent = () => {
    startDeleteTransition(async () => {
      setDeleteFailed(false);
      try{
        const res = await deleteEvent(eventId);
        if (res){
          console.log(res.status);
          dispatch(deleteMyListEventById(eventId));
          dispatch(updateCurrentPopup('none'));
        }
      }catch(e){
        console.log(e);
        setDeleteFailed(true);
      }
    });
  }


  // The following will be displayed if user clicks on the delete icon
  if (showConfirmDelete){
    return (
      <div
      style={{ height: 230 }}
      className="flex flex-col justify-center border border-gray items-center rounded-2xl p-16 bg-white "
    >
      <p className="mt-4">Are you sure you want to delete this product?</p>
      <div className="flex gap-4 mt-4">
        <button
          onClick={handleDeleteEvent}
          className="text-white bg-blue-500 rounded-2xl p-2 pl-4 pr-4"
        >
          Yes
        </button>
        <button
          onClick={() => {
            setShowConfirmDelete(false);
          }}
          className="text-white bg-slate-400 rounded-2xl p-2 pl-4 pr-4"
        >
          No
        </button>
      </div>
      <div
        style={{ height: 40 }}
        className="h-4 mt-2 w-full flex flex-col justify-center items-center"
      >
        <Image
          className={`${!isDeletePending && "invisible"} mt-4`}
          src={Loading}
          alt=""
          width={30}
          height={30}
        />
         {deleteFailed && <p className={`text-red-600`}>
          Failed to delete product
        </p>}
      </div>
    </div>
    )
  }

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

        {/*Delete product */}
        <button onClick={() => setShowConfirmDelete(true)}>
          <Trash2 className="hover:text-red-500"/>
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
        selected={new Date(dateSelected)}
        onSelect={(selected) => {
            if (selected){
                dispatch(updateEditEventDate(selected.toString()))
            }
            
        }}
        className="m-2 rounded-md border"
      />
      {/**Ends Section **/}
      <div className="flex justify-between mb-2">
        <span>Ends</span>
        <div className="flex gap-2">
          <HourSelector
            initialHour={convertTo12HourFormat(new Date(dateSelected).getHours())}
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
            // setEventTitle(e.target.value);
            dispatch(updateEditEventTitle(e.target.value));
          }}
        />
      </div>
      {/**Friend Section **/}
      <div className="w-full">
        <span className="text-xl pt-2">Friend you{"'"}ll share this event</span>
        <div className="flex gap-2 overflow-auto w-96 h-8 ">
          <div className="flex w-full">
            {selectedFriends.map((friend) => (
              <div key={friend.id} onClick={() => handleRemoveSelectedFriend(friend)}>
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
        <span className="text-xl pt-2 ">Select Friend</span>
        <div className="h-8 w-full">
          {isFriendPending ? (
            <div className="flex">
              <CircleSkeleton height={30} width={30}/>
              <CircleSkeleton height={30} width={30}/>
              <CircleSkeleton height={30} width={30}/>
              <CircleSkeleton height={30} width={30}/>
            </div>
          ) : (
            <div className="flex w-full">
              {friends.map((friend) => (
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
          )}
        </div>
      </div>
      <div className="flex justify-center gap-8 mt-6">
        <button onClick={handleSubmit} className="bg-blue-500 rounded-2xl pl-12 pr-12  text-white">
          Save
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
        {errorMessage && !handledAllError && <p className="text-red-500">{errorMessage}</p>}
      </div>
    </div>
  );
}
