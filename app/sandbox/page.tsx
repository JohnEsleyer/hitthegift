'use client'

export default function Sandbox() {
  const date: Date = new Date();
  const date2: Date = new Date('Tue Oct 15 2024');

 return (<div>
  
    {date.toDateString()}
    {date2.toDateString()}
  </div>
 )
 
}
