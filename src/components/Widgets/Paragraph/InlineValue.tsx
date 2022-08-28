import { useGetTableItemByName } from "../../../api/hooks";
import React from "react";

interface Props {
  table: string;
  column: string;
  entryKey: string;
}

export const InlineValue: React.FC<Props> = ({
  table,
  column,
  entryKey,
}: Props) => {
  const { item, isLoading, isError } = useGetTableItemByName(
    table,
    column,
    entryKey
  );

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error...</span>;
  }

  return <span>{item}</span>;
};
