import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthContext } from "../../hooks/useAuthContext";
import { toast } from "react-toastify";

function SendLocation() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleSendLocation = async () => {
    if (!user) {
      toast.error("Please log in to update your location");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Current location:", latitude, longitude);
    
        try {
          const response = await axios.put(
            `http://localhost:8070/users/${user.id}/location`,
            {
              latitude,
              longitude
            },
            {
              headers: {
                Authorization: `Bearer ${user.token}`
              }
            }
          );

          if (response.data) {
            toast.success("Location updated successfully!");
            console.log("Location updated successfully");
          }
        } catch (error) {
          console.error("Location update error:", error);
          toast.error(error.response?.data?.error || "Failed to update location");
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error("Failed to get your location. Please check your location permissions.");
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  return (
    <div>
      <h1>Send Location</h1>
      <button 
        className="imashi-btn imashi-btn-primary"
        onClick={handleSendLocation}
        disabled={isLoading}
      >
        {isLoading ? "Updating..." : "Send Location"}
      </button>
    </div>
  );
}

export default SendLocation;
