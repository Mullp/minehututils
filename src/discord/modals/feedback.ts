import { ModalSubmit } from "../structures/ModalSubmitStructure";
import Feedback from "../../database/controllers/feedback.controller";

export default new ModalSubmit("feedback", async (interaction) => {
  await interaction.deferReply({ ephemeral: true });

  await interaction.editReply({
    content: `Thanks for submitting feedback.${
      ["yes", "yep", "y", "yas", "ok", "k"].includes(
        interaction.fields.getTextInputValue("contact").toLowerCase()
      )
        ? " We'll contact you if we need any more information."
        : ""
    }`,
  });

  await Feedback.CreateFeedback({
    by: interaction.user.id,
    subject: interaction.fields.getField("subject").value,
    feedback: interaction.fields.getField("feedback").value,
    contact: interaction.fields.getField("contact").value,
  });
});
