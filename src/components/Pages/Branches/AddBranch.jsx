import React, { useState } from 'react';



function AddNewBranch() {
    const [branch, setBranch] = useState('');
    const [addressLine1, setaddressLine1] = useState('');
    const [addressLine2, setaddressLine2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setzipCode] = useState('');
    const [country, setCountry] = useState('');
    // const [operatingHours, setoperatingHours] = useState('');

    // list of countries
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
    


    const addBranch = (e) => {
        e.preventDefault();
        console.log(`New Branch Added: ${branch}, ${addressLine1}, ${addressLine2}, ${city}, ${state}, ${zipCode}, ${country}`);
    };

    return (
        <div className="container">
            <h3>Add New User</h3>
            <div className="container-content">
                <form onSubmit={addBranch}>
                    <div className="d-flex justify-content-between ml-5 mr-5 pt-4">
                        <div className="form-group">
                            <label>Branch Name:</label>
                            <input type="text" className="form-control" value={branch} onChange={(e) => setBranch(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Address Line 1:</label>
                            <input type="text" className="form-control" value={addressLine1} onChange={(e) => setaddressLine1(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Address Line 2:</label>
                            <input type="text" className="form-control" value={addressLine2} onChange={(e) => setaddressLine2(e.target.value)} />
                        </div>
                    </div>
                    <div className="d-flex justify-content-between ml-5 mr-5">
                        <div className="form-group">
                            <label>City:</label>
                            <input type="text" className="form-control" value={city} onChange={(e) => setCity(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>State:</label>
                            <input type="text" className="form-control" value={state} onChange={(e) => setState(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Zip Code:</label>
                            <input type="number" className="form-control" value={zipCode} onChange={(e) => setzipCode(e.target.value)} />
                        </div>
                    </div>
                    <div className="d-flex justify-content-between ml-5">
                        <div className="form-group">
                            <label>Countries:</label><br />
                            <select value={country} onChange={(e) => setCountry(e.target.value)}>
                                <option value="">Select Branch</option>
                                {countries.map((country, index) => (
                                    <option key={index} value={country}>{country}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button className='submit-btn mb-4 mt-4' type="submit">SAVE</button>
                </form>
            </div>
        </div>
    );
}

export default AddNewBranch;
