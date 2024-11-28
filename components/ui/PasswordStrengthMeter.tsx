import { useState, useEffect } from "react";

interface PasswordStrengthMeterProps {
    password: string;
    onPasswordStrengthChange: (isStrong: boolean, password: string) => void;
  }
  
export default function PasswordStrengthMeter({ password, onPasswordStrengthChange }: PasswordStrengthMeterProps){
    const [strength, setStrength] = useState(0);
  
    const checkStrength = () => {
      let score = 0;
  
      if (password.length >= 8) {
        score++;
      }
      if (password.match(/[a-z]/)) {
        score++;
      }
      if (password.match(/[A-Z]/)) {
        score++;
      }
      if (password.match(/[0-9]/)) {
        score++;
      }
      if (password.match(/[^a-zA-Z0-9]/)) {
        score++;
      }
  
      setStrength(score);
      onPasswordStrengthChange(score >= 4, password);
    };
  
    useEffect(() => {
      checkStrength();
    }, [password]);
  
    const strengthPercentage = (strength / 5) * 100;
  
    
    return (
      <div>
        <div>
          <p>Strength: {strength}/5</p>
          <div style={{ 
            width: '100%', 
            height: 5, 
            backgroundColor: 'lightgray', 
            borderRadius: 5, 
            overflow: 'hidden' 
          }}>
            <div 
              style={{ 
                width: `${strengthPercentage}%`, 
                height: '100%', 
                backgroundColor: strength < 3 ? 'red' : strength === 3 ? 'orange' : 'green' 
              }} 
            />
          </div>
        </div>
      </div>
    );
  };