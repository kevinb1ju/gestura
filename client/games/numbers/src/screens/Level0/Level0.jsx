import { useState } from "react";
import Train from "../../components/train/Train";
import Level1 from "../Level1/Level1";

export default function Level0({ onNextLevel }) {
  return <Train onNextLevel={onNextLevel} />;
}
