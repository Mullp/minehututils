import Feedback, { IFeedback } from "../models/feedback.model";

interface ICreateFeedbackInput {
  by: IFeedback["by"];
  subject: IFeedback["subject"];
  feedback: IFeedback["feedback"];
  contact: IFeedback["contact"];
}

const CreateFeedback = async ({
  by,
  subject,
  feedback,
  contact,
}: ICreateFeedbackInput) => {
  return await Feedback.create({ by, subject, feedback, contact })
    .then((data) => {
      return data;
    })
    .catch((error: Error) => {
      throw error;
    });
};

export default { CreateFeedback };
