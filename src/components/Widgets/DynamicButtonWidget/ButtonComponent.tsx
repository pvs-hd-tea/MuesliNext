import "./Button.css";
import React, { useEffect, useState } from "react";
import { createRoot, Root } from "react-dom/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import localDataService from "../../../data/services/localDataService";
import { ButtonData, buttonType } from "./ButtonTypes";
import { SubmitButtonField } from "./ButtonTypes/SubmitButtonField";

function pushDynamicValues(
  targets: string[],
  regex: string[],
  values: string[]
): string[] {
  const errors: string[] = [];
  for (let i = 0; i < targets.length; i++) {
    const error = pushDynamicValue(targets[i], regex[i], values[i]);
    if (error) {
      errors.push(error);
    }
  }
  return errors;
}

function pushDynamicValue(
  target: string,
  regex: string,
  value: string
): string {
  if (target.match(/[a-zA-Z0-9]+\.[a-zA-Z0-9]+\.[a-zA-Z0-9]+/)) {
    const args = target.split(".");
    const targetObj = {
      table: args[0],
      column: args[1],
      key: args[2],
    };
    // check regex
    try {
      new RegExp(regex);
      if (!value.match(new RegExp(regex))) {
        return "does not math regex " + regex;
      }
    } catch (e) {
      return "syntax error in regex " + regex;
    }

    // TODO: push
    const dataService = localDataService.getFromLocalOrNew();
    dataService.pushTableItemByName(
      targetObj.table,
      targetObj.column,
      targetObj.key,
      value
    );
    // alert(
    //   `SUBMIT:\nvalue: ${value} into\n ${JSON.stringify(targetObj, null, 2)}`
    // );
    return "";
  } else {
    return "malformed target: " + target;
  }
}

interface Props {
  onDataChange: (newData: ButtonData) => void;
  initData: ButtonData;
  readOnly: boolean;
}

export const ButtonComponent: React.FC<Props> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDataChange,
  initData,
  readOnly,
}) => {
  const [data, setData] = useState(initData);
  const [syntaxError, setSyntaxError] = useState(false);
  const [syntaxErrorMessage, setSyntaxErrorMessage] = useState("");

  const [submitValues, setSubmitValues] = useState([""]); // for submit button

  useEffect(() => {
    if (data.submit_targets[data.submit_targets.length - 1] !== "") {
      setSubmitValues([...submitValues, ""]);
      const newSubmitTargets = [...data.submit_targets, ""];
      const newSubmitRegex = [...data.submit_regex, ""];
      setData({
        ...data,
        submit_targets: newSubmitTargets,
        submit_regex: newSubmitRegex,
      });
    } else if (data.submit_targets[data.submit_targets.length - 2] === "") {
      setSubmitValues(submitValues.slice(0, -1));
      const newSubmitTargets = data.submit_targets.slice(0, -1);
      const newSubmitRegex = data.submit_regex.slice(0, -1);
      setData({
        ...data,
        submit_targets: newSubmitTargets,
        submit_regex: newSubmitRegex,
      });
    }
  });

  let btnColor = "";
  let specificFields;
  let onClickListener;
  if (initData.type === buttonType.LINK || !initData.type) {
    btnColor = "bg-blue-500 hover:bg-blue-400";
    specificFields = (
      <input
        id="linkInput"
        className="text-input"
        type="text"
        value={data.link ?? ""}
        onChange={(event) => {
          setData({ ...data, link: event.target.value });
        }}
        placeholder="Enter link"
      />
    );
    onClickListener = () => {
      window.location.assign(data.link.replace(/^www/, "http://www"));
    };
  } else if (data.type === buttonType.ALERT) {
    btnColor = "bg-red-500 hover:bg-red-400";
    specificFields = (
      <input
        id="messageInput"
        className="text-input"
        type="text"
        value={data.message ?? ""}
        onChange={(event) => {
          setData({ ...data, message: event.target.value });
        }}
        placeholder="Enter message"
      />
    );
    onClickListener = () => {
      alert(data.message);
    };
  } else if (data.type === buttonType.SCRIPT) {
    btnColor = "bg-black hover:bg-black-900";
    specificFields = (
      <input
        id="scriptInput"
        className="text-input"
        type="text"
        value={data.script ?? ""}
        onChange={(event) => {
          setData({ ...data, script: event.target.value });
        }}
        placeholder="Enter script"
      />
    );
    onClickListener = () => {
      // TODO: investigate security of using eval here
      // eval is okay here because it is only the frontend (we allow the user to inject scripts into his browser only)
      // or is it not??
      try {
        setSyntaxError(false);
        eval(data.script);
      } catch (e) {
        if (e instanceof SyntaxError) {
          setSyntaxError(true);
          setSyntaxErrorMessage(e.message);
        }
      }
    };
  } else if (data.type === buttonType.SUBMIT) {
    btnColor = "bg-green-500 hover:bg-green-400";
    specificFields = data.submit_targets.map((submitTarget, index) => {
      return (
        <SubmitButtonField
          key={index}
          index={index + 1}
          readOnly={readOnly}
          data={{
            submit_target: data.submit_targets[index],
            submit_regex: data.submit_regex[index],
            submitValue: submitValues[index],
          }}
          onDataItemChange={(newData) => {
            const newSubmitTargets = [...data.submit_targets];
            const newSubmitRegex = [...data.submit_regex];
            newSubmitTargets[index] = newData.submit_target;
            newSubmitRegex[index] = newData.submit_regex;
            setData({
              ...data,
              submit_targets: newSubmitTargets,
              submit_regex: newSubmitRegex,
            });
          }}
        />
      );
    });

    onClickListener = () => {
      // TODO: This is a placeholder
      const errors = pushDynamicValues(
        data.submit_targets,
        data.submit_regex,
        submitValues
      );
      if (errors.length === 0) {
        //setSubmitValue("");
        setSyntaxError(false);
      } else {
        setSyntaxError(true);
        setSyntaxErrorMessage(errors[0]);
      }
    };
  }

  if (readOnly) {
    return (
      <div className="button-component-configure">
        {data.type === buttonType.SUBMIT &&
          data.submit_targets.map((submitTarget, index) => {
            return (
              <SubmitButtonField
                key={index}
                index={index + 1}
                readOnly={readOnly}
                data={{
                  submit_target: data.submit_targets[index],
                  submit_regex: data.submit_regex[index],
                  submitValue: submitValues[index],
                }}
                onDataItemChange={(newData) => {
                  const newSubmitTargets = [...data.submit_targets];
                  const newSubmitRegex = [...data.submit_regex];
                  newSubmitTargets[index] = newData.submit_target;
                  newSubmitRegex[index] = newData.submit_regex;
                  setData({
                    ...data,
                    submit_targets: newSubmitTargets,
                    submit_regex: newSubmitRegex,
                  });
                }}
              />
            );
          })}
        <button
          className={`text-white ${btnColor} shadow-sm hover:shadow-md m-1 p-2 pl-3 pr-3 rounded-lg`}
          onClick={onClickListener}
        >
          {data.text == "" ? "Button" : data.text}
        </button>
        {syntaxError && (
          <div className="text-red-500">
            <p>{syntaxErrorMessage}</p>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="my-3 button-component-configure">
        <input
          id="textInput"
          className="text-input"
          type="text"
          value={data.text}
          onChange={(event) => {
            setData({ ...data, text: event.target.value });
          }}
          placeholder="Enter text name..."
        />
        <FontAwesomeIcon className="mx-1" icon={faArrowRight} />
        <button
          className={`text-white ${btnColor} shadow-sm hover:shadow-md mx-1 p-2 pl-3 pr-3 rounded-lg`}
          onClick={onClickListener}
        >
          {data.text == "" ? "Button" : data.text}
        </button>
        <br />
        {specificFields}
        {syntaxError && (
          <div className="text-red-500">
            <p>{syntaxErrorMessage}</p>
          </div>
        )}
      </div>
    );
  }
};
