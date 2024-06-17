import React, { useEffect, useState } from "react";
import { useRhino } from "@picovoice/rhino-react";

function VoiceWidget() {
  const { inference, isLoaded, isListening, error, init, process, release } =
    useRhino();

  const [listening, setListening] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const rhinoContext = {
    publicPath: "/AIMODEL_en_wasm_v3_0_0.rhn",
  };
  const rhinoModel = { publicPath: "/rhino_params.pv" };
  const ACCESS_KEY = "/W+h56o5ho0ufsPHuOAOrae43sfgYZVBZ/JUKn0B2QV1bemVEBiO9Q==";

  const initializeRhino = async () => {
    try {
      await init(ACCESS_KEY, rhinoContext, rhinoModel);
      console.log("Rhino initialized");
      setInitialized(true);
    } catch (err) {
      console.error("Failed to initialize Rhino:", err);
    }
  };

  useEffect(() => {
    initializeRhino();
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {
    if (inference !== null) {
      // Handle inference result
      console.log("Inference:", inference);
    }
  }, [inference]);

  const startListening = async () => {
    if (!initialized) {
      console.error("Rhino is not initialized");
      return;
    }
    try {
      await process();
      setListening(true);
    } catch (err) {
      console.error("Failed to start listening:", err);
    }
  };

  const stopListening = async () => {
    try {
      await release();
      setListening(false);
      // Re-initialize Rhino after release
      await initializeRhino();
    } catch (err) {
      console.error("Failed to stop listening or re-initialize Rhino:", err);
    }
  };

  return (
    <div className="m-10 container">
      <div className="row my-5">
        <div className="col-lg-3">
          <button
            className="btn btn-primary rounded-1"
            onClick={listening ? stopListening : startListening}
          >
            {listening ? "Stop Listening" : "Start Listening"}
          </button>
        </div>
        <div className="col-lg-9">
          {isListening && <p>Listening...</p>}
          {error && <p>Error: {error.message}</p>}
          {inference && <p>Inference: {JSON.stringify(inference)}</p>}
        </div>
      </div>
    </div>
  );
}

export default VoiceWidget;
