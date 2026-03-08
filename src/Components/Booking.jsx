import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUpload, FaFacebook, FaInstagram } from "react-icons/fa";
import { useEffect } from "react";
import Select from "react-select";

function Booking() {

  const [images, setImages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
const [loading, setLoading] = useState(false);
const [sendingOtp, setSendingOtp] = useState(false);
const [indianCities, setIndianCities] = useState([]);
const [loadingCities, setLoadingCities] = useState(true);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
const [date, setDate] = useState("");
const [qualification, setQualification] = useState("");
const [city, setCity] = useState("");
const [previousDetails, setPreviousDetails] = useState("");
  const navigate = useNavigate();

const isFormValid = () => {
  return (
    name.trim() !== "" &&
    date.trim() !== "" &&
    qualification.trim() !== "" &&
    city.trim() !== "" &&
    previousDetails.trim() !== ""
  );
};
  const handleUpload = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 5) {
      console.log("Maximum 5 images allowed");
      return;
    }

    setImages([...images, ...files]);
  };
useEffect(() => {
  const fetchCities = async () => {
    try {
      const res = await fetch("https://countriesnow.space/api/v0.1/countries/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: "India" }),
      });

      const data = await res.json();
      const sortedCities = data.data.sort(); // optional: sort alphabetically
      setIndianCities(sortedCities);
      setLoadingCities(false);
    } catch (err) {
      console.error("Failed to fetch cities:", err);
      setLoadingCities(false);
    }
  };

  fetchCities();
}, []);
const cityOptions = indianCities.map((city) => ({
  value: city,
  label: city
}));
  // Upload images to backend
  const uploadImages = async () => {

    const formData = new FormData();

    images.forEach((img) => {
      formData.append("images", img);
    });

    try {

      const res = await fetch("https://art-gallery-messanger.onrender.com/upload-images", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (data.success) {
        console.log("Uploaded URLs:", data.images);
        return data.images;
      } else {
        console.log("Image upload failed");
        return null;
        console.log(data)
      }

    } catch (err) {
      console.error(err);
      console.log("Upload error");
    }
  };

  const handleSendOtp = async () => {

  if (!phone) {
    
    return;
  }

  setSendingOtp(true); // start loading

  try {

    const res = await fetch("https://art-gallery-messanger.onrender.com/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ phone: `+91${phone}` })
    });

    const data = await res.json();

    setSendingOtp(false); // stop loading

    if (data.success) {
      setOtpSent(true);
    } else {
      console.log("Failed to send OTP.");
    }

  } catch (err) {
    setSendingOtp(false);
    console.log("Server error");
    console.error(err);
  }

};

  const handleVerifyOtp = async () => {

  if (!otp) {
    console.log("Please enter the OTP.");
    return;
  }

  setLoading(true); // start loading

  try {

    const uploadedImages = await uploadImages();

    if (!uploadedImages) {
      console.log("Image upload failed");
      setLoading(false);
      return;
    }

    const res = await fetch("https://art-gallery-messanger.onrender.com/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        phone: `+91${phone}`,
        otp,
        name,
        date,
        qualification,
        city,
        previousDetails,
        images: uploadedImages
      })
    });

    const data = await res.json();

    setLoading(false); // stop loading

    if (data.success) {
      
      navigate("/thank-you");
    } else {
      console.log("Invalid OTP");
    }

  } catch (err) {
    setLoading(false);
    console.log("Verification failed");
    console.error(err);
  }
};

  return (
    <div className="min-h-screen flex flex-col justify-center p-6 bg-amber-50">

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-xl border border-amber-200 mx-auto">

        <h1 className="text-3xl font-bold text-center mb-6 text-red-900">
          Upload your 5 best artwork for applying
        </h1>

        {images.length < 5 && (
          <>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleUpload}
              id="upload"
              className="hidden"
            />

            <label
              htmlFor="upload"
              className="flex flex-col items-center justify-center border-2 border-dashed border-amber-300 rounded-lg h-40 cursor-pointer hover:border-red-800 transition"
            >
              <FaUpload className="text-3xl mb-2 text-red-800" />

              <p className="text-red-900 font-medium">
                Upload Artwork
              </p>

              <p className="text-sm text-gray-500">
                {images.length}/5 uploaded
              </p>

            </label>
          </>
        )}

        <div className="flex flex-col gap-4 mt-6">
          {images.map((img, index) => (
            <img
              key={index}
              src={URL.createObjectURL(img)}
              alt="preview"
              className="w-full h-60 object-cover rounded-lg border border-amber-200"
            />
          ))}
        </div>

        {images.length === 5 && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full mt-6 bg-red-900 text-white py-3 rounded-lg hover:bg-red-800 transition"
          >
            Next
          </button>
        )}

      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">

          <div className="bg-white p-8 rounded-xl w-[90%] max-w-lg border border-amber-200">

            <h2 className="text-2xl font-semibold mb-4 text-red-900">
              Bio Data
            </h2>

<form className="space-y-3">
{/* Name */}
<label className="block text-gray-700 mb-1">Name</label>
<input
  type="text"
  placeholder="Enter your name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  className="w-full border p-2 rounded"
/>

{/* Date of Birth */}
<label className="block text-gray-700 mb-1">Date of Birth</label>
<input
  type="date"
  value={date} // reuse your existing 'date' state
  onChange={(e) => setDate(e.target.value)}
  className="w-full border p-2 rounded"
  max={new Date().toISOString().split("T")[0]} // prevent future dates
/>

{/* Qualification */}
<label className="block text-gray-700 mb-1">Qualification / Education Level</label>
<select
  value={qualification}
  onChange={(e) => setQualification(e.target.value)}
  className="w-full border p-2 rounded"
>
  <option value="">Select Education Level</option>

  {/* Primary Education */}
  <option value="Primary (1st-5th)">Primary (1st - 5th Class)</option>

  {/* Upper Primary / Middle School */}
  <option value="Upper Primary / Middle (6th-8th)">Upper Primary / Middle (6th - 8th Class)</option>

  {/* Secondary / High School */}
  <option value="Secondary / High School (9th-10th)">Secondary / High School (9th - 10th Class)</option>

  {/* Higher Secondary / Senior Secondary */}
  <option value="Higher Secondary / Senior Secondary (11th-12th)">Higher Secondary / Senior Secondary (11th - 12th Class)</option>

  {/* Graduation */}
  <option value="Graduate (College Degree)">Graduate (Undergraduate / College Degree)</option>

  {/* Postgraduate */}
  <option value="Postgraduate (Master's Degree)">Postgraduate (Master's / Higher Degree)</option>

  {/* Professional Artist */}
  <option value="Professional Artist">Professional Artist</option>
</select>

{/* City/Residence */}
<label className="block text-gray-700 mb-1">City / Residence</label>

{loadingCities ? (
  <p>Loading cities...</p>
) : (
  <Select
    options={cityOptions}
    value={cityOptions.find((c) => c.value === city)}
    onChange={(selected) => setCity(selected.value)}
    placeholder="Search City..."
    isSearchable
  />
)}

{/* Previous Exhibition Details */}
<label className="block text-gray-700 mb-1">Previous Exhibition Details</label>
<select
  value={previousDetails}
  onChange={(e) => setPreviousDetails(e.target.value)}
  className="w-full border p-2 rounded"
>
  <option value="">Select Previous Exhibition Details</option>
  <option value="First-time exhibitor">First-time exhibitor</option>
  <option value="Participated earlier">Participated earlier</option>
  <option value="Award-winning artist">Award-winning artist</option>
</select>
<button
  type="button"
  onClick={() => {
    if (isFormValid()) {
      setShowForm(false);
      setShowPhone(true);
    } else {
      console.log("Please fill all fields before submitting.");
    }
  }}
  className="w-full bg-red-900 text-white py-2 rounded"
>
  Submit Application
</button>

  <button
    type="button"
    onClick={() => setShowForm(false)}
    className="w-full border border-red-900 text-red-900 py-2 rounded"
  >
    Cancel
  </button>
</form>

          </div>

        </div>
      )}

      {showPhone && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">

          <div className="bg-white p-8 rounded-xl w-[90%] max-w-md border border-amber-200">

            <h2 className="text-2xl font-semibold mb-4 text-red-900">
              Phone Verification
            </h2>

            {!otpSent ? (
              <>
                <input
                  type="tel"
                  placeholder="Enter Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border p-2 rounded mb-4"
                />

<button
  onClick={handleSendOtp}
  className="w-full bg-red-900 text-white py-2 rounded flex justify-center items-center"
  disabled={sendingOtp}
>
  {sendingOtp ? (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  ) : (
    "Send OTP"
  )}
</button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border p-2 rounded mb-4"
                />

<button
  onClick={handleVerifyOtp}
  className="w-full bg-red-900 text-white py-2 rounded flex justify-center items-center"
  disabled={loading}
>
  {loading ? (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  ) : (
    "Verify OTP"
  )}
</button>
              </>
            )}

            <button
              onClick={() => {
                setShowPhone(false);
                setOtpSent(false);
                setOtp("");
              }}
              className="w-full border border-red-900 text-red-900 py-2 rounded mt-3"
            >
              Cancel
            </button>

          </div>

        </div>
      )}

      <footer className="mt-10 text-center">

        <p className="mb-3 text-red-900 font-medium">
          Follow Us
        </p>

        <div className="flex justify-center gap-6 text-2xl text-red-900">

          <a href="https://www.instagram.com/manikarnikaartgallery/">
            <FaInstagram />
          </a>

          <a href="https://www.facebook.com/manikarnikaartgallery/">
            <FaFacebook />
          </a>

        </div>

      </footer>

    </div>
  );
}

export default Booking;