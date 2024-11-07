'use client'


export function SnowHills() {
    return (
      <div>
        <style>
          {`
          body {
    background-color: #87CEEB;
  }
  
  .hills {
    position: relative;
    height: 150px;
    width: 500%;
  }
  
  .hill {
    position: absolute;
    bottom: 0;
    width: 200px;
    height: 100px;
    background-color: white;
    border-radius: 100% 100% 0 0 / 60% 60% 0 0; /* Adjust these values for different curves */
  }
  
  .hill:nth-child(1) {
    left: 0;
  }
  
  .hill:nth-child(2) {
    left: 100px;
    height: 120px;
  }
  
  .hill:nth-child(3) {
    left: 150px;
    height: 105px;
  }
  
  .hill:nth-child(4) {
    left: 200px;
    height: 80px;
  }
  
  .hill:nth-child(5) {
    left: 300px;
    height: 80px;
  }
    .hill:nth-child(6) {
    left: 350px;
    height: 80px;
  }
      .hill:nth-child(7) {
    left: 400px;
    height: 90px;
  }
  .hill:nth-child(8) {
    left: 500px;
    height: 70px;
  }
  .hill:nth-child(9) {
    left: 550px;
    height: 80px;
  }
  .hill:nth-child(10) {
    left: 750px;
    height:80px;
  }
  .hill:nth-child(11) {
    left: 850px;
    height:100px;
  }
  .hill:nth-child(12) {
    left: 900px;
    height:100px;
  }
    .hill:nth-child(13) {
    left: 950px;
    height: 70px;
  }
  
  .hill:nth-child(14) {
    left: 1000px;
    height:80px;
  }
  .hill:nth-child(15) {
    left: 1050px;
    height:100px;
  }
  .hill:nth-child(16) {
    left: 1100px;
    height:100px;
  }
    .hill:nth-child(17) {
    left: 1150x;
    height:100px;
  }
    .hill:nth-child(18) {
    left: 1200px;
    height:100px;
  }
    .hill:nth-child(19) {
    left: 1250px;
    height:80px;
  }
      .hill:nth-child(20) {
    left: 1300px;
    height:80px;
  }
  
  
          `}
        </style>
        <div className="hills">
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
        </div>
      </div>
    );
  }
  