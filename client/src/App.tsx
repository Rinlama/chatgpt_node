import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Card,
  ControlGroup,
  Elevation,
  FormGroup,
  InputGroup,
  Label,
  Spinner,
  Text,
  TextArea,
} from "@blueprintjs/core";
import "./App.css";
import axios from "axios";

interface StreamState {
  data: any | null;
  error: Error | null;
  filename: string | null;
}

function App() {
  const [alert, setAlert] = useState({ isError: false, message: "" });
  const [loader, setLoader] = useState(false);

  const [prompt, setPrompt] = useState<string>();
  const [response, setReponse] = useState<string>();

  const GetGPTResponse = async () => {
    try {
      setLoader(true);
      const { data } = await axios.post(`http://localhost:3001/api/chat`, {
        prompt,
      });
      setLoader(false);
      setReponse(data);
    } catch (error: any) {
      setLoader(false);
      setAlert({
        isError: true,
        message: JSON.stringify(error.message),
      });
    }
  };

  return (
    <React.Fragment>
      <div className="body">
        <Alert
          confirmButtonText="Okay"
          isOpen={alert.isError}
          loading={false}
          onClose={() => {
            setAlert({
              ...alert,
              isError: false,
            });
          }}
        >
          <p>{alert.message}</p>
        </Alert>

        <div className="box">
          <div className="converter">
            <div className="header">
              <Card interactive={true}>
                <p>Simple Chat GPT App - Node/React</p>
              </Card>
            </div>

            {response ? (
              <Card interactive={true} elevation={Elevation.TWO}>
                <Button
                  icon="arrow-left"
                  intent="primary"
                  className="my-2"
                  onClick={() => {
                    setPrompt("");
                    setReponse("");
                  }}
                />
                <Text>{response.trim()}</Text>
              </Card>
            ) : (
              <Card interactive={true} elevation={Elevation.TWO}>
                <div className="label-spinner">
                  {loader ? <Spinner intent={"primary"} size={20} /> : ""}
                </div>
                <FormGroup
                  helperText="Prompt"
                  label="Prompt"
                  labelFor="text-input"
                  labelInfo="(required)"
                >
                  <InputGroup
                    id="text-input"
                    placeholder="Add Prompt"
                    onChange={(e) => {
                      const value = e.target.value;
                      setPrompt(value);
                    }}
                  />
                </FormGroup>

                <Button
                  intent="primary"
                  disabled={!prompt || loader}
                  onClick={() => {
                    GetGPTResponse();
                  }}
                >
                  Get Response
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;
