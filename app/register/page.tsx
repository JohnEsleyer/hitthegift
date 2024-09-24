"use client";

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen ">
      <div className="gap-4 p-4 flex flex-col border border-black rounded-2xl">
        <div className="flex gap-2">
          <label>Name:</label>
          <input
            className="border-2 border-black rounded"
            type="text"
            placeholder="Ralph"
            id="fname"
            name="fname"
          />
          <label>Last Name:</label>
          <input
            className="border-2 border-black rounded"
            type="text"
            placeholder="Esleyer"
            id="fname"
            name="fname"
          ></input>
        </div>
        <div>
          <label>Email:</label>
          <input
            className="border-2 border-black rounded"
            type="text"
            placeholder="firstname@email.com"
            id="fname"
            name="fname"
          />
        </div>
        {/**Date of Birth and Toggle On/Off */}
        <div className="flex gap-4 ">
          <div className="flex flex-col">
            <label>Date of Birth</label>
            <input
              className="border-2 border-black rounded"
              type="text"
              placeholder="firstname@email.com"
              id="fname"
              name="fname"
            />
          </div>
          <div className="flex flex-col">
            <span>On/Off</span>
            <p>You want your friends to see your interests</p>
          </div>
        </div>
         {/** Hobbies and interests **/}
       <div>
       <span>Hobbies and interests</span>
         <div>
            <textarea 
                className="border border-black"
                name=""
                 
                id="">

            </textarea>
          </div>
       </div>
       {/**Checkbox for Terms and Conditions */}
        <div>
            <span>I have read and accept the terms and conditions for this page.</span>
        </div>
          {/** Buttons */}
      <div className="flex gap-4 justify-center">
      <button className="bg-blue-500 pl-2 pr-2 rounded text-white">Create</button>
      <button className="bg-black pl-2 pr-2 rounded text-white">Cancel</button>
      </div>
      </div>
    
    </div>
  );
}
