import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Common/Loader";
import { getSportSettingNames, updateSportSettingStatus } from "../Server/api";

function SportSetting() {
  const navigate = useNavigate();
  const { adminId } = useParams();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    if (adminId) {
      fetchSportSettings();
    }
  }, [adminId]);

  const fetchSportSettings = async () => {
    try {
      setLoading(true);
      const payload = { admin_id: adminId };
      const response = await getSportSettingNames(payload);
      console.log("Sport Settings Response:", response);

      if (response.data && response.data.success) {
        const data = response.data.data;
        
        const settingsObj = {};
        const sportKeys = ['football', 'cricket', 'tennis', 'horse_racing', 'greyhound_racing', 'kabaddi', 'i_casino', 'casino', 'politics'];
        
        sportKeys.forEach(key => {
          const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          // ✅ 1/0 mein convert karo
          settingsObj[key] = {
            label: label,
            status: data[key] === true || data[key] === 1 || data[key] === "1" ? 1 : 0
          };
        });
        
        setSettings(settingsObj);
      } else {
        toast.warning("Using default settings");
        setDefaultSettings();
      }
    } catch (error) {
      console.error("Error fetching sport settings:", error);
      toast.error("Failed to load sport settings");
      setDefaultSettings();
    } finally {
      setLoading(false);
    }
  };

  // ✅ Default settings - 1/0 mein
  const setDefaultSettings = () => {
    const defaultSettings = {
      football: { label: "Football", status: 1 },
      cricket: { label: "Cricket", status: 1 },
      tennis: { label: "Tennis", status: 1 },
      horse_racing: { label: "Horse Racing", status: 1 },
      greyhound_racing: { label: "Greyhound Racing", status: 1 },
      kabaddi: { label: "Kabaddi", status: 1 },
      i_casino: { label: "I Casino", status: 1 },
      casino: { label: "Casino", status: 1 },
      politics: { label: "Politics", status: 1 },
    };
    setSettings(defaultSettings);
  };

  // ✅ Toggle - 1/0 mein
  const handleToggle = (sportKey) => {
    setSettings({
      ...settings,
      [sportKey]: {
        ...settings[sportKey],
        status: settings[sportKey].status === 1 ? 0 : 1
      }
    });
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // ✅ 1/0 send kar rahe hain
      const payload = {
        admin_id: adminId,
        football: settings.football?.status || 0,
        cricket: settings.cricket?.status || 0,
        tennis: settings.tennis?.status || 0,
        horse_racing: settings.horse_racing?.status || 0,
        greyhound_racing: settings.greyhound_racing?.status || 0,
        kabaddi: settings.kabaddi?.status || 0,
        i_casino: settings.i_casino?.status || 0,
        casino: settings.casino?.status || 0,
        politics: settings.politics?.status || 0,
      };

      const response = await updateSportSettingStatus(payload);
      console.log("Update Response:", response);

      if (response.data && response.data.success) {
        toast.success("Sport settings updated successfully!");
        await fetchSportSettings();
      } else {
        toast.error(response.data?.message || "Failed to update settings");
      }
    } catch (error) {
      console.error("Error updating sport settings:", error);
      toast.error(error.response?.data?.message || "Error updating settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className="card sport_setting">
        <div className="card-header bgHeader bg-primary-yellow d-flex justify-content-between align-items-center">
          <h3 className="card-title mb-0">Sport Setting</h3>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-light" onClick={() => navigate(-1)}>
              Back
            </button>
          </div>
        </div>

        <div className="card-body">
          <div className="row">
            {/* Left Column */}
            <div className="col-md-6">
              <div className="py-2 d-flex justify-content-between align-items-center border-bottom">
                <div className="sport_name fw-bold">Football:</div>
                <div className="form-check form-switch m-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={settings.football?.status === 1}
                    onChange={() => handleToggle('football')}
                  />
                </div>
              </div>

              <div className="py-2 d-flex justify-content-between align-items-center border-bottom">
                <div className="sport_name fw-bold">Cricket:</div>
                <div className="form-check form-switch m-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={settings.cricket?.status === 1}
                    onChange={() => handleToggle('cricket')}
                  />
                </div>
              </div>

              <div className="py-2 d-flex justify-content-between align-items-center border-bottom">
                <div className="sport_name fw-bold">Greyhound Racing:</div>
                <div className="form-check form-switch m-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={settings.greyhound_racing?.status === 1}
                    onChange={() => handleToggle('greyhound_racing')}
                  />
                </div>
              </div>

              <div className="py-2 d-flex justify-content-between align-items-center border-bottom">
                <div className="sport_name fw-bold">I Casino:</div>
                <div className="form-check form-switch m-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={settings.i_casino?.status === 1}
                    onChange={() => handleToggle('i_casino')}
                  />
                </div>
              </div>

              <div className="py-2 d-flex justify-content-between align-items-center border-bottom">
                <div className="sport_name fw-bold">Politics:</div>
                <div className="form-check form-switch m-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={settings.politics?.status === 1}
                    onChange={() => handleToggle('politics')}
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-md-6">
              <div className="py-2 d-flex justify-content-between align-items-center border-bottom">
                <div className="sport_name fw-bold">Tennis:</div>
                <div className="form-check form-switch m-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={settings.tennis?.status === 1}
                    onChange={() => handleToggle('tennis')}
                  />
                </div>
              </div>

              <div className="py-2 d-flex justify-content-between align-items-center border-bottom">
                <div className="sport_name fw-bold">Horse Racing:</div>
                <div className="form-check form-switch m-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={settings.horse_racing?.status === 1}
                    onChange={() => handleToggle('horse_racing')}
                  />
                </div>
              </div>

              <div className="py-2 d-flex justify-content-between align-items-center border-bottom">
                <div className="sport_name fw-bold">Kabaddi:</div>
                <div className="form-check form-switch m-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={settings.kabaddi?.status === 1}
                    onChange={() => handleToggle('kabaddi')}
                  />
                </div>
              </div>

              <div className="py-2 d-flex justify-content-between align-items-center border-bottom">
                <div className="sport_name fw-bold">Casino:</div>
                <div className="form-check form-switch m-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={settings.casino?.status === 1}
                    onChange={() => handleToggle('casino')}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="d-flex gap-2 justify-content-start mt-4">
            <button 
              className="btn btn-primary text-dark py-2 px-4" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </span>
                  Submitting...
                </>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SportSetting;