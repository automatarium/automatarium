import { TFunction } from "i18next";
import { Step } from "../ProjectTour";
import { tmTourGifs } from "./tour-gifs.json";

export const makeTmTourSteps = (t: TFunction): Step[] => [
  {
    target: "",
    content: t("tm_tour.step1", { ns: "tutorials" }),
    gifUrl: tmTourGifs[0],
  },

  {
    target: "",
    content: t("tm_tour.step2", { ns: "tutorials" }),
    gifUrl: tmTourGifs[1],
  },

  {
    target: "",
    content: t("tm_tour.step3", { ns: "tutorials" }),
    gifUrl: tmTourGifs[2],
  },

  {
    target: "",
    content: t("tm_tour.step4", { ns: "tutorials" }),
    gifUrl: tmTourGifs[3],
  },

  {
    target: "",
    content: t("tm_tour.step5", { ns: "tutorials" }),
    gifUrl: tmTourGifs[4],
  },

  {
    target: "",
    content: t("tm_tour.step6", { ns: "tutorials" }),
    gifUrl: tmTourGifs[5],
  },

  {
    target: "",
    content: t("tm_tour.step7", { ns: "tutorials" }),
    gifUrl: tmTourGifs[6],
  },

  {
    target: "",
    content: t("tm_tour.step8", { ns: "tutorials" }),
    gifUrl: tmTourGifs[7],
  },

  {
    target: "",
    content: t("tm_tour.step9", { ns: "tutorials" }),
    gifUrl: tmTourGifs[8],
  },
]
