import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "axios";

// Create an axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

function App() {
  // State variables for the dropdown options
  const [AreaTypeOptions, setAreaTypeOptions] = useState([]);
  const [LocationTypeOptions, setLocationTypeOptions] = useState([]);
  const [isOptionsLoading, setIsOptionsLoading] = useState(false);
  const [optionsError, setOptionsError] = useState("");

  // State variables for the prediction
  const [isPedicting, setIsPredicting] = useState(false);
  const [predictionError, setPredictionError] = useState("");
  const [predictionData, setPredictionData] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Fetching and showing the dropdown options
  useEffect(() => {
    async function fetchOptions() {
      try {
        setIsOptionsLoading(true);

        const response = await api.get("/options");

        setAreaTypeOptions(response.data.area_type_features);
        setLocationTypeOptions(response.data.location_type_features);
      } catch (error) {
        console.log(`options fetch error ${error}`);
        setOptionsError(
          "Could not load dropdown options. Please check the backend.",
        );
      } finally {
        setIsOptionsLoading(false);
      }
    }

    fetchOptions();
  }, []);

  async function onSubmit(data) {
    setIsPredicting(true);
    setPredictionError("");
    setPredictionData(null);

    try {
      const response = await api.post("/predict", data);

      setPredictionData(response.data.prediction);
    } catch (error) {
      console.log(`prediction error ${error}`);

      setPredictionError("Could not predict price. Please check the backend.");
    } finally {
      setIsPredicting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8">
      <section className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-slate-800">
          House Price Predictor
        </h1>

        <p className="mt-3 text-center text-slate-500">
          Enter house details and predict the price using the trained ML model.
        </p>

        {optionsError && (
          <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {optionsError}
          </p>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 flex flex-col gap-5"
        >
          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Area Type
            </label>

            <select
              disabled={isOptionsLoading}
              {...register("area_type", {
                required: "Area type is required",
              })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="">
                {isOptionsLoading ? "Loading..." : "Select area type"}
              </option>

              {AreaTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            {errors.area_type && (
              <p className="mt-1 text-sm text-red-600">
                {errors.area_type.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Location
            </label>

            <select
              disabled={isOptionsLoading}
              {...register("location", {
                required: "Location is required",
              })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="">
                {isOptionsLoading ? "Loading..." : "Select location"}
              </option>

              {LocationTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            {errors.location && (
              <p className="mt-1 text-sm text-red-600">
                {errors.location.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Total Sqft
            </label>

            <input
              type="number"
              placeholder="Example: 1170"
              {...register("total_sqft", {
                required: "Total sqft is required",
                valueAsNumber: true,
                min: {
                  value: 1,
                  message: "Total sqft must be greater than 0",
                },
              })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            {errors.total_sqft && (
              <p className="mt-1 text-sm text-red-600">
                {errors.total_sqft.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Bath
            </label>

            <input
              type="number"
              placeholder="Example: 2"
              {...register("bath", {
                required: "Bath count is required",
                valueAsNumber: true,
                min: {
                  value: 1,
                  message: "Bath count must be at least 1",
                },
              })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            {errors.bath && (
              <p className="mt-1 text-sm text-red-600">{errors.bath.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium text-slate-700">BHK</label>

            <input
              type="number"
              placeholder="Example: 2"
              {...register("bhk", {
                required: "BHK count is required",
                valueAsNumber: true,
                min: {
                  value: 1,
                  message: "BHK count must be at least 1",
                },
              })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            {errors.bhk && (
              <p className="mt-1 text-sm text-red-600">{errors.bhk.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Balcony
            </label>

            <input
              type="number"
              placeholder="Example: 1"
              {...register("balcony", {
                required: "Balcony count is required",
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: "Balcony count cannot be negative",
                },
              })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            {errors.balcony && (
              <p className="mt-1 text-sm text-red-600">
                {errors.balcony.message}
              </p>
            )}
          </div>

          <button
            disabled={isPedicting || isOptionsLoading}
            type="submit"
            className="mt-3 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 transition"
          >
            {isPedicting ? "Predicting..." : "Predict Price"}
          </button>
        </form>

        {predictionError && (
          <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {predictionError}
          </p>
        )}

        {predictionData && (
          <div className="mt-5 rounded-lg bg-green-50 px-4 py-4 text-center">
            <p className="text-sm text-green-700">Predicted Price</p>

            <p className="mt-1 text-3xl font-bold text-green-800">
              {predictionData} lakhs
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
