import { ModalSubmit } from "../structures/ModalSubmitStructure";

export default new ModalSubmit("feedback", async (interaction) => {
  // console.log(JSON.stringify(interaction.));
  // await interaction.message.editReply({
  //   content: `Thanks for submitting feedback.${
  //     interaction.fields.getTextInputValue("contact") === "yes"
  //       ? " We'll contact you if we need any more information."
  //       : ""
  //   }`,
  // });
  // console.log(interaction.replied); // false
  // console.log(interaction.deferred); // true
  // await interaction.followUp({ ephemeral: true, content: "Thanks!" });
});
