import "../Button.css";
import React, { useState } from "react";
import { createRoot, Root } from "react-dom/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import localDataService from "../../../../data/services/localDataService";
import { ButtonData, buttonType } from "../ButtonTypes";

type SumbmitFieldData = {
  submit_regex: string;
  submit_target: string;
  submitValue: string;
};

interface Props {
  onDataItemChange: (data: SumbmitFieldData) => void;
  data: SumbmitFieldData;
  readOnly: boolean;
  index: number;
}

export const SubmitButtonField: React.FC<Props> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDataItemChange,
  data,
  readOnly,
  index,
}) => {
  let isValid = true;
  try {
    new RegExp(data.submit_regex);
  } catch (e) {
    isValid = false;
  }
  if (!readOnly)
    return (
      <>
        <input
          id="submitTargetInput"
          className="text-input"
          pattern="[a-zA-Z0-9]+\.[a-zA-Z0-9]+\.[a-zA-Z0-9]+"
          type="text"
          value={data.submit_target ?? ""}
          onChange={(event) => {
            onDataItemChange({ ...data, submit_target: event.target.value });
          }}
          placeholder={`Enter target cell ${index}`}
        />
        <input
          id="submitRegexInput"
          className="text-input"
          pattern={isValid ? ".*" : ""}
          type="text"
          value={data.submit_regex ?? ""}
          onChange={(event) => {
            onDataItemChange({ ...data, submit_regex: event.target.value });
          }}
          placeholder="Optional regex"
        />
        <br />
      </>
    );
  else
    return (
      <>
        {data.submit_target && (
          <>
            <input
              className="text-input"
              type="text"
              value={data.submitValue}
              pattern={data.submit_regex == "" ? ".*" : data.submit_regex}
              onChange={(event) => {
                onDataItemChange({ ...data, submitValue: event.target.value });
              }}
              placeholder={data.submit_target.split(".")[1]}
            />
            <br />
          </>
        )}
      </>
    );
};
