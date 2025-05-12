import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

function UpdateUser() {
    const [inputs, setInputs] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        jobTitle: '',
        salary: '',
        hireDate: ''
    });

    const navigate = useNavigate();
    const { employeeId } = useParams();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:8070/users/${employeeId}`);
                const userData = response.data.user;

                setInputs({
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    email: userData.email || '',
                    phone: userData.phone || '',
                    jobTitle: userData.job_title || '',
                    salary: userData.salary || '',
                    hireDate: userData.hire_date ? userData.hire_date.split('T')[0] : ''
                });
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    }, [employeeId]);

    const sendRequest = async () => {
        await axios.put(`http://localhost:8070/users/update/${employeeId}`, {
            firstName: inputs.firstName,
            lastName: inputs.lastName,
            email: inputs.email,
            phone: inputs.phone,
            job_title: inputs.jobTitle,
            salary: Number(inputs.salary),
            hire_date: inputs.hireDate
        });
    };

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Show loading toast
            const toastId = toast.loading("Processing your request...");
            
            await sendRequest();
            
            // Update to success toast
            toast.update(toastId, {
                render: "User updated successfully!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
                closeButton: true,
            });
            
            // Navigate after a short delay
            setTimeout(() => {
                navigate("/User/userdetails");
            }, 2000);
            
        } catch (error) {
            // Show error toast
            toast.error(
                error.response?.data?.message || 
                "Failed to add user. Please try again.",
                {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                }
            );
            
            console.error("Registration error:", error);
        }
    };

    return (
        <div className="update-user-container">
            <ToastContainer /> {/* Toast container for notifications */}

            <div className="update-user-card">
                <div className="update-user-header">
                    <h2>Update User</h2>
                </div>
                <div className="update-user-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>First Name</label>
                            <input type="text" name="firstName" onChange={handleChange} value={inputs.firstName} required />
                        </div>

                        <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" name="lastName" onChange={handleChange} value={inputs.lastName} required />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" name="email" onChange={handleChange} value={inputs.email} required />
                        </div>

                        <div className="form-group">
                            <label>Contact Number</label>
                            <input type="text" name="phone" onChange={handleChange} value={inputs.phone} required />
                        </div>

                        <div className="form-group">
                            <label>Role</label>
                            <input type="text" name="jobTitle" onChange={handleChange} value={inputs.jobTitle} required />
                        </div>

                        <div className="form-group">
                            <label>Salary</label>
                            <input type="number" name="salary" onChange={handleChange} value={inputs.salary} required />
                        </div>

                        <div className="form-group">
                            <label>Hired Date</label>
                            <input type="date" name="hireDate" onChange={handleChange} value={inputs.hireDate} required />
                        </div>

                        <div className="button-container">
                            <button type="submit" className="update-user-btn">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UpdateUser;
