import { Mentor } from "../../model/mentor";
import { responseHandler } from "../../response/responseHandler";

export const updateMentor = async (req, res) => {
  try {
    const id = req.params.id;
    const mentor = await Mentor.findByIdAndUpdate(
      { _id: id },
      {
        name: req.body.name,
        class: req.body.class,
        subject: req.body.subject,
        school_name: req.body.school_name,
      },
      { new: true }
    );
    return responseHandler(res, 200, "Mentor updated successfully");
  } catch (err) {
    return responseHandler(res, 500, err.message);
  }
};
