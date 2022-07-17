export enum buttonType {
  LINK = "link",
  ALERT = "alert",
  SCRIPT = "script",
  SUBMIT = "submit",
}

export interface ButtonData {
  text: string;
  type: buttonType;

  link: string; // for link button
  message: string; // for alert button
  script: string; // for script button
  submit_target: string; // for submit button
  submit_regex: string; // for submit button
}
