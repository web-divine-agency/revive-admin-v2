import React, { useState, useEffect } from "react";
import axiosInstance from "../../../../axiosInstance";
import Swal from "sweetalert2";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";

function EditBranch() {
    const { branchId } = useParams();
    const [branch, setBranch] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [country, setCountry] = useState('');
    const [openTime, setOpenTime] = useState('');
    const [closeTime, setCloseTime] = useState('');
    const [status, setStatus] = useState('Closed');

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const countries = [
        'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
        'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
        'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
        'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo (Congo-Brazzaville)', 'Costa Rica',
        'Croatia', 'Cuba', 'Cyprus', 'Czechia (Czech Republic)', 'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador',
        'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini (fmr. "Swaziland")', 'Ethiopia', 'Fiji', 'Finland', 'France',
        'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau',
        'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
        'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan',
        'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar',
        'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia',
        'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar (Burma)', 'Namibia', 'Nauru', 'Nepal',
        'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan',
        'Palau', 'Palestine State', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar',
        'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia',
        'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa',
        'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan',
        'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan',
        'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City',
        'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
    ];

    //assuming these are th data from database
    useEffect(() => {
        // Fetch branches
        const fetchBranches = async () => {
           
            try {
                const response = await axiosInstance.get(`/branch/${branchId}`);
                const { branch_name, branch_address, operating_hours, status } = response.data;
                setBranch(branch_name);
                const addressParts = branch_address.split(", ");
                setAddressLine1(addressParts[0]);
                setAddressLine2(addressParts[1]);
                setCity(addressParts[2]);
                setState(addressParts[3]);
                setZipCode(addressParts[4]);
                setCountry(addressParts[5]);
                setOpenTime(operating_hours.open);
                setCloseTime(operating_hours.close);
                setStatus(status);
            } catch (error) {
                console.error("Error fetching branches:", error);
        }

    };
        fetchBranches();
    }, [branchId]);
    
    const updateBranch = async (e) => {
        e.preventDefault();

        const branchAddress = `${addressLine1}, ${addressLine2}, ${city}, ${state}, ${zipCode}, ${country}`;

        const operatingHours = {
            open: openTime,
            close: closeTime
        };

        const updatedBranchData = {
            branch_name: branch,
            branch_address: branchAddress,
            operating_hours: operatingHours,
            status: status
        };

        try{
        const response = await axiosInstance.put(`/update-branch/${branchId}`, updatedBranchData);
        Swal.fire({
            title: "Branch Updated Successfully",
            text: `${branch} has been added to the system.`,
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "#0ABAA6",
          }).then(() => {
            navigate("/branches");
          });
        }catch (error) {
            console.error("Error updating branch:", error);
            setError("An error occurred while updating the branch.");
          }
    };


   
    // List of countries
    return (
        <div className="container">
            <h3>Update  Branch</h3>
            <div className="container-content">
                <form onSubmit={updateBranch}>
                {error && <div className="alert alert-danger">{error}</div>}
                    <div className="d-flex justify-content-between ml-5 mr-5 pt-4">
                        <div className="form-group">
                            <label>Branch Name:</label>
                            <input type="text" className="form-control" value={branch} onChange={(e) => setBranch(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Address Line 1:</label>
                            <input type="text" className="form-control" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Address Line 2:</label>
                            <input type="text" className="form-control" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} />
                        </div>
                    </div>
                    <div className="d-flex justify-content-between ml-5 mr-5">
                        <div className="form-group">
                            <label>City:</label>
                            <input type="text" className="form-control" value={city} onChange={(e) => setCity(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Province:</label>
                            <input type="text" className="form-control" value={state} onChange={(e) => setState(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Zip Code:</label>
                            <input type="number" className="form-control" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
                        </div>
                    </div>
                    <div className="d-flex justify-content-between ml-5">
                        <div className="form-group">
                            <label>Country:</label><br />
                            <select value={country} onChange={(e) => setCountry(e.target.value)}>
                                <option value="">Select Country</option>
                                {countries.map((country, index) => (
                                    <option key={index} value={country}>{country}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Opening Time:</label>
                            <input type="time" className="form-control" value={openTime} onChange={(e) => setOpenTime(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Closing Time:</label>
                            <input type="time" className="form-control" value={closeTime} onChange={(e) => setCloseTime(e.target.value)} />
                        </div>
                    </div>
                    <div className="d-flex ml-5">
                      
                    </div>
                    <div className="d-flex justify-content-between ml-5">
                        <div className="form-group">
                            <label>Status:</label><br />
                            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="Closed">Closed</option>
                                <option value="Open">Open</option>
                            </select>
                        </div>
                    </div>
                    <button className='submit-btn mb-4 mt-4' type="submit">SAVE</button>
                </form>
            </div>
        </div>
    );
}

export default EditBranch;
