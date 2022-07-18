import "./Button.css";
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
  onDataChange: (data: SumbmitFieldData) => void;
  data: SumbmitFieldData;
  readOnly: boolean;
}

export const SubmitButtonField: React.FC<Props> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDataChange,
  data,
  readOnly,
}) => {
  let isValid = true;
  try {
    new RegExp(data.submit_regex);
  } catch (e) {
    isValid = false;
  }
  return (
    <>
      <input
        id="submitTargetInput"
        className="text-input"
        pattern="[a-zA-Z0-9]+\.[a-zA-Z0-9]+\.[a-zA-Z0-9]+"
        type="text"
        value={data.submit_target ?? ""}
        onChange={(event) => {
          onDataChange({ ...data, submit_target: event.target.value });
        }}
        placeholder="Enter target cell"
      />
      <input
        id="submitRegexInput"
        className="text-input"
        pattern={isValid ? ".*" : ""}
        type="text"
        value={data.submit_regex ?? ""}
        onChange={(event) => {
          onDataChange({ ...data, submit_regex: event.target.value });
        }}
        placeholder="Optional regex"
      />
    </>
  );
};
