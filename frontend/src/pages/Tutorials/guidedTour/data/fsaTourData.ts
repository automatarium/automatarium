import { Step } from "../ProjectTour";
import type { TFunction } from "i18next";
import { fsaTourGifs } from "./tour-gifs.json";

export const makeFsaTourSteps = (t: TFunction): Step[] => [
  {
    target: "",
    content: t("fsa_tour.step1", { ns: "tutorials" }),
    gifUrl: fsaTourGifs[0],
  },

  {
    target: "",
    content: t("fsa_tour.step2", { ns: "tutorials" }),
    gifUrl: fsaTourGifs[1],
  },

  {
    target: "",
    content: t("fsa_tour.step3", { ns: "tutorials" }),
    gifUrl: fsaTourGifs[2],
  },

  {
    target: "",
    content: t("fsa_tour.step4", { ns: "tutorials" }),
    gifUrl: fsaTourGifs[3],
  },

  {
    target: "",
    content: t("fsa_tour.step5", { ns: "tutorials" }),
    gifUrl: fsaTourGifs[4],
  },

  {
    target: "",
    content: t("fsa_tour.step6", { ns: "tutorials" }),
    gifUrl: fsaTourGifs[5],
  },

  {
    target: "",
    content: t("fsa_tour.step7", { ns: "tutorials" }),
    gifUrl: fsaTourGifs[6],
  },
]
