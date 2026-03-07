import { useEffect, useState } from "react";

function Selection() {
  const [applications, setApplications] = useState([]);
  const [selectedImages, setSelectedImages] = useState({});
  const [filter, setFilter] = useState("all");
  const [preview, setPreview] = useState(null); // { appId, img }

  useEffect(() => {
    fetch("https://art-gallery-messanger.onrender.com/applications")
      .then(res => res.json())
      .then(data => setApplications(data));
  }, []);

  // Handle confirming image selection from preview
  const confirmImage = () => {
    const { appId, img } = preview;
    const app = applications.find(a => a._id === appId);

    if (app.Qualified) {
      // Already qualified → do nothing
      setPreview(null);
      return;
    }

    const current = selectedImages[appId] || [];
    if (!current.includes(img)) {
      if (current.length >= 2) {
        alert("Only 2 images allowed");
        return;
      }
      setSelectedImages({
        ...selectedImages,
        [appId]: [...current, img]
      });
    }
    setPreview(null);
  };

  const cancelImage = () => {
    setPreview(null);
  };

  // Full-screen preview trigger (disabled for qualified artists)
  const handleImageClick = (appId, img) => {
    const app = applications.find(a => a._id === appId);
    if (app.Qualified) return; // Cannot select for already qualified
    setPreview({ appId, img });
  };

  const handleSelect = async (id) => {
    const selected = selectedImages[id] || [];
    if (selected.length !== 2) {
      alert("Please select exactly 2 images");
      return;
    }

    try {
      const res = await fetch("https://art-gallery-messanger.onrender.com/select-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, selectedImages: selected })
      });

      const data = await res.json();
      if (data.success) {
        alert("Artist qualified for 2nd round");

        setApplications(prev =>
          prev.map(app =>
            app._id === id ? { ...app, Qualified: true, SelectedImages: selected } : app
          )
        );
        setSelectedImages(prev => ({ ...prev, [id]: [] }));
      } else {
        alert("Failed to qualify artist");
      }
    } catch (err) {
      console.error(err);
      alert("Error qualifying artist");
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === "qualified") return app.Qualified;
    if (filter === "unqualified") return !app.Qualified;
    return true;
  });

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-5">Artist Applications</h1>

      {/* Filter Buttons */}
      <div className="mb-10 flex gap-4">
        {["all", "qualified", "unqualified"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded ${
              filter === f ? "bg-blue-600 text-white" : "bg-gray-300"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Applications */}
      {filteredApplications.map(app => {
        const selected = selectedImages[app._id] || [];

        return (
          <div key={app._id} className="bg-white p-6 mb-10 rounded shadow">
            <h2 className="text-xl font-bold">{app.Name}</h2>
            <p>Phone: {app.Phone}</p>
            <p>City: {app.City}</p>
            <p>Qualification: {app.Qualification}</p>
            <p>{app.PreviousDetails}</p>

            <div className="grid grid-cols-3 gap-4 mt-5">
              {(app.Images || []).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => handleImageClick(app._id, img)}
                  className={`cursor-pointer border-4 ${
                    app.Qualified
                      ? app.SelectedImages?.includes(img)
                        ? "border-green-500"
                        : "border-transparent"
                      : selected.includes(img)
                      ? "border-green-500"
                      : "border-transparent"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => handleSelect(app._id)}
              disabled={app.Qualified}
              className={`mt-5 px-5 py-2 rounded text-white ${
                app.Qualified ? "bg-gray-400 cursor-not-allowed" : "bg-green-600"
              }`}
            >
              {app.Qualified ? "Already Qualified" : "Qualify for 2nd Round"}
            </button>
          </div>
        );
      })}

      {filteredApplications.length === 0 && (
        <p className="text-gray-500">No applications to display.</p>
      )}

      {/* Fullscreen Image Preview */}
      {preview && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
          <img src={preview.img} className="max-h-[80%] max-w-[90%] mb-5" />
          <div className="flex gap-4">
            <button
              onClick={confirmImage}
              className="px-6 py-2 bg-green-600 text-white rounded"
            >
              ✅ Select
            </button>
            <button
              onClick={cancelImage}
              className="px-6 py-2 bg-red-600 text-white rounded"
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Selection;