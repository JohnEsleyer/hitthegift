'use client'

export default function Sandbox() {
    return (
      <div className="h-screen relative bg-slate-200">
        <div className="flex justify-around flex-col items-center h-1/2 ">
          <h1 className=" text-4xl font-bold">Todos Page</h1>
          <form action="" className="flex flex-col">
            <h2 className="text-center text-green-400 font-bold">Add Todo</h2>
            <label htmlFor="todo" className="py-2">
              Todo
            </label>
            <input type="text" name="todo" className="mb-2  w-62 h-10 p-2" />
            <label htmlFor="Deadline" className="py-2">
              Deadline
            </label>
            <input type="text" name="todoDeadline" className=" w-62 h-10 p-2" />
            <button
              type="submit"
              className="bg-blue-400 h-10 w-62 p-2 mt-10 rounded text-white font-bold"
            >
              submit
            </button>
          </form>
        </div>
      </div>
    );
  }