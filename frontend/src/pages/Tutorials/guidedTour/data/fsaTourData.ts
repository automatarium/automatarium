import { Step } from "../ProjectTour";
import type { TFunction } from "i18next";

export const makeFsaTourSteps = (t: TFunction): Step[] => [
  {
    target: "",
    content: t("fsa_tour.step1", { ns: "tutorials" }),
    gifUrl:
      "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnBqMHcybWt0b240eHgyeGoxNnVnN3ZkamJ4NGR1aGxoZ2FmOXhzeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/CEhv9ob2WWq2aUHWcK/giphy.gif",
  },

  {
    target: "",
    content: t("fsa_tour.step2", { ns: "tutorials" }),
    gifUrl:
      "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExamF0bWd6OW1mYXRhemF5am5pamE5cWx1cmRqZzkycnBybWM4azIxbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gz6AZuHqdW620z78Cf/giphy.gif",
  },

  {
    target: "",
    content: t("fsa_tour.step3", { ns: "tutorials" }),
    gifUrl:
      "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmRlNDYzcmx0YjM0YW9hdGUzMnF4eWZ1dGI0d3RncWpscmU4Z2l5NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/8gxgNz6BWWzNb7yMO9/giphy.gif",
  },

  {
    target: "",
    content: t("fsa_tour.step4", { ns: "tutorials" }),
    gifUrl:
      "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXl2OTN6N2FobDZ6anYwYTMwZHNpdmQ3a2I0OHVkazdrem9vNzNpcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/lqAP4be6RHzicbwP4b/giphy.gif",
  },

  {
    target: "",
    content: t("fsa_tour.step5", { ns: "tutorials" }),
    gifUrl:
      "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXI2cDF0MWNjcGJnZ3pveWEwZnRmY3RuYXJvZzh5dWN4MGVzcDdxMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kNNU6jziwCCs7jRl4V/giphy.gif",
  },

  {
    target: "",
    content: t("fsa_tour.step6", { ns: "tutorials" }),
    gifUrl:
      "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGVhc3RqM2owZ2s3MHRqNnNncW11dTNiemVwY3hzYjJpdGdzN3NkZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/F71XE0yKbDGzp7uSQj/giphy.gif",
  },

  {
    target: "",
    content: t("fsa_tour.step7", { ns: "tutorials" }),
    gifUrl:
      "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZDk1cTV4ZnBsa2Z0ZWs3cmc5bno5cGdna2RsZm9nYTk2ZTdndXF3MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/vK75iMbo4P3pewcg0j/giphy.gif",
  },
]
