import { TFunction } from "i18next";
import { Step } from "../ProjectTour";
import { pdaTourGifs } from "./tour-gifs.json";

export const makePdaTourSteps = (t: TFunction): Step[] => [
  {
    target: "",
    content: t("pda_tour.step1", { ns: "tutorials" }),
    gifUrl: pdaTourGifs[0],
  },

  {
    target: "",
    content: t("pda_tour.step2", { ns: "tutorials" }),
    gifUrl: pdaTourGifs[1],
  },

  {
    target: "",
    content: t("pda_tour.step3", { ns: "tutorials" }),
    gifUrl: pdaTourGifs[2],
  },

  {
    target: "",
    content: t("pda_tour.step4", { ns: "tutorials" }),
    gifUrl: pdaTourGifs[3],
  },

  {
    target: "",
    content: t("pda_tour.step5", { ns: "tutorials" }),
    gifUrl: pdaTourGifs[4],
  },

  {
    target: "",
    content: t("pda_tour.step6", { ns: "tutorials" }),
    gifUrl: pdaTourGifs[5],
  },
]
