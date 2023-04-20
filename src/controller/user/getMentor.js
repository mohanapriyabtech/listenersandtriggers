import { Mentor } from "../../model/mentor";
import { responseHandler } from "../../response/responseHandler";

export const getMentor = async (req, res) => {
  try {
    const id = req.params.id;
    const mentor = await Mentor.findById({ _id: id })
      .populate("subject class", { name: 1, class_name: 1 })
      .populate("school_name");
    return responseHandler(res, 200, "Mentor details sent successfully", mentor);
  } catch (err) {
    return responseHandler(res, 500, err.message);
  }
};
